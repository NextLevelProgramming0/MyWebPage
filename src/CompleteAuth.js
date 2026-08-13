import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { variables } from './Variables';

export default function CompleteAuth({ type }) {
  const query = new URLSearchParams(useLocation().search);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isSignup = type === 'signup';

  const submit = async event => {
    event.preventDefault(); setError(''); setMessage('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setSubmitting(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const payload = isSignup
      ? { token: query.get('token'), username, password }
      : { uid: query.get('uid'), token: query.get('token'), password };
    try {
      const response = await fetch(variables.API_URL + (isSignup ? 'auth/signup/verify/' : 'auth/password/reset/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed.');
      setMessage(data.message);
    } catch (requestError) {
      setError(requestError.name === 'AbortError'
        ? 'The server could not be reached. Confirm Django is running for Wi-Fi access.'
        : requestError.message);
    } finally {
      clearTimeout(timeout);
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page"><section className="login-card">
      <div className="login-mark">DQ</div>
      <p className="login-eyebrow">Secure account setup</p>
      <h1>{isSignup ? 'Finish your account' : 'Choose a new password'}</h1>
      <p className="login-copy">{isSignup ? 'Your email link is verified. Choose your username and password.' : 'Create a new password for your account.'}</p>
      {!message ? <form onSubmit={submit}>
        {isSignup && <><label htmlFor="new-username">Username</label><input id="new-username" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required /></>}
        <label htmlFor="new-password">Password</label><input id="new-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required />
        <label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" required />
        {error && <div className="login-error">{error}</div>}
        <button type="submit" disabled={submitting}>{submitting ? 'Saving…' : isSignup ? 'Create account' : 'Reset password'}</button>
      </form> : <><div className="login-success">{message}</div><Link className="auth-login-link" to="/login">Continue to login</Link></>}
    </section></main>
  );
}
