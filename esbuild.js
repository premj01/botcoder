const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',

  setup(build) {
    build.onStart(() => {
      console.log('[watch] build started');
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(`    ${location.file}:${location.line}:${location.column}:`);
      });
      console.log('[watch] build finished');
    });
  },
};

async function main() {
  const backend = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
    plugins: [esbuildProblemMatcherPlugin],
  });

  const frontend = await esbuild.context({
    entryPoints: ['src/webview/index.tsx'],
    bundle: true,
    format: 'esm',
    target: ['es2020'],
    minify: production,
    sourcemap: !production,
    outfile: 'dist/webview.js',
    define: { 'process.env.NODE_ENV': production ? '"production"' : '"development"' },
    loader: { '.ts': 'ts', '.tsx': 'tsx' },
    logLevel: 'silent',
  });

  if (watch) {
    await backend.watch();
    await frontend.watch();
    console.log('[watch] both builds started');
  } else {
    await backend.rebuild();
    await frontend.rebuild();
    await backend.dispose();
    await frontend.dispose();
    console.log('[build] both builds complete');
  }
}


main().catch(e => {
  console.error(e);
  process.exit(1);
});
