import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
      icon: 'tabler:home',
    },
    {
      text: 'Services',
      href: getPermalink('/services'),
      icon: 'tabler:briefcase',
    },
    {
      text: 'Portfolio',
      href: getPermalink('/portfolio'),
      icon: 'tabler:layout-grid',
    },
    {
      text: 'Tools',
      href: getPermalink('/tools'),
      icon: 'tabler:tool',
    },
    {
      text: 'News',
      href: getBlogPermalink(),
      icon: 'tabler:news',
    },
    {
      text: 'About',
      href: getPermalink('/about'),
      icon: 'tabler:info-circle',
    },
    {
      text: 'Products',
      href: getPermalink('/products'),
      icon: 'tabler:shopping-bag',
    },
    {
      text: 'Local Services',
      href: getPermalink('/local-services'),
      icon: 'tabler:map-pin',
    },
  ],
  actions: [
    { text: 'Log In', href: getPermalink('/login') },
    { text: 'Start a Project', href: getPermalink('/contact') },
  ],
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
      title: 'Shop',
      links: [
        { text: 'Products', href: getPermalink('/products') },
        { text: 'Local Services', href: getPermalink('/local-services') },
        { text: 'Tools', href: getPermalink('/tools') },
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
        { text: 'News', href: getBlogPermalink() },
        { text: 'Terms of Service', href: getPermalink('/terms') },
        { text: 'Privacy Policy', href: getPermalink('/privacy') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Home', href: getPermalink('/') },
    { text: 'Services', href: getPermalink('/services') },
    { text: 'News', href: getBlogPermalink() },
    { text: 'Contact', href: getPermalink('/contact') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/technically-creative-llc/' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/technicallycreativellc/' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/share/19Pu1jnFMj/' },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: 'https://www.youtube.com/@rootcauseriff' },
    { ariaLabel: 'Discord', icon: 'tabler:brand-discord', href: 'https://discord.gg/8hGAgFkWc' },
    { ariaLabel: 'Email', icon: 'tabler:mail', href: 'mailto:hello@technicallycreative.work' },
  ],
  footNote: 
    `&copy; ${new Date().getFullYear()} Technically Creative LLC. All rights reserved.`
  ,
};
