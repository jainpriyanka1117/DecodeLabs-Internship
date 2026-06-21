/* ==============================================================================
   VIGENÈRE CIPHER FRONTEND INTERACTIVE LOGIC
   Task-2-Priyanka Vigenère Shield Controller
   ============================================================================== */

let currentMode = 'encrypt'; // 'encrypt' or 'decrypt'

// Initialize app state
document.addEventListener('DOMContentLoaded', () => {
    // Clear fields on reload
    document.getElementById('cipher-key').value = '';
    document.getElementById('cipher-input').value = '';
    document.getElementById('cipher-output').value = '';
    processCipher();
});

/**
 * Changes the operation mode and updates the DOM labels and styles.
 * @param {string} mode - 'encrypt' or 'decrypt'
 */
function setMode(mode) {
    if (mode === currentMode) return;
    currentMode = mode;

    // Toggle active classes on buttons
    document.getElementById('mode-encrypt').classList.toggle('active', mode === 'encrypt');
    document.getElementById('mode-decrypt').classList.toggle('active', mode === 'decrypt');

    // Update labels and placeholders
    const inputLabel = document.getElementById('input-label');
    const outputLabel = document.getElementById('output-label');
    const inputTextArea = document.getElementById('cipher-input');
    const outputTextArea = document.getElementById('cipher-output');

    if (mode === 'encrypt') {
        inputLabel.innerHTML = 'Message / Plaintext';
        outputLabel.innerHTML = 'Ciphertext / Encrypted Result';
        inputTextArea.placeholder = 'Enter your plaintext message here...';
        outputTextArea.placeholder = 'Result will appear here...';
    } else {
        inputLabel.innerHTML = 'Ciphertext / Encrypted Input';
        outputLabel.innerHTML = 'Plaintext / Decrypted Result';
        inputTextArea.placeholder = 'Enter your encrypted ciphertext here...';
        outputTextArea.placeholder = 'Result will appear here...';
    }

    // Swapping current input and output contents if user switched mode
    const currentInput = inputTextArea.value.trim();
    const currentOutput = outputTextArea.value.trim();
    if (currentOutput && currentOutput !== 'Result will appear here...') {
        inputTextArea.value = currentOutput;
    }

    processCipher();
}

/**
 * Validates inputs and triggers the encryption/decryption engine.
 */
function processCipher() {
    const keyInput = document.getElementById('cipher-key').value;
    const textInput = document.getElementById('cipher-input').value;
    
    const keyError = document.getElementById('key-error');
    const textError = document.getElementById('text-error');
    
    const keyVal = keyInput.trim();
    const textVal = textInput.trim();

    let isValid = true;

    // 1. Validate Keyword
    if (keyVal.length > 0) {
        // Must contain only alphabetic characters
        if (!/^[a-zA-Z]+$/.test(keyVal)) {
            keyError.style.display = 'block';
            isValid = false;
        } else {
            keyError.style.display = 'none';
        }
    } else {
        keyError.style.display = 'none';
        // Empty is invalid but we don't spam error unless typing message
        if (textVal.length > 0) {
            isValid = false;
        }
    }

    // 2. Validate Message
    if (textVal.length === 0 && keyVal.length > 0) {
        // Message is empty but key is typed
        isValid = false;
    }

    // If inputs are not fully filled or valid, clear results
    if (!isValid || keyVal.length === 0 || textVal.length === 0) {
        clearOutput();
        return;
    }

    // 3. Key Generation & Math Cipher execution
    const alignedKey = generateKey(textInput, keyVal);
    let result = '';

    if (currentMode === 'encrypt') {
        result = encrypt(textInput, alignedKey);
    } else {
        result = decrypt(textInput, alignedKey);
    }

    // 4. Update UI
    document.getElementById('cipher-output').value = result;
    
    // Aligned key visualization
    renderKeyAlignment(textInput, alignedKey);
    
    // Stats calculation
    calculateStats(textInput, keyVal);
    
    // Step by step math visualizer
    renderEducationalMath();
}

/**
 * Clears output elements when inputs are invalid/empty.
 */
