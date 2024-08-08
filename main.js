import MyPromise from "./MyPromise.js";
const testButtons = document.getElementById("testButtons");

[...testButtons.children].forEach((testButton) => {
  testButton.addEventListener("click", () => console.log("hi"));
});

const testOfPromise = new MyPromise((resolve) =>
  setTimeout(() => {
    resolve();
    console.log("promise 테스트 입니다");
  }, 3000)
);
