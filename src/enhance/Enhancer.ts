export default interface Enhancer {
  enhance(): Promise<void>;
}
