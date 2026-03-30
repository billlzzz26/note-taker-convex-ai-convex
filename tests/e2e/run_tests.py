#!/usr/bin/env python3
"""
Test runner for E2E tests.
Runs all Playwright tests in the tests/e2e directory.
"""
import subprocess
import sys
import os


def run_tests():
    """Run all E2E tests."""
    print("=" * 60)
    print("Running E2E Tests for Note Taker")
    print("=" * 60)
    
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # List of test files
    test_files = [
        "test_main_page.py",
        "test_thread_sidebar.py",
        "test_notes_panel.py",
        "test_note_tool_renderers.py",
    ]
    
    passed = 0
    failed = 0
    
    for test_file in test_files:
        test_path = os.path.join(script_dir, test_file)
        
        if not os.path.exists(test_path):
            print(f"⚠️  Test file not found: {test_file}")
            continue
        
        print(f"\n{'=' * 60}")
        print(f"Running: {test_file}")
        print('=' * 60)
        
        try:
            result = subprocess.run(
                [sys.executable, test_path],
                cwd=script_dir,
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0:
                print(f"✅ {test_file} - PASSED")
                passed += 1
            else:
                print(f"❌ {test_file} - FAILED")
                print(f"Error output:\n{result.stderr}")
                failed += 1
        except subprocess.TimeoutExpired:
            print(f"⏰ {test_file} - TIMEOUT")
            failed += 1
        except Exception as e:
            print(f"💥 {test_file} - ERROR: {e}")
            failed += 1
    
    print(f"\n{'=' * 60}")
    print("Test Summary")
    print('=' * 60)
    print(f"Total: {passed + failed}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print('=' * 60)
    
    return 0 if failed == 0 else 1


if __name__ == '__main__':
    sys.exit(run_tests())
