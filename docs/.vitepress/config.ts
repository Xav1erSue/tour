import path from 'path';
import { defineConfig } from 'vitepress';
import { vitepressDemoPlugin } from 'vitepress-demo-plugin';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Tour',
  description: '一个跨平台的引导组件',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '文档',
        link: 'document',
        activeMatch: '/document/',
      },
    ],
    sidebar: {
      '/document/': {
        base: '/document/',
        items: [
          {
            text: '组件总览',
            base: '/document',
            link: '/',
          },
          {
            text: '基础使用',
            base: '/document',
            link: '/basic-usage',
          },
        ],
      },
    },
    outline: {
      level: 'deep',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Xav1erSue/tour' },
    ],
  },
  lastUpdated: true,
  markdown: {
    config: (md) => {
      md.use(vitepressDemoPlugin);
    },
  },
  vite: {
    resolve: {
      alias: {
        tour: path.resolve(__dirname, '../../src/index.ts'),
      },
    },
  },
});
