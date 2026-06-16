import os
import sys
from core import evaluate_password

# Enable ANSI escape sequences on Windows command prompt
if os.name == 'nt':
    os.system('')

# ANSI styling helper functions
def bold(text: str) -> str: return f"\033[1m{text}\033[0m"
def color_red(text: str) -> str: return f"\033[91m{text}\033[0m"
def color_green(text: str) -> str: return f"\033[92m{text}\033[0m"
def color_yellow(text: str) -> str: return f"\033[93m{text}\033[0m"
def color_cyan(text: str) -> str: return f"\033[36m{text}\033[0m"
def color_gray(text: str) -> str: return f"\033[90m{text}\033[0m"

def print_divider():
    print(color_gray("-" * 65))

def welcome_banner():
    print_divider()
    print(bold(color_cyan("      CYBER SECURITY INTERNSHIP PROJECT - PASSWORD STRENGTH CHECKER      ")))
    print(color_gray("                  Developed for Security Evaluation & Analysis"))
    print_divider()

def print_result_report(email: str, is_accepted: bool, score: int, strength: str, feedback: list, reject_reason: str):
    print("\n" + bold(color_cyan("====================== SECURITY ASSESSMENT REPORT ======================")))
    print(f"{bold('Target User:')} {email}")
    
    # Color code strength
    strength_colored = strength
    if strength == "Weak":
        strength_colored = bold(color_red(strength))
    elif strength == "Medium":
        strength_colored = bold(color_yellow(strength))
    elif strength == "Strong":
        strength_colored = bold(color_green(strength))

    print(f"{bold('Password Strength:')} {strength_colored} (Score: {score}/6)")

    # Color code status
    if not is_accepted:
        status_colored = bold(color_red("REJECTED"))
    elif strength == "Medium":
        status_colored = bold(color_yellow("ACCEPTED WITH WARNING"))
    else:
        status_colored = bold(color_green("ACCEPTED"))
        
    print(f"{bold('Status:')} {status_colored}")

    if reject_reason:
        print(f"{bold('Rejection Reason:')} {color_red(reject_reason)}")

    if feedback:
        print(f"\n{bold('Security Recommendations & Improvement Tips:')}")
        for item in feedback:
            print(f"  {color_yellow('•')} {item}")
    else:
        print(f"\n{color_green('✔ Password meets all security requirements.')}")
        
    print(bold(color_cyan("========================================================================")) + "\n")

def main():
    # Detect the blacklist path relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    blacklist_path = os.path.join(script_dir, "blacklist.txt")

    welcome_banner()

    while True:
        try:
            # 1. Ask for Email Address
            email = input(bold("Enter Email Address: ")).strip()
            while not email or "@" not in email:
                print(color_red("Error: Invalid email format. Please enter a valid email containing '@'."))
                email = input(bold("Enter Email Address: ")).strip()

            # 2. Ask for Password
            password = input(bold("Enter Password to Validate: ")).strip()
            while not password:
                print(color_red("Error: Password cannot be empty."))
                password = input(bold("Enter Password to Validate: ")).strip()

            # 3. Perform Password Evaluation
            is_accepted, score, strength, feedback, reject_reason = evaluate_password(
                email, password, blacklist_path
            )

            # 4. Display colorized results
            print_result_report(email, is_accepted, score, strength, feedback, reject_reason)

        except KeyboardInterrupt:
            print(color_yellow("\nProgram interrupted by user. Exiting."))
            break

        # Ask if the user wants to check another password
        choice = input("Do you want to evaluate another password? (y/n): ").strip().lower()
        if choice not in ('y', 'yes'):
            print(bold(color_green("\nThank you for using the Password Strength Checker! Stay Secure!")))
            break
        print_divider()

if __name__ == "__main__":
    main()
