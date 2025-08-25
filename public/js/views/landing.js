// This function is used to direct the login button to the login view.

function afterRender() {
    const loginBtn = document.getElementById("loginBtn");
  
    if (loginBtn) {
      loginBtn.addEventListener("click", () => {
        window.location.href = "login.html"; 
      });
    }
  }
  