// DecodeLabs Project 4 Application Engine

// 1. Tab Navigation System
const tabs = {
    dashboard: document.getElementById('tab-dashboard'),
    scanner: document.getElementById('tab-scanner'),
    calculator: document.getElementById('tab-calculator'),
    report: document.getElementById('tab-report')
};

const navButtons = {
    dashboard: document.getElementById('nav-dashboard'),
    scanner: document.getElementById('nav-scanner'),
    calculator: document.getElementById('nav-calculator'),
    report: document.getElementById('nav-report')
};

function switchTab(activeTab) {
    Object.keys(tabs).forEach(key => {
        if (key === activeTab) {
            tabs[key].classList.add('active');
            navButtons[key].classList.add('active');
        } else {
            tabs[key].classList.remove('active');
            navButtons[key].classList.remove('active');
        }
    });
}

Object.keys(navButtons).forEach(key => {
    navButtons[key].addEventListener('click', () => switchTab(key));
});

// 2. Dynamic Security Checklist & Posture Score
const checkboxes = {
    identity: document.getElementById('check-identity'),
    patch: document.getElementById('check-patch'),
    human: document.getElementById('check-human'),
    network: document.getElementById('check-network')
};

const badges = {
    human: document.getElementById('badge-human'),
    network: document.getElementById('badge-network')
};

const securityScoreVal = document.getElementById('security-score-val');
const securityScoreBar = document.getElementById('security-score-bar');
const vulnCountVal = document.getElementById('vuln-count-val');
const systemStatusBadge = document.getElementById('system-status-badge');

// Vulnerability card elements
const vulnCardLength = document.getElementById('vuln-card-length');
const vulnCardLockout = document.getElementById('vuln-card-lockout');
const vulnCardHistory = document.getElementById('vuln-card-history');

function updateSecurityScore() {
    let checkedCount = 0;
    let totalItems = Object.keys(checkboxes).length;
    
    Object.keys(checkboxes).forEach(key => {
        if (checkboxes[key].checked) {
            checkedCount++;
            if (key === 'human' && badges.human) {
                badges.human.className = 'badge badge-success';
                badges.human.innerHTML = 'Secured';
            }
            if (key === 'network' && badges.network) {
                badges.network.className = 'badge badge-success';
                badges.network.innerHTML = 'Secured';
            }
        } else {
            if (key === 'human' && badges.human) {
                badges.human.className = 'badge badge-warning';
                badges.human.innerHTML = 'Reviewing';
            }
            if (key === 'network' && badges.network) {
                badges.network.className = 'badge badge-warning';
                badges.network.innerHTML = 'Reviewing';
            }
        }
    });

    const score = Math.round((checkedCount / totalItems) * 100);
    securityScoreVal.textContent = `${score}%`;
    securityScoreBar.style.width = `${score}%`;

    // Dynamic vulnerabilities left based on checkbox states
    let activeVulns = 0;
    if (!checkboxes.identity.checked) activeVulns += 2; // Length & Lockout
    if (!checkboxes.human.checked) activeVulns += 1;    // History/Reuse (simplification)
    
    vulnCountVal.textContent = activeVulns;

    if (score === 100) {
        systemStatusBadge.className = 'badge badge-success';
        systemStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> System Secured';
        vulnCardLength.style.display = 'none';
        vulnCardLockout.style.display = 'none';
        vulnCardHistory.style.display = 'none';
        vulnCountVal.textContent = '0';
    } else {
        systemStatusBadge.className = 'badge badge-warning';
        systemStatusBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Action Required';
        
        // Toggle individual cards
        vulnCardLength.style.display = checkboxes.identity.checked ? 'none' : 'flex';
        vulnCardLockout.style.display = checkboxes.identity.checked ? 'none' : 'flex';
        vulnCardHistory.style.display = checkboxes.identity.checked ? 'none' : 'flex';
        
        let count = 0;
        if (!checkboxes.identity.checked) count += 2;
        if (!checkboxes.identity.checked) { // mock check mapping
            vulnCardHistory.style.display = 'flex';
            count += 1;
        } else {
            vulnCardHistory.style.display = 'none';
        }
        vulnCountVal.textContent = count;
    }
}

Object.keys(checkboxes).forEach(key => {
    checkboxes[key].addEventListener('change', updateSecurityScore);
});

// Initial load
updateSecurityScore();