function clearOutput() {
    document.getElementById('cipher-output').value = '';
    document.getElementById('key-alignment-visual').innerHTML = '<span class="empty-placeholder">Aligns keyword with your message text characters...</span>';
    
    // Clear metrics
    document.getElementById('stat-chars').innerText = '0';
    document.getElementById('stat-shifts').innerText = '0';
    
    // Clear math steps
    document.getElementById('math-steps-container').innerHTML = `
        <div class="empty-math-placeholder">
            <i class="fa-solid fa-circle-info"></i> Enter a message and keyword above to visualize the step-by-step Vigenère cipher mathematics.
        </div>
    `;
}

/**
 * Aligns the keyword characters to the alphabetic characters in the message.
 * Non-alphabetic characters do not consume key characters.
 * @param {string} msg 
 * @param {string} key 
 * @returns {string} alignedKey
 */
function generateKey(msg, key) {
    const keyUpper = key.toUpperCase();
    const keyLen = keyUpper.length;
    let alignedKey = [];
    let keyIndex = 0;

    for (let i = 0; i < msg.length; i++) {
        const char = msg[i];
        if (/[a-zA-Z]/.test(char)) {
            alignedKey.push(keyUpper[keyIndex % keyLen]);
            keyIndex++;
        } else {
            alignedKey.push(char); // Keep alignment matching special character
        }
    }
    return alignedKey.join('');
}

/**
 * Performs Vigenère encryption on text.
 */
function encrypt(text, alignedKey) {
    let ciphertext = [];
    for (let i = 0; i < text.length; i++) {
        const pChar = text[i];
        const kChar = alignedKey[i];

        if (/[a-zA-Z]/.test(pChar)) {
            const isUpper = pChar === pChar.toUpperCase();
            const pBase = isUpper ? 65 : 97;
            
            const pVal = pChar.charCodeAt(0) - pBase;
            const kVal = kChar.toUpperCase().charCodeAt(0) - 65;
            
            const cVal = (pVal + kVal) % 26;
            const cChar = String.fromCharCode(cVal + pBase);
            ciphertext.push(cChar);
        } else {
            ciphertext.push(pChar);
        }
    }
    return ciphertext.join('');
}

/**
 * Performs Vigenère decryption on text.
 */
function decrypt(text, alignedKey) {
    let plaintext = [];
    for (let i = 0; i < text.length; i++) {
        const cChar = text[i];
        const kChar = alignedKey[i];

        if (/[a-zA-Z]/.test(cChar)) {
            const isUpper = cChar === cChar.toUpperCase();
            const cBase = isUpper ? 65 : 97;
            
            const cVal = cChar.charCodeAt(0) - cBase;
            const kVal = kChar.toUpperCase().charCodeAt(0) - 65;
            
            const pVal = (cVal - kVal + 26) % 26;
            const pChar = String.fromCharCode(pVal + cBase);
            plaintext.push(pChar);
        } else {
            plaintext.push(cChar);
        }
    }
    return plaintext.join('');
}

/**
 * Renders structured HTML columns to align message text with key characters.
 */
function renderKeyAlignment(msg, alignedKey) {
    const container = document.getElementById('key-alignment-visual');
    container.innerHTML = ''; // Clear

    // Split text into lines if long, or just render it
    const visualWrapper = document.createElement('div');
    visualWrapper.style.display = 'flex';
    visualWrapper.style.flexWrap = 'wrap';
    visualWrapper.style.gap = '8px 4px';

    for (let i = 0; i < msg.length; i++) {
        const mChar = msg[i];
        const kChar = alignedKey[i];

        const charPair = document.createElement('div');
        charPair.style.display = 'inline-flex';
        charPair.style.flexDirection = 'column';
        charPair.style.alignItems = 'center';
        charPair.style.background = 'rgba(255,255,255,0.03)';
        charPair.style.border = '1px solid rgba(255,255,255,0.05)';
        charPair.style.padding = '4px 6px';
        charPair.style.borderRadius = '4px';
        charPair.style.minWidth = '24px';

        const textSpan = document.createElement('span');
        textSpan.innerText = mChar === ' ' ? '␣' : mChar;
        textSpan.style.color = mChar === ' ' ? 'var(--text-muted)' : 'var(--text-primary)';
        textSpan.style.fontSize = '0.85rem';
        textSpan.style.fontWeight = 'bold';

        const divider = document.createElement('div');
        divider.style.width = '100%';
        divider.style.height = '1px';
        divider.style.background = 'rgba(255,255,255,0.1)';
        divider.style.margin = '3px 0';

        const keySpan = document.createElement('span');
        keySpan.innerText = /[a-zA-Z]/.test(mChar) ? kChar : '•';
        keySpan.style.color = /[a-zA-Z]/.test(mChar) ? 'var(--accent-cyan)' : 'var(--text-muted)';
        keySpan.style.fontSize = '0.75rem';
        keySpan.style.fontWeight = '600';

        charPair.appendChild(textSpan);
        charPair.appendChild(divider);
        charPair.appendChild(keySpan);
        visualWrapper.appendChild(charPair);
    }

    container.appendChild(visualWrapper);
}

