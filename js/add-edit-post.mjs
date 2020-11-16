import utils from "./utils.js";
import AppConstants from "./appConstants.js";
import postApi from "./api/postApi.js";

function parseUrlString(str) {
  const params = {};

  // Write your code here ...
  const keyValuePairs = str.split("&");
  // console.log(keyValuePairs);
  keyValuePairs.forEach((pairString) => {
    // const values = pairString.split('=');
    // const key = values[0];
    // const value = values[1];

    // array desctructoring
    const [key, value] = pairString.split("=");
    params[key] = value;

    // key = page
    // params.page = value;
  });

  return params;
}
const validateForm = (values) => {
  if (!values) return false;

  // Validate title
  const isValidTitle = !!values.title;
  if (!isValidTitle) {
    // TODO: Update DOM to show error message
    return false;
  }
  // Validate author name: at least 2 words
  const isValidAuthor = values.author.split(" ").filter((x) => !!x).length >= 2;
  if (!isValidAuthor) {
    // TODO: Update DOM to show error message
    return false;
  }
  if (!values.imageUrl) {
    return false;
  }

  return true;
};

const changeImageButton = document.querySelector("#postChangeImage");
changeImageButton.addEventListener("click", () => {
  let randomId = 1 + Math.trunc(Math.random() * 1000);
  const imageUrl = `https://picsum.photos/id/${randomId}/1368/400`;
  utils.setBackgroundImageByElementId("postHeroImage", imageUrl);
});

const urlParams = parseUrlString(window.location.search.slice(1));
const postId = urlParams.id; //OK
const isEditMode = !!postId;

const handleFormSubmit = async (event) => {
  event.preventDefault();
  let postObj = {};
  // push value into postObj
  const titleElement = document.querySelector("#postTitle");
  if (titleElement.value) postObj.title = titleElement.value;
  const authorElement = document.querySelector("#postAuthor");
  if (authorElement.value) postObj.author = authorElement.value;
  const descriptionElement = document.querySelector("#postDescription");
  if (descriptionElement.value) postObj.description = descriptionElement.value;
  const imageElement = document.querySelector("#postHeroImage");
  if (imageElement.style.backgroundImage)
    postObj.imageUrl = imageElement.style.backgroundImage.slice(5, -2);

  console.log(postObj);

  if (!validateForm(postObj)) {
    alert("Dữ liệu nhập vào thiếu hoặc không chính xác");
    return;
  }
  // EDIT
  if (isEditMode) {
    console.log("edit mode");
    postObj.id = postId;
    await postApi.update(postObj);
    console.log("update");
    window.location = `/post-detail.html?id=${postId}`;
    alert("Save post successfully");
  }
  if (!isEditMode) {
    //ADD
    await postApi.add(postObj);
    console.log("postObj", postObj);
    window.location = `/index.html?page=1`;
    alert("Add post successfully");
  }
};
//set value if edit
async function getValueForEdit() {
  if (isEditMode) {
    let postEdit = await postApi.get(postId);
    console.log("postEdit:", postEdit);
    const titleElement = document.querySelector("#postTitle");
    titleElement.value = postEdit.title;
    const authorElement = document.querySelector("#postAuthor");
    authorElement.value = postEdit.author;
    const descriptionElement = document.querySelector("#postDescription");
    descriptionElement.value = postEdit.description;
    utils.setBackgroundImageByElementId("postHeroImage", postEdit.imageUrl);
  }
  return;
}
getValueForEdit();
//handle submit
const formElement = document.querySelector(".post-form");
formElement.addEventListener("submit", handleFormSubmit);
