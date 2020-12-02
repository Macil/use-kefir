import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Kefir, { Observable } from 'kefir';

import { useKefir, useSyncKefir } from '.';

for (const useTestKefir of [useKefir, useSyncKefir]) {
  // prevent accidental use
  const useKefir = null,
    useSyncKefir = null;

  describe(useTestKefir.name, () => {
    test('constant', () => {
      function Foo(props: {}) {
        const value = useTestKefir<null | string>(
          Kefir.constant('abc'),
          null,
          []
        );
        return <div>{value || '<no value>'}</div>;
      }

      const div = document.createElement('div');
      act(() => {
        ReactDOM.render(<Foo />, div);
      });
      expect(div.textContent).toBe('abc');
      ReactDOM.unmountComponentAtNode(div);
    });

    test('initial and multiple values', () => {
      let activationCount = 0;
      let isActive = false;
      let emitter: any;
      let stream: Observable<string, never> = Kefir.stream(_em => {
        activationCount++;
        emitter = _em;
        isActive = true;
        return () => {
          isActive = false;
        };
      });

      function Foo(props: {}) {
        const value = useTestKefir(stream, () => 'initial', []);
        return <div>{value}</div>;
      }

      expect(activationCount).toBe(0);
      expect(isActive).toBe(false);

      const div = document.createElement('div');
      act(() => {
        ReactDOM.render(<Foo />, div);
      });
      expect(isActive).toBe(true);
      expect(activationCount).toBe(1);
      expect(div.textContent).toBe('initial');
      act(() => {
        emitter.value('abc');
      });
      expect(div.textContent).toBe('abc');
      act(() => {
        emitter.value('123');
      });
      expect(div.textContent).toBe('123');
      expect(isActive).toBe(true);
      act(() => {
        ReactDOM.unmountComponentAtNode(div);
      });
      expect(isActive).toBe(false);
      expect(activationCount).toBe(1);
    });
  });
}
