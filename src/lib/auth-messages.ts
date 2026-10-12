import type { AuthError } from '@supabase/supabase-js';

// Turns Supabase auth errors into something a first-time visitor can act on.
// Raw messages like "Invalid login credentials" or "email rate limit exceeded"
// read like bugs; unknown codes fall back to Supabase's own message.
export function friendlyAuthError(error: Pick<AuthError, 'code' | 'message' | 'name'>): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'Incorrect email or password.';
    case 'email_not_confirmed':
      return 'Please confirm your email first — check your inbox (and spam folder) for the confirmation link.';
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'email_address_invalid':
      return "That email address doesn't look valid. Please double-check it.";
    case 'signup_disabled':
      return 'Sign-ups are temporarily closed. Please try again later.';
    case 'same_password':
      return 'Your new password must be different from your current one.';
    case 'user_already_exists':
      return 'An account with this email already exists. Try logging in or resetting your password.';
  }

  if (error.name === 'AuthRetryableFetchError') {
    return "Couldn't reach the server. Check your connection and try again.";
  }

  return error.message || 'Something went wrong. Please try again.';
}

// Messages for the `?error=` / `?notice=` flags that /api/auth/callback and the
// password-reset flow redirect back with. Looked up by key (never echoed from the
// URL) so a crafted link can't inject arbitrary text into the page.
export const LOGIN_FLAG_MESSAGES: Record<string, { kind: 'error' | 'notice'; text: string }> = {
  confirmation_failed: {
    kind: 'notice',
    text: "We couldn't finish signing you in from that link — this happens when it's opened in a different browser or device than you signed up on. Your email is probably already confirmed, so try logging in below.",
  },
  link_expired: {
    kind: 'error',
    text: 'That link has expired or was already used. Log in below, or request a new one.',
  },
  missing_code: {
    kind: 'error',
    text: "That link didn't look right. Log in below, or request a new confirmation email.",
  },
};

export const RESET_FLAG_MESSAGES: Record<string, string> = {
  link_expired:
    'That reset link has expired or was already used (or was opened in a different browser). Request a new one below.',
};
