import MyPromise from "./MyPromise.js";

const testOfMyPromise = () =>
  new MyPromise((resolve) => {
    setTimeout(() => {
      resolve();
      console.log("promise 테스트 입니다1");
    }, 3000);
  });

const p1 = new MyPromise((resolve) =>
  setTimeout(() => {
    resolve("promise all test용 3초뒤 resolve");
  }, 3000)
);

const p2 = new MyPromise((_, reject) =>
  setTimeout(() => {
    reject("promise all test용 5초뒤 reject");
  }, 5000)
);

const p3 = "hi";

const testOfMyPromiseAll = () =>
  MyPromise.all([p1, p2, p3])
    .then((values) => console.log(values))
    .catch((e) => console.log(`이행되지 않은 myPromise : ${e}`));

const p4 = () =>
  new MyPromise((resolve) =>
    setTimeout(() => {
      resolve();
      console.log("promise all race test용 2초뒤 resolve");
    }, 2000)
  );

const p5 = () =>
  new MyPromise((resolve) =>
    setTimeout(() => {
      resolve();
      console.log("promise race test용 4초뒤 resolve");
    }, 4000)
  );

const testOfMyPromiseRace = () => MyPromise.race([p4, p5]);

const testButtons = document.getElementById("testButtons");

const myPromiseTestFunctions = [
  testOfMyPromise,
  testOfMyPromiseAll,
  testOfMyPromiseRace,
];

[...testButtons.children].forEach((testButton, i) => {
  testButton.addEventListener("click", myPromiseTestFunctions[i]);
});
