import 'isomorphic-fetch';
import isObject from './lib/is-object';
import serialize from './lib/serialize';
import { combineURL, isAbsoluteURL } from './lib/url';

export type AllowedFetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface IRequestOptions extends RequestInit {
  json?: object;
  form?: object;
  query?: object;
  responseType?: string;
}

export interface IAuthToken {
  token: string;
  type?: string;
}

const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

export class GlobalFetch {

  private authType: string = 'Bearer';

  private responseType: string | null = 'json';

  constructor(
    private baseUrl: string = '',
    private opts: RequestInit = DEFAULT_FETCH_OPTIONS,
  ) {
    this.setBaseUrl(baseUrl);
    const { headers, ...rest } = opts;
    if (headers && isObject(headers)) {
      this.setHeaders(headers);
    }
    this.opts = { ...this.opts, ...rest };
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  setHeader(name: string, val: any) {
    this.setHeaders({ [name]: val });
    return this;
  }

  setHeaders(headers: object) {
    this.opts.headers = {
      ...this.opts.headers,
      ...headers,
    };
    return this;
  }

  setToken(auth: string | IAuthToken) {
    let authToken;
    if (typeof auth === 'string') {
      authToken = auth;
    } else if (isObject(auth)) {
      authToken = auth.token;
      if (auth.type) {
        this.authType = auth.type;
      }
    }
    this.setHeader('Authorization', `${this.authType} ${authToken}`);
    return this;
  }

  setResponseType(responseType: string | null) {
    this.responseType = responseType;
  }

  get(url: string, opts: IRequestOptions = {}) {
    this.setMethod('GET');
    return this.request(url, opts);
  }

  post(url: string, opts: IRequestOptions = {}) {
    this.setMethod('POST');
    return this.request(url, opts);
  }

  put(url: string, opts: IRequestOptions = {}) {
    this.setMethod('PUT');
    return this.request(url, opts);
  }

  patch(url: string, opts: IRequestOptions = {}) {
    this.setMethod('PATCH');
    return this.request(url, opts);
  }

  delete(url: string, opts: IRequestOptions = {}) {
    this.setMethod('DELETE');
    return this.request(url, opts);
  }

  head(url: string, opts: IRequestOptions = {}) {
    this.setMethod('HEAD');
    return this.request(url, opts);
  }

  options(url: string, opts: IRequestOptions = {}) {
    this.setMethod('OPTIONS');
    return this.request(url, opts);
  }

  private setMethod(method: AllowedFetchMethod) {
    this.opts.method = method;
  }

  private request(url: string, opts: IRequestOptions): Promise<any> {
    const { responseType, headers, json, form, query, ...rest } = opts;

    // Ignore method to avoid confusion
    if (rest.method) {
      delete rest.method;
    }

    if (responseType) {
      this.setResponseType(responseType);
    }

    if (headers && isObject(headers)) {
      this.setHeaders(headers);
    }

    if (!isAbsoluteURL(url)) {
      url = combineURL(this.baseUrl, url);
    }

    let querystr;
    if (query && isObject(query)) {
      querystr = serialize(query);
    }

    // Send data as query string if request is GET or HEAD method
    const { method } = this.opts;
    if (rest.body && (method === 'GET' || method === 'HEAD')) {
      querystr = serialize(rest.body);
      delete rest.body;
    }

    if (url.includes('?')) {
      url += querystr;
    } else {
      url += `?${querystr}`;
    }

    if (isObject(json)) {
      rest.body = JSON.stringify(json);
    }

    if (form && isObject(form)) {
      rest.body = serialize(form);
      this.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    return fetch(url, { ...this.opts, ...rest })
      .then((response) => {
        if (response.ok) {
          return this.resolveResponse(response);
        }
        throw response;
      })
      .catch((err) => {
        throw err;
      });
  }

  private resolveResponse(response: Response) {
    switch (this.responseType) {
      case 'json':
        return response.json();
      case 'text':
        return response.text();
      case 'blob':
        return response.blob();
      case 'arrayBuffer':
        return response.arrayBuffer();
      case 'formData':
        return response.formData();
      default:
        return response;
    }
  }
}

export default function http(baseUrl: string = '', opts: any = {}) {
  return new GlobalFetch(baseUrl, opts);
}

const r = http();
export const get = (url: string, opts: any) => r.get(url, opts);
export const post = (url: string, opts: any) => r.post(url, opts);
export const put = (url: string, opts: any) => r.put(url, opts);
export const patch = (url: string, opts: any) => r.patch(url, opts);
export const del = (url: string, opts: any) => r.delete(url, opts);
export const head = (url: string, opts: any) => r.head(url, opts);
export const options = (url: string, opts: any) => r.options(url, opts);