/**
 * Calculates stats and updates dashboard metrics.
 */
function calculateStats(msg, key) {
    document.getElementById('stat-chars').innerText = msg.length;
    
    // Count shifts applied (only alphabetic letters are shifted)
    let shifts = 0;
    for (let char of msg) {
        if (/[a-zA-Z]/.test(char)) {
            shifts++;
        }
    }
    document.getElementById('stat-shifts').innerText = shifts;
}

/**
 * Renders the step-by-step calculations in the educational panel.
 */
function renderEducationalMath() {
    const textInput = document.getElementById('cipher-input').value;
    const keyInput = document.getElementById('cipher-key').value.trim();
    const showDetails = document.getElementById('math-toggle').checked;
    const container = document.getElementById('math-steps-container');

    if (!textInput || !keyInput || !/^[a-zA-Z]+$/.test(keyInput)) {
        return;
    }

    container.innerHTML = ''; // Clear

    const alignedKey = generateKey(textInput, keyInput);
    let stepCount = 0;

    for (let i = 0; i < textInput.length; i++) {
        const char = textInput[i];
        const keyChar = alignedKey[i];

        if (/[a-zA-Z]/.test(char)) {
            stepCount++;
            const isUpper = char === char.toUpperCase();
            const baseCode = isUpper ? 65 : 97;

            const charVal = char.charCodeAt(0) - baseCode;
            const keyVal = keyChar.toUpperCase().charCodeAt(0) - 65;

            let resultVal = 0;
            let resultChar = '';
            let op = '+';

            if (currentMode === 'encrypt') {
                resultVal = (charVal + keyVal) % 26;
                resultChar = String.fromCharCode(resultVal + baseCode);
                op = '+';
            } else {
                resultVal = (charVal - keyVal + 26) % 26;
                resultChar = String.fromCharCode(resultVal + baseCode);
                op = '-';
            }

            // Create step card
            const stepTile = document.createElement('div');
            stepTile.className = 'math-step-tile';

            const eqDiv = document.createElement('div');
            eqDiv.className = 'math-eq';
            eqDiv.innerHTML = `${char.toUpperCase()} <span class="math-eq-symbol">${op}</span> ${keyChar.toUpperCase()} = <span class="math-eq-result">${resultChar.toUpperCase()}</span>`;

            stepTile.appendChild(eqDiv);

            if (showDetails) {
                const posDiv = document.createElement('div');
                posDiv.className = 'math-pos';
                
                // Show positions, e.g. 7 + 10 = 17
                let mathStr = `${charVal} ${op} ${keyVal} = ${resultVal}`;
                if (currentMode === 'decrypt' && (charVal - keyVal < 0)) {
                    mathStr = `(${charVal} - ${keyVal} + 26) % 26 = ${resultVal}`;
                }
                
                posDiv.innerHTML = `<span class="pos-val">${mathStr}</span>`;
                stepTile.appendChild(posDiv);
            }

            container.appendChild(stepTile);
        }
    }

    if (stepCount === 0) {
        container.innerHTML = `
            <div class="empty-math-placeholder">
                <i class="fa-solid fa-circle-info"></i> No alphabetic characters in the text to shift.
            </div>
        `;
    }
}

/**
 * Copies the generated output to the clipboard and shows a toast.
 */
function copyResult() {
    const outputTextArea = document.getElementById('cipher-output');
    if (!outputTextArea.value || outputTextArea.value === 'Result will appear here...') return;

    outputTextArea.select();
    outputTextArea.setSelectionRange(0, 99999); /* For mobile devices */

    navigator.clipboard.writeText(outputTextArea.value).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}
