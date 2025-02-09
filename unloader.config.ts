import { defineConfig } from 'unloader'
import { Oxc } from './src/index'

export default defineConfig({
  plugins: [
    Oxc({
      transform: {
        target: 'es2015',
      },
    }),
  ],
})
