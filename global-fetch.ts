import 'isomorphic-fetch';
import isObject from './lib/is-object';
import serialize from './lib/serialize';
import { combineURL, isAbsoluteURL } from './lib/url';

export type AllowedFetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface IFetchErrorMessage {
  method: AllowedFetchMethod;
  url: string;
  body?: any;
  error: Response;
}

export interface IRequestOptions {
  json?: object;
  form?: object;
  query?: object;
  body?: any;
  headers?: object;
}

export interface IAuthToken {
  token: string;
  type?: string;
}

const DEFAULT_FETCH_OPTIONS = {
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};

export class GlobalFetch {

  private opts: any = DEFAULT_FETCH_OPTIONS;

  private authType: string = 'Bearer';

  constructor(
    private baseUrl: string = '',
    opts: any = {},
  ) {
    this.setBaseUrl(baseUrl);
    if (opts.headers) {
      this.setHeaders(opts.headers);
    }
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
    return this;
  }

  setHeaders(headers: object) {
    this.opts.headers = {
      ...this.opts.headers,
      ...headers,
    };
    return this;
  }

  setHeader(name: string, val: any) {
    this.setHeaders({ [name]: val });
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

  get(url: string, opts: IRequestOptions) {
    this.setMethod('GET');
    return this.request(url, opts);
  }

  post(url: string, opts: IRequestOptions) {
    this.setMethod('POST');
    return this.request(url, opts);
  }

  put(url: string, opts: IRequestOptions) {
    this.setMethod('PUT');
    return this.request(url, opts);
  }

  patch(url: string, opts: IRequestOptions) {
    this.setMethod('PATCH');
    return this.request(url, opts);
  }

  delete(url: string, opts: IRequestOptions) {
    this.setMethod('DELETE');
    return this.request(url, opts);
  }

  head(url: string, opts: IRequestOptions) {
    this.setMethod('HEAD');
    return this.request(url, opts);
  }

  options(url: string, opts: IRequestOptions) {
    this.setMethod('OPTIONS');
    return this.request(url, opts);
  }

  private setMethod(method: AllowedFetchMethod) {
    this.opts.method = method;
  }

  private request(url: string, opts: IRequestOptions): Promise<any> {
    const { json, form, headers, query, ...rest } = opts;

    if (isObject(json)) {
      rest.body = JSON.stringify(json);
    }

    if (form && isObject(form)) {
      rest.body = serialize(form);
      this.setHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    if (headers && isObject(headers)) {
      this.setHeaders(headers);
    }

    if (!isAbsoluteURL(url)) {
      url = combineURL(this.baseUrl, url);
    }

    if (query && isObject(query)) {
      const querystr = serialize(query);
      if (url.includes('?')) {
        url += querystr;
      } else {
        url += `?${querystr}`;
      }
    }

    return fetch(url, { ...this.opts, ...rest })
      .then((response) => {
        if (response.ok) {
          const emptyCodes = [204, 205];
          if (emptyCodes.indexOf(response.status) !== -1) {
            return null;
          }
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          }
          return response;
        }
        throw response;
      })
      .catch((e) => {
        const err: IFetchErrorMessage = {
          method: this.opts.method,
          url,
          body: rest,
          error: e,
        };
        throw err;
      });
  }
}

export default function http(url: string, opts: any) {
  return new GlobalFetch(url, opts);
}
export const get = (url: string, opts: IRequestOptions = {}) => new GlobalFetch().get(url, opts);
export const post = (url: string, opts: IRequestOptions = {}) => new GlobalFetch().post(url, opts);
export const put = (url: string, opts: IRequestOptions = {}) => new GlobalFetch().put(url, opts);
export const patch = (url: string, opts: IRequestOptions = {}) => new GlobalFetch().patch(url, opts);
export const del = (url: string, opts: IRequestOptions = {}) => new GlobalFetch().delete(url, opts);
export const head = (url: string, opts: IRequestOptions = {}) => new GlobalFetch().head(url, opts);
export const options = (url: string, opts: IRequestOptions = {}) => new GlobalFetch().options(url, opts);
