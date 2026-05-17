
import sys

def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    line_num = 1
    col_num = 1
    
    in_string = None
    string_start_pos = None
    
    i = 0
    while i < len(content):
        char = content[i]
        
        if in_string:
            if char == in_string:
                if content[i-1] != '\\': # Simple escape check
                    in_string = None
        elif char in ['"', "'", '`']:
            in_string = char
            string_start_pos = (line_num, col_num)
        elif char == '{':
            stack.append((line_num, col_num))
        elif char == '}':
            if not stack:
                print(f"Extra '}}' at line {line_num}, col {col_num}")
            else:
                stack.pop()
        
        if char == '\n':
            line_num += 1
            col_num = 1
        else:
            col_num += 1
        i += 1
    
    if stack:
        for ln, cn in stack:
            print(f"Unclosed '{{' from line {ln}, col {cn}")
    if in_string:
        print(f"Unclosed string {in_string} from line {string_start_pos[0]}, col {string_start_pos[1]}")

if __name__ == "__main__":
    check_braces(sys.argv[1])
