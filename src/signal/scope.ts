export interface ScopeOptions<T> {
  parent?: Scope;
  onChange?: (value: T) => void;
}

export class Scope<T = any> {
  private static readonly stack: Scope[] = [];
  private static readonly executionQueue: Scope[] = [];
  private static isQueued = false;

  private static runExecutionQueue() {
    // filter out scopes that are children of other scopes, they will be replaced anyway
    const scopes = Scope.executionQueue.filter((s1) => !Scope.executionQueue.some((s2) => s1.hasParent(s2)));
    Scope.executionQueue.splice(0);
    Scope.isQueued = false;
    scopes.forEach((scope) => {
      scope.dispose();
      const next = scope.execute();
      scope.onChange?.(next);
    });
  }

  public static getCurrent(): Scope | undefined {
    return Scope.stack[Scope.stack.length - 1];
  }

  readonly callback: () => T;
  readonly parent: Scope | undefined;
  readonly children: Scope[] = [];
  readonly disposeFns: (() => void)[] = [];
  readonly onChange: ((value: T) => void) | undefined;

  public constructor(callback: () => T, options?: ScopeOptions<T>) {
    this.callback = callback;
    this.parent = options?.parent ?? Scope.getCurrent();
    this.onChange = options?.onChange;
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
   * Notifies the scope that a signal inside has changed. This will queue
   * an update to this scope that may run later.
   */
  notify(): void {
    if (!Scope.executionQueue.includes(this)) {
      Scope.executionQueue.push(this);
      if (!Scope.isQueued) {
        Scope.isQueued = true;
        queueMicrotask(() => {
          Scope.runExecutionQueue();
        });
      }
    }
  }

  /**
   * Registers a function to dispose of resources.
   * @param dispose
   */
  onDispose(dispose: () => void): void {
    this.disposeFns.push(dispose);
  }

  /**
   * Releases all event handlers and other resources.
   */
  dispose(): void {
    this.disposeFns.splice(0).forEach((fn) => fn());
    this.children.splice(0).forEach((child) => {
      child.dispose();
      (child as { parent: undefined }).parent = undefined;
    });
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
