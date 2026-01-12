let allFailures = [];

// Load failures from server
async function loadFailures() {
  const res = await fetch("/api/failures");
  const data = await res.json();

  allFailures = data;
  displayFailures(data);
  
}

function displayFailures(data) {
  const div = document.getElementById("failures");
  div.innerHTML = "";

  if (data.length === 0) {
    div.innerHTML = "<p class='small-text'>No failures found.</p>";
    return;
  }

  data.forEach(f => {
    const box = document.createElement("div");
    box.className = "card";
    box.innerHTML = `
      <strong>${f.title}</strong><br>
      <span class="small-text">
        ${f.category} • ${f.reason} • ${f.mood}
      </span>
    `;
    div.appendChild(box);
  });
}


// Search failures
function searchFailures() {
  const input = document.getElementById("searchInput");
  const keyword = input.value.trim().toLowerCase();

  if (!keyword) {
    alert("Enter a keyword to search");
    return;
  }

  const results = allFailures.filter(f =>
    f.title.toLowerCase().includes(keyword) ||
    f.category.toLowerCase().includes(keyword) ||
    f.reason.toLowerCase().includes(keyword)
  );

  displayFailures(results);
}

// Clear search
function clearSearch() {
  document.getElementById("searchInput").value = "";
  displayFailures(allFailures);
}

// Attach button events AFTER page loads
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", searchFailures);
  document.getElementById("clearBtn").addEventListener("click", clearSearch);

  loadFailures();
  loadPatterns();
  loadReflections();    
});
function exportReport() {
  window.location.href = "/api/export";
}
// ---------------- REFLECTION SECTION ----------------

// Load reflections from server
async function loadReflections() {
  const res = await fetch("/api/reflections");
  const data = await res.json();

  const div = document.getElementById("reflections");
  div.innerHTML = "";

  if (data.length === 0) {
    div.innerHTML = "<p class='small-text'>No reflections yet.</p>";
    return;
  }

  data.forEach(r => {
    const box = document.createElement("div");
    box.className = "card";
    box.innerHTML = `
      <strong>${new Date(r.date).toLocaleDateString()}</strong><br>
      <span class="small-text">${r.reflection}</span>
    `;
    div.appendChild(box);
  });
}

// Add new reflection
async function addReflection() {
  const text = document.getElementById("reflectionText").value.trim();

  if (!text) {
    alert("Please write something before saving.");
    return;
  }

  await fetch("/api/reflections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reflection: text })
  });

  document.getElementById("reflectionText").value = "";
  loadReflections();
}
document.getElementById("topCategory").textContent =
  "Top category: " + data.topCategory;

document.getElementById("topReason").textContent =
  "Top reason: " + data.topReason;

document.getElementById("topDay").textContent =
  "Most failures on: " + data.topDay;
