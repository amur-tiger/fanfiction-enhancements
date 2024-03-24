interface Task<T, D = {}> {
  run: () => T | PromiseLike<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
  promise: Promise<T>;
  data: D;
}

function createTask<T, D = {}>(callback: () => T | PromiseLike<T>, data: D): Task<Awaited<T>, D> {
  let resolve, reject;
  const promise = new Promise<T>((rs, rj) => {
    resolve = rs;
    reject = rj;
  });

  return {
    run: callback as never,
    resolve: resolve!,
    reject: reject!,
    promise: promise as Promise<Awaited<T>>,
    data,
  };
}

interface FetchContext {
  request: Request;
  priority: number;
}

const maxParallel = 4;
const throttleSleep = 200;

const queue: Task<Response, FetchContext>[] = [];
let running = 0;
let waitUntil = 0;

export default function throttledFetch(input: RequestInfo | URL, init?: RequestInit, priority = 0): Promise<Response> {
  const request = new Request(input, init);

  const task = createTask(() => fetch(request), {
    request,
    priority,
  });

  enqueue(task);
  check();

  return task.promise;
}

function check() {
  if (running >= maxParallel || Date.now() < waitUntil) {
    return;
  }

  const task = queue.shift();
  if (!task) {
    return;
  }

  void run(task);
  check();
}

async function run(task: Task<Response, FetchContext>) {
  try {
    if (throttleSleep > 0) {
      waitUntil = Date.now() + throttleSleep;
      setTimeout(check, throttleSleep);
    }

    running += 1;
    const response = await task.run();

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const waitSeconds = ((retryAfter && !Number.isNaN(+retryAfter) && +retryAfter) || 30) + 1;

      console.warn("Rate limited! Waiting %ss.", waitSeconds);
      blockAndRetry(task, waitSeconds);
    } else {
      task.resolve(response);
    }
  } catch (ex) {
    blockAndRetry(task, 60);
  } finally {
    running -= 1;
    check();
  }
}

function enqueue(task: Task<Response, FetchContext>, retry = false) {
  for (let i = 0; i < queue.length; i++) {
    if (retry ? queue[i].data.priority <= task.data.priority : queue[i].data.priority < task.data.priority) {
      queue.splice(i, 0, task);
      return;
    }
  }
  queue.push(task);
}

function blockAndRetry(task: Task<Response, FetchContext>, waitSeconds: number) {
  enqueue(task, true);
  waitUntil = Date.now() + waitSeconds * 1000;
  setTimeout(check, waitSeconds * 1000);
}
