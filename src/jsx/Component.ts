import type { SmartValue } from "../api/SmartValue";

export type ComponentProps = Record<string, unknown>;

export type ComponentType = Element | SmartValue<string | number> | string | number | boolean | null | undefined;

export type ChildType = ComponentType | ChildType[];

export default interface Component<T extends ComponentProps> {
  (props: T): ComponentType;
}
