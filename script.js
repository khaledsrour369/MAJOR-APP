/* =========================================================
   MAJOR APP — Daily Mission Log
   ---------------------------------------------------------
   Every mission is a checklist. Each item has its own
   checkbox and a 🖼 link that opens an image search for
   that exercise/task. You can edit any item's text, add
   new items with "+ Add item", or remove one with the ✕.
   ========================================================= */

/* ---- 1. Default data structure -------------------------
   note  = optional short label shown above the checklist
   items = the actual checkable list for that mission        */
const DEFAULT_PLANS = {
  A: {
    BF: { title: "Body Function Training", note: "", items: ["#FULL STRETCHES"] },
    WL: {
      title: "Weight Lifting",
      note: "#UPPER LIMBS",
      items: [
        "1: Barbell Overhead Press",
        "2: Seated Dumbbell Press",
        "3: Arnold Press",
        "4: Dumbbell Lateral Raise",
        "5: Dumbbell Front Raise",
        "6: Rear Delt Flyes",
        "7: Barbell Upright Row",
        "8: Barbell Bicep Curl",
        "9: Dumbbell Alternate Curl",
        "10: Chin-Ups",
        "11: Concentration Curl",
        "12: Incline Dumbbell Curl",
        "13: Close-Grip Bench Press",
        "14: Dumbbell Skull Crushers",
        "15: Overhead DB Extension",
        "16: Bench Dips",
        "17: Tricep Kickbacks",
        "18: Hammer Curls",
        "19: Reverse Barbell Curls",
        "20: Zottman Curls",
        "21: Cross-Body Hammer Curl",
        "22: Wrist Curls",
        "23: Reverse Wrist Curls",
        "24: Barbell Static Hold",
        "25: Dumbbell Farmer's Walk",
        "26: Dead Hangs",
        "27: Lying Neck Flexion (Front)",
        "28: Lying Neck Extension (Back)",
        "29: Lateral Neck Flexion (Side)",
        "30: Barbell Shrugs",
        "31: Dumbbell Shrugs",
      ],
    },
    MA: { title: "Martial Arts", note: "", items: ["#ATTACK FOCUS"] },
    SW: { title: "Side Weapon Training", note: "", items: ["#STICKS"] },
    MF: { title: "Mindfulness & Meditation", note: "", items: ["SILENCE AND BREATH"] },
  },
  B: {
    BF: { title: "Body Function Training", note: "", items: [""] },
    WL: { title: "Weight Lifting", note: "", items: [""] },
    MA: { title: "Martial Arts", note: "", items: [""] },
    SW: { title: "Side Weapon Training", note: "", items: [""] },
    MF: { title: "Mindfulness & Meditation", note: "", items: [""] },
  },
  C: {
    BF: { title: "Body Function Training", note: "", items: [""] },
    WL: { title: "Weight Lifting", note: "", items: [""] },
    MA: { title: "Martial Arts", note: "", items: [""] },
    SW: { title: "Side Weapon Training", note: "", items: [""] },
    MF: { title: "Mindfulness & Meditation", note: "", items: [""] },
  },
};

const MISSION_ORDER = ["BF", "WL", "MA", "SW", "MF"];
const STORAGE_KEY = "major-app-data";

