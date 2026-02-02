import { createPost } from "./createPost.js";
import { clearApp } from "./clearApp.js";
import { displayLogin } from "./displayLogin.js";
import { app } from "./app.js";

import { DOMAIN } from "./app.js";

export async function displayFeed() {
  document.title = "Feed | labAder";
  clearApp();

  const nav = document.createElement("nav");
  const ul = document.createElement("ul");

  const li1 = document.createElement("li");
  li1.textContent = "Feed";
  const li2 = document.createElement("li");
  li2.textContent = "Write Post";

  const li3 = document.createElement("li");
  li3.textContent = "Profile";

  ul.append(li1, li2, li3);
  ul.append(nav);

  li1.addEventListener("click", displayFeed);
  li2.addEventListener("click", createPost);

  const response = await fetch(`${DOMAIN}/feed`, {
    credentials: "include",
  });

  if (!response.ok) {
    displayLogin();
  }

  const data = await response.json();

  const feed = document.createElement("div");
  const welcome = document.createElement("h2");
  welcome.textContent = data.message;
  app.appendChild(welcome);

  data.posts.forEach((posts) => {
    const wrapper = document.createElement("div");

    const email = document.createElement("h3");
    email.textContent = posts.email;

    const postImg = document.createElement("img");
    postImg.src = "../../assets/defaultPicture.jpg";

    const postContent = document.createElement("p");
    postContent.textContent = posts.content;

    const postTime = document.createElement("h5");
    postTime.textContent = posts.created_at;

    const postSeparator = document.createElement("hr");

    wrapper.append(email, postContent, postImg, postTime, postSeparator);
    feed.appendChild(wrapper);
  });

  app.appendChild(feed);
}
