/**
 * @fileoverview Email/password Admin login form (React island).
 *
 * Uses the browser Supabase client so session cookies are written on sign-in,
 * then navigates to the Admin dashboard. There is no signup path.
 */

import { useState, type FormEvent, type JSX } from "react";
import { createBrowserClient } from "@seo/db";
import { mapLoginErrorMessage, parseLoginCredentials } from "../../lib/admin-auth";

/**
 * Props for {@link LoginForm}.
 */
export type LoginFormProps = {
  /**
   * Absolute-from-origin path to redirect after a successful login
   * (must include Astro base, e.g. `/cae/admin/`).
   */
  redirectTo: string;
};

/**
 * Narrows unknown env values to non-empty strings.
 *
 * @param value - Candidate env value.
 * @returns Trimmed string or `undefined`.
 */
function readPublicEnv(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * CAE Admin email/password sign-in form. Login only — no signup link.
 *
 * @param props - Redirect target after success.
 * @returns Login form UI.
 */
export function LoginForm(props: LoginFormProps): JSX.Element {
  const { redirectTo } = props;

  if (typeof redirectTo !== "string" || redirectTo.trim().length === 0) {
    throw new Error("LoginForm requires a non-empty redirectTo path.");
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Signs in with email/password and redirects on success.
   *
   * @param event - Form submit event.
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setErrorMessage(null);

    const parsed = parseLoginCredentials(email, password);
    if ("error" in parsed) {
      setErrorMessage(parsed.error);
      return;
    }

    const supabaseUrl = readPublicEnv(import.meta.env.PUBLIC_SUPABASE_URL);
    const supabaseAnonKey = readPublicEnv(import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
    if (supabaseUrl === undefined || supabaseAnonKey === undefined) {
      setErrorMessage(
        "Auth is not configured. Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createBrowserClient({
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      });

      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.email,
        password: parsed.password,
      });

      if (error !== null) {
        setErrorMessage(mapLoginErrorMessage(error.message));
        return;
      }

      window.location.assign(redirectTo);
    } catch {
      setErrorMessage(
        "Could not reach the auth service. Check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="cae-login-form" onSubmit={handleSubmit} noValidate>
      <div className="cae-login-form__field">
        <label className="cae-login-form__label" htmlFor="cae-admin-email">
          Email
        </label>
        <input
          id="cae-admin-email"
          className="cae-login-form__input"
          name="email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          value={email}
          disabled={isSubmitting}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
      </div>

      <div className="cae-login-form__field">
        <label className="cae-login-form__label" htmlFor="cae-admin-password">
          Password
        </label>
        <input
          id="cae-admin-password"
          className="cae-login-form__input"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          disabled={isSubmitting}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </div>

      {errorMessage !== null ? (
        <p className="cae-login-form__error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        className="cae-login-form__submit"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default LoginForm;
