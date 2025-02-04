import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '조니 블로그',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://johnycho.github.io', // GitHub Pages URL
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/', // 리포지토리 이름
  deploymentBranch: 'gh-pages', // 배포 브랜치
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'johnycho', // GitHub 사용자명
  projectName: 'johny-dev', // GitHub 리포지토리 이름

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/johnycho/johny-dev/edit/main/',
        },
        blog: {
          routeBasePath: '/', // 블로그를 루트 경로로 변경
          tagsBasePath: 'tags',
          archiveBasePath: 'archive',
          authorsBasePath: 'authors',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/johnycho/johny-dev/edit/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false, // 다크/라이트 모드 전환 허용 (true로 설정하면 버튼이 사라짐)
      respectPrefersColorScheme: false, // OS 설정과 관계없이 다크 모드 강제 적용
    },
    navbar: {
      title: '조니 개발 블로그',
      logo: {
        alt: 'Johny Dev Logo',
        src: 'https://github.com/johnycho.png',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'tutorialSidebar',
        //   position: 'left',
        //   label: 'Tutorial',
        // },
        {
          to: '/tags',  // 태그 페이지 추가
          label: 'Tags',
          position: 'left',
        },
        {
          to: "/archive",
          label: "Archive",
          position: "left"
        },
        {
          href: 'https://github.com/johnycho',
          // label: 'GitHub',
          position: 'right',
          className: 'navbar-github-logo',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Posts',
          items: [
            {
              label: 'Hello',
              to: '/johny-dev-blog-launched',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/johnycho',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Johny Cho. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java'], // ✅ Java 코드 하이라이트 활성화
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
