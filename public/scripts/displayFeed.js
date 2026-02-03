import { createPost } from "./createPost.js";
import { clearApp } from "./clearApp.js";
import { displayLogin } from "./displayLogin.js";
import { app } from "./app.js";
import { profilePage } from "./profilePage.js";

import { DOMAIN } from "./app.js";

export async function displayFeed() {
  document.title = "Feed | labAder";
  clearApp();
  const header = document.getElementById("header");
  header.innerHTML = "";
  const h1 = document.createElement("h1");
  h1.textContent = "lab";
  const span = document.createElement("span");
  span.textContent = "Ader";
  span.className = "light";

  h1.appendChild(span);
  header.append(h1);
  const nav = document.createElement("nav");
  const ul = document.createElement("ul");

  const li1 = document.createElement("li");
  li1.textContent = "Feed";
  const li2 = document.createElement("li");
  li2.textContent = "Write Post";

  const li3 = document.createElement("li");
  li3.textContent = "Profile";

  ul.append(li1, li2, li3);
  nav.appendChild(ul);

  li1.addEventListener("click", displayFeed);
  li2.addEventListener("click", createPost);
  li3.addEventListener("click", profilePage);

  const welcome = document.createElement("h2");

  header.append(welcome, nav);

  const response = await fetch(`${DOMAIN}/feed`, {
    credentials: "include",
  });

  if (!response.ok) {
    displayLogin();
  }

  const data = await response.json();

  const feed = document.createElement("div");
  feed.className = "feed";

  welcome.textContent = data.message;

  data.posts.forEach((posts) => {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    const email = document.createElement("h3");
    email.textContent = posts.email;

    const postImg = document.createElement("img");
    postImg.src = "../../assets/defaultPicture.jpg";

    const postContent = document.createElement("p");
    postContent.textContent = posts.content;

    const postTime = document.createElement("h5");
    postTime.textContent = posts.created_at.toLocaleString();
    const postSeparator = document.createElement("hr");

    wrapper.append(email, postContent, postImg, postSeparator, postTime);
    const card = document.createElement("div");
    card.className = "card";
    card.append(wrapper);
    feed.appendChild(card);
  });
  app.appendChild(feed);
}