// 3. Simulated Remediation
document.getElementById('btn-remediate-sim').addEventListener('click', () => {
    Object.keys(checkboxes).forEach(key => {
        checkboxes[key].checked = true;
    });
    updateSecurityScore();
    alert("System auto-remediation simulated successfully! Minimum password length, lockout policy, and password history have been secured.");
});

// 4. Simulated PowerShell Terminal Auditor
const terminalScreen = document.getElementById('terminal-screen');
const btnStartScan = document.getElementById('btn-start-scan');
const btnClearTerminal = document.getElementById('btn-clear-terminal');

const auditLog = [
    { text: "PS D:\\priyanka\\projects\\DecodeLabs-Internship\\Task-4-Priyanka> .\\audit_scripts\\run_audit.ps1", type: "input" },
    { text: "============================================================", type: "info" },
    { text: "         DECODELABS SYSTEM VULNERABILITY AUDITOR", type: "info" },
    { text: "============================================================", type: "info" },
    { text: "\n[+] STEP 1: IDENTITY & LOCAL USER AUDIT\n", type: "step" },
    { text: "Name               Enabled Description\n----               ------- -----------\nAdministrator        False Built-in account for administering the computer\nDT                    True Primary Account\nGuest                False Built-in account for guest access", type: "log" },
    { text: "\n[+] STEP 2: ADMINISTRATORS GROUP MEMBERSHIP\n", type: "step" },
    { text: "Name                          PrincipalSource ObjectClass\n----                          --------------- -----------\nDESKTOP-30AS34Q\\Administrator           Local User\nDESKTOP-30AS34Q\\DT                      Local User", type: "log" },
    { text: "\n[+] STEP 3: RECENT INSTALLED HOTFIXES\n", type: "step" },
    { text: "Source Description     HotFixID  InstalledOn\n------ -----------     --------  -----------\n       Security Update KB5075912 22-02-2026 00:00:00\n       Security Update KB5077456 21-02-2026 00:00:00\n       Security Update KB5068780 02-12-2025 00:00:00", type: "log" },
    { text: "\n[+] STEP 4: OS FIREWALL PROFILE STATUS\n", type: "step" },
    { text: "Name    Enabled\n----    -------\nDomain     True\nPrivate    True\nPublic     True", type: "log" },
    { text: "\n[+] STEP 5: BITLOCKER DISK ENCRYPTION STATUS\n", type: "step" },
    { text: "Get-CimInstance : Access denied (Requires Administrator privilege to read BitLocker provider)\nAt run_audit.ps1:144\n+ Get-CimInstance root/cimv2/Security/MicrosoftVolumeEncryption...", type: "error" },
    { text: "\n============================================================", type: "info" },
    { text: "Audit complete. Review the above output for vulnerabilities.", type: "info" },
    { text: "============================================================", type: "info" }
];

let typingTimer = null;

function clearTerminal() {
    terminalScreen.innerHTML = '';
    btnStartScan.disabled = false;
    if (typingTimer) clearTimeout(typingTimer);
}

function runAuditTerminal() {
    clearTerminal();
    btnStartScan.disabled = true;
    
    let index = 0;
    
    function printNextLine() {
        if (index < auditLog.length) {
            const logItem = auditLog[index];
            const div = document.createElement('div');
            
            if (logItem.type === "input") {
                div.className = "terminal-line";
                div.innerHTML = `<span class="prompt">PS D:\\priyanka\\projects\\DecodeLabs-Internship\\Task-4-Priyanka&gt;</span> <span class="cmd-text">${logItem.text.split('>')[1]}</span>`;
            } else {
                div.className = "terminal-line";
                if (logItem.type === "step") div.style.color = "var(--color-purple)";
                else if (logItem.type === "info") div.style.color = "var(--color-cyan)";
                else if (logItem.type === "error") div.style.color = "var(--color-rose)";
                else div.style.color = "var(--text-primary)";
                
                div.innerText = logItem.text;
            }
            
            terminalScreen.appendChild(div);
            terminalScreen.scrollTop = terminalScreen.scrollHeight;
            index++;
            
            typingTimer = setTimeout(printNextLine, logItem.type === "input" ? 800 : 400);
        } else {
            btnStartScan.disabled = false;
        }
    }
    
    printNextLine();
}

btnStartScan.addEventListener('click', runAuditTerminal);
btnClearTerminal.addEventListener('click', clearTerminal);

