# MAJOR — Daily Mission Log

A personal training tracker for you and your friends. Each day you run one of
three plans — **MAJOR A**, **MAJOR B**, or **MAJOR C** — and complete the same
5 objectives:

| Code | Meaning |
|------|---------|
| BF | Body Function Training (yoga / mobility) |
| WL | Weight Lifting |
| MA | Martial Arts |
| SW | Side Weapon Training |
| MF | Mindfulness & Meditation |

## Files in this project

```
MAJOR-APP/
├── index.html   ← page structure
├── style.css    ← tactical "dossier" look and feel
├── script.js    ← all the logic (plans, streak, saving)
└── README.md    ← this file
```

## How to add it to your VS Code workspace

1. In VS Code, right-click your **PROGRAMING** folder in the Explorer panel.
2. Choose **New Folder**, name it `MAJOR-APP`.
3. Copy these four files (`index.html`, `style.css`, `script.js`, `README.md`)
   into that folder.
4. Click `index.html`, then use the **Go Live** button (bottom-right, if you
   have the Live Server extension) — or just double-click `index.html` to
   open it in your browser.

## How it works right now

- Every day, the app suggests a rotation (A → B → C → A → …) automatically,
  but you can tap **MAJOR A / B / C** to override it manually.
- Each of the 5 missions has an editable description — click directly on the
  grey italic text under a mission's name to type in your real plan details
  (e.g. what specific yoga poses, lifts, or drills that day covers).
- Checking off a mission stamps it **COMPLETE**.
- The **Streak** counter in the header counts consecutive days where all 5
  missions were finished.
- Everything is saved automatically in your browser (`localStorage`) — no
  backend or account needed. Note: this means data is per-browser/device;
  it won't sync between your phone and laptop, or between you and friends,
  unless you add that later.

## Adding your real mission details

Open `script.js` and look for `DEFAULT_PLANS` near the top. You can either:
- Type your details directly in the running app (easiest — they'll persist
  in your browser), **or**
- Pre-fill the `detail: ""` fields in `DEFAULT_PLANS` with your actual plan
  content, so anyone opening the app for the first time already sees it.

## Possible next steps (for later, not required now)

- Publish it the same way you did with CREDMORT — push to GitHub, enable
  GitHub Pages, and share the link with friends.
- If you want everyone's progress to sync in one shared place (instead of
  each person's own browser), that would need a small backend/database —
  just say the word when you're ready and we can add that.
