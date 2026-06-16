import os
import sys
from core import evaluate_password

def run_tests():
    # Setup paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blacklist_path = os.path.join(script_dir, "blacklist.txt")

    print("\n=================== STARTING AUTOMATED SECURITY TESTS ===================")

    # Test cases: (email, password, expected_is_accepted, expected_strength, test_name)
    test_cases = [
        # 1. Length checks
        ("test@example.com", "S1!", False, "Weak", "Length < 8 (Immediate Reject)"),
        
        # 2. Basic variety criteria evaluations (Score based strength checks)
        ("test@example.com", "secure123!", True, "Medium", "Has Lower, Num, Special (Score 4)"),
        ("test@example.com", "SECURE123!", True, "Medium", "Has Upper, Num, Special (Score 4)"),
        ("test@example.com", "SecurePass!", True, "Medium", "Has Upper, Lower, Special (Score 4)"),
        ("test@example.com", "SecurePass123", True, "Strong", "Has Upper, Lower, Num, Length Bonus (Score 5)"),
        
        # 3. Score-based Weak rejections (No pattern failures, but score <= 2)
        ("test@example.com", "mypasswd", False, "Weak", "All lowercase, no patterns (Score 2, Weak)"),
        ("test@example.com", "MYPASSWD", False, "Weak", "All uppercase, no patterns (Score 2, Weak)"),
        ("test@example.com", "13579246", False, "Weak", "All numbers, non-sequential (Score 2, Weak)"),
        ("test@example.com", "!?_@*-#$", False, "Weak", "All special, non-repeated (Score 2, Weak)"),

        # 4. Email matching checks
        ("abc@gmail.com", "abc@gmail.com", False, "Weak", "Exact email match (Immediate Reject)"),
        
        # 5. Email-derived passwords
        ("abc22@gmail.com", "abc22", False, "Weak", "Exact email username (Immediate Reject)"),
        ("abc22@gmail.com", "abc", False, "Weak", "Email username alpha part (Immediate Reject)"),
        ("abc22@gmail.com", "22", False, "Weak", "Email username numeric part (Immediate Reject)"),
        ("abc22@gmail.com", "abc@22", False, "Weak", "Email username split parts combo (Immediate Reject)"),
        ("abc22@gmail.com", "abc22@123", False, "Weak", "Email username prefix (Immediate Reject)"),
        ("abc22@gmail.com", "Abc22#Secure", False, "Weak", "Email username prefix cased (Immediate Reject)"),
        
        # 6. Blacklist matches
        ("test@example.com", "password", False, "Weak", "Blacklisted word 'password' (Immediate Reject)"),
        ("test@example.com", "123456", False, "Weak", "Blacklisted word '123456' (Immediate Reject)"),
        ("test@example.com", "qwerty", False, "Weak", "Blacklisted word 'qwerty' (Immediate Reject)"),
        
        # 7. Repeated pattern checks
        ("test@example.com", "aaaaaa12#S", False, "Weak", "Repeated character 'aaaaaa' (Immediate Reject)"),
        ("test@example.com", "abcabcabc1#S", False, "Weak", "Repeated pattern 'abcabcabc' (Immediate Reject)"),
        ("test@example.com", "12121212!A", False, "Weak", "Repeated pattern '12121212' (Immediate Reject)"),
        
        # 8. Sequential pattern checks
        ("test@example.com", "123456!Aa", False, "Weak", "Numeric sequence '123456' (Immediate Reject)"),
        ("test@example.com", "abcdef!Aa", False, "Weak", "Alphabetical sequence 'abcdef' (Immediate Reject)"),
        ("test@example.com", "qwerty!Aa", False, "Weak", "Keyboard sequence 'qwerty' (Immediate Reject)"),
        ("test@example.com", "asdfgh!Aa", False, "Weak", "Keyboard sequence 'asdfgh' (Immediate Reject)"),
        
        # 9. Accepted password strengths
        ("user123@gmail.com", "Secure@123", True, "Strong", "Valid Strong Password (Score 5)"),
        ("user123@gmail.com", "SuperLongSecurePassword123!", True, "Strong", "Valid Strong Password w/ Length Bonus (Score 6)"),
    ]

    passed_count = 0
    failed_count = 0

    for idx, (email, password, exp_accepted, exp_strength, name) in enumerate(test_cases, 1):
        is_accepted, score, strength, feedback, reject_reason = evaluate_password(
            email, password, blacklist_path
        )
        
        # Determine if test passed
        test_passed = (is_accepted == exp_accepted) and (strength == exp_strength)
        
        status_text = "PASS" if test_passed else "FAIL"
        print(f"Test #{idx:02d} [{name}]: {status_text}")
        print(f"  Input Email   : {email}")
        print(f"  Input Password: {password}")
        print(f"  Expected      : Accepted={exp_accepted}, Strength={exp_strength}")
        print(f"  Got           : Accepted={is_accepted}, Strength={strength}, Score={score}")
        if reject_reason:
            print(f"  Reject Reason : {reject_reason}")
        if feedback:
            print(f"  Feedback      : {feedback}")
        print("-" * 70)

        if test_passed:
            passed_count += 1
        else:
            failed_count += 1

    print(f"\n=================== ASSESSMENT RESULTS SUMMARY ===================")
    print(f"Total Tests Run: {len(test_cases)}")
    print(f"Tests Passed   : {passed_count}")
    print(f"Tests Failed   : {failed_count}")
    print("===================================================================\n")

    if failed_count > 0:
        print("FAIL: One or more test cases did not behave as expected.")
        sys.exit(1)
    else:
        print("SUCCESS: All security validation test cases passed successfully!")
        sys.exit(0)

if __name__ == "__main__":
    run_tests()
