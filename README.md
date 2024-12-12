# sveltekit-demoapp

SvelteKit CRUD app monorepo using Turborepo.

## develop

### ndc_list.json

data source: https://lib.nittento.or.jp/helpndc.html

script:

```js
[...document.querySelectorAll('section:nth-of-type(3) tr')].map(e =>
  [...e.children].map(c => `"${c.textContent.trim()}"`).join(':')
).join(',');
```
