import { DOMAIN } from "./app.js";
import { displayLogin } from "./displayLogin.js";
export async function logout() {
  await fetch(`${DOMAIN}/logout`, {
    method: "POST",
    credentials: "include",
  });
  displayLogin();
}
