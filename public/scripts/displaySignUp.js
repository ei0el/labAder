import { clearApp } from "./clearApp.js";
import { app } from "./app.js";
import { displayLogin } from "./displayLogin.js";
import { DOMAIN } from "./app.js";

export function displaySignUp() {
  document.title = "Sign Up | labAder";
  clearApp();
  const title = document.createElement("h2");
  title.textContent = "Sign Up";

  const form = document.createElement("form");

  const email = document.createElement("input");
  email.type = "email";
  email.placeholder = "Email";
  email.required = true;

  const password = document.createElement("input");
  password.type = "password";
  password.placeholder = "Password";
  password.required = true;

  const confirmPassword = document.createElement("input");
  confirmPassword.type = "password";
  confirmPassword.placeholder = "Confirm Password";
  confirmPassword.required = true;

  const signUpBtn = document.createElement("button");
  signUpBtn.textContent = "Sign Up";
  signUpBtn.type = "submit";

  form.append(email, password, confirmPassword, signUpBtn);

  const backToLogin = document.createElement("h4");
  backToLogin.textContent = "Back to Login";
  backToLogin.style.cursor = "pointer";
  backToLogin.style.color = "grey";

  backToLogin.addEventListener("click", displayLogin);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (password.value !== confirmPassword.value) {
      alert("Password doesn't match");
      return;
    }

    const response = await fetch(`${DOMAIN}/signup`, {
      method: "POST",
      header: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert(`${data.message}`);

    displayLogin();
  });
  const card = document.createElement("div");
  card.className = "card";
  card.append(title, form, backToLogin);

  app.appendChild(card);
}
