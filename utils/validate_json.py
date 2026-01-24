#!/usr/bin/env python3
"""
Script to validate JSON and identify formatting errors with precise location information.
"""

import json
import sys
import re
from pathlib import Path


def validate_json_file(file_path):
    """
    Validate a JSON file and report any formatting errors with line/column information.
    """
    file_path = Path(file_path)
    
    if not file_path.exists():
        print(f"Error: File not found: {file_path}")
        return False
    
    print(f"Reading file: {file_path}")
    print(f"File size: {file_path.stat().st_size:,} bytes")
    print("-" * 80)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        lines = content.split('\n')
        
        # Try to parse the JSON
        try:
            data = json.loads(content)
            print("✓ JSON is valid!")
            
            # Even if valid, check for potential issues
            print("\n" + "=" * 80)
            print("Additional checks (JSON is valid but checking for formatting issues):")
            print("=" * 80)
            
            # Check if it's minified (all on one line)
            if len(lines) == 1:
                print("\n⚠ File is minified (all on one line)")
                print("  This is valid JSON but may be hard to read/edit")
                print("  Consider pretty-printing for better readability")
            
            # Check for trailing commas (even in valid JSON, some parsers are strict)
            trailing_comma_pattern = re.compile(r',\s*[}\]](?=\s*[,}\]])')
            trailing_commas = list(trailing_comma_pattern.finditer(content))
            if trailing_commas:
                print(f"\n⚠ Found {len(trailing_commas)} potential trailing comma(s):")
                for match in trailing_commas[:10]:  # Show first 10
                    pos = match.start()
                    line_num = content[:pos].count('\n') + 1
                    col_num = pos - content.rfind('\n', 0, pos) - 1
                    start = max(0, pos - 30)
                    end = min(len(content), pos + 30)
                    context = content[start:end].replace('\n', '\\n')
                    marker_pos = min(30, pos - start)
                    print(f"    Line {line_num}, Column {col_num} (position {pos}):")
                    print(f"      ...{context}...")
                    print(f"      {' ' * (marker_pos + 3)}^")
                if len(trailing_commas) > 10:
                    print(f"    ... and {len(trailing_commas) - 10} more")
            
            # Check for common typos
            # Check for single quotes instead of double quotes (not valid JSON)
            single_quotes = content.count("'")
            if single_quotes > 0:
                print(f"\n⚠ Found {single_quotes} single quote(s) - JSON requires double quotes")
                # Find exact positions
                positions = []
                for i, char in enumerate(content):
                    if char == "'":
                        # Calculate line and column
                        line_num = content[:i].count('\n') + 1
                        col_num = i - content.rfind('\n', 0, i) - 1
                        # Get context (50 chars before and after)
                        start = max(0, i - 50)
                        end = min(len(content), i + 50)
                        context = content[start:end].replace('\n', '\\n')
                        positions.append((line_num, col_num, i, context))
                
                print(f"\n  Single quote positions:")
                for line_num, col_num, pos, context in positions[:20]:  # Show first 20
                    marker_pos = min(50, pos - (pos - 50 if pos >= 50 else 0))
                    print(f"    Line {line_num}, Column {col_num} (position {pos}):")
                    print(f"      ...{context}...")
                    print(f"      {' ' * (marker_pos + 3)}^")
                if len(positions) > 20:
                    print(f"    ... and {len(positions) - 20} more")
            
            # Try to pretty-print to see if there are any issues
            try:
                pretty = json.dumps(data, indent=2, ensure_ascii=False)
                print("\n✓ JSON can be successfully pretty-printed")
                print(f"  Original size: {len(content):,} characters")
                print(f"  Pretty-printed size: {len(pretty):,} characters")
            except Exception as e:
                print(f"\n⚠ Error during pretty-printing: {e}")
            
            return True
        except json.JSONDecodeError as e:
            print(f"✗ JSON parsing error found!")
            print(f"\nError details:")
            print(f"  Message: {e.msg}")
            print(f"  Line: {e.lineno}")
            print(f"  Column: {e.colno}")
            print(f"  Position: {e.pos}")
            
            # Show context around the error
            lines = content.split('\n')
            error_line = e.lineno - 1  # Convert to 0-based index
            
            print(f"\nContext around error (line {e.lineno}):")
            print("-" * 80)
            
            # Show 3 lines before and after the error
            start_line = max(0, error_line - 3)
            end_line = min(len(lines), error_line + 4)
            
            for i in range(start_line, end_line):
                line_num = i + 1
                prefix = ">>> " if i == error_line else "    "
                print(f"{prefix}{line_num:4d} | {lines[i]}")
            
            # Show pointer to exact column
            if error_line < len(lines):
                error_col = e.colno - 1
                print(" " * (10 + error_col) + "^")
                print(f"Column {e.colno} (0-indexed: {error_col})")
            
            # Additional analysis: check common JSON issues
            print("\n" + "=" * 80)
            print("Checking for common JSON issues:")
            print("=" * 80)
            
            # Check for trailing commas
            trailing_comma_lines = []
            for i, line in enumerate(lines, 1):
                stripped = line.strip()
                if stripped and stripped[-1] == ',':
                    # Check if it's followed by } or ]
                    if i < len(lines):
                        next_stripped = lines[i].strip()
                        if next_stripped.startswith(('}', ']')):
                            trailing_comma_lines.append(i)
            
            if trailing_comma_lines:
                print(f"\n⚠ Found {len(trailing_comma_lines)} potential trailing comma(s) before closing brackets:")
                for line_num in trailing_comma_lines[:10]:  # Show first 10
                    print(f"  Line {line_num}: {lines[line_num - 1].rstrip()}")
                if len(trailing_comma_lines) > 10:
                    print(f"  ... and {len(trailing_comma_lines) - 10} more")
            
            # Check for unclosed strings
            in_string = False
            escape_next = False
            string_start_line = None
            for i, line in enumerate(lines, 1):
                for j, char in enumerate(line):
                    if escape_next:
                        escape_next = False
                        continue
                    if char == '\\':
                        escape_next = True
                        continue
                    if char == '"':
                        if not in_string:
                            in_string = True
                            string_start_line = i
                        else:
                            in_string = False
                            string_start_line = None
            
            if in_string:
                print(f"\n⚠ Unclosed string detected starting at line {string_start_line}")
            
            # Check for unmatched brackets
            open_braces = content.count('{')
            close_braces = content.count('}')
            open_brackets = content.count('[')
            close_brackets = content.count(']')
            
            print(f"\nBracket count:")
            print(f"  {{ : {open_braces}, }} : {close_braces} (diff: {open_braces - close_braces})")
            print(f"  [ : {open_brackets}, ] : {close_brackets} (diff: {open_brackets - close_brackets})")
            
            if open_braces != close_braces:
                print(f"  ⚠ Mismatched braces!")
            if open_brackets != close_brackets:
                print(f"  ⚠ Mismatched brackets!")
            
            # Check for invalid escape sequences
            invalid_escapes = []
            escape_pattern = re.compile(r'\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})')
            for i, line in enumerate(lines, 1):
                matches = escape_pattern.finditer(line)
                for match in matches:
                    invalid_escapes.append((i, match.start() + 1, match.group()))
            
            if invalid_escapes:
                print(f"\n⚠ Found {len(invalid_escapes)} invalid escape sequence(s):")
                for line_num, col, seq in invalid_escapes[:10]:
                    print(f"  Line {line_num}, Column {col}: {seq}")
                if len(invalid_escapes) > 10:
                    print(f"  ... and {len(invalid_escapes) - 10} more")
            
            # Check for control characters (except newlines, tabs, etc.)
            control_chars = []
            for i, line in enumerate(lines, 1):
                for j, char in enumerate(line):
                    if ord(char) < 32 and char not in '\n\r\t':
                        control_chars.append((i, j + 1, repr(char)))
            
            if control_chars:
                print(f"\n⚠ Found {len(control_chars)} control character(s):")
                for line_num, col, char_repr in control_chars[:10]:
                    print(f"  Line {line_num}, Column {col}: {char_repr}")
                if len(control_chars) > 10:
                    print(f"  ... and {len(control_chars) - 10} more")
            
            return False
        except Exception as parse_error:
            # If JSON parsing succeeds but there's another error
            print(f"Unexpected error during parsing: {parse_error}")
            return False
            
    except Exception as e:
        print(f"Error reading file: {e}")
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python validate_json.py <json_file_path>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    success = validate_json_file(file_path)
    sys.exit(0 if success else 1)
