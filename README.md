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
import http, { get, post } from 'global-fetch';

(async () => {
  const query = { userId: 1 };
  try {
    await get('http://jsonplaceholder.typicode.com/users', { query });
  } catch (e) {}

  // or all requests with the same server url
  const request = http('http://jsonplaceholder.typicode.com');
  await request.get('/users');
  await request.post('/post', {
    json: { title: 'foo', body: 'bar', userId: 1 }
  });
})();
```

By default, `GlobalFetch` resolves the response data as JSON. If any other formats you want to yield, do it like below.

```js
// Resolve response type as text
await get('./index.html', { responseType: 'text' });

// If response type is falsy value like `null`,
// response will be resolved as original data
await get('./index.html', { responseType: null });
```

```js
// request as query string when method is GET or HEAD
const query = { user_id: 1 };
await get('/users', { query }); // /users?user_id=1

// post JSON data
const json = { name: 'jiraiyame', age: 27 };
await post('/users', { json });

// post form data
const form = document.querySelector('form');
await post('/users', {
  body: new FormData(form),
});

// post data via url encoded request
const form = { foo: 1, bar: [1, 2, 3] };
await post('/users', { form });
```

## Interface

### `class GlobalFetch`

#### Constructor

```ts
constructor(baseUrl: string, config?: RequestInit);
```

### setBaseUrl(url)
- `url` &lt;string&gt; the API host of the resource

### setHeader(name, value)
- `name` &lt;string&gt; header field name
- `value` &lt;any&gt; header field value

### setHeaders(headers)
- `headers` &lt;Object&gt; custom header fields

### setToken(auth)
- `auth` &lt;string&gt; the credentials of the auth
- `auth: { token, type }`
  - `type` &lt;string&gt; the authentication scheme. Defaults to `Bearer`
  - `token` &lt;string&gt; the credentials of the auth

### setResponseType(responseType)
- `responseType` &lt;string | null&gt; the response data type will respond. Defaults to `json`

### get(url[, options])

### post(url[, options])

### put(url[, options])

### patch(url[, options])

### del(url[, options])

### head(url[, options])

### options(url[, options])

## License

MIT @ jiraiyame
