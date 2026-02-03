import { app } from "./app.js";
import { clearApp } from "./clearApp.js";
import { displayFeed } from "./displayFeed.js";
import { DOMAIN } from "./app.js";

export function createPost() {
  document.title = "Write Post | labAder";
  clearApp();
  const form = document.createElement("form");
  const textArea = document.createElement("textarea");
  textArea.placeholder = "Write about something...";
  const button = document.createElement("button");
  button.textContent = "Post";
  button.type = "submit";
  form.append(textArea, button);

  const backLink = document.createElement("h4");
  backLink.textContent = "Return to Feed";
  backLink.addEventListener("click", displayFeed);
  backLink.style.cursor = "pointer";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    await fetch(`${DOMAIN}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: textArea.value }),
    });

    displayFeed();
  });
  const card = document.createElement("div");
  card.className = "card";
  card.append(form, backLink);

  app.append(card);
}
