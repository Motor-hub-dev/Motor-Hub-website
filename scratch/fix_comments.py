
import sys
import re

def fix_comments(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        if '//' in line:
            # Try to find // that is NOT preceded by 'http:' or 'https:'
            # and NOT inside a string.
            # This is complex, so I'll just use a simple regex for now 
            # and check common patterns.
            
            # Pattern: // followed by text, then non-space text (code)
            # Actually, most of these are "// comment        code"
            match = re.search(r'(?<!http:)(?<!https:)//.*?\s{2,}(\w)', line)
            if match:
                # Split at the start of the code
                pos = match.start(1)
                new_lines.append(line[:pos].strip() + "\n")
                new_lines.append(line[pos:])
            else:
                new_lines.append(line)
        else:
            new_lines.append(line)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

if __name__ == "__main__":
    fix_comments(sys.argv[1])
