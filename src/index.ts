import { Observable } from 'kefir';
import { useState, useEffect, useLayoutEffect, DependencyList } from 'react';

// There is a slice of time between the initial value is received and the stream is
// subscribed to. If it's important to not miss changes that may happen in this slice
// of time, make the stream be a property (`.toProperty(() => currentValue)`) so that
// the most current value is received immediately on subscription.

// This subscribes to the stream asynchronously after the component has been
// mounted and visible to the user. Use `useSyncKefir` if it's important that the
// stream is subscribed to before the user sees the component rendered.
export function useKefir<T>(
  stream: Observable<T, any>,
  initialValue: (() => T) | T,
  inputs: DependencyList
): T {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    stream.onValue(setValue);
    return () => {
      stream.offValue(setValue);
    };
  }, inputs);

  return value;
}

// Use this if it's important that the stream is subscribed to before first render.
export function useSyncKefir<T>(
  stream: Observable<T, any>,
  initialValue: (() => T) | T,
  inputs: DependencyList
): T {
  const [value, setValue] = useState(initialValue);

  useLayoutEffect(() => {
    stream.onValue(setValue);
    return () => {
      stream.offValue(setValue);
    };
  }, inputs);

  return value;
}
