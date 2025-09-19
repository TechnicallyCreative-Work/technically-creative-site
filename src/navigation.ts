import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Services',
      links: [
        {
          text: 'Mixing & Mastering',
          href: getPermalink('/services/mixing-mastering'),
        },
        {
          text: 'Music Technology Consulting',
          href: getPermalink('/services/music-technology-consulting'),
        },
        {
          text: 'Project Management Consulting',
          href: getPermalink('/services/project-management-consulting'),
        },
        {
          text: 'Public Speaking & Workshops',
          href: getPermalink('/services/public-speaking-workshops'),
        },
        {
          text: 'Sound Design & Foley',
          href: getPermalink('/services/sound-design-foley'),
        },
        {
          text: 'Workflow Automation',
          href: getPermalink('/services/workflow-automation'),
        },
      ],
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Credentials',
      href: getPermalink('/credentials'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: 'Download', href: 'https://github.com/arthelokyo/astrowind', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Services',
      links: [
        { text: 'Mixing & Mastering', href: getPermalink('/services/mixing-mastering') },
        { text: 'Sound Design & Foley', href: getPermalink('/services/sound-design-foley') },
        { text: 'Music Technology Consulting', href: getPermalink('/services/music-technology-consulting') },
        { text: 'Project Management Consulting', href: getPermalink('/services/project-management-consulting') },
        { text: 'Workflow Automation', href: getPermalink('/services/workflow-automation') },
        { text: 'Public Speaking & Workshops', href: getPermalink('/services/public-speaking-workshops') },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'Home', href: getPermalink('/') },
        { text: 'About', href: getPermalink('/about') },
        { text: 'Credentials', href: getPermalink('/credentials') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Services Overview', href: getPermalink('/services') },
        { text: 'Terms of Service', href: getPermalink('/terms') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'Services', href: getPermalink('/services') },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  socialLinks: [
    { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: '#' },
    { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: '#' },
  ],
  footNote: 
    `&copy; ${new Date().getFullYear()} . All rights reserved.`
  ,
};