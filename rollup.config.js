import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import cleanup from 'rollup-plugin-cleanup';
import dts from 'rollup-plugin-dts';
import lib from './package.json' with { type: 'json' };

const pkgName = 'lit-toaster';
const year = new Date().getFullYear();
const version = lib.version;
const author = lib.author;
const license = 'MIT License';
const banner = `/*! ${pkgName} v${version} Copyright (c) ${year} ${author} and contributors ${license}*/`;

export default [
  // Browser build (ESM)
  {
    input: 'src/index.ts',
    external: ['lit', 'lit/decorators.js'],
    output: {
      file: `dist/${pkgName}.js`,
      format: 'esm',
      sourcemap: false,
      banner,
    },
    plugins: [
      del({ targets: 'dist/*' }),
      resolve(),
      typescript({
        sourceMap: false,
        noEmit: true,
        tsconfig: './tsconfig.json',
      }),
      cleanup({
        comments: 'none',
      }),
      del({
        targets: ['dist/**/*.map', 'dist/**/*.d.ts', 'dist/testing'],
        hook: 'writeBundle',
      }),
    ],
  },
  // Declaration file
  {
    input: 'src/typings.ts',
    output: {
      file: 'dist/index.d.ts', // Combine all typings into one single file
      format: 'esm',
    },
    plugins: [dts()],
  },
];
