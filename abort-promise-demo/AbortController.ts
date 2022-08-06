(function () {
  function makeCancelableFetch(url: string) {
    const controller = new AbortController();
    // console.log(`controller:`, controller);
    const signal = controller.signal;
    // console.log(`signal:`, signal)
    const promise = fetch(url, { signal });
    // console.log(`promise:`, promise)

    const cancel = () => {
      controller.abort();
    };

    return {
      promise,
      cancel
    };
  }

  let { promise, cancel } = makeCancelableFetch('https://jsonplaceholder.typicode.com/posts/1');

  const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(promise);
    }, 1000);
  });

  p1.then(res0 => {
    console.log(`res0:`, res0);
    return (res0 as any).json();
  })
    .then(res1 => {
      console.log(`res1:`, res1);
    })
    .catch(err => {
      console.log(`err.message:`, err.message);
    }); // DOMException: The user aborted a request.

  cancel();
})();
