# ==============================================================================
# ADVANCED TEXT ENCRYPTION SYSTEM
# VIGENÈRE CIPHER IMPLEMENTATION
# Cyber Security Project
# ==============================================================================
#
# THEORY & EXPLANATIONS:
# 
# 1. WHAT IS ENCRYPTION?
#    Encryption is the process of converting plaintext (readable data) into
#    ciphertext (unreadable/encoded data) using an algorithm and a key. Its
#    primary goal is to ensure confidentiality, preventing unauthorized parties
#    from reading sensitive information during transmission or storage.
#
# 2. WHAT IS DECRYPTION?
#    Decryption is the reverse process of encryption. It converts the scrambled
#    ciphertext back into its original, readable plaintext form using the correct
#    algorithm and the corresponding decryption key.
#
# 3. HOW THE VIGENÈRE CIPHER WORKS:
#    The Vigenère Cipher is a classic polyalphabetic substitution cipher. Unlike
#    a simple Caesar Cipher that shifts every letter by the same number of steps,
#    the Vigenère Cipher uses a keyword where each letter of the keyword determines
#    the shift amount for the corresponding letter of the plaintext.
#    
#    The keyword is repeated cyclically to match the length of the plaintext's
#    alphabetic characters. For example, if the plaintext is "HELLO" and the
#    keyword is "KEY", the key sequence becomes "KEYKE".
#
# 4. HOW SHIFTS ARE CALCULATED:
#    We map letters of the alphabet (A-Z) to integers from 0 to 25:
#    A=0, B=1, C=2, ..., Z=25.
#    
#    - Encryption Formula:
#      C_i = (P_i + K_i) mod 26
#      Where:
#        P_i = Alphabet index of the plaintext character
#        K_i = Alphabet index of the key character
#        C_i = Alphabet index of the resulting ciphertext character
#        
#    - Decryption Formula:
#      P_i = (C_i - K_i + 26) mod 26
#      We add 26 before taking the modulo to handle negative results in Python.
#
#    For instance:
#    Plaintext character 'H' (7) and Key character 'K' (10)
#    Encryption: (7 + 10) % 26 = 17, which corresponds to 'R'.
# ==============================================================================

import sys

def generate_key(msg: str, key: str) -> str:
    """
    Generates a key string aligned with the input message.
    Non-alphabetic characters in the message do not consume keyword characters,
    ensuring that only actual alphabetic letters are shifted by the key sequence.
    
    Args:
        msg (str): The input plaintext or ciphertext message.
        key (str): The keyword.
        
    Returns:
        str: A key string of the same length as the message.
    """
    key_upper = key.upper()
    key_len = len(key_upper)
    generated_key = []
    key_index = 0
    
    for char in msg:
        if char.isalpha():
            # Align the current character of the message with the key character
            generated_key.append(key_upper[key_index % key_len])
            key_index += 1
        else:
            # Preserving non-alphabetic characters in the key alignment
            generated_key.append(char)
            
    return "".join(generated_key)


def encrypt(text: str, key_string: str, edu_mode: bool = False) -> str:
    """
    Encrypts plaintext using the Vigenère Cipher and the aligned key string.
    Preserves case and leaves spaces, numbers, and special characters unchanged.
    
    Args:
        text (str): The plaintext message to encrypt.
        key_string (str): The generated key string of the same length as text.
        edu_mode (bool): If True, prints step-by-step calculations.
        
    Returns:
        str: The encrypted ciphertext.
    """
    ciphertext = []
    
    if edu_mode:
        print("\n--- STEP-BY-STEP ENCRYPTION MATH ---")
        
    for p_char, k_char in zip(text, key_string):
        if p_char.isalpha():
            is_upper = p_char.isupper()
            # Find the starting character code based on case
            p_base = ord('A') if is_upper else ord('a')
            
            # Map character to 0-25 range
            p_val = ord(p_char) - p_base
            k_val = ord(k_char.upper()) - ord('A')
            
            # Vigenère formula: C = (P + K) % 26
            c_val = (p_val + k_val) % 26
            c_char = chr(c_val + p_base)
            ciphertext.append(c_char)
            
            if edu_mode:
                # Displays standard representation: H + K = R
                print(f"{p_char.upper()} + {k_char.upper()} = {c_char.upper()}")
        else:
            # Keep numbers, spaces, and punctuation unchanged
            ciphertext.append(p_char)
            
    if edu_mode:
        print("------------------------------------")
        
    return "".join(ciphertext)


