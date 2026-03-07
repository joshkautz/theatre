import path from 'path'
import * as esbuild from 'esbuild'
import {definedGlobals} from './definedGlobals'

export async function createBundles(watch: boolean) {
  for (const which of ['core', 'studio']) {
    const pathToPackage = path.join(__dirname, '../', which)
    const esbuildConfig: Parameters<typeof esbuild.context>[0] = {
      entryPoints: [path.join(pathToPackage, 'src/index.ts')],
      target: ['es6'],
      loader: {'.png': 'file', '.svg': 'dataurl'},
      bundle: true,
      sourcemap: true,
      supported: {
        // 'unicode-escapes': false,
        'template-literal': false,
      },
      define: {
        ...definedGlobals,
        __IS_VISUAL_REGRESSION_TESTING: 'false',
      },
      external: [
        '@tomorrowevening/theatre-dataverse',
        /**
         * Prevents double-bundling react.
         *
         * @remarks
         * Ideally we'd want to just bundle our own fixed version of react to keep things
         * simple, but for now we keep react external because we're exposing these
         * react-dependant API from \@tomorrowevening/theatre-studio:
         *
         * - `ToolbarIconButton`
         * - `IStudio['extend']({globalToolbar: {component}})`
         *
         * These are further exposed by \@tomorrowevening/theatre-r3f which provides `<Wrapper />`
         * as an API.
         *
         * It's probably possible to bundle our own react version and somehow share it
         * with the plugins, but that's not urgent atm.
         */
        // 'react',
        // 'react-dom',
        // 'styled-components',
      ],
    }

    if (which === 'core') {
      esbuildConfig.platform = 'neutral'
      esbuildConfig.mainFields = ['browser', 'module', 'main']
      esbuildConfig.target = ['firefox57', 'chrome58']
      esbuildConfig.conditions = ['browser', 'node']
    } else {
      // For studio build, make @tomorrowevening/theatre-core external to prevent double-bundling
      esbuildConfig.external!.push('@tomorrowevening/theatre-core')

      esbuildConfig.define!['process.env.NODE_ENV'] =
        JSON.stringify('production')

      esbuildConfig.minify = true
    }

    const ctx = await esbuild.context({
      ...esbuildConfig,
      outfile: path.join(pathToPackage, 'dist/index.js'),
      format: 'cjs',
    })

    const esmCtx = await esbuild.context({
      ...esbuildConfig,
      outfile: path.join(pathToPackage, 'dist/index.mjs'),
      format: 'esm',
    })

    if (watch) {
      await ctx.watch()
      await esmCtx.watch()
    } else {
      await ctx.rebuild()
      await ctx.dispose()
      await esmCtx.rebuild()
      await esmCtx.dispose()
    }
  }
}
