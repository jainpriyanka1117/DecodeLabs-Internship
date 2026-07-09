# DecodeLabs - Project 4 System Vulnerability Checklist Auditor
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "         DECODELABS SYSTEM VULNERABILITY AUDITOR" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Identity & Guest Account Check
Write-Host "`n[+] STEP 1: IDENTITY & LOCAL USER AUDIT" -ForegroundColor Yellow
Get-LocalUser | Format-Table Name, Enabled, Description

# 2. Administrator Group Check (Privilege Creep)
Write-Host "`n[+] STEP 2: ADMINISTRATORS GROUP MEMBERSHIP" -ForegroundColor Yellow
Get-LocalGroupMember -Group "Administrators" | Format-Table Name, PrincipalSource, ObjectClass

# 3. Windows Update & Recent Patches Check
Write-Host "`n[+] STEP 3: RECENT INSTALLED HOTFIXES" -ForegroundColor Yellow
Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 5 | Format-Table Source, Description, HotFixID, InstalledOn

# 4. OS Firewall Status Check
Write-Host "`n[+] STEP 4: OS FIREWALL PROFILE STATUS" -ForegroundColor Yellow
Get-NetFirewallProfile | Format-Table Name, Enabled

# 5. Local Disk Encryption Check (BitLocker)
Write-Host "`n[+] STEP 5: BITLOCKER DISK ENCRYPTION STATUS" -ForegroundColor Yellow
try {
    Get-BitLockerVolume | Format-Table MountPoint, VolumeStatus, EncryptionPercentage
} catch {
    Write-Warning "Could not retrieve BitLocker status. Ensure you are running as Administrator."
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host "Audit complete. Review the above output for vulnerabilities." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
