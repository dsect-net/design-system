import { useState, type FormEvent, type ReactNode } from 'react';

/**
 * Auth — `.sign-in` from components.css, canonised from the Nebula login.
 *
 * The one sign-in screen for every app: centred card, the app's mark, name
 * and subtitle, a segmented Email | Passphrase switch, provider buttons
 * under an "or" rule, and two quiet footer lines. The component owns the
 * shape and the states (default, field error, form error, submitting,
 * forgot); the app owns the wiring — handlers that return promises get
 * the busy state for free, and a rejected handler surfaces the same
 * plain-language errors the source screen uses.
 *
 * Methods are configuration, not restyles: turn any of them off and the
 * rest keep their shape. With a single credential method left, the
 * segmented switch disappears.
 */

export type SignInMode = 'email' | 'passphrase';

export interface SignInMethods {
  /** DSECT account email + password. Default true. */
  email?: boolean;
  /** Shared hub passphrase (legacy fallback). Default true. */
  passphrase?: boolean;
  /** "Sign in with Google" provider button. Default true. */
  google?: boolean;
  /** "Sign in with Tailscale" provider button. Default true. */
  tailscale?: boolean;
}

export interface SignInProps {
  /** App name, rendered as the card's heading. An instrument gets its bare codename. */
  appName: ReactNode;
  /** One quiet line under the name: what this is, or where it runs. */
  subtitle?: ReactNode;
  /** The app's mark (an <img> or inline SVG), rendered at 48×48 in the logo slot. Artwork is app-supplied; never drawn here. */
  logo?: ReactNode;
  /** Which sign-in methods the app offers. Defaults to all four. */
  methods?: SignInMethods;
  /** Which credential tab is selected first. Default 'email' when enabled, else 'passphrase'. */
  defaultMode?: SignInMode;
  /** Email + password sign-in. Resolve on success; reject to show the error state. */
  onEmailSubmit?: (creds: { email: string; password: string }) => void | Promise<void>;
  /** Passphrase sign-in. Resolve on success; reject to show the error state. */
  onPassphraseSubmit?: (creds: { token: string }) => void | Promise<void>;
  /** Password-reset request from the forgot view. When omitted, no "Forgot password?" link is shown. Resolve to show the "check your email" notice. */
  onForgotPassword?: (email: string) => void | Promise<void>;
  /** Google sign-in. When omitted and `googleHref` is set, the button navigates there instead. */
  onGoogle?: () => void;
  /** Where the Google button navigates when `onGoogle` is not given. */
  googleHref?: string;
  /** Tailscale sign-in. Reject with an Error to show its message as the form error. */
  onTailscale?: () => void | Promise<void>;
  /** A form-level error supplied by the app (e.g. an OAuth failure bounced back in the URL). Shown as role="alert" until the user edits or switches mode. */
  error?: ReactNode;
  /** Submit button label in credential modes. The forgot view always reads "Send Reset Link". Default 'Unlock'. */
  submitLabel?: string;
  /** Footer note, first quiet line (12px). The app words its own access note here. */
  note?: ReactNode;
  /** Footer meta, second quiet line (11px mono): e.g. scope + host, in the app's words. */
  meta?: ReactNode;
}

const ERRORS: Record<'email' | 'passphrase' | 'forgot', string> = {
  email: 'Those credentials did not work. Try again.',
  passphrase: 'That passphrase did not work. Try again.',
  forgot: "Couldn't send the reset email. Try again.",
};

type Mode = SignInMode | 'forgot';

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

function TailscaleMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ off }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {off ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}

function FieldErrorIcon() {
  return (
    <span className="sign-in__field-error" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </span>
  );
}

