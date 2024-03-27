export interface ScopeOptions<T> {
  parent?: Scope;
  onChange?: (value: T) => void;
}

export class Scope<T = any> extends EventTarget {
  public static readonly EVENT_DISPOSE = "dispose";

  private static readonly stack: Scope[] = [];
  private static readonly executionQueue: Scope[] = [];
  private static isQueued = false;

  private static runExecutionQueue() {
    // filter out scopes that are children of other scopes, they will be replaced anyway
    const scopes = Scope.executionQueue.filter((s1) => !Scope.executionQueue.some((s2) => s1.hasParent(s2)));
    Scope.executionQueue.splice(0);
    Scope.isQueued = false;
    scopes.forEach((scope) => {
      scope.dispatchEvent(new Event(Scope.EVENT_DISPOSE));
      const next = scope.execute();
      scope.onChange?.(next);
    });
  }

  public static getCurrent(): Scope | undefined {
    return Scope.stack[Scope.stack.length - 1];
  }

  readonly callback: () => T;
  readonly parent: Scope | undefined;
  readonly onChange: ((value: T) => void) | undefined;

  public constructor(callback: () => T, options?: ScopeOptions<T>) {
    super();

    this.callback = callback;
    this.parent = options?.parent ?? Scope.getCurrent();
    this.onChange = options?.onChange;

    if (this.parent) {
      // dispose self if parent disposes
      this.parent.addEventListener(
        Scope.EVENT_DISPOSE,
        () => {
          (this as { parent: undefined }).parent = undefined;
          this.dispatchEvent(new Event(Scope.EVENT_DISPOSE));
        },
        { once: true },
      );
    }
  }

  /**
   * Checks if the given scope is a parent of the current scope, recursively.
   * @param scope
   */
  hasParent(scope: Scope): boolean {
    if (this.parent == null) {
      return false;
    }
    if (this.parent === scope) {
      return true;
    }
    return this.parent.hasParent(scope);
  }

  /**
   * Registers an object in this scope. Whenever the object raises a change event,
   * this scope updates. Only the first change event is captured and objects have to
   * re-register for every execution.
   * @param object
   */
  register(object: EventTarget) {
    object.addEventListener(
      "change",
      () => {
        if (!Scope.executionQueue.includes(this)) {
          Scope.executionQueue.push(this);
          if (!Scope.isQueued) {
            Scope.isQueued = true;
            queueMicrotask(() => {
              Scope.runExecutionQueue();
            });
          }
        }
      },
      { once: true },
    );
  }

  /**
   * Re-runs the callback within this scope.
   */
  execute(): T {
    try {
      Scope.stack.push(this);
      return this.callback();
    } finally {
      Scope.stack.pop();
    }
  }
}

/**
 *
 * @param callback
 * @param onChange
 */
export default function scoped<T>(callback: () => T, onChange?: (next: T) => void): T {
  const current = new Scope(callback, { onChange });
  return current.execute();
}

export function onDispose(dispose: () => void) {
  const scope = Scope.getCurrent();
  if (!scope) {
    return;
  }

  scope.addEventListener(Scope.EVENT_DISPOSE, dispose, { once: true });
}
