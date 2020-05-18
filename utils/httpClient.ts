import { Options, Hooks } from 'ky'
import ky from 'ky/umd'
import { mapValues, removeUndefined } from "./object";


export type IURLString = string
export type ISearchParams = Partial<Record<keyof any, number | string | ReadonlyArray<string>>>

export interface RequestOptions extends Omit<Options, 'searchParams'> {
  headers: Headers
  useHooks: boolean
  searchParams?: ISearchParams
}

const DEFAULT_OPTIONS: Partial<Omit<RequestOptions, 'searchParams'>> = {
  useHooks: true,
  credentials: 'omit',
  timeout: 30000,
  retry: 0
}

const defaultHooks: Hooks = {
  beforeRequest: [],
  afterResponse: []
}

export function serializeSearchParams(filter: ISearchParams) {
  return mapValues<ISearchParams, Record<keyof ISearchParams, string | number>>(removeUndefined(filter), value => {
    if (value instanceof Array) {
      return value.join(',')
    }
    return value as string
  })
}

function createRequestOptions(options: Partial<RequestOptions> = {}, body?: object): Options {
  const searchParams = options.searchParams ? serializeSearchParams(options.searchParams) : undefined
  return {
    ...options,
    searchParams,
    json: body

  }
}

export class HttpClient {
  public provider: typeof ky
  private providerOptions: Options = {}

  constructor(options: Partial<Options>) {
    this.providerOptions = {
      ...DEFAULT_OPTIONS,
      hooks: defaultHooks,
      ...options
    }

    this.provider = ky.extend(this.providerOptions)
  }

  get<T>(url: IURLString, options?: Partial<RequestOptions>) {
    return this.provider
      .get(url, createRequestOptions(options))
      .then(this.handleResponse)
      .catch(this.handleError) as Promise<T>
  }

  post<T>(url: IURLString, body?: object, options?: Partial<RequestOptions>) {
    return this.provider
      .post(url, createRequestOptions(options, body))
      .then(this.handleResponse)
      .catch(this.handleError) as Promise<T>
  }

  put<T>(url: IURLString, body?: object, options?: Partial<RequestOptions>) {
    return this.provider
      .put(url, createRequestOptions(options, body))
      .then(this.handleResponse)
      .catch(this.handleError) as Promise<T>
  }

  patch<T>(url: IURLString, body?: object, options?: Partial<RequestOptions>) {
    return this.provider
      .patch(url, createRequestOptions(options, body))
      .then(this.handleResponse)
      .catch(this.handleError) as Promise<T>
  }

  delete<T>(url: IURLString, body?: object, options?: Partial<RequestOptions>) {
    return this.provider
      .delete(url, createRequestOptions(options, body))
      .then(this.handleResponse)
      .catch(this.handleError) as Promise<T>
  }

  addRequestInterceptor(fn: (options: RequestOptions) => RequestOptions) {
    const hooks = this.providerOptions.hooks || defaultHooks

    this.providerOptions = {
      ...this.providerOptions,
      hooks: {
        ...hooks,
        beforeRequest: [...hooks.beforeRequest, fn as any]
      }
    }

    this.provider = this.provider.extend(this.providerOptions)
  }

  addResponseInterceptor(fn: (options: Response) => Response) {
    const hooks = this.providerOptions.hooks || defaultHooks

    this.providerOptions = {
      ...this.providerOptions,
      hooks: {
        ...hooks,
        afterResponse: [...hooks.afterResponse, fn as any]
      }
    }

    this.provider = this.provider.extend(this.providerOptions)
  }


  private handleResponse = (response: Response) => {

    if (!response.ok) {
      throw { response } as ky.HTTPError
    }

    if ([202, 204].includes(response.status)) {
      return response
    }

    return response
      .json() //
      .catch(() => response) // TODO: remove when API will always use 204 status code with empty body
  }

  private handleError(error: ky.HTTPError) {
    if (!error.response) {
      throw error
    }

    if (error.response.status >= 400 && error.response.status < 500) {
      return error.response.text().then(text => {
        let data = text
        try {
          data = JSON.parse(text)
        } finally {
          throw data
        }
      })
    }

    throw error.response
  }
}

export const httpClient = new HttpClient({
  prefixUrl: `/api`
})

export const http = httpClient
