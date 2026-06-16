# Cyber Security Internship Project Report

**Project Title:** Password Strength Checker  
**Domain:** Defensive Cyber Security & Secure Coding Heuristics  
**Intern Name:** Priyanka  
**Date:** June 16, 2026  
**Status:** Completed  

---

## 1. Executive Summary
This project delivers a production-quality, modular security utility designed to validate and rate user passwords. The core objective of the application is to implement a strict defensive security boundary that filters out weak, compromised, or highly predictable credentials. 

Unlike primitive length-checking scripts, this checker enforces custom algorithms targeting sequential, repeating, and email-derived string patterns, protecting users against modern brute-force, dictionary, and social engineering attack vectors.

---

## 2. Technical Goals & Specifications
The validator evaluates input combinations and classifies them as **Weak** (Rejected), **Medium** (Accepted with Warning), or **Strong** (Accepted).

### System Specifications:
*   **Minimum Length Requirement**: $\ge 8$ characters (mandatory).
*   **Character Variety Checks**: Uppercase (A-Z), Lowercase (a-z), Numeric (0-9), and Special Symbols (`@#$%^&*!?_-`).
*   **Predictable String Protections**: Blacklisting, Exact Email Matching, Username Extraction & Derived Match, Character Repetition, Alphabetical/Numerical Sequence, and Keyboard Pathing Detection.

---

## 3. Modular Architecture Design

The project is designed in Python using standard libraries to minimize dependencies and eliminate external software supply-chain vulnerabilities. 

```
password_strength_checker/
│
├── core.py              # Contains all heuristics, pattern matchers, and scoring algorithms
├── main.py              # Interactive console input/output runner with colored ANSI styling
├── blacklist.txt        # Database of popular weak passwords targeted for immediate rejection
├── tests.py             # Diagnostic test suite executing 28 verification test cases
├── index.html           # Modern, responsive Web UI landing page with glassmorphism styling
├── style.css            # Custom CSS for dark theme layout and micro-animations
└── app.js               # Real-time Javascript validation runner matching core.py
```

### Module Interfaces:
1.  **`core.py`**: Exports the primary function `evaluate_password(email, password, blacklist_path)`.
2.  **`main.py`**: Executes a command-line input loop prompting for user email and password, triggering the assessment module, and rendering results.
3.  **`tests.py`**: A non-interactive validation framework verifying edge cases and ensuring zero regression bugs.
4.  **`index.html` + `style.css` + `app.js`**: Replicates python validation checks on the frontend to provide real-time interactive assessment results in the browser.

---

## 4. Algorithmic Implementation Details

### A. Email-Derived Heuristics
Extracts username string $U$ from email $U@D$. Splits $U$ into alphabetic ($U_{alpha}$) and numeric ($U_{num}$) tokens. Rejects password $P$ if:
1.  $U$ is a substring of $P$.
2.  $P$ exactly matches any token $U_i$ (where len($U_i$) $\ge 2$).
3.  $P$ contains all tokens of $U$ concurrently (e.g. contains both $U_{alpha}$ and $U_{num}$).

### B. Repeating Pattern Search
Analyzes consecutive repeating structures:
*   **Char Level**: Uses a sliding window of length 4 to detect matching characters: $P_i == P_{i+1} == P_{i+2} == P_{i+3}$.
*   **Sub-Pattern Level**: Detects multi-character repeats of length 2 and 3 (e.g., `121212` or `abcabcabc`) by comparing successive substrings.

### C. Sequence Scanning
Scans sliding windows of length 5 of the password against precomputed sequential structures, including the alphabet, numbers (forward & reverse), and three keyboard rows (`qwertyuiop`, `asdfghjkl`, `zxcvbnm` and reverses).

---

## 5. Sample Inputs & Outputs

### Case 1: Rejected Password - Email-Derived Pattern
*   **Input Email**: `abc22@gmail.com`
*   **Input Password**: `Abc22#Secure`
*   **Output Assessment**:
    ```text
    ====================== SECURITY ASSESSMENT REPORT ======================
    Target User: abc22@gmail.com
    Password Strength: Weak (Score: 0/6)
    Status: REJECTED
    Rejection Reason: Password is derived from the email address username.

    Security Recommendations & Improvement Tips:
      • Avoid using parts of your email address or username in your password.
    ========================================================================
    ```

### Case 2: Accepted Password with Warning - Medium Strength
*   **Input Email**: `user123@gmail.com`
*   **Input Password**: `SecurePass123`
*   **Output Assessment**:
    ```text
    ====================== SECURITY ASSESSMENT REPORT ======================
    Target User: user123@gmail.com
    Password Strength: Medium (Score: 5/6)
    Status: ACCEPTED WITH WARNING

    Security Recommendations & Improvement Tips:
      • Add at least one special character (@, #, $, %, ^, &, *, !, ?, _, -).
    ========================================================================
    ```

### Case 3: Accepted Password - Strong Strength
*   **Input Email**: `user123@gmail.com`
*   **Input Password**: `Secure@123`
*   **Output Assessment**:
    ```text
    ====================== SECURITY ASSESSMENT REPORT ======================
    Target User: user123@gmail.com
    Password Strength: Strong (Score: 5/6)
    Status: ACCEPTED

    ✔ Password meets all security requirements.
    ========================================================================
    ```

---

## 6. Testing & Quality Assurance
The verification suite in `tests.py` runs 28 diagnostic assertions. Each test exercises a distinct edge-case, verifying immediate rejects and score-based calculations. 

All 28 tests completed with a status of **`PASS`**, proving the codebase fulfills all architectural and functional goals.

---

## 7. Conclusions & Industry Standards
This project successfully demonstrates the implementation of defensive secure coding practices. By shifting password validation away from simple length-based rules and incorporating contextual and pattern analysis, the system prevents common vulnerabilities that arise from predictable password creation habits.
