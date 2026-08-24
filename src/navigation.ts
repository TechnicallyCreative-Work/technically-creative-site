import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Services',
      href: getPermalink('/services'),
    },
    {
      text: 'Portfolio',
      href: getPermalink('/portfolio'),
    },
    {
      text: 'Tools',
      href: getPermalink('/notemapper'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
    {
      text: 'Products',
      href: getPermalink('/store'),
    },
    {
      text: 'Local Services',
      href: getPermalink('/store'),
    },
  ],
  actions: [{ text: 'Start a Project', href: getPermalink('/contact') }],
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
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/technically-creative-llc/' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/technicallycreativellc/' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://www.youtube.com/@rootcauseriff' },
    { ariaLabel: 'Email', icon: 'tabler:mail', href: 'mailto:hello@technicallycreative.work' },
  ],
  footNote: 
    `&copy; ${new Date().getFullYear()} Technically Creative LLC. All rights reserved.`
  ,
};
