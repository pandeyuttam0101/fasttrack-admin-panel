// Auto Location
function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude.toFixed(5);
    const lon = pos.coords.longitude.toFixed(5);
    document.getElementById("location").value = `Lat:${lat}, Lng:${lon}`;
  });
}

// Form Submit
document.getElementById("serviceForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(this).entries());

  const res = await fetch("/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.success) {
    document.getElementById("success").classList.remove("hidden");
    this.reset();
  } else {
    alert("❌ Submission failed");
  }
});
