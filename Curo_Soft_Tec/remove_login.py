import os
import re

def comment_out_login_button(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find the Login button line (flexible for different attributes)
    # Looking for <a href="...login..." ...>Login</a>
    # We want to wrap it in <!-- --> if it's not already
    
    pattern = re.compile(r'(<a\s+[^>]*href=["\'][^"\']*login[^"\']*["\'][^>]*>.*?Login.*?</a>)', re.IGNORECASE | re.DOTALL)
    
    if pattern.search(content):
        # Check if already commented
        # This is a simple check, manual review suggested if complex
        new_content = pattern.sub(r'<!-- \1 -->', content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated: {file_path}")
        else:
            print(f"No change needed (already commented or pattern mismatch?): {file_path}")
    else:
        print(f"Login button not found in: {file_path}")

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html'):
                comment_out_login_button(os.path.join(root, file))

# Run on root and pages
print("Processing root...")
comment_out_login_button('d:\\WORK\\Curo_Soft_Tec\\index.html')
print("Processing pages...")
process_directory('d:\\WORK\\Curo_Soft_Tec\\pages')