// 5. Interactive CVSS v4.0 Calculator
const calcSelects = document.querySelectorAll('.calc-select');
const calcScoreVal = document.getElementById('calc-score-val');
const calcSeverityVal = document.getElementById('calc-severity-val');
const calcVectorStr = document.getElementById('calc-vector-str');
const calcScoreRing = document.getElementById('calc-score-ring');

function updateCVSS() {
    const av = parseFloat(document.getElementById('metric-av').value);
    const ac = parseFloat(document.getElementById('metric-ac').value);
    const pr = parseFloat(document.getElementById('metric-pr').value);
    const ui = parseFloat(document.getElementById('metric-ui').value);
    const vc = parseFloat(document.getElementById('metric-vc').value);
    const vi = parseFloat(document.getElementById('metric-vi').value);

    // Dynamic mathematical estimation for CVSS Base Score
    let baseScore = (av * 3.5) + (ac * 1.5) + (pr * 1.5) + (ui * 1.0) + (vc * 1.5) + (vi * 1.0);
    baseScore = Math.min(10.0, Math.round(baseScore * 10) / 10);
    
    // Fallback logic for all zero
    if (vc === 0 && vi === 0) baseScore = 0.0;

    calcScoreVal.textContent = baseScore.toFixed(1);

    // Severity mapping
    let severity = "LOW";
    let severityClass = "text-success";
    let colorHex = "#10b981"; // Emerald

    if (baseScore >= 9.0) {
        severity = "CRITICAL";
        severityClass = "text-danger";
        colorHex = "#f43f5e"; // Rose
    } else if (baseScore >= 7.0) {
        severity = "HIGH";
        severityClass = "text-danger";
        colorHex = "#f43f5e"; // Rose
    } else if (baseScore >= 4.0) {
        severity = "MEDIUM";
        severityClass = "text-warning";
        colorHex = "#f59e0b"; // Amber
    } else if (baseScore > 0) {
        severity = "LOW";
        severityClass = "text-success";
        colorHex = "#10b981"; // Emerald
    } else {
        severity = "NONE";
        severityClass = "text-muted";
        colorHex = "#6b7280"; // Muted Gray
    }

    calcSeverityVal.textContent = severity;
    calcSeverityVal.className = `score-severity ${severityClass}`;

    // Vector string formatting
    const avStr = document.getElementById('metric-av').selectedOptions[0].text.split('(')[1][0];
    const acStr = document.getElementById('metric-ac').selectedOptions[0].text.split('(')[1][0];
    const prStr = document.getElementById('metric-pr').selectedOptions[0].text.split('(')[1][0];
    const uiStr = document.getElementById('metric-ui').selectedOptions[0].text.split('(')[1][0];
    const vcStr = document.getElementById('metric-vc').selectedOptions[0].text.split('(')[1][0];
    const viStr = document.getElementById('metric-vi').selectedOptions[0].text.split('(')[1][0];

    calcVectorStr.textContent = `CVSS:4.0/AV:${avStr}/AC:${acStr}/AT:N/PR:${prStr}/UI:${uiStr}/VC:${vcStr}/VI:${viStr}/VA:N`;

    // Radial ring animation (Circumference is 440)
    const offset = 440 - (baseScore / 10) * 440;
    calcScoreRing.style.strokeDashoffset = offset;
    calcScoreRing.style.stroke = colorHex;
}

calcSelects.forEach(sel => sel.addEventListener('change', updateCVSS));
updateCVSS(); // Initial load

