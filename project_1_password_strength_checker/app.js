/* ==========================================================================
   JavaScript Application Controller
   Project: Password Strength Checker (Web Landing Page)
   Functions: Real-time validation checks, DOM Updates, Tab Switching
   ========================================================================== */

// 1. Blacklist database matching core.py
const BLACKLIST = [
    "123456", "12345678", "password", "password123", 
    "admin", "administrator", "welcome", "qwerty", "letmein", "abc123"
];

// 2. DOM Elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("toggle-password");
const emailError = document.getElementById("email-error");

// Checklist items
const reqLength = document.getElementById("req-length");
const reqUpper = document.getElementById("req-upper");
const reqLower = document.getElementById("req-lower");
const reqDigit = document.getElementById("req-digit");
const reqSpecial = document.getElementById("req-special");

// Results displays
const statusShield = document.getElementById("status-shield");
const shieldIcon = document.getElementById("shield-icon");
const strengthLabel = document.getElementById("strength-label");
const statusBadge = document.getElementById("status-badge");
const scoreText = document.getElementById("score-text");
const progressBar = document.getElementById("progress-bar");
const feedbackPanel = document.getElementById("feedback-panel");

// 3. Password Toggle Visibility Handler
togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    // Toggle icon
    const icon = togglePasswordBtn.querySelector("i");
    if (type === "password") {
        icon.className = "fa-regular fa-eye";
    } else {
        icon.className = "fa-regular fa-eye-slash";
    }
});

// 4. Tab Switching Handler
function openTab(evt, tabId) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // Remove active class from all tab buttons
    const tabButtons = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }

    // Show current tab, and add active class to button
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
}

// 5. Validation Checkers
function checkUppercase(password) {
    return /[A-Z]/.test(password);
}

function checkLowercase(password) {
    return /[a-z]/.test(password);
}

function checkNumber(password) {
    return /[0-9]/.test(password);
}

function checkSpecialChar(password) {
    const specialChars = "@#$%^&*!?_-";
    return [...password].some(char => specialChars.includes(char));
}

function checkEmailDerived(email, password) {
    if (!email || !email.includes("@")) return false;
    
    const username = email.split("@")[0].trim().toLowerCase();
    const pLow = password.toLowerCase();

    // 1. Full username matching
    if (username.length >= 3 && pLow.includes(username)) {
        return true;
    }

    // Split username into segments
    const parts = username.split(/[^a-zA-Z0-9]+/);
    const allParts = [];
    for (const part of parts) {
        const subpartsLetters = part.match(/[a-zA-Z]+/g) || [];
        const subpartsDigits = part.match(/[0-9]+/g) || [];
        allParts.push(...subpartsLetters, ...subpartsDigits);
    }

    const significantParts = allParts.filter(p => p.length >= 2);

    // 2. Exact match segment checks
    for (const part of significantParts) {
        if (pLow === part) return true;
    }

    // 3. Combination of all segments
    if (significantParts.length > 1) {
        if (significantParts.every(part => pLow.includes(part))) {
            return true;
        }
    }

    return false;
}

function checkRepeatedPatterns(password) {
    // 1. Consecutive identical character repeated 4 or more times
    for (let i = 0; i < password.length - 3; i++) {
        if (password[i] === password[i+1] && password[i] === password[i+2] && password[i] === password[i+3]) {
            return true;
        }
    }

    // 2. Consecutive pattern of length 2 repeating 3 or more times (e.g. '121212')
    for (let i = 0; i < password.length - 5; i++) {
        const pattern = password.substring(i, i+2);
        if (password.substring(i+2, i+4) === pattern && password.substring(i+4, i+6) === pattern) {
            return true;
        }
    }

    // 3. Consecutive pattern of length 3 repeating 3 or more times (e.g. 'abcabcabc')
    for (let i = 0; i < password.length - 8; i++) {
        const pattern = password.substring(i, i+3);
        if (password.substring(i+3, i+6) === pattern && password.substring(i+6, i+9) === pattern) {
            return true;
        }
    }

    return false;
}

function checkSequentialPatterns(password) {
    const pLow = password.toLowerCase();
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const digits = "01234567890";
    
    const keyboardRows = [
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm"
    ];

    const sequences = [
        alphabet, [...alphabet].reverse().join(""),
        digits, [...digits].reverse().join("")
    ];

    for (const row of keyboardRows) {
        sequences.push(row);
        sequences.push([...row].reverse().join(""));
    }

    // Check sliding window of length 5
    for (const seq of sequences) {
        for (let start = 0; start <= seq.length - 5; start++) {
            const subseq = seq.substring(start, start + 5);
            if (pLow.includes(subseq)) {
                return true;
            }
        }
    }

    return false;
}

