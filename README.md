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

## Development

```sh
> git clone https://github.com/jiraiyame/global-fetch
> cd global-fetch
> yarn && yarn start
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

## License

MIT @ jiraiya
