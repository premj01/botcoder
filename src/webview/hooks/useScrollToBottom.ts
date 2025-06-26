import { useEffect, useRef } from "react";

export const useScrollToBottom = <T extends HTMLElement>(deps: any[] = []) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, deps);

  return ref;
};
