// Step Navigation
const steps = document.querySelectorAll(".step");
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");
const progress = document.getElementById("progress");

let currentStep = 0;

function showStep(step) {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progress.style.width = ((step + 1) / steps.length) * 100 + "%";
}

nextBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  });
});

prevBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });
});

// Ticket Selection Logic
let ticketCount = 0;
const ticketLimit = 3;
const ticketCountEl = document.getElementById("ticketCount");
const subtotalEl = document.getElementById("subtotal");

document.querySelectorAll(".add-ticket").forEach(btn => {
  btn.addEventListener("click", () => {
    if(ticketCount < ticketLimit){
      ticketCount++;
      ticketCountEl.textContent = ticketCount;
      subtotalEl.textContent = ticketCount * 50; // Example price
      btn.textContent = "Added ✅";
      btn.disabled = true;
    } else {
      alert("Maximum 3 tickets allowed");
    }
  });
});

// Review Step Update
const proceedBtn = document.querySelector(".proceed");
proceedBtn.addEventListener("click", () => {
  const date = document.querySelector('input[name="date"]:checked')?.value || "N/A";
  const time = document.querySelector('input[name="time"]:checked')?.value || "N/A";

  document.getElementById("reviewDate").textContent = date;
  document.getElementById("reviewTime").textContent = time;
  document.getElementById("reviewTickets").textContent = ticketCount;
  document.getElementById("reviewSubtotal").textContent = ticketCount * 50;
  alert("Redirecting to payment gateway...");
});
