import { DOMAIN } from "./app.js";
import { app } from "./app.js";
import { clearApp } from "./clearApp.js";
import { profilePage } from "./profilePage.js";

export function changePassword() {
  clearApp();
  const card = document.createElement("div");
  card.className = "card";

  const form = document.createElement("form");

  const oldPassword = document.createElement("input");
  oldPassword.type = "password";
  oldPassword.placeholder = "Old Password";
  oldPassword.required = true;

  const newPassword = document.createElement("input");
  newPassword.type = "password";
  newPassword.placeholder = "New Password";
  newPassword.required = true;

  const confirmPassword = document.createElement("input");
  confirmPassword.type = "password";
  confirmPassword.placeholder = "Confirm Password";
  confirmPassword.required = true;

  const updatePassword = document.createElement("button");
  updatePassword.textContent = "Change Password";
  updatePassword.type = "submit";

  const backToProfile = document.createElement("h5");
  backToProfile.textContent = "Back to Profile";
  backToProfile.addEventListener("click", profilePage);

  form.append(oldPassword, newPassword, confirmPassword, updatePassword);
  card.append(form, backToProfile);
  const container = document.createElement("div");
  container.className = "container";
  container.appendChild(card);
  app.appendChild(container);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (
      oldPassword.value.trim() === "" ||
      newPassword.value.trim() === "" ||
      confirmPassword.value.trim() === ""
    ) {
      alert("Empty fields not Allowed");
      return;
    }

    if (newPassword.value.trim() !== confirmPassword.value.trim()) {
      alert("Passwords Don't Match");
      return;
    }

    const response = await fetch(`${DOMAIN}/changepassword`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      },
    });

    const data = response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert(data.message);

    profilePage();
  });
}
