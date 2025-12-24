document.getElementById("service-request-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("customer-name").value,
    phone: document.getElementById("customer-phone").value,
    email: document.getElementById("customer-email").value,
    service: document.getElementById("service-type").value,
    vehicle: document.getElementById("vehicle-type").value,
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
    emergency: document.getElementById("emergency-checkbox").checked
  };

  const response = await fetch("/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (response.ok) {
    document.getElementById("service-request-form").classList.add("hidden");
    document.getElementById("success-message").classList.remove("hidden");
  }
});
