(function () {
  function makeCancelable<T>(promise: Promise<T>) {
    //设置初始值false
    let isCanceled = false;
    const wrappedPromise = new Promise((resolve, reject) => {
      //成功回调
      promise.then(val => {
        isCanceled ? reject({ 'resolve canceled': true }) : resolve(val);
      });
      //失败回调
      promise.catch(err => {
        isCanceled ? reject({ 'reject canceled': true }) : resolve(err);
      });
    });
    //cancel函数
    function cancel() {
      isCanceled = true;
    }
    //返回promise
    return {
      promise: wrappedPromise,
      cancel
    };
  }

  let { promise, cancel } = makeCancelable(fetch('https://jsonplaceholder.typicode.com/posts/1'));
  console.log(`promise 1:`, promise);

  // promise = new Promise((resolve, reject) => {
  //   reject('hello error');
  // });
  // console.log(`promise 2:`, promise)

  promise
    .then(res => {
      console.log(`res:`, res);
      return (res as any).json();
    })
    .then(res1 => {
      console.log(`res1:`, res1);
    })
    .catch(err => {
      console.log(`err:`, err);
    });

  cancel();
})();
