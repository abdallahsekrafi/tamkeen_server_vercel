const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get("message");
const status = urlParams.get("status");
const statusMessage = document.getElementById("statusMessage");
const btn = document.getElementById("btn");
const redIcon = document.getElementById("redIcon");
const blueIcon = document.getElementById("blueIcon");
if (status === "success") {
  redIcon.classList.add("hideBtn");
  statusMessage.classList.add("success");
  statusMessage.textContent = message;
} else {
  blueIcon.classList.add("hideBtn");
  btn.classList.add("hideBtn");
  statusMessage.classList.add("error");
  statusMessage.textContent = message;
}