// 6. Submission Report Rendering (from markdown template)
const reportMarkdown = `# DecodeLabs Cyber Security Project 4: Vulnerability Report
**Audited Machine**: Personal Windows PC (DESKTOP-30AS34Q)  
**Auditor**: Priyanka Jain  
**Date**: 2026-07-09  

---

## Section 1: Flaws Found (The Diagnosis)
*Document three specific security flaws discovered on your machine using your audit script and command-line diagnostics.*

1. **Vulnerability 1: Insecure Minimum Password Length (Set to 0)**
   - **CVSS 4.0 Score**: 7.3 (High)  *Vector: CVSS:4.0/AV:L/AC:L/AT:N/PR:L/UI:N/VC:H/VI:H/VA:N*
   - **Description**: The minimum password length on the system is set to 0. This allows users to set blank or extremely weak single-character passwords, making the system highly vulnerable to unauthorized local access and offline credential cracking.
   - **Evidence (Initial Command Output)**:
     \`\`\`text
     PS C:\\Users\\DT> net accounts
     Minimum password length:                              0
     \`\`\`

2. **Vulnerability 2: Missing Account Lockout Policy (Set to Never)**
   - **CVSS 4.0 Score**: 7.5 (High)  *Vector: CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:L/VI:L/VA:H*
   - **Description**: The account lockout threshold is configured to \`Never\`. An attacker can perform infinite brute-force or credential stuffing attacks against user accounts without triggering any security lockout or defensive delay.
   - **Evidence (Initial Command Output)**:
     \`\`\`text
     PS C:\\Users\\DT> net accounts
     Lockout threshold:                                    Never
     \`\`\`

3. **Vulnerability 3: Lack of Password History Enforcement (Set to None)**
   - **CVSS 4.0 Score**: 5.3 (Medium)  *Vector: CVSS:4.0/AV:L/AC:L/AT:N/PR:L/UI:N/VC:M/VI:M/VA:N*
   - **Description**: The password history maintained is set to \`None\`. This means the system does not remember previously used passwords, allowing users to continually reuse the same passwords, rendering periodic change rules ineffective.
   - **Evidence (Initial Command Output)**:
     \`\`\`text
     PS C:\\Users\\DT> net accounts
     Length of password history maintained:                None
     \`\`\`

---

## Section 2: Remediation Actions (The Treatment)
*Detail the exact steps and administrative commands required to remediate each flaw.*

1. **Remediation for Vulnerability 1 (Minimum Password Length)**:
   - Run PowerShell or Command Prompt as Administrator and enforce a minimum length of 12 characters:
     \`\`\`powershell
     net accounts /minpwlen:12
     \`\`\`

2. **Remediation for Vulnerability 2 (Account Lockout Policy)**:
   - Enforce an account lockout after 5 consecutive failed login attempts:
     \`\`\`powershell
     net accounts /lockoutthreshold:5
     \`\`\`

3. **Remediation for Vulnerability 3 (Password History)**:
   - Configure the system to remember the last 10 passwords to prevent immediate reuse:
     \`\`\`powershell
     net accounts /history:10
     \`\`\`

*Alternatively, run the automated remediation script: \`.\\audit_scripts\\remediate.ps1\` inside an elevated Administrator PowerShell terminal.*

---

## Section 3: Hardened Verification (The Proof)
*Provide the expected verification outputs showing that the policies have been successfully updated.*

Once the remediation script \`.\\audit_scripts\\remediate.ps1\` is run in an elevated command terminal, the system configuration is updated to the following hardened baseline:

\`\`\`text
PS C:\\Windows\\system32> net accounts
Force user logoff how long after time expires?:       Never
Minimum password age (days):                          0
Maximum password age (days):                          42
Minimum password length:                              12
Length of password history maintained:                None
Lockout threshold:                                    5
Lockout duration (minutes):                           30
Lockout observation window (minutes):                 30
Computer role:                                        WORKSTATION
The command completed successfully.
\`\`\``;

// Simple markdown-to-HTML parser function
function parseMarkdown(md) {
    let html = md
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^\* (.*$)/gim, '<li>$1</li>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/---/g, '<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 24px 0;">')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');

    // Code blocks parser
    const parts = html.split('```');
    for (let i = 1; i < parts.length; i += 2) {
        // Strip off the language identifier if present
        let code = parts[i];
        const lines = code.split('\n');
        if (lines[0] === 'text' || lines[0] === 'powershell') {
            lines.shift();
        }
        code = lines.join('\n');
        parts[i] = `<pre><code>${code.trim()}</code></pre>`;
    }
    html = parts.join('');
    
    // Wrap lists in <ul>
    html = html.replace(/(<li>.*<\/li>)/sg, '<ul>$1</ul>');
    
    return html;
}

const reportContainer = document.getElementById('report-view-container');
if (reportContainer) {
    reportContainer.innerHTML = parseMarkdown(reportMarkdown);
}

// Copy markdown to clipboard
document.getElementById('btn-copy-report').addEventListener('click', () => {
    navigator.clipboard.writeText(reportMarkdown).then(() => {
        alert("Report markdown copied to clipboard successfully!");
    }).catch(err => {
        console.error("Could not copy text: ", err);
    });
});
