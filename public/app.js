let token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
if(params.get("token")){
  token = params.get("token");
  localStorage.setItem("token", token);
  window.history.replaceState({}, document.title, "/");
}
if (!token) window.location.href = "/login.html";
let dailyChart, categoryChart;
let allFailures = [];
function showToast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2000);
}
function toggleTheme(){
  document.body.classList.toggle("light");
}
function logout(){
  localStorage.removeItem("token");
  window.location.href="/login.html";
}
async function loadFailures(){
  const res = await fetch("/api/failures",{
    headers:{Authorization:token}
  });
  if(!res.ok) return;
  const data = await res.json();
  allFailures=data;
  displayFailures(data);
  updateStats(data);
  renderCharts(data);
  generateInsights(data);
  calculateStreak(data);
  renderHeatmap(data);
}
function displayFailures(data){
  const div=document.getElementById("failures");
  div.innerHTML="";

  data.forEach(f=>{

    div.innerHTML+=`
      <div class="timeline-item ${f.resolved ? "resolved" : ""}">
        <div class="dot"></div>
        <div class="content">
          <div class="row">
            <strong>${f.title}</strong>
            <span class="actions">
              <button onclick="toggleResolve('${f._id}')">
                ${f.resolved ? "Undo" : "Resolve"}
              </button>
              <button onclick="editFailure('${f._id}')">✏️</button>
              <button onclick="deleteFailure('${f._id}')">🗑</button>
            </span>
          </div>

          ${f.tags.map(t=>`<span class="tag">${t}</span>`).join(" ")}
          <br>

          <small>${f.reason} • ${f.mood}</small>
          <small>${new Date(f.date).toLocaleString()}</small>
        </div>
      </div>`;
  });
}

function updateStats(data){
  const today=new Date().toDateString();
  const todayCount=data.filter(f=>new Date(f.date).toDateString()===today).length;
  const weekAgo=Date.now()-7*86400000;
  const weekCount=data.filter(f=>new Date(f.date)>weekAgo).length;
  const map={};
  data.forEach(f=>{
    f.tags.forEach(tag=>{
      map[tag]=(map[tag]||0)+1;
    });
  });
  const top=Object.keys(map).sort((a,b)=>map[b]-map[a])[0]||"-";
  document.getElementById("todayCount").textContent=todayCount;
  document.getElementById("weekCount").textContent=weekCount;
  document.getElementById("topCategoryStat").textContent=top;
}
async function addFailure(){
  const title=titleInput("title");
  const tags = titleInput("tags")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);
  const reason=titleInput("reason");
  const mood=titleInput("mood");
  await fetch("/api/failures",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:token
    },
    body: JSON.stringify({ title, tags, reason, mood })
  });
  clearInputs();
  showToast("Failure saved ✓");
  loadFailures();
  loadUserStats();
}
function titleInput(id){
  return document.getElementById(id).value.trim();
}
function clearInputs(){
  ["title","tags","reason","mood"].forEach(id=>document.getElementById(id).value="");
}
function renderCharts(data) {
  const dailyMap = {};
  const categoryMap = {};
  data.forEach(f => {
    const day = new Date(f.date).toLocaleDateString();
    dailyMap[day] = (dailyMap[day] || 0) + 1;
    f.tags.forEach(tag=>{
      categoryMap[tag]=(categoryMap[tag]||0)+1;
    });
  });
  const days = Object.keys(dailyMap);
  const counts = Object.values(dailyMap);
  const cats = Object.keys(categoryMap);
  const catCounts = Object.values(categoryMap);
  if (dailyChart) dailyChart.destroy();
  if (categoryChart) categoryChart.destroy();
  dailyChart = new Chart(document.getElementById("dailyChart"),{
    type:"bar",
    data:{ labels:days, datasets:[{data:counts}] }
  });
  categoryChart = new Chart(document.getElementById("categoryChart"),{
    type:"pie",
    data:{ labels:cats, datasets:[{data:catCounts}] }
  });
}
function generateInsights(data){
  const list = document.getElementById("insightsList");
  list.innerHTML = "";
  if(data.length===0) return;
  const tagMap={};
  const reasonMap={};
  const moodMap={};
  const dayMap={};
  data.forEach(f=>{
    f.tags.forEach(tag=>{
      tagMap[tag]=(tagMap[tag]||0)+1;
    });
    reasonMap[f.reason]=(reasonMap[f.reason]||0)+1;
    moodMap[f.mood]=(moodMap[f.mood]||0)+1;
    const day=new Date(f.date).toLocaleDateString("en-US",{weekday:"long"});
    dayMap[day]=(dayMap[day]||0)+1;
  });
  const top=obj=>Object.keys(obj).sort((a,b)=>obj[b]-obj[a])[0];
  [
    `Most failures happen on ${top(dayMap)}`,
    `Top tag: ${top(tagMap)}`,
    `Top reason: ${top(reasonMap)}`,
    `Mood pattern: mostly ${top(moodMap)}`
  ].forEach(text=>{
    const li=document.createElement("li");
    li.textContent=text;
    list.appendChild(li);
  });
}
async function deleteFailure(id){

  const res = await fetch("/api/failures/"+id,{
    method:"DELETE",
    headers:{
      "Authorization": token
    }
  });

  if(res.ok){
    showToast("Deleted ✓");
    loadFailures();
  } else {
    showToast("Delete failed ❌");
  }
}

