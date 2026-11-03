import type { ImageMetadata } from 'astro';
import markMixing from '~/assets/images/tiles/logo-waveform.png';
import markSoundDesign from '~/assets/images/tiles/logo-sound-design-foley.png';
import markMusicTech from '~/assets/images/tiles/logo-music-tech-consulting.png';
import markProjectManagement from '~/assets/images/tiles/logo-clickup.png';
import markAutomation from '~/assets/images/tiles/logo-gears.png';
import markWorkshops from '~/assets/images/tiles/logo-mic.png';

// One source of truth for the six service offerings. The Services page shows the long copy with prices,
// the home page "Highlights" shows the short copy. Both render as pads (CategoryGrid).
type Accent = 'cyan' | 'green' | 'pink' | 'purple';

export interface ServiceOffering {
  slug: string;
  title: string;
  /** Short line for the home page. */
  summary: string;
  /** Long copy with pricing for the Services page. */
  description: string;
  /** Label for the pad's small caption line on the Services page. */
  meta: string;
  logo: ImageMetadata;
  accent: Accent;
}

export const serviceOfferings: ServiceOffering[] = [
  {
    slug: 'mixing-mastering',
    title: 'Mixing & Mastering',
    summary: 'Release-ready mixes and masters that translate across all playback systems.',
    description:
      'Singles start at $249 with EP and album bundles. Expect organized sessions, a detailed mix report, and unlimited notes for 10 days.',
    meta: 'Mixing workflow',
    logo: markMixing,
    accent: 'green',
  },
  {
    slug: 'sound-design-foley',
    title: 'Sound Design & Foley',
    summary: 'Custom soundscapes and immersive audio for film, games, and interactive experiences.',
    description:
      'Custom audio textures for games, film, and trailers. Project bundles start at $350 with delivery-ready stems and alternate mixes.',
    meta: 'Sound design process',
    logo: markSoundDesign,
    accent: 'pink',
  },
  {
    slug: 'music-technology-consulting',
    title: 'Music Technology Consulting',
    summary: 'Expert guidance on DAWs, studio setup, signal flow, and audio software optimization.',
    description:
      'Studio audits, systems roadmaps, and coaching subscriptions start at $350 per month with async support between sessions.',
    meta: 'Consulting details',
    logo: markMusicTech,
    accent: 'purple',
  },
  {
    slug: 'project-management-consulting',
    title: 'Project Management Consulting',
    summary: 'Structured workflows and Agile methodologies to keep your creative projects on track and on budget.',
    description:
      'Sprint planning intensives from $680, launch management packages, and fractional retainers for ongoing oversight.',
    meta: 'Delivery playbook',
    logo: markProjectManagement,
    accent: 'cyan',
  },
  {
    slug: 'workflow-automation',
    title: 'Workflow Automation',
    summary: 'Automate repetitive tasks, streamline client intake, and optimize your creative pipeline for efficiency.',
    description:
      'ClickUp, Airtable, and n8n builds that automate intake, approvals, and reporting. Discovery-to-build roadmaps start at $600.',
    meta: 'Automation roadmap',
    logo: markAutomation,
    accent: 'cyan',
  },
  {
    slug: 'public-speaking-workshops',
    title: 'Public Speaking Workshops',
    summary:
      'Engaging presentations and hands-on training on music technology, audio production, and project management for creatives.',
    description:
      'Keynotes and interactive workshops on creative discipline, delivery, and emerging audio tech. Sessions begin at $750.',
    meta: 'Workshop formats',
    logo: markWorkshops,
    accent: 'purple',
  },
];
