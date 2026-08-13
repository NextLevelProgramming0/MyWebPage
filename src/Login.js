import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { saveTokens, isAuthenticated } from './Auth';
import { variables } from './Variables';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated()) return <Navigate to="/" replace />;

  const changeMode = nextMode => {
    setMode(nextMode); setMessage(''); setError(''); setPassword('');
  };

  const submit = async event => {
    event.preventDefault();
    setError(''); setMessage(''); setSubmitting(true);
    const endpoint = mode === 'login' ? 'auth/token/' : mode === 'signup' ? 'auth/signup/' : 'auth/password/forgot/';
    const frontend_url = window.location.origin;
    const payload = mode === 'login'
      ? { identifier, password }
      : mode === 'signup'
        ? { email, password, frontend_url }
        : { email, frontend_url };
    try {
      const response = await fetch(variables.API_URL + endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.detail || 'Request failed.');
      if (mode === 'login') {
        saveTokens(data); onLogin(); navigate(location.state?.from || '/', { replace: true });
      } else {
        setMessage(data.message);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password';
  const copy = mode === 'login' ? 'Sign in with your username or email.' : mode === 'signup' ? 'We’ll email you a secure link to finish choosing your username.' : 'Enter the email linked to your account.';

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-mark">DQ</div>
        <p className="login-eyebrow">Personal Portfolio</p>
        <div className="auth-tabs">
          <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => changeMode('login')}>Login</button>
          <button className={mode === 'signup' ? 'active' : ''} type="button" onClick={() => changeMode('signup')}>Sign Up</button>
        </div>
        <h1>{title}</h1>
        <p className="login-copy">{copy}</p>
        <form onSubmit={submit}>
          {mode === 'login' ? (
            <><label htmlFor="identifier">Email or username</label><input id="identifier" value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete="username" required autoFocus /></>
          ) : (
            <><label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required autoFocus /></>
          )}
          {mode !== 'forgot' && <><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></>}
          {error && <div className="login-error" role="alert">{error}</div>}
          {message && <div className="login-success" role="status">{message}</div>}
          <button type="submit" disabled={submitting}>{submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : mode === 'signup' ? 'Send verification email' : 'Send reset email'}</button>
        </form>
        {mode === 'login' && <button className="auth-text-button" type="button" onClick={() => changeMode('forgot')}>Forgot password?</button>}
        {mode === 'forgot' && <button className="auth-text-button" type="button" onClick={() => changeMode('login')}>Back to login</button>}
      </section>
    </main>
  );
}
