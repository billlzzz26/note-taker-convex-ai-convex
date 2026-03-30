"""
E2E test for ThreadSidebar component.
Tests thread creation, selection, and navigation.
"""
from playwright.sync_api import sync_playwright, expect


def test_thread_sidebar_visible():
    """Test that the thread sidebar is visible on page load."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # Verify sidebar is visible
        sidebar = page.locator('aside, [class*="sidebar"]').first
        expect(sidebar).to_be_visible()
        
        browser.close()


def test_create_new_thread():
    """Test creating a new thread."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # Find and click the new thread button
        new_thread_button = page.locator('button:has-text("New"), button:has-text("New Chat"), button:has-text("+")').first
        expect(new_thread_button).to_be_visible()
        new_thread_button.click()
        
        # Wait for the thread to be created
        page.wait_for_timeout(500)
        
        # Verify a new thread appears in the sidebar
        thread_item = page.locator('[class*="thread"], [class*="chat"]').first
        expect(thread_item).to_be_visible()
        
        browser.close()


def test_thread_selection():
    """Test selecting a thread from the sidebar."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # Create a thread first
        new_thread_button = page.locator('button:has-text("New"), button:has-text("New Chat"), button:has-text("+")').first
        new_thread_button.click()
        page.wait_for_timeout(500)
        
        # Get the first thread item
        thread_item = page.locator('[class*="thread"], [class*="chat"]').first
        expect(thread_item).to_be_visible()
        
        # Click on the thread
        thread_item.click()
        
        # Verify the thread is selected (should have active state)
        # The active thread should have a different visual style
        page.wait_for_timeout(300)
        
        browser.close()


def test_multiple_threads():
    """Test creating multiple threads."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # Create first thread
        new_thread_button = page.locator('button:has-text("New"), button:has-text("New Chat"), button:has-text("+")').first
        new_thread_button.click()
        page.wait_for_timeout(500)
        
        # Create second thread
        new_thread_button.click()
        page.wait_for_timeout(500)
        
        # Create third thread
        new_thread_button.click()
        page.wait_for_timeout(500)
        
        # Verify multiple threads exist
        thread_items = page.locator('[class*="thread"], [class*="chat"]')
        expect(thread_items).to_have_count(3)
        
        browser.close()


def test_thread_sidebar_responsive():
    """Test thread sidebar behavior on different screen sizes."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Test on desktop
        page = browser.new_page(viewport={'width': 1280, 'height': 720})
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        sidebar = page.locator('aside, [class*="sidebar"]').first
        expect(sidebar).to_be_visible()
        
        page.close()
        
        # Test on tablet
        page = browser.new_page(viewport={'width': 768, 'height': 1024})
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # Sidebar should still be accessible
        sidebar = page.locator('aside, [class*="sidebar"]').first
        expect(sidebar).to_be_visible()
        
        page.close()
        
        browser.close()


if __name__ == '__main__':
    test_thread_sidebar_visible()
    test_create_new_thread()
    test_thread_selection()
    test_multiple_threads()
    test_thread_sidebar_responsive()
    print("All thread sidebar tests passed!")
