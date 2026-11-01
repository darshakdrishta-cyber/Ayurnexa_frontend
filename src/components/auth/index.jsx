import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../common/Button'
import { Field, Input, InputIcon } from '../common/Input'
import { GoogleSignInButton } from '../common/GoogleSignIn'
import { useAppDispatch } from '../../hooks/redux'
import { loginUser, registerUser, clearError } from '../../store/slices/authSlice'

function AuthShell({ children, title, subtitle, side, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-70px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 lg:block">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-secondary-500/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-primary-600/25 blur-3xl"
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-sm font-extrabold backdrop-blur">
              A
            </span>
            <span className="font-display text-xl font-semibold">Ayurnexa</span>
          </Link>
          <div>
            <h2 className="max-w-md text-balance font-display text-4xl font-semibold leading-[1.15]">
              {side}
            </h2>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/75">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full bg-secondary-500" aria-hidden="true" />
                Discreet packaging
              </span>
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Secure checkout
              </span>
            </div>
          </div>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Ayurnexa · Men's wellness, privately delivered
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          {children}
          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </motion.div>
      </div>
    </div>
  )
}

function PasswordInput({ id, value, onChange, placeholder = '••••••••' }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <InputIcon icon={Lock}>
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="current-password"
        />
      </InputIcon>
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

export function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    dispatch(clearError())
    try {
      const res = await dispatch(loginUser({ email, password }))
      if (loginUser.fulfilled.match(res)) {
        navigate(from, { replace: true })
      } else {
        setError(res.payload || 'Invalid email or password. Please try again.')
      }
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your private wellness account."
      side="Your ritual. Your pace. Delivered discreetly to your door."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-semibold text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="mt-8 space-y-5">
        <GoogleSignInButton className="w-full" />
        <p className="relative text-xs text-muted-foreground">
          <span className="relative flex h-5 w-full items-center border-t border-border">
            <span className="relative -top-[0.7em] bg-background px-2 text-sm">Or continue with email</span>
          </span>
        </p>
        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <Field label="Email address" htmlFor="email">
            <InputIcon icon={Mail}>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </InputIcon>
          </Field>
          <Field label="Password" htmlFor="password">
            <PasswordInput id="password" value={password} onChange={setPassword} />
          </Field>
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-destructive/25 bg-destructive-50 px-4 py-3 text-sm font-medium text-destructive dark:bg-destructive-950/40"
            >
              {error}
            </motion.p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </AuthShell>
  )
}

export function Signup() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError('')
    dispatch(clearError())
    try {
      const res = await dispatch(registerUser(form))
      if (registerUser.fulfilled.match(res)) {
        // If registration response already returned user/token or set cookie:
        if (res.payload?.token || res.payload?.user) {
          navigate(from, { replace: true })
          return
        }

        // Automatically sign in with the new credentials
        const loginRes = await dispatch(loginUser({ email: form.email, password: form.password }))
        if (loginUser.fulfilled.match(loginRes)) {
          navigate(from, { replace: true })
        } else {
          navigate('/login', { state: { from } })
        }
      } else {
        setError(res.payload || 'Registration failed. Please check your details and try again.')
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Private orders, discreet packaging, faster checkout."
      side="Wellness for him — built on Ayurveda, delivered with privacy."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="mt-8 space-y-5">
        <GoogleSignInButton className="w-full" text="Sign up with Google" />
        <p className="relative text-xs text-muted-foreground">
          <span className="relative flex h-5 w-full items-center border-t border-border">
            <span className="relative -top-[0.7em] bg-background px-2 text-sm">Or create with email</span>
          </span>
        </p>
        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <Field label="Full name" htmlFor="username">
            <InputIcon icon={User}>
              <Input
                id="username"
                type="text"
                required
                value={form.username}
                onChange={update('username')}
                placeholder="Arjun Mehta"
                autoComplete="name"
              />
            </InputIcon>
          </Field>
          <Field label="Email address" htmlFor="email-signup">
            <InputIcon icon={Mail}>
              <Input
                id="email-signup"
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </InputIcon>
          </Field>
          <Field
            label="Password"
            htmlFor="password-signup"
            hint="At least 6 characters."
          >
            <PasswordInput id="password-signup" value={form.password} onChange={update('password')} />
          </Field>
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-destructive/25 bg-destructive-50 px-4 py-3 text-sm font-medium text-destructive dark:bg-destructive-950/40"
            >
              {error}
            </motion.p>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </AuthShell>
  )
}
