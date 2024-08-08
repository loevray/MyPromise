import MyPromise from "./MyPromise";

function* fetchDataGenerator() {
  try {
    console.time();
    const data = yield fetchData();
    console.timeEnd();
    console.log(data);
    return "Processing data";
  } catch (error) {
    console.error("Error:", error);
  }
}

function fetchData() {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("3seconds after Data fetched successfully");
    }, 3000);
  });
}

function runGenerator(generator) {
  const iterator = generator();

  function iterate(iteration) {
    if (iteration.done) {
      return iteration.value;
    }

    const promise = iteration.value;

    return promise
      .then((result) => {
        return iterate(iterator.next(result));
      })
      .catch((error) => {
        iterator.throw(error);
      });
  }

  return iterate(iterator.next());
}

runGenerator(fetchDataGenerator);
