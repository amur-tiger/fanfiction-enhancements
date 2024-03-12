export default class RenderContext {
  private static stack: RenderContext[] = [];

  /**
   * Retrieves the current render context. If no context is opened, an exception is thrown.
   */
  public static getCurrent(): RenderContext {
    const context = this.stack[this.stack.length - 1];
    if (context == null) {
      throw new Error("Not in a render context.");
    }
    return context;
  }

  /**
   * Retrieves the current render context.
   */
  public static findCurrent(): RenderContext | undefined {
    return this.stack[this.stack.length - 1];
  }

  /**
   * Creates a new render context. If a context is already open, the new context will be a child of it.
   */
  public static create(): RenderContext {
    const parent = this.stack[this.stack.length - 1];
    return new RenderContext(parent);
  }

  private _parent: RenderContext | undefined;
  private children: RenderContext[] = [];
  private disposeFn: (() => void)[] = [];
  private element: JSX.Element | undefined;

  public constructor(parent?: RenderContext) {
    this._parent = parent;
    if (parent != null) {
      parent.children.push(this);
    }
  }

  public get parent() {
    return this._parent;
  }

  /**
   * Renders a component in the current context.
   * @param render
   */
  public render<T extends JSX.Element>(render: () => T): T {
    const doRender = () => {
      try {
        RenderContext.stack.push(this);
        return render();
      } finally {
        RenderContext.stack.pop();
      }
    };

    this.rerender = function (this: RenderContext) {
      this.dispose();
      const next = doRender();
      this.element!.replaceWith(next);
      this.element = next;
    };

    this.element = doRender();
    return this.element as T;
  }

  /**
   * Renders the current context anew. The previous context will be disposed and the element
   * of this context will be replaced with a new one.
   */
  public rerender() {
    throw new Error("This context was not rendered before.");
  }

  /**
   * Registers a function that is called when the context is disposed.
   * @param dispose
   */
  public onDispose(dispose: () => void): void {
    this.disposeFn.push(dispose);
  }

  /**
   * Releases all change listeners of this context and all child contexts.
   */
  public dispose(): void {
    for (const disposeFn of this.disposeFn) {
      disposeFn();
    }
    for (const child of this.children) {
      child.dispose();
      child._parent = undefined;
    }
    this.disposeFn = [];
    this.children = [];
  }
}
