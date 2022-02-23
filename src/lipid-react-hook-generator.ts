import { Lipid } from './lipid';
import { useRef, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';

const useIsMounted = () => {
  const isMounted = useRef(false);
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
    const [state, setState] = useState(
      Object.fromEntries(
        properties.reduce((acc, key) => {
          acc.push([key, lipidState.get(key)]);
          return acc;
        }, [])
      )
    );
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
