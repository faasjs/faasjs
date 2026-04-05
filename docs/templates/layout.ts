import { classNames, escapeHtml } from './partials.ts'

type LayoutOptions = {
  lang: string
  title: string
  description: string
  homeLink: string
  hasSidebar: boolean
  navbarHtml: string
  sidebarHtml: string
  contentHtml: string
  footerHtml?: string
  gaId: string
  adsScript: string
}

function escapeJs(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export function renderLayout(options: LayoutOptions): string {
  return `<!doctype html>
<html lang="${escapeHtml(options.lang)}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="generator" content="FaasJS Custom SSG" />
    <style>
      :root {
        --vp-c-bg: #fff;
      }

      [data-theme='dark'] {
        --vp-c-bg: #1b1b1f;
      }

      html,
      body {
        background-color: var(--vp-c-bg);
      }
    </style>
    <script>
      try {
        const useChoice = localStorage.getItem('vuepress-color-scheme');
        const systemStatus =
          'matchMedia' in window
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : false;

        if (useChoice === 'light') {
          document.documentElement.dataset.theme = 'light';
        } else if (useChoice === 'dark' || systemStatus) {
          document.documentElement.dataset.theme = 'dark';
        }
      } catch {}
    </script>
    <link rel="icon" href="/logo.jpg" />
    <title>${escapeHtml(options.title)}</title>
    <meta name="description" content="${escapeHtml(options.description)}" />
    <link rel="stylesheet" href="/assets/style.css" />
    <script async src="${escapeHtml(options.adsScript)}" crossorigin="anonymous"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(options.gaId)}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', '${escapeJs(options.gaId)}');
    </script>
  </head>
  <body>
    <div id="app">
      <div class="${classNames('vp-theme-container', 'external-link-icon', !options.hasSidebar && 'no-sidebar')}">
        <header class="vp-navbar" vp-navbar>
          <div class="vp-toggle-sidebar-button" title="toggle sidebar" aria-expanded="false" role="button" tabindex="0">
            <div class="icon" aria-hidden="true"><span></span><span></span><span></span></div>
          </div>
          <span>
            <a class="route-link" href="${escapeHtml(options.homeLink)}"><span class="vp-site-name" aria-hidden="true">FaasJS</span></a>
          </span>
          <div class="vp-navbar-items-wrapper">${options.navbarHtml}</div>
        </header>
        <div class="vp-sidebar-mask"></div>
        <aside class="vp-sidebar" vp-sidebar>${options.sidebarHtml}</aside>
        <main class="vp-page">
          <div vp-content>
            <div id="content">${options.contentHtml}</div>
          </div>
          ${options.footerHtml ?? ''}
        </main>
      </div>
    </div>
    <script src="/assets/app.js" defer></script>
  </body>
</html>`
}
