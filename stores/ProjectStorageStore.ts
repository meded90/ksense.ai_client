import { IAbstractTableBuilderStore, IHeaderItem, IRow, IStatus } from "../components/TableBuilder/typings";
import { action, computed, observable, reaction } from "mobx";
import SettingsStore from "./SettingsStore";
import { httpClient } from "../utils/httpClient";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { saveStoreToLocalStorage } from "../utils/saveStoreToLocalStorage";

type IProjectStorageCollectionDTO = {
  empty: "false" | "true",
  headers: IHeaderItem[],
  limit: number,
  offset: number,
  report: { header: IHeaderItem[], rows: IRow[] }
  total: number
}

export class ProjectStorageStore implements IAbstractTableBuilderStore {
  @observable
  status: IStatus = IStatus.init;
  @observable
  limit: number = 100;
  @observable
  offset: number = 0;
  @observable
  total: number;
  rowKey = 'entry_id'

  @computed
  get columns() {
    return this.headers.map((item) => {
      return {
        render_format: item.format,
        render_type: item.type,
        title: capitalizeFirstLetter(item.name.replace('_', ' ')),
        key: item.name,
        dataIndex: item.name
      }
    })
  }

  @computed
  get dataSource() {
    return this.rows.map((row) => row.reduce((acc, item, index) => {
      acc[this.headers[index].name] = item;
      return acc;
    }, {}))
  }


  // origin

  @observable
  headers: IHeaderItem[] = [];
  @observable
  rows: IRow[] = [];


  constructor(private settings: SettingsStore) {
    reaction(() => [settings.token, settings.projectId, this.limit, this.offset], this.update)
    this.update()
  }

  @action.bound
  onChangePagination(offset: number, limit: number) {
    this.offset = offset;
    this.limit = limit
  };

  @action.bound
  update() {
    if (!this.settings.projectId || !this.settings.token || this.status === IStatus.loading) {
      return
    }
    this.status = IStatus.loading
    return httpClient.get<IProjectStorageCollectionDTO>('v2/project_storage/collection', {
      searchParams: {
        projectId: this.settings.projectId,
        token: this.settings.token,
        format: "query_json",
        loc: "covid.cases",
        offset: this.offset,
        limit: this.limit
      }
    }).then(action(data => {
      this.status = IStatus.done;
      if (data.empty === "true") {
        this.rows = [];
        this.total = 0;
        return
      }
      this.total = data.total;
      this.offset = data.offset || 0;
      this.limit = data.limit || 10;
      this.headers = data.headers;
      this.rows = data.report.rows;
    })).catch(() => {
      this.status = IStatus.error;
    })
  }
}
