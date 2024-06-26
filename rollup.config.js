import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: './src/index.ts',
  plugins: [typescript()],
  output: [
    {
      file: './dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      assetFileNames: '[name].esm.js',
    },
    {
      file: './dist/index.js',
      format: 'umd',
      name: 'Autolang',
      sourcemap: true,
    },
  ],
})
