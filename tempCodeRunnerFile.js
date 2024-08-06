  static resolve(value) {
    return new MyPromise((res) => res(value));
  }