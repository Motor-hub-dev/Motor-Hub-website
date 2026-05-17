
import sys

def check_line_braces(filename, target_line):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    for i in range(target_line):
        line = lines[i]
        for char in line:
            if char == '{': balance += 1
            elif char == '}': balance -= 1
    
    print(f"Balance after line {target_line}: {balance}")

if __name__ == "__main__":
    check_line_braces(sys.argv[1], int(sys.argv[2]))