// 6. Primary Validation Runner
function validatePasswordRealTime() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset email formatting validation
    if (email && !email.includes("@")) {
        emailError.textContent = "Please enter a valid email address containing '@'.";
        return;
    } else {
        emailError.textContent = "";
    }

    // If either field is empty, reset display to initial
    if (!email || !password) {
        resetUI();
        return;
    }

    // 1. Live Checklist Check off
    updateChecklist(password);

    // 2. Perform Pre-checks (Immediate Rejection Heuristics)
    let rejectReason = "";
    let feedbackTips = [];

    if (password.length < 8) {
        rejectReason = "Password is too short (minimum 8 characters).";
        feedbackTips.push("Increase password length to at least 8 characters.");
    } else if (password.toLowerCase() === email.toLowerCase()) {
        rejectReason = "Password cannot be identical to your email address.";
        feedbackTips.push("Choose a password that does not match your email.");
    } else if (checkEmailDerived(email, password)) {
        rejectReason = "Password contains parts or patterns derived from your email username.";
        feedbackTips.push("Avoid using your username, name, or numbers derived from your email.");
    } else if (BLACKLIST.includes(password.toLowerCase())) {
        rejectReason = "Password is a commonly used, insecure password that is easily guessed.";
        feedbackTips.push("Avoid common combinations like '123456', 'qwerty', or 'password'.");
    } else if (checkRepeatedPatterns(password)) {
        rejectReason = "Password contains repeating characters or predictable repeating patterns.";
        feedbackTips.push("Avoid repeated characters (e.g. 'aaaa') or sequential repeating parts (e.g. '121212').");
    } else if (checkSequentialPatterns(password)) {
        rejectReason = "Password contains sequential keyboard walks or alphabetical chains.";
        feedbackTips.push("Avoid predictable layouts (e.g. '12345', 'abcdef', 'qwerty', or 'asdfgh').");
    }

    // If immediate reject failed
    if (rejectReason) {
        renderRejectedState(rejectReason, feedbackTips);
        return;
    }

    // 3. All pre-checks passed, calculate variety score
    let score = 0;
    let suggestions = [];

    // Length >= 8
    score += 1;
    // Length >= 12 (Bonus)
    if (password.length >= 12) {
        score += 1;
    } else {
        suggestions.push("Increase password length to 12 or more characters for a strength bonus.");
    }

    // Uppercase
    if (checkUppercase(password)) {
        score += 1;
    } else {
        suggestions.push("Add at least one uppercase letter (A-Z).");
    }

    // Lowercase
    if (checkLowercase(password)) {
        score += 1;
    } else {
        suggestions.push("Add at least one lowercase letter (a-z).");
    }

    // Digit
    if (checkNumber(password)) {
        score += 1;
    } else {
        suggestions.push("Add at least one number (0-9).");
    }

    // Special
    if (checkSpecialChar(password)) {
        score += 1;
    } else {
        suggestions.push("Add at least one special character (@, #, $, %, ^, &, *, !, ?, _, -).");
    }

    // Determine strength and render
    renderScoreState(score, suggestions);
}

// 7. Helper UI Render Functions
function resetUI() {
    statusShield.className = "status-shield state-initial";
    shieldIcon.className = "fa-solid fa-shield-slash";
    strengthLabel.textContent = "Awaiting Input";
    statusBadge.textContent = "N/A";
    statusBadge.className = "status-badge";
    scoreText.textContent = "0 / 6";
    progressBar.style.width = "0%";
    progressBar.className = "progress-bar";
    
    feedbackPanel.innerHTML = `
        <div class="feedback-placeholder">
            <i class="fa-solid fa-circle-info"></i>
            <p>Fill in your email and password to begin a comprehensive threat assessment.</p>
        </div>
    `;

    // Clear checklist item classes
    const reqItems = [reqLength, reqUpper, reqLower, reqDigit, reqSpecial];
    reqItems.forEach(item => {
        item.className = "req-item";
        item.querySelector("i").className = "fa-regular fa-circle";
    });
}

