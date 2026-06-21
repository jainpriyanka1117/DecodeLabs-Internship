import os
import re
from typing import Tuple, List

def validate_length(password: str) -> bool:
    """Checks if the password meets the minimum length requirement of 8 characters."""
    return len(password) >= 8

def check_uppercase(password: str) -> bool:
    """Checks if the password contains at least one uppercase letter (A-Z)."""
    return any(char.isupper() for char in password)

def check_lowercase(password: str) -> bool:
    """Checks if the password contains at least one lowercase letter (a-z)."""
    return any(char.islower() for char in password)

def check_number(password: str) -> bool:
    """Checks if the password contains at least one numeric digit (0-9)."""
    return any(char.isdigit() for char in password)

def check_special_char(password: str) -> bool:
    """Checks if the password contains at least one special character from the allowed set."""
    special_chars = "@#$%^&*!?_-"
    return any(char in special_chars for char in password)

def check_email_match(email: str, password: str) -> bool:
    """Checks if the password exactly matches the email address (case-insensitive)."""
    return email.strip().lower() == password.lower()

def check_email_derived(email: str, password: str) -> bool:
    """
    Checks if the password is derived from the email address username.
    It extracts the username (before '@') and checks:
    1. If the full username is in the password (case-insensitive).
    2. If the password exactly matches any segment of the username (e.g. 'abc' or '22').
    3. If the password contains all segments of the username (e.g. contains both 'abc' and '22').
    """
    if not email or "@" not in email:
        return False

    username = email.split("@")[0].strip().lower()
    p_low = password.lower()

    # 1. If the full username is a substring of the password
    if len(username) >= 3 and username in p_low:
        return True

    # Split username into letters, digits, and other segments
    # e.g., 'abc22' -> ['abc', '22']
    parts = re.split(r'[^a-zA-Z0-9]+', username)
    all_parts = []
    for part in parts:
        # Find contiguous letter sequences and digit sequences
        subparts = re.findall(r'[a-zA-Z]+|[0-9]+', part)
        all_parts.extend(subparts)

    # Filter out empty or very short parts (length < 2) to avoid false positives (e.g. letter 'a')
    significant_parts = [p for p in all_parts if len(p) >= 2]
    
    # 2. If the password exactly matches any segment
    for part in significant_parts:
        if p_low == part:
            return True

    # 3. If the password contains ALL segments (and there is more than one segment)
    if len(significant_parts) > 1:
        if all(part in p_low for part in significant_parts):
            return True

    return False

