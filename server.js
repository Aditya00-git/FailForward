const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;


const failureFile = path.join(__dirname, "data/failures.json");
const reflectionFile = path.join(__dirname, "data/reflections.json");

app.use(express.json());
app.use(express.static("public"));

function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ---------- APIs ---------- */

// Get all failures
app.get("/api/failures", (req, res) => {
  res.json(readJSON(failureFile));
});

// Add failure
app.post("/api/failures", (req, res) => {
  const data = readJSON(failureFile);
  const newFailure = { ...req.body, date: new Date().toISOString() };
  data.push(newFailure);
  writeJSON(failureFile, data);
  res.json({ success: true });
});

// Get reflections
app.get("/api/reflections", (req, res) => {
  res.json(readJSON(reflectionFile));
});

// Add reflection
app.post("/api/reflections", (req, res) => {
  const data = readJSON(reflectionFile);
  data.push({ ...req.body, date: new Date().toISOString() });
  writeJSON(reflectionFile, data);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// Get pattern summary
app.get("/api/patterns", (req, res) => {
  const data = readJSON(failureFile);

  if (data.length === 0) {
    return res.json({});
  }

  const categoryCount = {};
  const reasonCount = {};
  const dayCount = {};

  data.forEach(item => {
    categoryCount[item.category] =
      (categoryCount[item.category] || 0) + 1;

    reasonCount[item.reason] =
      (reasonCount[item.reason] || 0) + 1;

    const day = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "long"
    });
    dayCount[day] = (dayCount[day] || 0) + 1;
  });

  function getTop(obj) {
    let maxKey = null, maxVal = 0;
    for (let k in obj) {
      if (obj[k] > maxVal) {
        maxVal = obj[k];
        maxKey = k;
      }
    }
    return maxKey;
  }

  res.json({
    topCategory: getTop(categoryCount),
    topReason: getTop(reasonCount),
    topDay: getTop(dayCount)
  });
});
// Export report
// Export report
app.get("/api/export", (req, res) => {
  const failures = readJSON(failureFile);
  const reflections = readJSON(reflectionFile);

  let content = "MICRO-FAILURE TRACKER REPORT\n";
  content += "============================\n\n";

  content += "FAILURES:\n";
  failures.forEach((f, i) => {
    content += `\n${i + 1}. ${f.title}\n`;
    content += `   Category: ${f.category}\n`;
    content += `   Reason: ${f.reason}\n`;
    content += `   Mood: ${f.mood}\n`;
    content += `   Date: ${f.date}\n`;
  });

  content += "\n\nREFLECTIONS:\n";
  reflections.forEach((r, i) => {
    content += `\n${i + 1}. ${new Date(r.date).toLocaleDateString()}\n`;
    content += `   ${r.reflection}\n`;
  });

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", "attachment; filename=micro_failure_report.txt");
  res.send(content);
});

