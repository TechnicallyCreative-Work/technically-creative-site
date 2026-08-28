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
      text: 'Portfolio',
      links: [
        { text: 'Music & Sound Design', href: getPermalink('/portfolio#music-sound-design') },
        { text: 'Sound & Audio Engineering', href: getPermalink('/portfolio#sound-audio-engineering') },
        { text: 'Ableton Training', href: getPermalink('/portfolio#ableton-training') },
        { text: 'Graphic Design & Visual Art', href: getPermalink('/portfolio#graphic-design') },
        { text: 'Automation', href: getPermalink('/portfolio#automation') },
        { text: 'Project Management', href: getPermalink('/portfolio#project-management') },
        { text: 'Video Editing', href: getPermalink('/portfolio#video-editing') },
        { text: 'Gear Consultation', href: getPermalink('/portfolio#gear-consultation') },
        { text: 'Performance / Live Sound', href: getPermalink('/portfolio#performance-live-sound') },
        { text: 'Technology Efficiency', href: getPermalink('/portfolio#technology-efficiency') },
        { text: 'Signal & Space', href: getPermalink('/portfolio#signal-space') },
      ],
    },
    {
      text: 'Tools',
      href: getPermalink('/tools'),
    },
    {
      text: 'News',
      href: getBlogPermalink(),
    },
    {
      text: 'About',
      links: [
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
    },
    {
      text: 'Products',
      links: [
        { text: 'Ableton Training', href: getPermalink('/products#ableton-training') },
        { text: 'Nature Series Prints', href: getPermalink('/products#nature-series') },
        { text: 'Dark & Fan Art', href: getPermalink('/products#dark-art') },
        { text: 'Browse All on Gumroad', href: 'https://techcre8.gumroad.com' },
      ],
    },
    {
      text: 'Local Services',
      links: [
        { text: 'Graphic Design & Commissions', href: getPermalink('/local-services#graphic-design') },
        { text: 'Online Consulting', href: getPermalink('/local-services#services') },
        { text: 'Indianapolis Local Services', href: getPermalink('/local-services#local-services') },
      ],
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
