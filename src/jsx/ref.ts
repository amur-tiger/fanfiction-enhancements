interface Reference<T> {
  callback: (value: T) => void;
}

export function isReference(ref: unknown): ref is Reference<unknown> {
  return typeof (ref as Reference<unknown>)?.callback === "function";
}

export default function useRef<T>(callback: (value: T) => void): Reference<T> {
  return { callback };
}
