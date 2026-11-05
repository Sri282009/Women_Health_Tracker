# Flo — Women's Health Tracker (Prototype)

A responsive React + Vite prototype for cycle awareness and everyday wellbeing.

## Features
- Demo account creation and sign-in screen
- Cycle setup and period logging
- Calendar view with period and estimated fertile-window highlights
- Approximate ovulation and next-period estimates
- Symptom journal with optional notes
- Daily mood, sleep, hydration and energy check-ins
- Short, age-appropriate health education Q&A
- Local browser storage and privacy notes
- Responsive desktop and mobile layout

## Run locally
1. Install [Node.js](https://nodejs.org/) (LTS).
2. Open a terminal in this project folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

To create a production build, run `npm run build`. The generated site is in `dist/`.

## Upload to GitHub
1. Create a new empty repository on GitHub.
2. Extract this ZIP.
3. Upload the `flo-womens-health` folder contents (including `src/`, `package.json`, `index.html`, `.gitignore`, and this README) to the repository.
4. Commit the files.

Or use Git:
```bash
git init
git add .
git commit -m "Build Flo women's health tracker prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Important safety, privacy and production notes
- This is a **front-end demo**, not a clinical product. Cycle and ovulation dates are rough calendar estimates and may be inaccurate, especially when cycles vary. They do not confirm ovulation, diagnose a condition, or provide contraception.
- Health information is sensitive. This demo stores profile and log data in browser `localStorage`; it is not encrypted and is visible to anyone who can access that browser profile. Do not enter real sensitive information into a public/shared computer.
- The sign-in screen is **not real authentication**. It does not verify passwords or use a server. Do not use a real or reused password.
- Before public/real-world launch, add secure server-side authentication, encrypted storage, access controls, account deletion/export, consent and privacy policies, secure transport, backups, and security testing. Have medical content reviewed by qualified clinicians and check applicable privacy/health regulations.
- The name “Flo” is used here as the requested prototype name; this project is not affiliated with or endorsed by any existing Flo-branded health service.
