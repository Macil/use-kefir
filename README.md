# use-kefir

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Macil/use-kefir/blob/master/LICENSE.txt) [![npm version](https://badge.fury.io/js/use-kefir.svg)](https://badge.fury.io/js/use-kefir) [![Circle CI](https://circleci.com/gh/Macil/use-kefir.svg?style=shield)](https://circleci.com/gh/Macil/use-kefir) [![Greenkeeper badge](https://badges.greenkeeper.io/Macil/use-kefir.svg)](https://greenkeeper.io/)

This is a React hook for allowing components to subscribe to a [Kefir](https://kefirjs.github.io/kefir/)
observable and read the latest value from it.

## Example

```js
import { useKefir } from 'use-kefir';

function MyComponent(props) {
  const { model } = props;

  const name = useKefir(
    model
      .getChangesStream() // some kefir stream
      .toProperty(() => null)
      .map(() => model.get('name')),
    model.get('name'),
    [model]
  );

  return <div>{name}</div>;
}
```

## API

### useKefir

```js
export function useKefir(stream, initialValue, inputs)
```

This function is a React hook that may only be called from a functional React component. On first render, it returns the `initialValue` (if `initialValue` is a function, then the function is called and its return value is used). After the component is mounted and committed to the screen, the `stream` is subscribed to. Whenever `stream` emits a new value, the React component will re-render, and useKefir will return the latest value received from the stream.

- `stream` must be a Kefir Observable. Once the stream has emitted a value, useKefir will always return that latest value. This may be a Kefir Property. If `stream` represents a changing value that may change in the time between the initial render (when `initialValue` is calculated) and the time that the `stream` is subscribed to, then `stream` must be a property that emits the current value when first subscribed to. The example above shows how this can be done. (This may cause a re-render shortly after mounting, but React currently requires this. See https://github.com/facebook/react/issues/13186#issuecomment-403959161 for an explanation.)
- `initialValue` represents the value that will be returned in the initial render and in all renders before the stream has emitted a value. This parameter may either be a function that returns the initial value, or be the initial value itself. (This is just like the initialState parameter of React's useState hook.)
- `inputs` must be an array. If any value passed in the inputs array is changed on a subsequent render, then the previously-subscribed to stream will be unsubscribed from, and the new stream value will be subscribed to. (This is equivalent to the [second parameter of React's useEffect hook](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).) If you want to subscribe to the stream on component mount, never switch out the subscribed stream, and only unsubscribe once the component is unmounted, you can pass an empty array `[]` as the inputs parameter.

### useSyncKefir

```js
export function useSyncKefir(stream, initialValue, inputs)
```

Works just like useKefir, but subscribes to `stream` before the initial render is committed to the screen. Internally it uses React's useLayoutEffect hook, unlike useKefir which uses React's useEffect hook. The useKefir function should be preferred unless this difference is critical in a component's specific use case. React's useLayoutEffect and therefore useSyncKefir are not allowed to be used in React components [that are rendered server-side](https://github.com/facebook/react/issues/14927).

## Types

Both [TypeScript](https://www.typescriptlang.org/) and
[Flow](https://flowtype.org/) type definitions for this module are included!
The type definitions won't require any configuration to use.
