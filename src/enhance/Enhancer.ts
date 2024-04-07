import type { Page } from "../util/environment";

export default interface Enhancer {
  canEnhance(type: Page): boolean;

  enhance(): Promise<void>;
}
