import { MY_PROMISE_STATE } from "./constant.js";

export default class MyPromise {
  #executor;
  #state = MY_PROMISE_STATE.pending;
  #value = undefined;

  #onFulFilledFunctions = [];
  #onRejectedFunctions = [];

  constructor(executor) {
    this.#executor = executor;
    this.#init();
  }

  #setState(state, value) {
    queueMicrotask(() => {
      this.#state = state;
      this.#value = value;
      if (value instanceof MyPromise) {
        value.then(this.#resolve.bind(this), this.#reject.bind(this));
        return;
      }
      if (this.#state === MY_PROMISE_STATE.fulfilled) {
        this.#onFulFilledFunctions.forEach((fn) => fn(this.#value));
      }
      if (this.#state === MY_PROMISE_STATE.rejected) {
        this.#onRejectedFunctions.forEach((fn) => fn(this.#value));
      }
    });
  }

  #resolve(value) {
    this.#setState(MY_PROMISE_STATE.fulfilled, value);
  }

  #reject(err) {
    this.#setState(MY_PROMISE_STATE.rejected, err);
  }

  #init() {
    try {
      this.#executor(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (err) {
      this.#reject(err);
    }
  }

  then(onFulFilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#onFulFilledFunctions.push((value) => {
        if (!onFulFilled) {
          resolve(value);
          return;
        }

        try {
          resolve(onFulFilled(value));
        } catch (err) {
          reject(err);
        }
      });

      this.#onRejectedFunctions.push((value) => {
        if (!onRejected) {
          reject(value);
          return;
        }

        try {
          resolve(onRejected(value));
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (value) => {
        onFinally();
        throw value;
      }
    );
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((_, reject) => reject(value));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      let count = promises.length;

      const returnArr = [];

      promises.forEach((ps, i) => {
        if (ps instanceof MyPromise) {
          ps.then((value) => {
            returnArr[i] = value;
            count--;
            !count && resolve(returnArr);
          }).catch(reject);
        } else {
          returnArr[i] = ps;
          count--;
          !count && resolve(returnArr);
        }
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      let settled = false;

      promises.forEach((ps) => {
        MyPromise.resolve(ps)
          .then((value) => {
            if (!settled) {
              resolve(value);
              settled = true;
            }
          })
          .catch((err) => {
            if (!settled) {
              reject(err);
              settled = true;
            }
          });
      });
    });
  }
}
