import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GoogleSignInButton } from '../common/GoogleSignIn'

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
            <span className="font-display text-xl font-semibold">Ayurnexaa</span>
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
                <span className="h-4 w-4 rounded-full bg-secondary-500" aria-hidden="true" />
                Secure checkout
              </span>
            </div>
          </div>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Ayurnexaa · Men's wellness, privately delivered
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

export function Login() {
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
      <div className="mt-10 space-y-3">
        <GoogleSignInButton className="w-full" />
        <p className="relative text-xs text-muted-foreground">
          <span className="relative flex h-5 w-full items-center border-t border-border">
            <span className="relative -top-[0.7em] bg-background px-2 text-sm">Continue with Google</span>
          </span>
        </p>
      </div>
    </AuthShell>
  )
}

export function Signup() {
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
      <div className="mt-10 space-y-3">
        <GoogleSignInButton className="w-full" text="signup_with" />
        <p className="relative text-xs text-muted-foreground">
          <span className="relative flex h-5 w-full items-center border-t border-border">
            <span className="relative -top-[0.7em] bg-background px-2 text-sm">Continue with Google</span>
          </span>
        </p>
      </div>
    </AuthShell>
  )
}