def check_blacklist(password: str, blacklist_path: str) -> bool:
    """Checks if the password is present in the common passwords blacklist (case-insensitive)."""
    p_low = password.lower()
    
    # Check if the blacklist file exists
    if not os.path.exists(blacklist_path):
        # Fallback to the default required blacklist
        default_blacklist = {
            "123456", "12345678", "password", "password123", 
            "admin", "administrator", "welcome", "qwerty", "letmein", "abc123"
        }
        return p_low in default_blacklist

    try:
        with open(blacklist_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip().lower() == p_low:
                    return True
    except IOError:
        # Fallback in case of file read error
        default_blacklist = {
            "123456", "12345678", "password", "password123", 
            "admin", "administrator", "welcome", "qwerty", "letmein", "abc123"
        }
        return p_low in default_blacklist

    return False

def check_repeated_patterns(password: str) -> bool:
    """
    Checks for consecutive repeating characters (e.g., 'aaaaaa', '111111') 
    or obvious repeating patterns (e.g., 'abcabcabc', '12121212', 'xyzxyzxyz').
    """
    # 1. Consecutive identical character repeated 4 or more times
    for i in range(len(password) - 3):
        if password[i] == password[i+1] == password[i+2] == password[i+3]:
            return True

    # 2. Consecutive pattern of length 2 repeating 3 or more times (e.g., '121212')
    for i in range(len(password) - 5):
        pattern = password[i:i+2]
        if password[i+2:i+4] == pattern and password[i+4:i+6] == pattern:
            return True

    # 3. Consecutive pattern of length 3 repeating 3 or more times (e.g., 'abcabcabc')
    for i in range(len(password) - 8):
        pattern = password[i:i+3]
        if password[i+3:i+6] == pattern and password[i+6:i+9] == pattern:
            return True

    return False

def check_sequential_patterns(password: str) -> bool:
    """
    Checks for sequential alphabetical, numerical, or keyboard row sequences
    of length >= 5 (e.g., 'abcdef', 'fedcba', '123456', 'qwerty', 'asdfgh').
    """
    p_low = password.lower()

    # Setup character sequences
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    digits = "01234567890"  # includes 90 for wrapping
    
    # Keyboard rows (QWERTY layout)
    keyboard_rows = [
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm"
    ]

    sequences = [
        alphabet, alphabet[::-1],
        digits, digits[::-1]
    ]

    for row in keyboard_rows:
        sequences.append(row)
        sequences.append(row[::-1])

    # Check for any sliding window subsequence of length 5
    for seq in sequences:
        for start in range(len(seq) - 4):
            subseq = seq[start:start+5]
            if subseq in p_low:
                return True

    return False

def calculate_score_and_feedback(password: str) -> Tuple[int, List[str]]:
    """
    Calculates the password strength score (0 to 6) and collects
    constructive feedback suggestions if any requirements are missing.
    """
    score = 0
    feedback = []

    # 1. Length >= 8 check
    if len(password) >= 8:
        score += 1
    else:
        feedback.append("Increase password length to at least 8 characters.")

    # 2. Length >= 12 bonus check
    if len(password) >= 12:
        score += 1

    # 3. Uppercase check
    if check_uppercase(password):
        score += 1
    else:
        feedback.append("Add at least one uppercase letter (A-Z).")

    # 4. Lowercase check
    if check_lowercase(password):
        score += 1
    else:
        feedback.append("Add at least one lowercase letter (a-z).")

    # 5. Number check
    if check_number(password):
        score += 1
    else:
        feedback.append("Add at least one number (0-9).")

    # 6. Special character check
    if check_special_char(password):
        score += 1
    else:
        feedback.append("Add at least one special character (@, #, $, %, ^, &, *, !, ?, _, -).")

    return score, feedback

def evaluate_password(email: str, password: str, blacklist_path: str) -> Tuple[bool, int, str, List[str], str]:
    """
    Runs full password validation workflow.
    Returns: (is_accepted, score, strength_label, feedback_suggestions, reject_reason)
    """
    # 1. Clean input
    email = email.strip()
    password = password.strip()

    # 2. Run Mandatory Pre-checks (Immediate Rejection Checks)
    if not validate_length(password):
        return False, 0, "Weak", ["Increase password length to at least 8 characters."], "Password is too short (less than 8 characters)."

    if check_email_match(email, password):
        return False, 0, "Weak", ["Avoid using your email address as your password."], "Password exactly matches the email address."

    if check_email_derived(email, password):
        return False, 0, "Weak", ["Avoid using parts of your email address or username in your password."], "Password is derived from the email address username."

    if check_blacklist(password, blacklist_path):
        return False, 0, "Weak", ["Avoid using common passwords like '123456' or 'password'."], "Password matches a known vulnerable blacklist."

    if check_repeated_patterns(password):
        return False, 0, "Weak", ["Avoid repeated characters (e.g. 'aaaa') or repeating patterns (e.g. '121212')."], "Password contains highly repetitive patterns."

    if check_sequential_patterns(password):
        return False, 0, "Weak", ["Avoid sequential characters (e.g. '12345' or 'qwerty')."], "Password contains predictable sequential patterns."

    # 3. Calculate Score & Feedback (runs if all mandatory pre-checks pass)
    score, feedback = calculate_score_and_feedback(password)

    # 4. Determine Acceptance Status and Strength Label
    if score <= 2:
        return False, score, "Weak", feedback, "Password does not meet the basic character variety requirements."
    elif score <= 4:
        # Add general tip for medium passwords
        if len(password) < 12:
            feedback.append("Increase password length to 12 or more characters for a strength bonus.")
        return True, score, "Medium", feedback, ""
    else:
        return True, score, "Strong", [], ""
