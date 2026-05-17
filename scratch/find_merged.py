
import re
import sys

def find_merged_comments(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        # Match // followed by some text, then significant whitespace, then code-like characters
        # Avoiding http:// and https://
        match = re.search(r'(?<!http:)(?<!https:)//.*?\s{2,}\S', line)
        if match:
            # Check if the code part is actually code (e.g. not just more comment)
            # This is hard, but let's just print them all.
            print(f"Line {i+1}: {line.strip()}")

if __name__ == "__main__":
    find_merged_comments(sys.argv[1])
