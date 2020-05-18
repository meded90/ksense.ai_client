import { MobXProviderContext, useStaticRendering } from 'mobx-react';
import isServer from "../utils/isServer";
import SettingsStore from "./SettingsStore";
import { useContext } from "react";
import { ProjectStorageStore } from './ProjectStorageStore';

// import PostStore from './PostStore';
// import UIStore from './UIStore';

useStaticRendering(isServer());

let store = null;


function createStores() {
  const settingsStore = new SettingsStore();
  const projectStorageStore = new ProjectStorageStore(settingsStore);
  return { settingsStore, projectStorageStore };
}


export type RootStore = ReturnType<typeof createStores>;

export type StorePartial = Partial<RootStore>;
export type StoreConsumer<K extends keyof RootStore> = {
  [P in K]: Readonly<RootStore[P]>;
};


export function useStores(): RootStore {
  return useContext(MobXProviderContext) as RootStore;
}

export default function initializeStore() {

  if (store === null) {

    store = createStores()
  }

  return store;
}
