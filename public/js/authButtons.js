document.addEventListener("DOMContentLoaded", function () {
  var authButtons = document.getElementById("authButtons");
  var loginBtn = document.getElementById("loginBtn");
  var idUsuario = sessionStorage.ID_USUARIO;

  if (!authButtons) {
    if (loginBtn && loginBtn.parentNode) {
      authButtons = document.createElement("div");
      authButtons.id = "authButtons";
      loginBtn.parentNode.replaceChild(authButtons, loginBtn);
      authButtons.appendChild(loginBtn);
    }
  }

  if (!authButtons) {
    return;
  }

  authButtons.innerHTML = "";

  if (idUsuario) {
    var dashboardLink = document.createElement("a");
    dashboardLink.href = "./dashboard-usuario.html";
    dashboardLink.id = "dashboardBtn";
    dashboardLink.innerText = "Dashboard";
    dashboardLink.style.marginRight = "10px";
    authButtons.appendChild(dashboardLink);

    var logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.id = "logoutBtn";
    logoutLink.innerText = "Logout";
    logoutLink.addEventListener("click", function (event) {
      event.preventDefault();
      sessionStorage.clear();
      window.location = "./index.html";
    });
    authButtons.appendChild(logoutLink);
  } else {
    var loginLink = document.createElement("a");
    loginLink.href = "./login.html";
    loginLink.id = "loginBtn";
    loginLink.innerText = "Login";
    authButtons.appendChild(loginLink);
  }
});
