import rollupTypescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';

const buildDirFiles = fs.readdirSync('build');
const precacheManifest = buildDirFiles.find(file =>
  file.startsWith('precache-manifest'),
);

export default {
  input: 'src/service-worker/index.ts',
  output: {
    file: 'build/sw.js',
    format: 'iife',
  },
  plugins: [
    resolve(),
    replace({
      PRECACHE_MANIFEST: precacheManifest,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    rollupTypescript(),
    terser(),
  ],
};
