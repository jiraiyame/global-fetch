# global-fetch

Promise-based HTTP client built on top of the global fetch API.

## Install

```sh
yarn add global-fetch
```
or
```sh
npm install --save global-fetch
```

## Usage

```js
import * as http from 'global-fetch';

(async () => {
  const headers = { foo: 1 };
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

Query and post data example:

```js
// query with parameters
const query = { foo: 1, bar: 2 };
await http.get('/users', { query });

// post JSON data
const json = { username: 'jiraiyame', age: 27 };
await http.post('/createUser', { json });

// post formData
const form = document.querySelector('form');
await http.post('/submit', {
  body: new FormData(form),
});
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
- auth &lt;string&gt; the credentials of the auth
- auth: { token, type }
  - type &lt;string&gt; the authentication scheme. Defaults to `Bearer`
  - token &lt;string&gt; the credentials of the auth

### r.get(url, options)
- `url` &lt;string&gt; url of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.post(url, options)
- `url` &lt;string&gt; url of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.put(url, options)
- `url` &lt;string&gt; url of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.patch(url, options)
- `url` &lt;string&gt; url of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.del(url, options)
- `url` &lt;string&gt; url of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.head(url, options)
- `url` &lt;string&gt; url of the resource
- `options` &lt;Object&gt; custom settings apply to the request

### r.options(url, options)
- `url` &lt;string&gt; url of the resource
- `options` &lt;Object&gt; custom settings apply to the request

## License

MIT @ jiraiyame
