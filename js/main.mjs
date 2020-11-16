import postApi from "./api/postApi.js";
import AppConstants from "./appConstants.js";
import utils from "./utils.js";

function parseUrlString(str) {
  const params = {};
  const [key, value] = str.split("=");
  params[key] = value;
  return params;
}

const renderPostList = (postList) => {
  const ulElement = document.querySelector("#postsList");
  postList.forEach((post) => {
    // Get template
    const templateElement = document.querySelector("#postItemTemplate");
    if (!templateElement) return;

    // Clone li
    const liElementFromTemplate = templateElement.content.querySelector("li");
    const newLiElement = liElementFromTemplate.cloneNode(true);

    // Fill data
    // set imgae
    const imageElement = newLiElement.querySelector("#postItemImage");
    if (imageElement) {
      post.imageUrl = post.imageUrl.slice(0, -8);
      post.imageUrl += "350/235";
      console.log(post.imageUrl);
      imageElement.src = post.imageUrl;
    }
    console.log(post);
    // set title
    const titleElement = newLiElement.querySelector("#postItemTitle");
    if (titleElement) {
      titleElement.textContent = post.title;
    }

    // set author
    const authorElement = newLiElement.querySelector("#postItemAuthor");
    if (authorElement) {
      authorElement.textContent = post.author;
    }

    //set time update
    const timeSpanElement = newLiElement.querySelector("#postItemTimeSpan");
    if (timeSpanElement) {
      const timeString = utils.formatDate(post.updatedAt);
      timeSpanElement.innerText = ` - ${timeString}`;
    }

    // set description
    const descriptionElement = newLiElement.querySelector(
      "#postItemDescription"
    );
    if (descriptionElement) {
      descriptionElement.textContent = post.description;
    }

    // Add click event for post div
    const divElement = newLiElement.querySelector(".card");
    if (divElement) {
      divElement.addEventListener("click", () => {
        window.location = `/post-detail.html?id=${post.id}`;
      });
    }

    // Add click event for edit button
    const editElement = newLiElement.querySelector("#postItemEdit");
    if (editElement) {
      editElement.addEventListener("click", (e) => {
        // Stop bubbling
        e.stopPropagation();
        window.location = `/add-edit-post.html?id=${post.id}`;
      });
    }

    // Add click event for remove button
    const removeElement = newLiElement.querySelector("#postItemRemove");
    if (removeElement) {
      removeElement.addEventListener("click", async (e) => {
        // Stop bubbling
        e.stopPropagation();

        // Ask user whether they want to delete
        const message = `Are you sure to remove post ${post.title}?`;
        if (window.confirm(message)) {
          try {
            await postApi.remove(post.id);

            // remove li element
            newLiElement.remove();
          } catch (error) {
            console.log("Failed to remove post:", error);
          }
        }
      });
    }

    // Append li to ul
    ulElement.appendChild(newLiElement);
  });
};

// MAIN
// IIFE -- iffy
(async function () {
  try {
    // Retrieve city from URL params
    let urlParams = window.location.search;
    urlParams = urlParams ? urlParams.substring(1) : "";
    console.log("urlParams", urlParams);

    let paramsObj = parseUrlString(urlParams);
    console.log(paramsObj);
    const params = {
      _page: paramsObj.page,
      _limit: 9,
      _sort: "updatedAt",
      _order: "desc",
    };
    const response = await postApi.getAll(params);
    const postList = response.data;
    console.log(postList);
    // render
    renderPostList(postList);
  } catch (error) {
    console.log("Failed to fetch post list", error);
  }
})();
