import os
import re

def move_book_demo_button(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to capture the Book Demo button (allowing for varying whitespace)
    # Target: <a href="#" class="btn btn-primary">Book Demo</a>
    # We want to remove it from .nav-buttons and add it to .nav-links
    
    # 1. Find the button logic
    button_pattern = re.compile(r'(<a\s+[^>]*class=["\']btn btn-primary["\'][^>]*>.*?Book Demo.*?</a>)', re.IGNORECASE | re.DOTALL)
    match = button_pattern.search(content)
    
    if match:
        button_html = match.group(1)
        # Create list item version
        new_list_item = f'\n                <li>{button_html}</li>'
        
        # 2. Remove from old location (and empty wrapper if needed)
        # We replace the button with empty string. 
        # If .nav-buttons is empty after (or contains only comments), we might leave it for mobile script compatibility?
        # The mobile script looks for .nav-buttons. It's safer to leave the div empty or with the comment.
        content_removed = content.replace(button_html, '')
        
        # 3. Add to .nav-links </ul>
        # Find the closing </ul> of nav-links
        # Look for <ul class="nav-links"> ... </ul>
        # We insert before the last </ul> inside the nav-links block
        
        # Finding the specific </ul> for nav-links is tricky with regex if nested, 
        # but here we know the structure.
        
        # Simplest approach: Replace '</ul>\n            <div class="nav-buttons">' 
        # But whitespace varies.
        
        # Better: Find inner HTML range of nav-links and append.
        
        # Let's try flexible replacement:
        # Search for the specific pattern of the end of nav-links and start of nav-buttons
        
        # Pattern: Close UL, then whitespace, then div nav-buttons
        # We want to put the LI before the Close UL.
        
        # Robust method:
        # Finds the last </ul> before <div class="nav-buttons">
        
        # Let's simple-search for the button first to verify existence.
        print(f"Propagating change to {file_path}")
        
        # Remove button
        content = content.replace(button_html, '')
        
        # Add to end of list
        # We look for the "Pages" dropdown end, usually </li>\n            </ul>
        
        # We can look for the closing </ul> tag that strictly precedes <div class="nav-buttons">
        # pattern: (</ul>)(\s*<div class="nav-buttons">)
        
        pattern_end_ul = re.compile(r'(</ul>)(\s*<div class="nav-buttons">)', re.IGNORECASE)
        
        if pattern_end_ul.search(content):
            content = pattern_end_ul.sub(f'{new_list_item}\n            \\1\\2', content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(" - Success")
        else:
            print(" - Could not find insertion point (</ul> before .nav-buttons)")
            
    else:
        print(f" - Book Demo button not found or already moved in {file_path}")

def process_directory(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.html') and file != 'login.html': # Skip login.html
                move_book_demo_button(os.path.join(root, file))

# Run on root and pages
print("Processing root...")
move_book_demo_button('d:\\WORK\\Curo_Soft_Tec\\index.html')
print("Processing pages...")
process_directory('d:\\WORK\\Curo_Soft_Tec\\pages')