/* ---- 2. Load / save from localStorage ------------------- */
function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { plans: DEFAULT_PLANS, log: {} };
  }
  try {
    const parsed = JSON.parse(raw);
    parsed.log = parsed.log || {};

    // Merge saved plans with the latest DEFAULT_PLANS:
    // - if you've already edited a mission's items/note, that's kept
    // - anything never touched falls back to the newest defaults here
    const merged = {};
    Object.keys(DEFAULT_PLANS).forEach((planLetter) => {
      merged[planLetter] = {};
      Object.keys(DEFAULT_PLANS[planLetter]).forEach((code) => {
        const saved = parsed.plans && parsed.plans[planLetter] && parsed.plans[planLetter][code];
        const def = DEFAULT_PLANS[planLetter][code];
        const hasSavedItems =
          saved && Array.isArray(saved.items) && saved.items.some((i) => i && i.trim());
        merged[planLetter][code] = {
          title: def.title,
          note: saved && saved.note ? saved.note : def.note,
          items: hasSavedItems ? saved.items : def.items,
        };
      });
    });
    parsed.plans = merged;
    return parsed;
  } catch (e) {
    console.error("Could not read saved data, starting fresh.", e);
    return { plans: DEFAULT_PLANS, log: {} };
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---- 3. App state ---------------------------------------- */
let state = loadData();

function todayKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function suggestedPlanForToday() {
  const anchor = new Date("2026-01-01T00:00:00");
  const today = new Date(todayKey() + "T00:00:00");
  const daysSince = Math.round((today - anchor) / 86400000);
  const letters = ["A", "B", "C"];
  return letters[((daysSince % 3) + 3) % 3];
}

function getTodayLog() {
  const key = todayKey();
  if (!state.log[key]) {
    state.log[key] = { plan: suggestedPlanForToday(), itemsDone: {} };
  }
  if (!state.log[key].itemsDone) state.log[key].itemsDone = {};
  return state.log[key];
}

/* Gets (and repairs the length of) the done-array for one mission today */
function getItemsDoneArray(code) {
  const today = getTodayLog();
  const items = state.plans[today.plan][code].items;
  let arr = today.itemsDone[code] || [];
  // pad or trim so it always matches the current item count
  while (arr.length < items.length) arr.push(false);
  arr = arr.slice(0, items.length);
  today.itemsDone[code] = arr;
  return arr;
}

function isMissionComplete(code) {
  const arr = getItemsDoneArray(code);
  return arr.length > 0 && arr.every(Boolean);
}

/* ---- 4. Rendering ----------------------------------------- */
function render() {
  const today = getTodayLog();

  document.getElementById("date-value").textContent = new Date().toLocaleDateString(
    undefined,
    { month: "short", day: "numeric" }
  );

  document.querySelectorAll(".plan-stamp").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.plan === today.plan);
  });
  document.getElementById("suggestion-text").textContent =
    today.plan === suggestedPlanForToday()
      ? "Following today's suggested rotation."
      : `Suggested rotation today: MAJOR ${suggestedPlanForToday()} (you switched manually).`;

  const missionsContainer = document.getElementById("missions");
  missionsContainer.innerHTML = "";

  MISSION_ORDER.forEach((code) => {
    const mission = state.plans[today.plan][code];
    const doneArr = getItemsDoneArray(code);
    const doneCount = doneArr.filter(Boolean).length;
    const allDone = isMissionComplete(code);

    const card = document.createElement("div");
    card.className = "mission-card" + (allDone ? " complete" : "");

    const itemsHtml = mission.items
      .map((item, i) => {
        const checked = doneArr[i] ? "checked" : "";
        const searchUrl =
          "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(item || mission.title);
        return `
          <div class="item-row">
            <input type="checkbox" class="item-check" data-code="${code}" data-index="${i}" ${checked} aria-label="Mark item done" />
            <span class="item-text" contenteditable="true" data-code="${code}" data-index="${i}" data-placeholder="Type an exercise or task...">${item}</span>
            <a class="item-photo" href="${searchUrl}" target="_blank" rel="noopener noreferrer" title="See reference images">🖼</a>
            <button class="item-remove" data-code="${code}" data-index="${i}" title="Remove item">✕</button>
          </div>`;
      })
      .join("");

    card.innerHTML = `
      <span class="mission-code">${code}</span>
      <div class="mission-text">
        <div class="mission-head">
          <span class="mission-title">${mission.title}</span>
          <span class="mission-progress">${doneCount}/${mission.items.length}</span>
        </div>
        <span class="mission-note" contenteditable="true" data-code="${code}" data-placeholder="Add a short focus tag...">${mission.note}</span>
        <div class="item-list">${itemsHtml}</div>
        <button class="item-add" data-code="${code}">+ Add item</button>
      </div>
    `;

    missionsContainer.appendChild(card);
  });

  updateStreak();
}

/* ---- 5. Streak calculation --------------------------------- */
function updateStreak() {
  let streak = 0;
  let cursor = new Date();

  const today = getTodayLog();
  const todayDone = MISSION_ORDER.every((c) => isMissionComplete(c));
  if (!todayDone) cursor.setDate(cursor.getDate() - 1);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    const entry = state.log[key];
    const done =
      entry &&
      entry.itemsDone &&
      MISSION_ORDER.every((c) => {
        const arr = entry.itemsDone[c];
        return Array.isArray(arr) && arr.length > 0 && arr.every(Boolean);
      });
    if (done) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }

  document.getElementById("streak-value").textContent = streak;
}

/* ---- 6. Event handling -------------------------------------- */
document.getElementById("plan-tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".plan-stamp");
  if (!btn) return;
  getTodayLog().plan = btn.dataset.plan;
  saveData();
  render();
});

document.getElementById("missions").addEventListener("click", (e) => {
  const addBtn = e.target.closest(".item-add");
  if (addBtn) {
    const code = addBtn.dataset.code;
    const plan = getTodayLog().plan;
    state.plans[plan][code].items.push("");
    saveData();
    render();
    return;
  }
  const removeBtn = e.target.closest(".item-remove");
  if (removeBtn) {
    const code = removeBtn.dataset.code;
    const index = Number(removeBtn.dataset.index);
    const plan = getTodayLog().plan;
    state.plans[plan][code].items.splice(index, 1);
    const doneArr = getTodayLog().itemsDone[code] || [];
    doneArr.splice(index, 1);
    saveData();
    render();
  }
});

document.getElementById("missions").addEventListener("change", (e) => {
  if (!e.target.matches(".item-check")) return;
  const code = e.target.dataset.code;
  const index = Number(e.target.dataset.index);
  const arr = getItemsDoneArray(code);
  arr[index] = e.target.checked;
  saveData();
  render();
});

document.getElementById("missions").addEventListener(
  "blur",
  (e) => {
    const plan = getTodayLog().plan;
    if (e.target.matches(".item-text")) {
      const code = e.target.dataset.code;
      const index = Number(e.target.dataset.index);
      state.plans[plan][code].items[index] = e.target.textContent.trim();
      saveData();
    } else if (e.target.matches(".mission-note")) {
      const code = e.target.dataset.code;
      state.plans[plan][code].note = e.target.textContent.trim();
      saveData();
    }
  },
  true
);

/* ---- 7. Init -------------------------------------------------- */
render();