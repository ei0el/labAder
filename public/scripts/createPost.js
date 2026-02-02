import { app } from "./app.js";
import { clearApp } from "./clearApp.js";

export function createPost() {
  document.title = "Write Post | labAder";
  clearApp();
  const form = document.createElement("form");
  const textArea = document.createElement("textarea");
  textArea.placeholder = "Caption";
  const button = document.createElement("button");
  button.textContent = "Post";
  button.type = "submit";
  form.append(textArea, button);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await fetch(`${DOMAIN}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: textArea.value }),
    });

    displayFeed();
  });

  app.append(form);
}
