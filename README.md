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
import * as http from 'global-fetch';

(async () => {
  const headers = new Headers();
  try {
    const r = await http.get('http://jsonplaceholder.typicode.com/users', { headers });
  } catch (e) {
    console.error('err: ', e);
  }
})();
```

By default, `GlobalFetch` resolves the response text as JSON if response data type matches. If any other formats you want to yield, you can do it like below.

```js
await(await http.get('./index.html')).text();
```

Query and post data usage example:

```js
// query data via parameters
const query = { user_id: 1 };
await http.get('/users', { query }); // query url: /users?user_id=1

// post JSON data
const json = { username: 'jiraiyame', age: 27 };
await http.post('/create_user', { json });

// post form data via `FormData` API
const form = document.querySelector('form');
await http.post('/create_profile', {
  body: new FormData(form),
});

// post form data via serialized form fields
// form `enctype` attribute is `application/x-www-form-urlencoded`
const form = { foo: 1, bar: [1, 2, 3] };
await http.post('/submit', { form });
```

## API

### class:GlobalFetch

```js
import http from 'global-fetch';

const r = http(url, options);
```

### r.setBaseUrl(url)
- `url` &lt;string&gt; the API host of the resource

### r.setHeaders(headers)
- `headers` &lt;Object&gt; custom header fields

### r.setHeader(name, value)
- `name` &lt;string&gt; header field name
- `value` &lt;any&gt; header field value

### r.setToken(auth)
- `auth` &lt;string&gt; the credentials of the auth
- `auth: { token, type }`
  - `type` &lt;string&gt; the authentication scheme. Defaults to `Bearer`
  - `token` &lt;string&gt; the credentials of the auth

### r.get(url, options)
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.post(url, options)
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.put(url, options)
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.patch(url, options)
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.del(url, options)
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.head(url, options)
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.options(url, options)
- `url` &lt;string&gt; url or path of the resource
- `options` &lt;Object&gt; custom settings apply to the request

## License

MIT @ jiraiyame