async function toggleResolve(id){

  const res = await fetch(`/api/failures/${id}/resolve`,{
    method:"PATCH",
    headers:{
      "Authorization": token
    }
  });

  if(res.ok){
    showToast("Updated ✓");
    loadFailures();
  } else {
    showToast("Error ❌");
  }
}


async function editFailure(id){

  const title = prompt("New title:");
  if(!title) return;

  const res = await fetch("/api/failures/"+id,{
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
      "Authorization": token
    },
    body: JSON.stringify({ title })
  });

  if(res.ok){
    showToast("Updated ✓");
    loadFailures();
  } else {
    showToast("Update failed ❌");
  }
}

function calculateStreak(data){
  const dates = new Set(data.map(f=>new Date(f.date).toDateString()));
  let streak=0;
  for(let i=0;i<365;i++){
    const day=new Date(Date.now()-i*86400000).toDateString();
    if(dates.has(day)) streak++;
    else break;
  }
  document.getElementById("streakCount").textContent=`${streak} 🔥`;
}
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("title").focus();
  loadFailures();
  initDailyReminder();
});
function renderHeatmap(data){
  const container = document.getElementById("heatmap");
  if(!container) return;
  container.innerHTML = "";
  const map = {};
  data.forEach(f=>{
    const day = new Date(f.date).toDateString();
    map[day] = (map[day] || 0) + 1;
  });
  for(let i=89;i>=0;i--){
    const d = new Date(Date.now() - i*86400000);
    const key = d.toDateString();
    const count = map[key] || 0;
    let level = 0;
    if(count>=5) level=4;
    else if(count>=3) level=3;
    else if(count>=2) level=2;
    else if(count>=1) level=1;
    const cell = document.createElement("div");
    cell.className = `heat-day level-${level}`;
    cell.title = `${key} : ${count} failures`;
    container.appendChild(cell);
  }
}
function initDailyReminder(){
  if(!("Notification" in window)) return;
  if(Notification.permission !== "granted"){
    Notification.requestPermission();
  }
  scheduleReminder(21); 
}
function scheduleReminder(hour){
  const now = new Date();
  const target = new Date();
  target.setHours(hour,0,0,0);
  if(target < now){
    target.setDate(target.getDate()+1);
  }
  const delay = target - now;
  setTimeout(()=>{
    new Notification("🧠 FailForward Reminder",{
      body:"Time to reflect on today and log your failures ✨"
    });
    scheduleReminder(hour);
  }, delay);
}
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
async function loadUserStats(){

  const res = await fetch("/api/user-stats",{
    headers:{ Authorization: token }
  });

  const data = await res.json();

  document.getElementById("xp").innerText = data.xp;
  document.getElementById("level").innerText = data.level;
}
async function loadBadges(){

  const res = await fetch("/api/user-badges",{
    headers:{ Authorization: token }
  });

  const data = await res.json();

  const div = document.getElementById("badges");
  div.innerHTML = "";

  data.badges.forEach(b=>{
    div.innerHTML += `<span class="badge">${b}</span>`;
  });
}
