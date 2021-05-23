import useRef, { Reference } from "./ref";

export interface ValueReference<T> extends Reference<T> {
  current?: T;
}

export default function useValueRef<T>(initial?: T): ValueReference<T> {
  const ref = useRef((v) => {
    ref.current = v;
  }) as ValueReference<T>;
  ref.current = initial;
  return ref;
}
