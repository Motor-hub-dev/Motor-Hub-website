
import re

def check_braces_context(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find Script 3 (the large module script)
    scripts = re.findall(r'<script type="module">([\s\S]*?)<\/script>', content)
    if not scripts:
        print("Script not found")
        return
    
    script = scripts[0]
    
    # Remove strings and comments
    # script = re.sub(r'\/\/.*', '', script)
    # script = re.sub(r'\/\*[\s\S]*?\*\/', '', script)
    # script = re.sub(r"'[^']*'", "''", script)
    # script = re.sub(r'"[^"]*"', '""', script)
    # script = re.sub(r'`[\s\S]*?`', '``', script)
    
    stack = []
    lines = script.splitlines()
    
    in_string = None
    in_comment = False
    
    for line_num, line in enumerate(lines, 1):
        i = 0
        while i < len(line):
            char = line[i]
            
            # Simple string and comment skipping
            if not in_comment and not in_string:
                if char == '{':
                    stack.append((line_num, line.strip()[:50]))
                elif char == '}':
                    if not stack:
                        print(f"Extra '}}' at line {line_num}: {line.strip()[:100]}")
                    else:
                        stack.pop()
            
            # This is very basic and might fail on nested templates, but let's try
            i += 1
            
    if stack:
        print("Unclosed braces:")
        for ln, ctx in stack:
            print(f"  Line {ln}: {ctx}")

check_braces_context(r'c:\Web projects\Motor Hub\Motor-Hub-website\admin\index.html')
