import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts' // 用于生成 .d.ts 类型声明
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
  build: {
    lib: {
      entry:'src/lib/index.ts',
      name: 'OpenlayersSerializer',
      fileName: (format) => `openlayers-serializer.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'vue','ol',/^ol\//], // 注意：正则把 ol 子模块也外部化], // 不要打包进来的依赖
      output: {
        globals: {
          react: 'React',
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    dts({ insertTypesEntry: true }) // 自动生成 index.d.ts
  ]
})