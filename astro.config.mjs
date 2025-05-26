import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://approved-offers.com',
  integrations: [
    sitemap(),
    robotsTxt(),
    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
        sortAttributes: true,
        sortClassName: true,
      },
      Image: {
        quality: 80,
        format: ['avif', 'webp'],
      },
      JavaScript: {
        compress: {
          passes: 2,
          dead_code: true,
          drop_console: true,
          drop_debugger: true,
          keep_classnames: false,
          keep_fnames: false,
          unused: true,
        },
      },
      SVG: true,
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
    splitting: true,
    prerender: true,
  },
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'form-utils': [
              './src/lib/form-utils.ts',
              './src/lib/form-validation.ts',
              './src/lib/form-state.ts',
            ],
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          dead_code: true,
          passes: 2,
        },
      },
    },
    ssr: {
      noExternal: ['@astrojs/sitemap', 'astro-robots-txt'],
    },
    optimizeDeps: {
      exclude: ['@astrojs/sitemap', 'astro-robots-txt'],
    },
  },
  headers: {
    '/*': [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      },
      {
        key: 'Content-Security-Policy',
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://api.iconify.design; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: https://api.iconify.design https://a.impactradius-go.com https://imp.pxf.io; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-src 'none'; object-src 'none'; base-uri 'self';",
      },
    ],
  },
});
