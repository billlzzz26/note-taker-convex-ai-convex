"""
E2E test for main page layout and basic interactions.
Tests the three-panel layout: ThreadSidebar, Chat, NotesPanel.
"""
from playwright.sync_api import sync_playwright, expect


def test_main_page_layout():
    """Test that the main page renders with all three panels."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('http://localhost:3000', timeout=120000)
        page.wait_for_load_state('networkidle')
        
        # Verify the page title
        expect(page).to_have_title("Note Taker")
        
        # Verify the three-panel layout exists
        # Thread sidebar should be present
        sidebar = page.locator('aside, [class*="sidebar"]').first
        expect(sidebar).to_be_visible()
        
        # Main chat area should be present
        chat_area = page.locator('main, [class*="conversation"]').first
        expect(chat_area).to_be_visible()
        
        # Notes panel should be present
        notes_panel = page.locator('[class*="notes"]').first
        expect(notes_panel).to_be_visible()
        
        browser.close()


def test_empty_state_display():
    """Test that the empty state is shown when no messages exist."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('http://localhost:3000', timeout=120000)
        page.wait_for_load_state('networkidle')
        
        # Verify empty state is displayed
        empty_state = page.locator('text=Note Taker').first
        expect(empty_state).to_be_visible()
        
        # Verify the description text
        description = page.locator('text=Ask me to remember something').first
        expect(description).to_be_visible()
        
        # Verify the example prompt
        example = page.locator('text=Remember my meeting is at 2pm Tuesday').first
        expect(example).to_be_visible()
        
        browser.close()


def test_chat_input_exists():
    """Test that the chat input area is present and functional."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('http://localhost:3000', timeout=120000)
        page.wait_for_load_state('networkidle')
        
        # Verify the textarea exists
        textarea = page.locator('textarea[placeholder="Type a message..."]')
        expect(textarea).to_be_visible()
        
        # Verify the submit button exists
        submit_button = page.locator('button[type="submit"]').first
        expect(submit_button).to_be_visible()
        
        # Verify the helper text
        helper_text = page.locator('text=Enter to send, Shift+Enter for newline')
        expect(helper_text).to_be_visible()
        
        browser.close()


def test_new_thread_button():
    """Test that the new thread button exists in the sidebar."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('http://localhost:3000', timeout=120000)
        page.wait_for_load_state('networkidle')
        
        # Find the new thread button (should be in sidebar)
        new_thread_button = page.locator('button:has-text("New"), button:has-text("New Chat"), button:has-text("+")').first
        expect(new_thread_button).to_be_visible()
        
        browser.close()


def test_responsive_layout():
    """Test that the layout is responsive on different screen sizes."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Test desktop layout
        page = browser.new_page(viewport={'width': 1280, 'height': 720})
        page.goto('http://localhost:3000', timeout=120000)
        page.wait_for_load_state('networkidle')
        
        # All panels should be visible on desktop
        sidebar = page.locator('aside, [class*="sidebar"]').first
        expect(sidebar).to_be_visible()
        
        page.close()
        
        # Test mobile layout
        page = browser.new_page(viewport={'width': 375, 'height': 667})
        page.goto('http://localhost:3000', timeout=120000)
        page.wait_for_load_state('networkidle')
        
        # Main content should still be visible
        chat_area = page.locator('main, [class*="conversation"]').first
        expect(chat_area).to_be_visible()
        
        page.close()
        browser.close()


if __name__ == '__main__':
    test_main_page_layout()
    test_empty_state_display()
    test_chat_input_exists()
    test_new_thread_button()
    test_responsive_layout()
    print("All main page tests passed!")
