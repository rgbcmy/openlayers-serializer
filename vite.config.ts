import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts' // 用于生成 .d.ts 类型声明
import path from 'path';
export default defineConfig({
  build: {
    lib: {
      entry:{
        serializer: path.resolve(__dirname, 'src/serializer/index.ts'),
        common: path.resolve(__dirname, 'src/common/index.ts'),
        dto: path.resolve(__dirname, 'src/dto/index.ts')
      },
      name: 'OpenlayersSerializer',
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'vue'], // 不要打包进来的依赖
      output: {
        globals: {
          react: 'React',
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    dts({ insertTypesEntry: true }) // 自动生成 index.d.ts
  ]
})