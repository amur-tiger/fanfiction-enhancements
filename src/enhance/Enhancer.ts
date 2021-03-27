export default interface Enhancer {
  enhance(): Promise<any>;
}
