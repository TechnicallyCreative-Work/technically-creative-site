import { getPermalink, getBlogPermalink } from './utils/permalinks';
import { SOCIAL_URLS } from './data/social';

// Shared with the gated "Join the Discord" link on /account — keep in sync
// if the invite is ever rotated.
export const DISCORD_INVITE_URL = 'https://discord.gg/8hGAgFkWc';

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
      text: 'Membership',
      href: getPermalink('/membership'),
      icon: 'tabler:star',
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
  loginAction: { text: 'Log In', href: getPermalink('/login'), icon: 'tabler:login' },
  actions: [
    { text: 'Start a Project', href: getPermalink('/contact'), icon: 'tabler:rocket' },
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
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: SOCIAL_URLS.linkedin },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: SOCIAL_URLS.instagram },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: SOCIAL_URLS.facebook },
    { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: SOCIAL_URLS.youtube },
    // Discord intentionally left off the public footer — it's a paid-member
    // perk, surfaced only on /account once membership_tier === 'paid'.
    { ariaLabel: 'Email', icon: 'tabler:mail', href: 'mailto:hello@technicallycreative.work' },
  ],
  footNote: 
    `&copy; ${new Date().getFullYear()} Technically Creative LLC. All rights reserved.`
  ,
};
