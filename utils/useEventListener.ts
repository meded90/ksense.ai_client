import { RefObject, useEffect, useRef } from 'react';
import isServer from "./isServer";

export default function useEventListener<T extends HTMLDivElement | Window | Document>(
  event: T extends Window
    ? keyof WindowEventMap
    : T extends Document
      ? keyof DocumentEventMap
      : T extends HTMLDivElement
        ? keyof HTMLElementEventMap
        : string,
  func: (event: unknown) => void,
  ref: RefObject<T>,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    ref.current!.addEventListener(event, func, options);
    return () => ref.current!.removeEventListener(event, func, options as EventListenerOptions);
  }, [event, func, options, ref.current]);
}

export function useWindowEventListener(
  event: keyof WindowEventMap,
  func: (event: unknown) => void,
  options?: boolean | AddEventListenerOptions,
) {
  if (isServer()) return
  useEventListener(event, func, useRef(window), options);
}

export function useDocumentEventListener(
  event: keyof DocumentEventMap,
  func: (event: unknown) => void,
  options?: boolean | AddEventListenerOptions,
) {
  if (isServer()) return
  useEventListener(event, func, useRef(document), options);
}
