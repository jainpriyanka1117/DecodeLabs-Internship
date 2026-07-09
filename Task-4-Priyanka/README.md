# Cyber Security Project 4: System Vulnerability Checklist

This repository contains the scripts, reports, and interactive Web GUI Dashboard to conduct a local cybersecurity audit on a Windows machine.

## File Structure

```text
Task-4-Priyanka/
├── README.md                  # This guide
├── index.html                 # Stunning, interactive Web GUI landing page
├── style.css                  # Custom styling (glassmorphism, dark theme)
├── app.js                     # JavaScript engine (simulated audit & CVSS calculator)
├── audit_scripts/
│   ├── run_audit.ps1          # PowerShell script to run the local audit checks
│   └── remediate.ps1          # PowerShell script to remediate password policy flaws
└── reports/
    └── vulnerability_report.md  # Completed 1-page vulnerability report
```

## How to Run the Web GUI Landing Page
You can view the interactive project dashboard in two ways:

1. **Directly**:
   - Double-click the [index.html](file:///D:/priyanka/projects/DecodeLabs-Internship/Task-4-Priyanka/index.html) file to open it in Google Chrome, Microsoft Edge, or any web browser.
   
2. **Via Local Python Server** (Recommended):
   - Open Command Prompt or PowerShell, switch to your D: drive, and run:
     ```cmd
     d:
     cd \priyanka\projects\DecodeLabs-Internship\Task-4-Priyanka
     python -m http.server 8000
     ```
   - Open your browser and navigate to: **[http://localhost:8000](http://localhost:8000)**

---

## How to Conduct the CLI System Audit

1. **Audit phase (Read-only)**:
   - Open PowerShell and run the audit script:
     ```powershell
     .\audit_scripts\run_audit.ps1
     ```
   - Notice the current settings for user profiles, firewall, and password policies.

2. **Remediation phase (Write)**:
   - Open PowerShell **as Administrator**.
   - Navigate to the project directory and run the remediation script to fix the password complexity, history, and lockout vulnerabilities:
     ```powershell
     .\audit_scripts\remediate.ps1
     ```

3. **Verify**:
   - The remediation script will automatically output the updated `net accounts` showing the hardened state.
   - Open [reports/vulnerability_report.md](file:///D:/priyanka/projects/DecodeLabs-Internship/Task-4-Priyanka/reports/vulnerability_report.md) and verify that the outputs match.
