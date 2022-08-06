const allowAbort = promise => {
  let _reject = null;
  const newPromise = new Promise((resolve, reject) => {
    _reject = reject;
    promise.then(resolve, reject);
  });
  newPromise.abort = () => {
    _reject && _reject({ type: 'abort' });
  };
  return newPromise;
};

const foo = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('ok'), 1000);
    setTimeout(() => reject('error'), 2000);
  });
};


const f = allowAbort(foo());
f.then(console.log, console.error);
f.abort();

// const p1 = new Promise((resolve, reject) => {});
// console.log('allowAbort:\n', allowAbort(p1));
