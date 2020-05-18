import { IAbstractTableBuilderStore, IHeaderItem, IRow } from "../components/TableBilder/typings";
import { observable } from "mobx";
import SettingsStore from "./SettingsStore";
import { httpClient } from "../helpers/httpClient";


export class ProjectStorageTable implements IAbstractTableBuilderStore {
  @observable
  headers: IHeaderItem[];
  @observable
  limit: number;
  @observable
  offset: number;
  @observable
  rows: IRow[];
  @observable
  total: number;


  constructor(private settings: SettingsStore) {


  }


  update(){
    httpClient
  }
}
