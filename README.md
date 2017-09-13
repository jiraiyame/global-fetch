# global-fetch

Promise-based HTTP client built on top of the global fetch API.

## Installing

```sh
yarn add global-fetch

# or via npm
npm install --save global-fetch
```

## Examples

```js
import * as request from 'global-fetch';

(async () => {
  const query = { userId: 1 };
  try {
    await request.get('http://jsonplaceholder.typicode.com/users', { query });
  } catch (e) {
    console.error('err: ', e);
  }

  // or all requests with the same server url
  const http = request.http('http://jsonplaceholder.typicode.com');
  const json = { title: 'foo', body: 'bar', userId: 1 };
  await http.get('/users');
  await http.post('/post', { json });
})();
```

By default, `GlobalFetch` resolves the response data as JSON. If any other formats you want to yield, do it like below.

```js
// resolve response type as text alone
await http.get('./index.html', { responseType: 'text' });

// or set response type to `null`, resolve the original response data
await(await http.get('./index.html', { responseType: null })).text();
```

Query and post data usage example:

```js
// request as query string when method is GET or HEAD
const query = { user_id: 1 };
await http.get('/users', { query }); // /users?user_id=1

// post JSON
const json = { name: 'jiraiyame', age: 27 };
await http.post('/users', { json });

// post form
const form = document.querySelector('form');
await http.post('/users', {
  body: new FormData(form),
});

// post data via url encoded request
const form = { foo: 1, bar: [1, 2, 3] };
await http.post('/users', { form });
```

## API

### class:GlobalFetch

```js
import http from 'global-fetch';

const r = http(baseUrl, options);
```

### r.setBaseUrl(url)
- `url` &lt;string&gt; the API host of the resource

### r.setHeader(name, value)
- `name` &lt;string&gt; header field name
- `value` &lt;any&gt; header field value

### r.setHeaders(headers)
- `headers` &lt;Object&gt; custom header fields

### r.setToken(auth)
- `auth` &lt;string&gt; the credentials of the auth
- `auth: { token, type }`
  - `type` &lt;string&gt; the authentication scheme. Defaults to `Bearer`
  - `token` &lt;string&gt; the credentials of the auth

### r.setResponseType(responseType)
- `responseType` &lt;string | null&gt; the response data type will respond. Defaults to `json`

### r.get(url[, options])
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.post(url[, options])
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.put(url[, options])
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.patch(url[, options])
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.del(url[, options])
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.head(url[, options])
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.options(url[, options])
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

## License

MIT @ jiraiyame
