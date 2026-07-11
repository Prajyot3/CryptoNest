import './globals.css'

export const metadata = {
  title: 'CryptoNest - Advanced Hybrid Cryptography',
  description: 'CryptoNest provides high-speed hybrid encryption and key management. Encrypt files with local RSA-2048 keys or password phrase.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                var stored = localStorage.getItem('theme');
                var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                var isDark = stored ? stored === 'dark' : prefersDark;
                var root = document.documentElement;
                if (isDark) {
                  root.classList.add('dark');
                } else {
                  root.classList.remove('dark');
                }
              } catch (e) {}
            })();
          ` }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              if (window.__themeHandlerInstalled) return; // prevent duplicate listeners on HMR
              window.__themeHandlerInstalled = true;
              function setTheme(next){
                try { localStorage.setItem('theme', next); } catch(e) {}
                var root = document.documentElement;
                if(next === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
              }
              function getTheme(){
                try { var stored = localStorage.getItem('theme'); if (stored) return stored; } catch(e) {}
                return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
              }
              // Delegated click handler so it works regardless of render timing
              document.addEventListener('click', function(e){
                var el = e.target.closest && e.target.closest('#theme-toggle');
                if (!el) return;
                var current = getTheme();
                var next = current === 'dark' ? 'light' : 'dark';
                setTheme(next);
              }, true);
            })();
          `}}
        />
      </head>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        {/* Global Top-Right Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <button
            id="theme-toggle"
            aria-label="Toggle theme"
            title="Toggle theme"
            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-md ring-1 ring-gray-200 dark:ring-gray-700 backdrop-blur hover:bg-white dark:hover:bg-gray-700 transition-colors"
          >
            {/* Moon icon (shown in light mode) */}
            <svg className="h-5 w-5 block dark:hidden" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            {/* Sun icon (shown in dark mode) */}
            <svg className="h-5 w-5 hidden dark:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10-9h-2v3h2V4zm7.04.46l-1.41-1.41-1.8 1.79 1.41 1.41 1.8-1.79zM17 11v2h3v-2h-3zm-5 5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-1 4h2v-3h-2v3zm7.66-2.34l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM4.96 19.54l1.41 1.41 1.8-1.79-1.41-1.41-1.8 1.79z" />
            </svg>
          </button>
        </div>
        {children}
      </body>
    </html>
  )
}