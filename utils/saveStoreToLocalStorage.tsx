import { autorun, toJS } from "mobx";
import isObject from 'lodash/isObject';
import isServer from "./isServer";
import { removeUndefined } from "./object";

export default function saveStoreToLocalStorage<T>(store: T, cacheKey: Array<keyof T>, prefix = '') {
  if (isServer()) {
    return;
  }
  requestAnimationFrame(() => {


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
  })
}