def decrypt(text: str, key_string: str, edu_mode: bool = False) -> str:
    """
    Decrypts ciphertext using the Vigenère Cipher and the aligned key string.
    Preserves case and leaves spaces, numbers, and special characters unchanged.
    
    Args:
        text (str): The ciphertext message to decrypt.
        key_string (str): The generated key string of the same length as text.
        edu_mode (bool): If True, prints step-by-step calculations.
        
    Returns:
        str: The decrypted plaintext.
    """
    plaintext = []
    
    if edu_mode:
        print("\n--- STEP-BY-STEP DECRYPTION MATH ---")
        
    for c_char, k_char in zip(text, key_string):
        if c_char.isalpha():
            is_upper = c_char.isupper()
            # Find the starting character code based on case
            c_base = ord('A') if is_upper else ord('a')
            
            # Map character to 0-25 range
            c_val = ord(c_char) - c_base
            k_val = ord(k_char.upper()) - ord('A')
            
            # Vigenère formula: P = (C - K + 26) % 26
            p_val = (c_val - k_val + 26) % 26
            p_char = chr(p_val + c_base)
            plaintext.append(p_char)
            
            if edu_mode:
                # Displays standard representation: R - K = H
                print(f"{c_char.upper()} - {k_char.upper()} = {p_char.upper()}")
        else:
            # Keep numbers, spaces, and punctuation unchanged
            plaintext.append(c_char)
            
    if edu_mode:
        print("------------------------------------")
        
    return "".join(plaintext)


def display_result(original: str, keyword: str, encrypted: str, decrypted: str) -> None:
    """
    Prints the final result block in the required format.
    
    Args:
        original (str): The original input text.
        keyword (str): The user's keyword.
        encrypted (str): The encrypted ciphertext.
        decrypted (str): The decrypted plaintext.
    """
    print("\n---------------------------------")
    print(f"Original Text : {original}")
    print(f"Keyword       : {keyword}")
    print(f"Encrypted     : {encrypted}")
    print(f"Decrypted     : {decrypted}")
    print("---------------------------------")


def main() -> None:
    """
    The main program controller. Displays the banner, processes the menu,
    and coordinates input, validation, cipher logic, and results display.
    """
    # Start Banner
    print("=====================================")
    print("ADVANCED TEXT ENCRYPTION SYSTEM")
    print("VIGENÈRE CIPHER IMPLEMENTATION")
    print("Cyber Security Project")
    print("=====================================")
    
    while True:
        print("\nMENU:")
        print("1. Encrypt Text")
        print("2. Decrypt Text")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == '1':
            print("\n--- ENCRYPTION MODE ---")
            # Robust input validation
            while True:
                message = input("Enter Message/Text: ").strip()
                if not message:
                    print("[Error] Message cannot be empty. Please try again.")
                else:
                    break
                    
            while True:
                keyword = input("Enter Keyword: ").strip()
                if not keyword:
                    print("[Error] Keyword cannot be empty. Please try again.")
                elif not keyword.isalpha():
                    print("[Error] Keyword must contain only alphabetic characters. Please try again.")
                else:
                    break
            
            edu_choice = input("Enable step-by-step Educational Mode? (y/n): ").strip().lower()
            edu_mode = edu_choice == 'y'
            
            # Key generation & Encryption
            key_str = generate_key(message, keyword)
            ciphertext = encrypt(message, key_str, edu_mode)
            decrypted_check = decrypt(ciphertext, key_str, False) # Run silently for verification output
            
            display_result(message, keyword, ciphertext, decrypted_check)
            
        elif choice == '2':
            print("\n--- DECRYPTION MODE ---")
            # Robust input validation
            while True:
                ciphertext = input("Enter Encrypted Ciphertext: ").strip()
                if not ciphertext:
                    print("[Error] Ciphertext cannot be empty. Please try again.")
                else:
                    break
                    
            while True:
                keyword = input("Enter Keyword: ").strip()
                if not keyword:
                    print("[Error] Keyword cannot be empty. Please try again.")
                elif not keyword.isalpha():
                    print("[Error] Keyword must contain only alphabetic characters. Please try again.")
                else:
                    break
            
            edu_choice = input("Enable step-by-step Educational Mode? (y/n): ").strip().lower()
            edu_mode = edu_choice == 'y'
            
            # Key generation & Decryption
            key_str = generate_key(ciphertext, keyword)
            plaintext = decrypt(ciphertext, key_str, edu_mode)
            encrypted_check = encrypt(plaintext, key_str, False) # Run silently for verification output
            
            display_result(plaintext, keyword, ciphertext, plaintext)
            
        elif choice == '3':
            print("\nThank you for using the Advanced Text Encryption System. Goodbye!")
            sys.exit(0)
            
        else:
            print("[Error] Invalid choice. Please select a valid option (1-3).")

if __name__ == "__main__":
    main()
