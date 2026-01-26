import os
import re

def move_button_to_right(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find the button inside the list (Move it back out)
    # Look for: <li><a href="#" class="btn btn-primary">Book Demo</a></li>
    # We want to remove it from <ul> and place it in <div class="nav-buttons">
    
    # 1. Find the list item
    li_pattern = re.compile(r'(<li>\s*<a\s+[^>]*class=["\']btn btn-primary["\'][^>]*>.*?Book Demo.*?</a>\s*</li>)', re.IGNORECASE | re.DOTALL)
    match_li = li_pattern.search(content)
    
    if match_li:
        li_html = match_li.group(1)
        # Extract just the button link from the LI
        link_pattern = re.compile(r'(<a\s+[^>]*>.*?</a>)', re.DOTALL)
        link_match = link_pattern.search(li_html)
        
        if link_match:
            button_html = link_match.group(1)
            
            # 2. Remove LI fro ul
            content = content.replace(li_html, '')
            
            # 3. Add to .nav-buttons
            # Find <div class="nav-buttons"> ... </div>
            # We want to replace the content (or append if empty)
            
            # Since I know it's currently empty/commented:
            # <div class="nav-buttons">\n YOUR_COMMENT </div>
            
            # Let's simple regex for width
            div_pattern = re.compile(r'(<div class="nav-buttons">)(.*?)(</div>)', re.IGNORECASE | re.DOTALL)
            
            if div_pattern.search(content):
                # Preserve existing comments if we want, or just append
                # But to be clean, let's just make sure it's inside.
                # \1 is open tag, \2 is content, \3 is close
                
                # Check if button is already in there? No, we found it in LI.
                
                # Replace the div content with existing + button
                # Or just Button + Comment?
                
                # Let's Just Prepend the button to the content of div
                content = div_pattern.sub(f'\\1\\n{button_html}\\n\\2\\3', content)
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {file_path}")
            else:
                 print(f"Nav buttons div not found in {file_path}")
    else:
        print(f"Button not found in list in {file_path}")

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html') and file != 'login.html':
                move_button_to_right(os.path.join(root, file))

# Run on root and pages
print("Processing root...")
move_button_to_right('d:\\WORK\\Curo_Soft_Tec\\index.html')
print("Processing pages...")
process_directory('d:\\WORK\\Curo_Soft_Tec\\pages')
