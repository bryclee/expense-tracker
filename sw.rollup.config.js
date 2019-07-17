import rollupTypescript from 'rollup-plugin-typescript';

export default {
  input: 'src/service-worker/index.ts',
  output: {
    file: 'build/sw.js',
    format: 'iife',
  },
  plugins: [rollupTypescript()],
};
