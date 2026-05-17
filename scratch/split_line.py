
import sys

def split_massive_line(filename, target_line):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    line = lines[target_line - 1]
    
    # Simple splitting logic: after ;, {, }
    # but NOT inside strings
    
    new_lines = []
    current = ""
    in_string = None
    
    i = 0
    while i < len(line):
        char = line[i]
        current += char
        
        if in_string:
            if char == in_string:
                if i > 0 and line[i-1] != '\\':
                    in_string = None
        elif char in ['"', "'", '`']:
            in_string = char
        elif char in [';', '{', '}']:
            # Peek for 'else' after '}'
            peek = line[i+1:i+6].strip()
            if char == '}' and peek.startswith('else'):
                pass # don't split yet
            else:
                new_lines.append(current.strip())
                current = ""
        
        i += 1
    
    if current.strip():
        new_lines.append(current.strip())
    
    # Replace the target line with the split lines
    lines[target_line - 1 : target_line] = [nl + "\n" for nl in new_lines]
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.writelines(lines)

if __name__ == "__main__":
    split_massive_line(sys.argv[1], int(sys.argv[2]))
