import { DOMAIN } from "./app.js";
import { displayLogin } from "./displayLogin.js";
export async function logout() {
  await fetch(`${DOMAIN}/logout`, {
    method: "POST",
    credentials: "include",
  });
  const header = document.getElementById("header");
  header.innerHTML = "";
  const h1 = document.createElement("h1");
  h1.textContent = "lab";
  const span = document.createElement("span");
  span.textContent = "Ader";
  span.className = "light";
  h1.appendChild(span);
  header.append(h1);

  displayLogin();
}
