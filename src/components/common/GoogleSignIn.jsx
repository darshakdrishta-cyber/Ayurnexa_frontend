import { GoogleLogin } from '@react-oauth/google'
import { useAppDispatch } from '../../hooks/redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { googleLoginUser, setCredentials } from '../../store/slices/authSlice'

export function GoogleSignInButton({ className = '', text = 'Continue with Google' }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const onSuccess = async (credentialResponse) => {
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

      const res = await dispatch(googleLoginUser({ credential: credentialResponse.credential }))
      if (googleLoginUser.fulfilled.match(res)) {
        if (picture || name) {
          const userObj = res.payload?.user || {}
          dispatch(
            setCredentials({
              user: {
                ...userObj,
                username: userObj.username || name,
                picture: picture || userObj.picture,
              },
              token: res.payload?.token,
            })
          )
        }
        navigate(from, { replace: true })
      }
    } catch (err) {
      console.error('Google Sign-in failed', err)
    }
  }

  const onError = () => {
    // sign-in failed
  }

  return (
    <GoogleLogin
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      onSuccess={onSuccess}
      onError={onError}
      theme="outline"
      buttonText={text}
      width={320}
      className={className}
      locale="en"
    />
  )
}
