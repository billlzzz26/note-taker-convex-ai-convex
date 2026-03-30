# E2E Tests for Note Taker

This directory contains End-to-End (E2E) tests for the Note Taker application using Playwright.

## Test Files

| File | Description |
| --- | --- |
| `test_main_page.py` | Tests for main page layout, empty state, chat input, and responsive design |
| `test_thread_sidebar.py` | Tests for thread creation, selection, and sidebar navigation |
| `test_notes_panel.py` | Tests for notes panel visibility, header, and responsive behavior |
| `test_note_tool_renderers.py` | Tests for tool call result rendering and display |
| `run_tests.py` | Test runner script that executes all tests |

## Prerequisites

1. **Python 3.8+** installed
2. **Playwright** installed:
   ```bash
   pip install playwright
   playwright install chromium
   ```

## Running Tests

### Run All Tests

```bash
python tests/e2e/run_tests.py
```

### Run Individual Tests

```bash
python tests/e2e/test_main_page.py
python tests/e2e/test_thread_sidebar.py
python tests/e2e/test_notes_panel.py
python tests/e2e/test_note_tool_renderers.py
```

### Using with_server.py Helper

If the server is not already running, use the helper script:

```bash
python .kilocode/skills/webapp-testing/scripts/with_server.py \
  --server "bun dev" \
  --port 3000 \
  -- python tests/e2e/run_tests.py
```

## Test Coverage

### Main Page (`test_main_page.py`)

- ✅ Page layout with three panels
- ✅ Empty state display
- ✅ Chat input area
- ✅ New thread button
- ✅ Responsive layout (desktop, tablet, mobile)

### Thread Sidebar (`test_thread_sidebar.py`)

- ✅ Sidebar visibility
- ✅ Create new thread
- ✅ Thread selection
- ✅ Multiple threads
- ✅ Responsive behavior

### Notes Panel (`test_notes_panel.py`)

- ✅ Panel visibility
- ✅ Panel header
- ✅ Empty state
- ✅ Responsive behavior
- ✅ Scrollable content

### Note Tool Renderers (`test_note_tool_renderers.py`)

- ✅ Component existence
- ✅ Tool result display structure
- ✅ Tool call rendering
- ✅ Styling
- ✅ Accessibility

## Writing New Tests

To add new tests:

1. Create a new file: `test_<feature>.py`
2. Import from `playwright.sync_api`:
   ```python
   from playwright.sync_api import sync_playwright, expect
   ```

3. Write test functions following the pattern:
   ```python
   def test_feature():
       with sync_playwright() as p:
           browser = p.chromium.launch(headless=True)
           page = browser.new_page()
           
           page.goto('http://localhost:3000')
           page.wait_for_load_state('networkidle')
           
           # Your test logic here
           
           browser.close()
   ```

4. Add the test file to `run_tests.py`

## Best Practices

- Always wait for `networkidle` before assertions
- Use `headless=True` for CI/CD environments
- Close browser instances after tests
- Use descriptive test function names
- Add comments for complex test logic
- Handle timeouts gracefully

## Troubleshooting

### Server Not Running

If tests fail with connection errors, ensure the dev server is running:

```bash
bun dev
```

### Playwright Not Installed

Install Playwright and Chromium:

```bash
pip install playwright
playwright install chromium
```

### Timeout Errors

Increase timeout in test files if needed:

```python
page.goto('http://localhost:3000', timeout=60000)
```
