import SignInForm from '../../../components/auth/signin-form'
import AuthRedirect from '../../../components/auth/auth-redirect'

export const metadata = {
  title: "Sign In - Yuzuu.co",
  description: "Log in to your Yuzuu account",
};

export default function SignIn() {
  return (
    <AuthRedirect>
      <SignInForm />
    </AuthRedirect>
  )
}
