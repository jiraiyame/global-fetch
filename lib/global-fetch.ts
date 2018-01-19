import 'isomorphic-fetch';
import isObject from './is-object';
import serialize from './serialize';
import { combineURL, isAbsoluteURL } from './url';

export type AllowedFetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type AllowedResponseType = 'json' | 'text' | 'blob' | 'arraybuffer' | 'formdata'

export interface IRequestOptions extends RequestInit {
  json?: object;
  form?: object;
  query?: object;
  responseType?: AllowedResponseType;
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
  private responseType: AllowedResponseType = 'json';

  constructor(
    private baseUrl: string = '',
    private config: RequestInit = DEFAULT_FETCH_OPTIONS,
  ) {
    this.setBaseUrl(baseUrl);

    const { headers, ...rest } = config;

    if (headers && isObject(headers)) {
      this.setHeaders(headers);
    }

    this.config = { ...this.config, ...rest };
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  setHeader(name: string, val: any) {
    this.setHeaders({ [name]: val });
    return this;
  }

  setHeaders(headers: RequestInit['headers']) {
    this.config.headers = {
      ...this.config.headers,
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

  setResponseType(responseType: AllowedResponseType) {
    this.responseType = responseType;
  }

  get(url: string, config?: IRequestOptions) {
    this.setMethod('GET');
    return this.request(url, config);
  }

  post(url: string, config?: IRequestOptions) {
    this.setMethod('POST');
    return this.request(url, config);
  }

  put(url: string, config?: IRequestOptions) {
    this.setMethod('PUT');
    return this.request(url, config);
  }

  patch(url: string, config?: IRequestOptions) {
    this.setMethod('PATCH');
    return this.request(url, config);
  }

  delete(url: string, config?: IRequestOptions) {
    this.setMethod('DELETE');
    return this.request(url, config);
  }

  head(url: string, config?: IRequestOptions) {
    this.setMethod('HEAD');
    return this.request(url, config);
  }

  options(url: string, config?: IRequestOptions) {
    this.setMethod('OPTIONS');
    return this.request(url, config);
  }

  private setMethod(method: AllowedFetchMethod) {
    this.config.method = method;
  }

  private request(
    url: string,
    config: IRequestOptions = {},
  ): Promise<Response | Error> {
    const { responseType, headers, json, form, query, ...rest } = config;

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

    const { method } = this.config;
    if (rest.body && (method === 'GET' || method === 'HEAD')) {
      throw new Error('`GET` or `HEAD` method can not have a body, use `query` instead')
    }

    let querystr;
    if (query && isObject(query)) {
      querystr = serialize(query);
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

    return fetch(url, { ...this.config, ...rest }).then((response) => {
      if (response.ok) {
        return this.resolveResponse(response);
      }
      throw response;
    }).catch((err) => {
      throw new Error(err.stack || err);
    });
  }

  private resolveResponse(response: Response) {
    if (!this.responseType) {
      return response
    }

    switch (this.responseType) {
      case 'json':
        return response.json();
      case 'text':
        return response.text();
      case 'blob':
        return response.blob();
      case 'arraybuffer':
        return response.arrayBuffer();
      case 'formdata':
        return response.formData();
      default:
        throw new Error('Invalid response type')
    }
  }
}

export default function http(baseUrl: string = '', config?: IRequestOptions) {
  return new GlobalFetch(baseUrl, config);
}

const request = http();
export const get = (url: string, config?: IRequestOptions) => request.get(url, config);
export const post = (url: string, config?: IRequestOptions) => request.post(url, config);
export const put = (url: string, config?: IRequestOptions) => request.put(url, config);
export const patch = (url: string, config?: IRequestOptions) => request.patch(url, config);
export const del = (url: string, config?: IRequestOptions) => request.delete(url, config);
export const head = (url: string, config?: IRequestOptions) => request.head(url, config);
export const options = (url: string, config?: IRequestOptions) => request.options(url, config);
