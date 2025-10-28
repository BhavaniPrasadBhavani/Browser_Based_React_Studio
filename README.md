# CipherStudio (MVP)

This is a minimal MVP for CipherStudio — a browser-based React IDE using Next.js and Sandpack.

Features included in this MVP:
- Create a new single React file (JSX) in the project.
- File explorer with file creation and deletion.
- In-browser code editor (Sandpack editor) with live preview.
- Save and load project state to/from localStorage via a generated project id.

How to run
1. Open a terminal in `c:\Users\HP\Desktop\sulphur` (PowerShell recommended).
2. Install dependencies:

```powershell
cd c:\Users\HP\Desktop\sulphur
npm install
```

3. Start the dev server:

```powershell
npm run dev
```

4. Open http://localhost:3000 in your browser.

Notes
- This MVP focuses on a single-file workflow (one React file at a time). The UI is built to expand to multi-file uploads and backend persistence later.
- Project persistence is implemented with localStorage and a projectId token.
# Browser_Based_React_Studio
