function login() {
  const role = document.getElementById("role").value;

  if (role === "student") {
    window.location.href = "student-dashboard.html";
  } else if (role === "committee") {
    window.location.href = "committee-dashboard.html";
  } else {
    window.location.href = "warden-dashboard.html";
  }
}
