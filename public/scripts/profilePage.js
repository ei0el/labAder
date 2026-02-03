import { app } from "./app.js";
import { logout } from "./logout.js";
import { clearApp } from "./clearApp.js";
import { changePassword } from "./changePassword.js";

export async function profilePage() {
  clearApp();
  /* const response = await fetch(`${DOMAIN}/profilepage`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error);
  }
 */
  const fullName = document.createElement("input");
  fullName.placeholder = "Full Name";
  fullName.type = "text";

  const email = document.createElement("input");
  email.placeholder = "Email";
  email.type = "email";

  const textArea = document.createElement("textarea");
  textArea.placeholder = "Bio";
  textArea.className = "inputBio";

  const applyChanges = document.createElement("button");
  applyChanges.textContent = "Apply Changes";

  const form = document.createElement("form");
  form.append(fullName, email, textArea, applyChanges);

  const updatePassword = document.createElement("button");
  updatePassword.textContent = "Change Password";

  updatePassword.addEventListener("click", changePassword);

  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";
  logoutBtn.className = "logout";

  const card = document.createElement("div");
  card.className = "card";
  card.append(form, updatePassword, logoutBtn);

  logoutBtn.addEventListener("click", logout);

  app.appendChild(card);

  /* changePassword.addEventListener("click");

  const res = changeName.addEventListener("click", async () => {
    const res = await fetch(`${DOMAIN}/changename`, {
      method: "PUT",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fullName: fullName.value }),
    });
  });

  changeEmail.addEventListener("click", async () => {
    const res = await fetch(`${DOMAIN}/changeemail`, {
      method: "PUT",
      credentials: "include",
      header: { "content-type": "application/json" },
      body: JSON.stringify({ email: email.value }),
    });
  });

  changeDescription.addEventListener("click", async () => {
    const res = await fetch(`${DOMAIN}/changetextarea`, {
      method: "PUT",
      credentials: "include",
      header: { "content-type": "application/json" },
      body: JSON.stringify({ textArea: textArea.value }),
    });
  }); */
}
