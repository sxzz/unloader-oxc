import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { ResolverFactory, type NapiResolveOptions } from 'oxc-resolver'
import { transform, type TransformOptions } from 'oxc-transform'
import { createFilter, type FilterPattern } from 'unplugin-utils'
import type { Plugin } from 'unloader'

export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
  transform?: Omit<TransformOptions, 'sourcemap'>
  resolve?: NapiResolveOptions
  sourcemap?: boolean
}

export type OptionsResolved = Required<Options>

export function resolveOptions(options: Options): OptionsResolved {
  return {
    include: options.include || [/\.[cm]?tsx?$/],
    exclude: options.exclude || [],
    transform: options.transform || {},
    resolve: options.resolve || {},
    sourcemap: options.sourcemap ?? true,
  }
}

export function Oxc(userOptions: Options = {}): Plugin {
  const options = resolveOptions(userOptions)
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'oxc',

    options(config) {
      config.sourcemap ||= options.sourcemap
    },
    async resolveId(source, importer, { conditions }) {
      if (!importer) return
      const resolver = new ResolverFactory({
        conditionNames: conditions,
        extensions: ['.ts', '.mts', '.cts', '.tsx'],
        ...options.resolve,
      })
      const directory = path.dirname(fileURLToPath(importer))
      const resolved = await resolver.async(directory, source)

      if (resolved.path) {
        const format = resolved.path.endsWith('.cts')
          ? 'commonjs'
          : resolved.path.endsWith('.mts')
            ? 'module'
            : (resolved.moduleType as 'module' | 'commonjs' | undefined)
        return {
          id: pathToFileURL(resolved.path).href,
          format,
        }
      }
    },

    async load(id, { format }) {
      if (!filter(id)) return

      const filepath = fileURLToPath(id)
      const contents = await readFile(filepath, 'utf8')

      const result = transform(filepath, contents, {
        sourcemap: options.sourcemap,
        ...options.transform,
      })
      if (result.errors.length)
        throw new SyntaxError(
          result.errors.map((error) => error.message).join('\n'),
        )

      return { code: result.code, map: result.map, format: format || 'module' }
    },
  }
}
