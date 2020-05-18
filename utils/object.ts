import { isObservableObject, keys, values } from 'mobx'

export const objectKeys: typeof Object.keys = <T>(o: T) => (isObservableObject(o) ? keys(o) : (Object.keys(o) as any))
export const objectValues: typeof Object.values = <T>(o: T) => (isObservableObject(o) ? values(o) : (Object.values(o) as any))

export type Mapper<T, R, K> = (value: T, key: K) => R

export const mapValues = <T, R extends Record<keyof T, unknown>>(object: T, mapper: Mapper<T[keyof T], R[keyof T], keyof T>): R => {
  return objectKeys(object).reduce((newObject, key) => {
    newObject[key] = mapper(object[key], key as keyof T)
    return newObject
  }, {} as R)
}

export const removeUndefined = <T>(object: T): T => {
  const newObject: T = {} as T
  objectKeys(object).forEach(key => {
    if (object[key] !== undefined) {
      newObject[key] = object[key]
    }
  })
  return newObject
}
