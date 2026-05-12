let streak = localStorage.getItem("streak") || 0;
const streakText = document.getElementById("streak");

streakText.innerText = "🔥 Streak: " + streak + " days";

let day = localStorage.getItem("day") || 1;

const dayText = document.getElementById("day");
const progressBar = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextDay");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

const rewards = {
  5: "🍰 Dessert Treat",
  10: "🎬 Movie Night",
  15: "🛍️ Buy Something Small",
  20: "☕ Café Treat",
  25: "💄 Self-care Item",
  30: "🌸 Solo Outing",
   35: "👗 Fashion Accessory",
  40: "💆 Spa / Relax Day",
  45: "🏋️ New Workout Item",
  50: "🍽️ Fancy Dinner",
  55: "🛒 Mini Shopping",
  60: "🌿 Day Trip",
  65: "📸 Photoshoot",
  70: "✨ Big Self-care Day",
  75: "🏆 GRAND REWARD"
};

const rewardText = document.getElementById("rewardText");

updateReward();

dayText.innerText = "Day " + day;

// ✅ Load saved checkbox state
const savedChecks = JSON.parse(localStorage.getItem("checks")) || [];

checkboxes.forEach((cb, index) => {
  cb.checked = savedChecks[index] || false;
});

// ✅ Save checkbox state
checkboxes.forEach((cb, index) => {
  cb.addEventListener("change", () => {
    let updatedChecks = [];

    checkboxes.forEach(c => updatedChecks.push(c.checked));

    localStorage.setItem("checks", JSON.stringify(updatedChecks));
  });
});

updateProgress();

nextBtn.addEventListener("click", () => {
  let allChecked = true;

  checkboxes.forEach(cb => {
    if (!cb.checked) allChecked = false;
  });

  // 💧 Water must also be completed
  if (water < 3000) {
    allChecked = false;
  }

  if (!allChecked) {
    let confirmReset = confirm("You missed tasks. Restart from Day 1?");

    if (confirmReset) {
      day = 1;
      streak = 0;
            localStorage.setItem("day", day);
      localStorage.setItem("streak", streak);

      resetCheckboxes();
      resetWater();
      updateUI();
    }

    return;
  }

  if (day >= 75) {
    alert("🔥 You completed 75 Days!");
    return;
  }

  day++;
  streak++;

                         
  localStorage.setItem("day", day);
  localStorage.setItem("streak", streak);

  localStorage.setItem("checks", JSON.stringify([]));

  resetCheckboxes();
  resetWater();
  updateUI();
});

function updateUI() {
  dayText.innerText = "Day " + day;

  streakText.innerText = "🔥 Streak: " + streak + " days";

  updateProgress();
  updateReward();
}

function resetCheckboxes() {
  checkboxes.forEach(cb => cb.checked = false);
}

function updateProgress() {
  let percent = (day / 75) * 100;

  progressBar.style.width = percent + "%";
}

// 💧 MINIMAL WATER TRACKER

let waterDrops =
  JSON.parse(localStorage.getItem("waterDrops")) ||
  [false, false, false, false, false, false];

const drops = document.querySelectorAll(".drop");

const waterStatus =
  document.getElementById("waterStatus");

drops.forEach((drop, index) => {
  if (waterDrops[index]) {
    drop.classList.add("active");
  }

  drop.addEventListener("click", () => {
    waterDrops[index] = !waterDrops[index];

    drop.classList.toggle("active");

    localStorage.setItem(
      "waterDrops",
      JSON.stringify(waterDrops)
    );

    updateWaterStatus();
  });
});

function updateWaterStatus() {
  const completed =
    waterDrops.filter(Boolean).length;

  waterStatus.innerText =
    completed * 500 + " ml / 3000 ml";

  if (completed === 6) {
    waterStatus.innerText +=
      "  ✅ Goal Completed";
  }
}

function resetWater() {
  waterDrops =
    [false, false, false, false, false, false];

  localStorage.setItem(
    "waterDrops",
    JSON.stringify(waterDrops)
  );

  drops.forEach(drop => {
    drop.classList.remove("active");
  });

  updateWaterStatus();
}

updateWaterStatus();

// ⚖️ WEIGHT TRACKER
let weights = JSON.parse(localStorage.getItem("weights")) || [];

const weightList = document.getElementById("weightList");

showWeights();

function saveWeight() {
  const input = document.getElementById("weightInput");

  if (!input.value) return;

  weights.push({
    day: day,
    weight: input.value
  });

  localStorage.setItem("weights", JSON.stringify(weights));


  input.value = "";

  showWeights();
}

function showWeights() {
  weightList.innerHTML = "";

  weights.forEach(entry => {
    const li = document.createElement("li");

    li.innerText =
      "Day " + entry.day + " → " + entry.weight + " kg";

    weightList.appendChild(li);
  });
}

// 🎁 REWARD SYSTEM
function updateReward() {
  let nextRewardDay = Math.ceil(day / 5) * 5;

  if (nextRewardDay > 75) nextRewardDay = 75;

  let reward = rewards[nextRewardDay];

  let daysLeft = nextRewardDay - day;

  if (daysLeft === 0) {
    rewardText.innerText =
      "🎉 Reward Unlocked: " + reward;
  } else {
    rewardText.innerText =
      "Next Reward: " + reward +
      " • Unlocks in " + daysLeft + " days";
  }
}
