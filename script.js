let streak = localStorage.getItem("streak") || 0;
const streakText = document.getElementById("streak");

streakText.innerText = "🔥 Streak: " + streak + " days";
let day = localStorage.getItem("day") || 1;

const dayText = document.getElementById("day");
const progressBar = document.getElementById("progressBar");
const nextBtn = document.getElementById("nextDay");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

dayText.innerText = "Day " + day;

// ✅ Load saved checkbox state
const savedChecks = JSON.parse(localStorage.getItem("checks")) || [];

checkboxes.forEach((cb, index) => {
  cb.checked = savedChecks[index] || false;
});

// ✅ Save checkbox state when changed
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

  if (!allChecked) {
    let confirmReset = confirm("You missed tasks. Restart from Day 1?");
    
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

  // ✅ Clear saved checkbox data for new day
  localStorage.setItem("checks", JSON.stringify([]));

  resetCheckboxes();
  updateUI();
});

function updateUI() {
  dayText.innerText = "Day " + day;
  streakText.innerText = "🔥 Streak: " + streak + " days";
  updateProgress();
}

function resetCheckboxes() {
  checkboxes.forEach(cb => cb.checked = false);
}

function updateProgress() {
  let percent = (day / 75) * 100;
  progressBar.style.width = percent + "%";
}