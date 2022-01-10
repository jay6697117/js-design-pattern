/*
// 1.0
// 类型别名
type Type = null | number;
let timerId: Type = null;
let progress = 0;

function getList() {
  console.log("开始查询列表");
  console.log('-------------------------')
}

function notify(progress: number) {
  console.log("当前进度%d%:", progress);
  console.log('-------------------------')
}

// async function readProgress() {
//   progress += 20;
//   return progress;
// }

function readProgress() {
  progress += 20;
  return Promise.resolve(progress);
}

function run() {
  console.log(`progress:`, progress);
  notify(progress);
  if (progress >= 100) {
    clearTimeout(timerId!);
    getList();
    return;
  }
  timerId = setTimeout(async () => {
    await readProgress();
    run();
  }, 600);
}

run();
*/


// 2.0
let progress = 0;
async function getList() {
  console.log("开始查询列表");
}
function notify(progress: number) {
  console.log("当前进度%d%:", progress);
}

// async function readProgress() {
//   progress += 20;
//   return progress;
// }

function readProgress() {
  progress += 20;
  return Promise.resolve(progress);
}

type AnyFunction = (...arg: any) => void;
type Executor<T> = (
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason?: any) => void,
  notifyFn: (status: any) => void
) => void;

/*
 * 数组的类型声明：
 *    类型[]
 *    Array<类型>
 */
class TrackablePromise<T> extends Promise<T> {
  subscribes: AnyFunction[];

  constructor(executor: Executor<T>) {
    const subscribes: AnyFunction[] = [];

    super((resolve, reject) => {
      return executor(resolve, reject, (status: any) => {
        console.log(`status:`, status);
        console.log(`subscribes:`, subscribes);
        subscribes.forEach((subscribe, index) => {
          // if ((index === 1)) {
          //   return;
          // }
          subscribe(status);
        });
      });
    });

    this.subscribes = subscribes;
  }

  addSubscribe(subscribe: AnyFunction) {
    this.subscribes.push(subscribe);
    return this;
  }
}

const p = new TrackablePromise((resolve, reject, notify) => {

  const run = async () => {
    if (progress > 100) {
      resolve({ success: true });
    } else {
      notify(progress);
      await readProgress();
      setTimeout(() => {
        run();
      }, 1000);
    }
  };
  run();
});

console.log(`p:`, p);
console.log("--------0-------\n");

// 如果想添加多个订阅者,可以继续链式调用
p.addSubscribe((x: any) => {
  console.log(`x:`, x);
  console.log("--------1-------");
}).addSubscribe((y: any) => {
  console.log(`y:`, y);
  console.log("--------2-------\n");
});

p.then((res) => {
  console.log(`res:`, res);
  getList();
});
