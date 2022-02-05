declare module "*.svg" {
  interface SVGComponent {
    (): HTMLElement & SVGElement;
  }

  const ctr: SVGComponent;

  export default ctr;
}
