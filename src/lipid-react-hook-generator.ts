import type Lipid from './lipid';
import type { useRef, useEffect, useState } from 'react';
import type { Subscription } from 'rxjs';

const useIsMounted = () => {
  // @ts-ignore
  const isMounted = useRef(false);
  // @ts-ignore
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};

export function lipidReactHookGenerator(lipidState: Lipid) {
  return (properties: string[]) => {
    const isMounted = useIsMounted();
    // @ts-ignore
    const [state, setState] = useState(
      Object.fromEntries(
        properties.reduce((acc, key) => {
          acc.push([key, lipidState.get(key)]);
          return acc;
        }, [])
      )
    );
    // @ts-ignore
    useEffect(() => {
      const obs: Subscription = lipidState
        .on(properties)
        .subscribe(({ state }) => {
          if (isMounted.current) {
            setState(state);
          }
        });
      return () => {
        obs.unsubscribe();
      };
    }, []);
    return state;
  };
}
