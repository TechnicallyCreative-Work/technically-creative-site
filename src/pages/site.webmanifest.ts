import appleTouchIcon from '~/assets/favicons/apple-touch-icon.png';
import icon192 from '~/assets/favicons/icon-192.png';
import icon256 from '~/assets/favicons/icon-256.png';

export const prerender = true;

const manifest = {
  name: 'Technically Creative',
  short_name: 'Tech Creative',
  description:
    'Creative audio, project leadership, workflow automation, and workshops for teams that need reliable delivery.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#0a0a14',
  theme_color: '#00c8ff',
  icons: [
    {
      src: icon192.src,
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: icon256.src,
      sizes: '256x256',
      type: 'image/png',
    },
    {
      src: appleTouchIcon.src,
      sizes: '180x180',
      type: 'image/png',
    },
  ],
};

export function GET() {
  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
