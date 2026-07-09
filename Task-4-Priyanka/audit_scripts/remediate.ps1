# DecodeLabs - Project 4 System Vulnerability Remediation
# IMPORTANT: Run this script inside a PowerShell window opened as Administrator!

Write-Host "============================================================" -ForegroundColor Green
Write-Host "         DECODELABS SYSTEM VULNERABILITY REMEDIATION" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green

# 1. Enforce Minimum Password Length to 12
Write-Host "`n[+] Enforcing Minimum Password Length of 12 characters..." -ForegroundColor Yellow
net accounts /minpwlen:12

# 2. Enforce Account Lockout Threshold to 5 failed attempts
Write-Host "[+] Enforcing Account Lockout Threshold of 5 attempts..." -ForegroundColor Yellow
net accounts /lockoutthreshold:5

# 3. Enforce Password History to remember last 10 passwords
Write-Host "[+] Enforcing Password History to remember last 10 entries..." -ForegroundColor Yellow
net accounts /history:10

# Verification output
Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "                VERIFYING REMEDIATION RESULTS" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
net accounts

Write-Host "`nRemediation complete. Copy the verification output above to Section 3 of your report." -ForegroundColor Green
