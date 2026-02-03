import { app } from "./app.js";
import { clearApp } from "./clearApp.js";
import { displayLogin } from "./displayLogin.js";

export function resetPassword() {
  clearApp();
  const form = document.createElement("form");
  const resetPasswordP = document.createElement("h2");
  resetPasswordP.textContent = "Reset Password";

  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "Email";

  const resetPasswordBtn = document.createElement("button");
  resetPasswordBtn.textContent = "Reset Password";
  resetPasswordBtn.type = "submit";

  const backToLogin = document.createElement("h4");
  backToLogin.textContent = "Back to Login";
  backToLogin.style.cursor = "pointer";
  backToLogin.style.color = "grey";

  backToLogin.addEventListener("click", displayLogin);

  form.append(email, resetPasswordBtn);

  const card = document.createElement("div");
  card.className = "card";
  card.append(resetPasswordP, form, backToLogin);
  const container = document.createElement("div");
  container.className = "container";

  container.appendChild(card);
  app.appendChild(container);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(`Verification sent to ${email.value}`);
    /* const res = await fetch(`${DOMAIN}/resetPassword`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      }),
    }); */
    displayLogin();
  });
}

