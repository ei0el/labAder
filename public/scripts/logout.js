export function logout() {
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Logout";

  logoutBtn.addEventListener("click", async () => {
    await fetch(`$(DOMAIN)/logout`, {
      method: "POST",
      credentials: "include",
    });
    displayLogin();
  });
}
