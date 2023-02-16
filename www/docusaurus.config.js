// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://mongo.bridge.codes',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bridge-codes', // Usually your GitHub org/user name.
  projectName: 'bridge-mongo', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
    [
      'docusaurus-preset-shiki-twoslash',
      {
        // Not sure how reliable this path is (it's relative from the preset package)?
        // None of the light themes had good support for `diff` mode, so had to patch my own theme
        themes: ['../../../min-light-with-diff', 'nord'],
      },
    ],
  ],
  plugins: [
    async function myPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS, AutoPrefixer & CSSNano.
          /* eslint-disable @typescript-eslint/no-var-requires */
          postcssOptions.plugins.push(require('tailwindcss'));
          postcssOptions.plugins.push(require('autoprefixer'));
          if (process.env.NODE_ENV === 'production') {
            postcssOptions.plugins.push(require('cssnano'));
          }
          /* eslint-enable @typescript-eslint/no-var-requires */
          return postcssOptions;
        },
      };
    },
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      docs: {
        sidebar: {
          autoCollapseCategories: false,
        },
      },
      navbar: {
        title: 'Bridge Mongo',
        logo: {
          alt: 'My Site Logo',
          src: 'img/bridge-mongo.svg',
          width: 30,
        },
        items: [
          {
            docId: 'intro',
            position: 'left',
            label: 'Docs',
            to: '/docs/intro',
          },
          {
            docId: 'quickstart',
            position: 'left',
            label: 'Quickstart',
            to: '/docs/quickstart',
          },

          {
            href: 'https://github.com/bridge-codes/bridge-mongo',
            position: 'right',
            className: 'header-social-link header-github-link',
            'aria-label': 'GitHub',
          },
          {
            href: 'https://twitter.com/bridge_codes',
            position: 'right',
            className: 'header-social-link header-twitter-link',
            'aria-label': 'Twitter',
          },
          {
            href: 'https://discord.gg/yxjrwm7Bfr',
            position: 'right',
            className: 'header-social-link header-discord-link',
            'aria-label': 'Discord',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/intro',
              },
              {
                label: 'Quickstart',
                to: '/docs/quickstart',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.com/invite/yxjrwm7Bfr',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/bridge_codes',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/bridge-codes/bridge-mongo',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
