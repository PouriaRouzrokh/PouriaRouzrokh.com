#!/usr/bin/env python3
"""
Script to fix JSON formatting issues and pretty-print the result.
"""

import json
import sys
import re
from pathlib import Path


def fix_json_file(input_path, output_path=None, pretty_print=True):
    """
    Fix JSON formatting issues and optionally pretty-print.
    """
    input_path = Path(input_path)
    
    if not input_path.exists():
        print(f"Error: File not found: {input_path}")
        return False
    
    if output_path is None:
        output_path = input_path
    
    print(f"Reading file: {input_path}")
    
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Try to parse the JSON first
        try:
            data = json.loads(content)
            print("✓ JSON is valid and can be parsed")
        except json.JSONDecodeError as e:
            print(f"✗ JSON parsing error: {e.msg} at line {e.lineno}, column {e.colno}")
            print("Attempting to fix common issues...")
            
            # Try to fix trailing commas before } or ]
            # This is a common issue - remove commas that are followed by } or ]
            fixed_content = re.sub(r',(\s*[}\]])', r'\1', content)
            
            # Try parsing again
            try:
                data = json.loads(fixed_content)
                print("✓ Fixed trailing commas - JSON is now valid")
                content = fixed_content
            except json.JSONDecodeError as e2:
                print(f"✗ Still has errors after fixing: {e2.msg} at line {e2.lineno}, column {e2.colno}")
                return False
        
        # Write the fixed/pretty-printed JSON
        with open(output_path, 'w', encoding='utf-8') as f:
            if pretty_print:
                json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"✓ Wrote pretty-printed JSON to: {output_path}")
            else:
                json.dump(data, f, ensure_ascii=False)
                print(f"✓ Wrote minified JSON to: {output_path}")
        
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_json.py <input_json_file> [output_json_file]")
        print("  If output file is not specified, input file will be overwritten")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    success = fix_json_file(input_file, output_file)
    sys.exit(0 if success else 1)
