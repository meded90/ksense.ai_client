import { observable } from "mobx";
import { saveStoreToLocalStorage } from "../utils/saveStoreToLocalStorage";


export default class SettingsStore {
  @observable
  token: string = ''
  @observable
  projectId: string = ''

  constructor() {
    saveStoreToLocalStorage(this, ["projectId", "token"])
  }
}