function updateChecklist(password) {
    toggleItemState(reqLength, password.length >= 8);
    toggleItemState(reqUpper, checkUppercase(password));
    toggleItemState(reqLower, checkLowercase(password));
    toggleItemState(reqDigit, checkNumber(password));
    toggleItemState(reqSpecial, checkSpecialChar(password));
}

function toggleItemState(element, isValid) {
    const icon = element.querySelector("i");
    if (isValid) {
        element.className = "req-item valid";
        icon.className = "fa-solid fa-circle-check";
    } else {
        element.className = "req-item invalid";
        icon.className = "fa-regular fa-circle";
    }
}

function renderRejectedState(reason, tips) {
    statusShield.className = "status-shield state-weak";
    shieldIcon.className = "fa-solid fa-shield-xmark";
    strengthLabel.textContent = "Weak";
    
    statusBadge.textContent = "Rejected";
    statusBadge.className = "status-badge badge-weak";
    
    scoreText.textContent = "0 / 6";
    progressBar.style.width = "5%";
    progressBar.className = "progress-bar weak";

    let tipsHTML = "";
    tips.forEach(tip => {
        tipsHTML += `<li><i class="fa-solid fa-circle-exclamation"></i> ${tip}</li>`;
    });

    feedbackPanel.innerHTML = `
        <div class="feedback-title reject">
            <i class="fa-solid fa-circle-xmark"></i> Rejection Reason:
        </div>
        <p style="font-size: 0.85rem; margin-bottom: 10px; line-height: 1.4;">${reason}</p>
        <div class="feedback-title reject" style="font-size: 0.85rem; margin-top: 10px;">
            <i class="fa-solid fa-lightbulb"></i> Security Recommendation:
        </div>
        <ul class="feedback-list">${tipsHTML}</ul>
    `;
}

function renderScoreState(score, suggestions) {
    let strength = "";
    let status = "";
    let shieldClass = "";
    let shieldIconClass = "";
    let badgeClass = "";
    let barClass = "";
    
    if (score <= 2) {
        strength = "Weak";
        status = "Rejected";
        shieldClass = "state-weak";
        shieldIconClass = "fa-solid fa-shield-xmark";
        badgeClass = "badge-weak";
        barClass = "weak";
    } else if (score <= 4) {
        strength = "Medium";
        status = "Accepted With Warning";
        shieldClass = "state-medium";
        shieldIconClass = "fa-solid fa-shield-exclamation";
        badgeClass = "badge-medium";
        barClass = "medium";
    } else {
        strength = "Strong";
        status = "Accepted";
        shieldClass = "state-strong";
        shieldIconClass = "fa-solid fa-shield-check";
        badgeClass = "badge-strong";
        barClass = "strong";
    }

    // Update displays
    statusShield.className = `status-shield ${shieldClass}`;
    shieldIcon.className = shieldIconClass;
    strengthLabel.textContent = strength;
    statusBadge.textContent = status;
    statusBadge.className = `status-badge ${badgeClass}`;
    scoreText.textContent = `${score} / 6`;
    progressBar.style.width = `${(score / 6) * 100}%`;
    progressBar.className = `progress-bar ${barClass}`;

    if (strength === "Strong") {
        feedbackPanel.innerHTML = `
            <div class="feedback-title pass">
                <i class="fa-solid fa-circle-check"></i> Security Cleared
            </div>
            <p style="font-size: 0.85rem; line-height: 1.4; color: var(--text-muted);">
                Password meets all security guidelines and provides robust resistance against brute-force and dictionary profiling.
            </p>
        `;
    } else {
        let tipsHTML = "";
        suggestions.forEach(tip => {
            tipsHTML += `<li><i class="fa-solid fa-arrow-right"></i> ${tip}</li>`;
        });
        
        let titleClass = strength === "Weak" ? "reject" : "warn";
        let titleIcon = strength === "Weak" ? "fa-circle-xmark" : "fa-circle-exclamation";

        feedbackPanel.innerHTML = `
            <div class="feedback-title ${titleClass}">
                <i class="fa-solid ${titleIcon}"></i> Improvement Recommendations:
            </div>
            <ul class="feedback-list">${tipsHTML}</ul>
        `;
    }
}

// 8. Attach Input Event Listeners for Live Assessment
emailInput.addEventListener("input", validatePasswordRealTime);
passwordInput.addEventListener("input", validatePasswordRealTime);

// Initial UI Reset on load
resetUI();
