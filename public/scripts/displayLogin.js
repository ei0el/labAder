import { clearApp } from "./clearApp.js";
import { displaySignUp } from "./displaySignUp.js";
import { displayFeed } from "./displayFeed.js";

import { DOMAIN } from "./app.js";
import { app } from "./app.js";

export function displayLogin() {
  document.title = "Login | labAder";
  clearApp();
  const title = document.createElement("h2");
  title.textContent = "Login";
  const form = document.createElement("form");

  const email = document.createElement("input");
  email.placeholder = "Email";
  email.type = "email";
  email.required = true;

  const password = document.createElement("input");
  password.placeholder = "Password";
  password.type = "password";
  password.required = true;

  const loginBtn = document.createElement("button");
  loginBtn.textContent = "Login";
  loginBtn.type = "submit";

  form.append(email, password, loginBtn);

  const forgotPassword = document.createElement("h5");
  forgotPassword.textContent = "Forgot Password?";
  forgotPassword.style.cursor = "pointer";
  forgotPassword.style.color = "grey";
  forgotPassword.addEventListener("click", {});

  const noAccount = document.createElement("h5");
  noAccount.textContent = "Don't Have an Account? ";
  const signUp = document.createElement("span");
  signUp.textContent = "Sign Up";
  signUp.style.cursor = "pointer";
  signUp.style.color = "blue";
  noAccount.append(signUp);

  const card = document.createElement("div");
  card.className = "card";
  card.append(title, form, forgotPassword, noAccount);

  app.appendChild(card);

  signUp.addEventListener("click", displaySignUp);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const response = await fetch(`${DOMAIN}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    displayFeed();
  });
}
