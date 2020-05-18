import React, { useCallback, useEffect } from "react";
import { action, autorun, toJS } from "mobx";
import isObject from 'lodash/isObject';
import { removeUndefined } from "./object";

const queueInit = new Set<() => void>()

export function SaveStoreToLocalStorageProvider() {
  const handlerInit = useCallback(action(() => {
    queueInit.forEach(cb => cb())
    queueInit.clear()
  }), []);
  useEffect(() => {
    requestAnimationFrame(handlerInit)
  }, [])
  return <></>
};

export function saveStoreToLocalStorage<T>(store: T, cacheKey: Array<keyof T>, prefix = '') {

  queueInit.add(action(() => {

    const cacheState = cacheKey.reduce((acc, key) => {
      const value = window.localStorage.getItem(prefix + key as string);
      if (value !== null && value !== undefined) {
        acc[key] = value;
        if (value === 'undefined') {
          acc[key] = undefined;

        }
        if (value === 'true') {
          acc[key] = true;
        }
        if (value === 'false') {
          acc[key] = false;
        }
        try {
          if (isObject(JSON.parse(value))) {
            return JSON.parse(value);
          }
        } catch {
        }
      }
      return acc;
    }, {} as Record<keyof T, any>);


    Object.assign(store, removeUndefined(cacheState));

    autorun(() => {
      cacheKey.forEach((key) => {
        let value = toJS(store[key]) as any;
        if (value !== null) {
          if (isObject(value)) {
            value = JSON.stringify(value);
          }
          localStorage.setItem(prefix + key as string, value as string);
        }
      });
    });
  }));
};
