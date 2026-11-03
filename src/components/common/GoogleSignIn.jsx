import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { appConfig } from '../../config'
import { useAppDispatch } from '../../hooks/redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { googleLoginUser, setCredentials } from '../../store/slices/authSlice'

export function GoogleSignInButton({ className = '', text = 'continue_with' }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [errorMessage, setErrorMessage] = useState('')

  const onSuccess = async (credentialResponse) => {
    setErrorMessage('')
    if (!credentialResponse?.credential) {
      setErrorMessage('Google did not return a sign-in credential. Please try again.')
      return
    }

    try {
      let picture
      let name
      try {
        const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]))
        picture = payload.picture
        name = payload.name
      } catch {
        picture = undefined
      }

      const response = await dispatch(
        googleLoginUser({ credential: credentialResponse.credential })
      ).unwrap()

      if (picture || name) {
        const userObj = response?.user || {}
        dispatch(
          setCredentials({
            user: {
              ...userObj,
              username: userObj.username || name,
              picture: picture || userObj.picture,
            },
            token: response?.token,
          })
        )
      }
      navigate(from, { replace: true })
    } catch (error) {
      setErrorMessage(
        typeof error === 'string'
          ? error
          : error?.message || 'Something went wrong. Please try again.'
      )
    }
  }

  const onError = () => {
    setErrorMessage('Google sign-in was not completed. Please try again.')
  }

  return (
    <>
      <GoogleLogin
        clientId={appConfig.googleClientId}
        onSuccess={onSuccess}
        onError={onError}
        theme="outline"
        text={text}
        width={320}
        className={className}
        locale="en"
      />
      {errorMessage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setErrorMessage('')}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="google-signin-error-title"
            aria-describedby="google-signin-error-message"
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="google-signin-error-title" className="font-display text-xl font-semibold text-foreground">
              Google authentication failed
            </h2>
            <p id="google-signin-error-message" className="mt-2 text-sm text-muted-foreground">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => setErrorMessage('')}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-primary-600 px-6 text-sm font-semibold text-white transition hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
