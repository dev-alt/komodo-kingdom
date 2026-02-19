import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import type { PluginOption } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [...react()]

  if (mode === 'development') {
    plugins.push(inspectAttr())
  }

  return {
    base: './',
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
