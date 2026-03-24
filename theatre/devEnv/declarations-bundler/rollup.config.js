import alias from '@rollup/plugin-alias'
import fs from 'fs'
import path from 'path'
import dts from 'rollup-plugin-dts'

const fromPrivatePackage = (s) => path.join(__dirname, '../..', s)

const config = ['studio', 'core'].map((which) => {
  const fromPackage = (s) => path.join(fromPrivatePackage(`${which}`), s)

  return {
    input: {
      [which]: fromPrivatePackage(`.temp/declarations/${which}/src/index.d.ts`),
    },
    output: {
      dir: fromPackage('dist'),
      entryFileNames: 'index.d.ts',
      format: 'es',
    },
    external: (s) => {
      if (
        s === '@tomorrowevening/theatre-dataverse' ||
        s.startsWith(
          `@tomorrowevening/theatre-${which === 'studio' ? 'core' : 'studio'}`,
        )
      ) {
        return true
      }

      // Don't externalize deep self-imports or shared — they must be inlined
      if (
        s.startsWith(`@tomorrowevening/theatre-${which}`) ||
        s.startsWith('@tomorrowevening/theatre-shared')
      ) {
        return false
      }

      if (s.startsWith('@theatre')) {
        return false
      }

      if (s.startsWith('/') || s.startsWith('./') || s.startsWith('../')) {
        return false
      }

      return true
    },

    plugins: [
      dts({
        respectExternal: true,
        compilerOptions: {preserveSymlinks: false},
        // Bundle all declarations into a single file
        bundleDeclarations: true,
      }),
      // Resolve deep subpath imports (e.g. @tomorrowevening/theatre-core/sequences/TheatreSequence)
      // to the .temp/declarations source so rollup-plugin-dts can inline them.
      {
        name: 'resolve-deep-theatre-imports',
        resolveId(source) {
          const selfPrefix = `@tomorrowevening/theatre-${which}/`
          const sharedPrefix = '@tomorrowevening/theatre-shared/'
          let resolved = null
          if (source.startsWith(selfPrefix)) {
            resolved = fromPrivatePackage(
              `.temp/declarations/${which}/src/${source.slice(
                selfPrefix.length,
              )}`,
            )
          } else if (source.startsWith(sharedPrefix)) {
            resolved = fromPrivatePackage(
              `.temp/declarations/shared/src/${source.slice(
                sharedPrefix.length,
              )}`,
            )
          }
          if (resolved && !resolved.endsWith('.d.ts')) {
            // Try as a direct .d.ts file first, then as a directory with index.d.ts
            if (fs.existsSync(resolved + '.d.ts')) {
              resolved += '.d.ts'
            } else if (fs.existsSync(path.join(resolved, 'index.d.ts'))) {
              resolved = path.join(resolved, 'index.d.ts')
            }
          }
          return resolved
        },
      },
      alias({
        entries: [
          {
            find: `@tomorrowevening/theatre-${which}`,
            replacement: fromPrivatePackage(`.temp/declarations/${which}/src`),
          },
          {
            find: '@tomorrowevening/theatre-shared',
            replacement: fromPrivatePackage('.temp/declarations/shared/src'),
          },
        ],
      }),
    ],
  }
})

export default config
