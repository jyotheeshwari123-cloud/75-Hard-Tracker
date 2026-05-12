let streak = localStorage.getItem("streak") || 0;
const streakText = document.getElementById("streak");

streakText.innerText = "🔥 Streak: " + streak + " days";

let day = localStorage.getItem("day") || 1;

const dayText = document.getElementById("day");
const progressBar = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextDay");
const checkboxes = document.querySelectorAll(
  "input[type='checkbox']"
);

// 🎁 Rewards
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

const rewardText =
  document.getElementById("rewardText");

updateReward();

dayText.innerText = "Day " + day;

// ✅ Load saved checkbox state
const savedChecks =
  JSON.parse(localStorage.getItem("checks")) || [];

checkboxes.forEach((cb, index) => {
  cb.checked = savedChecks[index] || false;
});

// ✅ Save checkbox state
checkboxes.forEach((cb, index) => {
  cb.addEventListener("change", () => {
    let updatedChecks = [];

    checkboxes.forEach(c =>
      updatedChecks.push(c.checked)
    );

    localStorage.setItem(
      "checks",
      JSON.stringify(updatedChecks)
    );
  });
});

updateProgress();

// ✅ COMPLETE DAY
nextBtn.addEventListener("click", () => {
  let allChecked = true;

  checkboxes.forEach(cb => {
    if (!cb.checked) allChecked = false;
  });

  if (!allChecked) {
    let confirmReset = confirm(
      "You missed tasks. Restart from Day 1?"
    );

    if (confirmReset) {
      day = 1;
      streak = 0;

      localStorage.setItem("day", day);
      localStorage.setItem("streak", streak);

      resetCheckboxes();
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

  // reset checkboxes for new day
  localStorage.setItem(
    "checks",
    JSON.stringify([])
  );

  resetCheckboxes();

  updateUI();
});

// ✅ Update UI
function updateUI() {
  dayText.innerText = "Day " + day;

  streakText.innerText =
    "🔥 Streak: " + streak + " days";

  updateProgress();
  updateReward();
}

// ✅ Reset checkboxes
function resetCheckboxes() {
  checkboxes.forEach(cb => (cb.checked = false));
}

// ✅ Progress Bar
function updateProgress() {
  let percent = (day / 75) * 100;

  progressBar.style.width = percent + "%";
}

// 🎁 Reward System
function updateReward() {
  let nextRewardDay =
    Math.ceil(day / 5) * 5;

  if (nextRewardDay > 75)
    nextRewardDay = 75;

  let reward = rewards[nextRewardDay];

  let daysLeft = nextRewardDay - day;

  if (daysLeft === 0) {
    rewardText.innerText =
      "🎉 Reward Unlocked: " + reward;
  } else {
    rewardText.innerText =
      "Next Reward: " +
      reward +
      " • Unlocks in " +
      daysLeft +
      " days";
  }
}

// ⚖️ WEIGHT TRANSFORMATION GRAPH

let weights =
  JSON.parse(localStorage.getItem("weights")) || [
    {
      day: 1,
      weight: 54
    }
  ];

const ctx =
  document.getElementById("weightChart");

function saveWeight() {
  const input =
    document.getElementById("weightInput");

  if (!input.value) return;

  weights.push({
    day: Number(day),
    weight: Number(input.value)
  });

  localStorage.setItem(
    "weights",
    JSON.stringify(weights)
  );

  input.value = "";

  renderChart();
}

function renderChart() {
  const labels =
    weights.map(w => "Day " + w.day);

  const data =
    weights.map(w => w.weight);

  if (window.weightGraph) {
    window.weightGraph.destroy();
  }

  window.weightGraph =
    new Chart(ctx, {
      type: "line",

      data: {
        labels: labels,

        datasets: [
          {
            label: "Weight (kg)",

            data: data,

            borderColor: "#a47551",

            backgroundColor:
              "rgba(164,117,81,0.15)",

            tension: 0.4,

            fill: true,

            pointRadius: 5,

            pointBackgroundColor:
              "#8b6f47"
          }
        ]
      },

      options: {
        responsive: true,

        plugins: {
          legend: {
            display: false
          }
        },

        scales: {
          y: {
            suggestedMin: 45,
            suggestedMax: 55
          }
        }
      }
    });
}

renderChart();
