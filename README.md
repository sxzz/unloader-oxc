# unloader-oxc [![npm](https://img.shields.io/npm/v/unloader-oxc.svg)](https://npmjs.com/package/unloader-oxc)

[![Unit Test](https://github.com/sxzz/unloader-oxc/actions/workflows/unit-test.yml/badge.svg)](https://github.com/sxzz/unloader-oxc/actions/workflows/unit-test.yml)

[Oxc](https://oxc.rs/) integration for [unloader](https://github.com/sxzz/unloader).

## Install

```bash
npm i unloader-oxc
```

## Usage

```ts
// unloader.config.ts
import { defineConfig } from 'unloader'
import { Oxc } from 'unloader-oxc'

export default defineConfig({
  plugins: [
    Oxc({
      transform: {
        // target: 'es2015',
        // ...
      },
      resolve: {
        // ...
      },
    }),
  ],
})
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2025 [三咲智子 Kevin Deng](https://github.com/sxzz)
