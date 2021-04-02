export type ComponentProps = Record<string, unknown>;

export type ComponentType = Element | string | number | null;

export type ChildType = ComponentType | ChildType[];

export default interface Component<T extends ComponentProps> {
  (props: T): ComponentType;
}
