// Single source of truth for TechCre8's public social URLs.
// Footer, News page follow cards, and JSON-LD (OrganizationSchema) all import from here
// so the site can't drift out of sync with the live accounts again.
// Handles should match the Channel Registry / Buffer channels.

export const SOCIAL_URLS = {
  linkedin: 'https://www.linkedin.com/company/technically-creative-llc/',
  instagram: 'https://www.instagram.com/tech.cre8/',
  // Canonical page URL. The old facebook.com/share/... link is a share-style URL
  // that redirects unreliably on mobile (app deep-linking).
  facebook: 'https://www.facebook.com/people/Technically-Creative/61581256443170/',
  youtube: 'https://www.youtube.com/@rootcauseriff',
} as const;
