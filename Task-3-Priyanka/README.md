# Phish Triage: SOC Analyst Simulation Platform

Phish Triage is a lightweight, high-fidelity, interactive phishing detection simulator designed for a cybersecurity awareness training portfolio project. It mimics the workflow of a Security Operations Center (SOC) analyst triaging suspicious emails and alerts. 

Rather than a simple quiz, this platform uses a weighted **Red Flag Checklist** and a formal **Decision Tree Verdict System** to teach users how to analyze threat indicators, identify psychological triggers, and make defensible security decisions.

---

## 🎯 Project Goals & Features

1. **The Triage Simulator**: Analyze 13 different realistic phishing/BEC and safe scenarios. Users inspect the message and check which of the 11 key red flags are present.
2. **Dynamic Verdict Tree**: The simulator calculates a point score based on checked red flags, mapping the total to a specific action (Safe/Close, Suspicious/Warn, Malicious/Block).
3. **Interactive Annotations**: Upon triage submission, the app highlights correct indicators directly on the email body using numbered annotations, detailing the psychological triggers (Authority, Urgency, Curiosity, Fear-Greed) at play.
4. **URL Decoder Utility**: A built-in, right-to-left sub-domain analyzer that parses complex URLs and highlights the true root domain versus typosquatted or nested sub-domains.
5. **Aesthetic & UX**: Designed with a sleek, dark-mode SOC analyst terminal interface using high-contrast indicators and monospace layouts.

---

## 🚦 Scoring Model & Decision Tree

Each of the 11 red flags is assigned a point weight reflecting its severity and threat certainty:

| Red Flag | Description | Points |
|---|---|---|
| 1 | **Sender-Domain Mismatch** (e.g., mismatched display name and address) | **4** |
| 2 | **Header / Timestamp Anomalies** (e.g., fake forwarded chains or weird times) | **2** |
| 3 | **Browser-in-the-Browser Popup** (fake SSO or credential prompt) | **4** |
| 4 | **Dangerous Attachment Extension** (e.g., `.iso`, `.js`, `.scr`, `.exe`) | **5** |
| 5 | **Urgent Bypass Request** ("skip procedure", "don't report this") | **3** |
| 6 | **Request for Sensitive Info** (MFA code, password, bank info) | **4** |
| 7 | **Alarmist Sign-in Alert** (unusual login or account suspension warn) | **3** |
| 8 | **MFA Fatigue** (spamming push notifications or repeated OTP requests) | **3** |
| 9 | **Callback Phishing (TOAD)** (no link, phone-only support/invoice scam) | **3** |
| 10 | **Unsolicited QR Code (Quishing)** (QR code for login/recovery) | **3** |
| 11 | **Deepfake Call Impersonation** (synthetic voice/video live simulation) | **4** |

### Decision Tree Rules
When the user submits their triage, their checklist score dictates the verdict:
* **Low Score (0 points)**: **Safe** → Safe to Close.
* **Medium Score (1 - 4 points)**: **Suspicious** → Warn User (requires warning headers/additional inspection).
* **High Score (5+ points)**: **Malicious** → Block Domain & Escalate (triggers active defensive SOC measures).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Single-file HTML5 structure using semantic elements.
- **Styling**: Vanilla CSS3 Grid & Flexbox, featuring custom CSS variables for easy theming and dark SOC-dashboard aesthetics.
- **Interactivity**: Vanilla ES6+ Javascript for simulation state, scoring logic, and URL string parsing.
- **Typography**: IBM Plex Mono (monospace) and Inter (sans-serif) imported via Google Fonts.
- **Icons**: Hand-crafted inline SVG icons — no icon library or CDN dependency.
- **Zero Configuration**: No build step, no install — just double-click `index.html` or host directly on GitHub Pages. Note: typography (IBM Plex Mono / Inter) is loaded from Google Fonts via CDN, so an internet connection is needed for the intended look; without one, the app still runs fully but falls back to system fonts.

---

## 📝 Scenarios Covered

The simulator contains a rich database of 13 realistic, professionally written scenarios:
1. **BEC SMS**: CEO impersonation requesting an urgent bank transfer. (Urgency, Authority)
2. **SaaS Billing Failure**: Fake billing update page for a popular SaaS productivity tool. (Fear-Greed)
3. **IT Credential Harvest**: Fake password expiration warning with login link. (Authority)
4. **HR Benefits Update**: Urgent corporate benefits enrollment questionnaire. (Curiosity)
5. **Genuinely Safe Email**: A low-urgency internal project review from a teammate. (Neutral)
6. **TOAD Subscription Scam**: Geek Squad invoice with a toll-free callback number. (Fear-Greed)
7. **Quishing**: Corporate portal MFA setup asking to scan a QR code. (Curiosity)
8. **UPI Block Alert**: Urgent PAN/Aadhaar status update warning for a UPI app. (Fear-Greed)
9. **IRCTC Ticket Refund**: Fake train ticket cancellation refund portal. (Curiosity)
10. **Tax Refund Notice**: Government-style notice claiming an outstanding refund or penalty. (Authority)
11. **Work-from-Home Job Scam**: High-paying WhatsApp message asking for deposit fees. (Greed)
12. **Deepfake CFO Video Call**: Live "video call" with synthetic voice/video impersonating a CFO to authorize a wire transfer. (Authority, Urgency)
13. **Ambiguous New-Device Sign-in Notice**: Generic "unusual sign-in" alert with no credential request or domain mismatch — the deliberate medium-risk case. (Fear-Greed)