export function SignIn({
  appName,
  subtitle,
  logo,
  methods,
  defaultMode,
  onEmailSubmit,
  onPassphraseSubmit,
  onForgotPassword,
  onGoogle,
  googleHref,
  onTailscale,
  error,
  submitLabel = 'Unlock',
  note,
  meta,
}: SignInProps) {
  const m: Required<SignInMethods> = {
    email: methods?.email ?? true,
    passphrase: methods?.passphrase ?? true,
    google: methods?.google ?? true,
    tailscale: methods?.tailscale ?? true,
  };
  const firstMode: SignInMode = defaultMode ?? (m.email ? 'email' : 'passphrase');
  const [mode, setMode] = useState<Mode>(firstMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [fieldsInvalid, setFieldsInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const showSegments = m.email && m.passphrase;
  const showProviders = m.google || m.tailscale;
  const canSubmit =
    mode === 'email'
      ? email.trim() !== '' && password !== ''
      : mode === 'forgot'
        ? email.trim() !== '' && !forgotSent
        : token.trim() !== '';

  const switchMode = (next: Mode) => {
    setMode(next);
    setErr('');
    setFieldsInvalid(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || busy) return;
    setBusy(true);
    setErr('');
    try {
      if (mode === 'email') {
        await onEmailSubmit?.({ email: email.trim(), password });
      } else if (mode === 'forgot') {
        await onForgotPassword?.(email.trim());
        setForgotSent(true);
      } else {
        await onPassphraseSubmit?.({ token: token.trim() });
      }
      setBusy(false);
    } catch {
      if (mode === 'email') setFieldsInvalid(true);
      setErr(ERRORS[mode]);
      setBusy(false);
    }
  };

  const tailscale = async () => {
    if (!onTailscale) return;
    try {
      await onTailscale();
    } catch (ex) {
      setErr(ex instanceof Error && ex.message ? ex.message : 'Tailscale sign-in failed.');
    }
  };

  const shownError = err || error;

  return (
    <div className="sign-in">
      <div className="sign-in__card">
        {logo ? <div className="sign-in__logo">{logo}</div> : null}
        <h1 className="sign-in__name">{appName}</h1>
        {subtitle ? <p className="sign-in__sub">{subtitle}</p> : null}

        {showSegments ? (
          <div className="segmented sign-in__segments" role="tablist" aria-label="Sign-in method">
            <button
              type="button"
              role="tab"
              aria-selected={mode !== 'passphrase'}
              onClick={() => switchMode('email')}
            >
              Email
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'passphrase'}
              onClick={() => switchMode('passphrase')}
            >
              Passphrase
            </button>
          </div>
        ) : null}

        <form className="sign-in__form" onSubmit={submit}>
          {mode === 'email' ? (
            <>
              <div className="sign-in__field">
                <input
                  className="input"
                  aria-label="Email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email"
                  value={email}
                  aria-invalid={fieldsInvalid || undefined}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldsInvalid(false);
                  }}
                />
                {fieldsInvalid ? <FieldErrorIcon /> : null}
              </div>
              <div className="sign-in__field">
                <input
                  className="input"
                  aria-label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Password"
                  value={password}
                  aria-invalid={fieldsInvalid || undefined}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldsInvalid(false);
                  }}
                />
                <button
                  type="button"
                  className="sign-in__reveal"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {onForgotPassword ? (
                <button type="button" className="sign-in__link" onClick={() => switchMode('forgot')}>
                  Forgot password?
                </button>
              ) : null}
            </>
          ) : mode === 'forgot' ? (
            <>
              <p className="sign-in__hint">Enter your email and we&rsquo;ll send you a link to reset your password.</p>
              <div className="sign-in__field">
                <input
                  className="input"
                  aria-label="Email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="button" className="sign-in__link sign-in__link--start" onClick={() => switchMode('email')}>
                &larr; Back to sign in
              </button>
            </>
          ) : (
            <div className="sign-in__field">
              <input
                className="input"
                aria-label="Hub passphrase"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Hub passphrase"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <button
                type="button"
                className="sign-in__reveal"
                aria-label={showPassword ? 'Hide passphrase' : 'Show passphrase'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>
          )}

          {shownError ? (
            <p role="alert" className="sign-in__alert">
              {shownError}
            </p>
          ) : null}
          {forgotSent && mode === 'forgot' ? (
            <p role="status" className="sign-in__notice">
              Check your email — if an account exists, a reset link is on its way.
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary sign-in__submit" disabled={!canSubmit || busy}>
            {busy ? <span className="spinner spinner--sm" aria-hidden="true" /> : null}
            {mode === 'forgot' ? 'Send Reset Link' : submitLabel}
          </button>
        </form>

        {showProviders ? (
          <>
            <div className="sign-in__divider">
              <span>or</span>
            </div>
            {m.google ? (
              <button
                type="button"
                className="sign-in__provider"
                onClick={() => {
                  if (onGoogle) onGoogle();
                  else if (googleHref) window.location.href = googleHref;
                }}
              >
                <GoogleMark />
                Sign in with Google
              </button>
            ) : null}
            {m.tailscale ? (
              <button type="button" className="sign-in__provider" onClick={tailscale}>
                <TailscaleMark />
                Sign in with Tailscale
              </button>
            ) : null}
          </>
        ) : null}

        {note ? <p className="sign-in__note">{note}</p> : null}
        {meta ? <p className="sign-in__meta">{meta}</p> : null}
      </div>
    </div>
  );
}
