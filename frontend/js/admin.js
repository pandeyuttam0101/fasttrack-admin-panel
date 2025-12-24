// =========================
// SESSION CHECK ON LOAD
// =========================
fetch("/admin/requests").then(res => {
  if (res.status === 401) {
    window.location.href = "/admin-login.html";
  }
});

// =========================
// GLOBAL DATA STORE
// =========================
let allData = [];
let idleTimer;
let lineChart, pieChart;

// =========================
// AUTO LOGOUT AFTER IDLE (5 MIN)
// =========================
function resetTimer() {
  clearTimeout(idleTimer);

  idleTimer = setTimeout(async () => {
    try {
      await fetch("/admin/logout");
      alert("Session expired due to inactivity");
      window.location.href = "/admin-login.html";
    } catch (err) {
      console.error("Auto logout error:", err);
    }
  }, 5 * 60 * 1000);
}

["click", "mousemove", "keypress", "scroll"].forEach(e =>
  document.addEventListener(e, resetTimer)
);

// =========================
// LOAD ADMIN DATA
// =========================
async function loadData() {
  try {
    const res = await fetch("/admin/requests");

    if (res.status === 401) {
      window.location.href = "/admin-login.html";
      return;
    }

    allData = await res.json();
    renderTable(allData);
    updateStats(allData);
    renderCharts(allData);
    resetTimer();

  } catch (err) {
    console.error("Data load error:", err);
  }
}

// =========================
// RENDER TABLE
// =========================
function renderTable(data) {
  const tbody = document.getElementById("data");
  tbody.innerHTML = "";

  data.forEach(item => {
    tbody.innerHTML += `
      <tr class="border-b border-slate-600">
        <td class="p-2">${item.service || "-"}</td>
        <td class="p-2">${item.vehicle || "-"}</td>
        <td class="p-2">${item.year || "-"}</td>
        <td class="p-2">${item.phone || "-"}</td>
        <td class="p-2">${item.location || "-"}</td>
        <td class="p-2">${item.description || "-"}</td>
        <td class="p-2">${new Date(item.createdAt).toLocaleString()}</td>
      </tr>
    `;
  });
}

// =========================
// UPDATE STATS
// =========================
function updateStats(data) {
  document.getElementById("total").innerText = data.length;

  const today = new Date().toDateString();
  document.getElementById("today").innerText =
    data.filter(d => new Date(d.createdAt).toDateString() === today).length;

  document.getElementById("emergency").innerText =
    data.filter(d =>
      (d.service || "").toLowerCase().includes("emergency")
    ).length;
}

// =========================
// SEARCH
// =========================
document.getElementById("search")?.addEventListener("input", e => {
  const val = e.target.value.toLowerCase();

  const filtered = allData.filter(d =>
    (d.service || "").toLowerCase().includes(val) ||
    (d.phone || "").includes(val)
  );

  renderTable(filtered);
  renderCharts(filtered);
  resetTimer();
});

// =========================
// LOGOUT WITH CONFIRM
// =========================
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  if (!confirm("Are you sure you want to logout?")) return;

  await fetch("/admin/logout");
  window.location.href = "/admin-login.html";
});

// =========================
// CHARTS (STEP 6.2)
// =========================
function renderCharts(data) {
  const dates = {};
  const services = {};

  data.forEach(d => {
    const day = new Date(d.createdAt).toLocaleDateString();
    dates[day] = (dates[day] || 0) + 1;

    const s = d.service || "Other";
    services[s] = (services[s] || 0) + 1;
  });

  if (lineChart) lineChart.destroy();
  if (pieChart) pieChart.destroy();

  lineChart = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: Object.keys(dates),
      datasets: [{
        label: "Requests",
        data: Object.values(dates),
        borderColor: "red",
        tension: 0.3,
        fill: false
      }]
    }
  });

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: Object.keys(services),
      datasets: [{ data: Object.values(services) }]
    }
  });
}

// =========================
// 9.1 REFRESH BUTTON
// =========================
document.getElementById("refreshBtn")?.addEventListener("click", () => {
  loadData();
});

// =========================
// 9.2 EXPORT TO CSV
// =========================
document.getElementById("exportBtn")?.addEventListener("click", () => {
  let csv = "Service,Vehicle,Year,Phone,Location,Details,Time\n";

  allData.forEach(d => {
    csv += `"${d.service}","${d.vehicle}","${d.year}","${d.phone}","${d.location}","${d.description}","${new Date(d.createdAt).toLocaleString()}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "requests.csv";
  link.click();
});

// =========================
// 9.3 PRINT DATA
// =========================
document.getElementById("printBtn")?.addEventListener("click", () => {
  window.print();
});

// =========================
// INIT
// =========================
loadData();
resetTimer();
