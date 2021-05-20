export default class NextEvent extends Event {
  public static readonly type = "next";

  public constructor(public readonly requestId: number) {
    super(NextEvent.type);
  }
}
