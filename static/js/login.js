document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const message = document.getElementById("loginMessage");

    if (params.get("error") === "1") {
        message.textContent = "Invalid username or password. Please try again.";
    }
});