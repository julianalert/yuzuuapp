import SignInForm from '../../../components/auth/signin-form'
import AuthRedirect from '../../../components/auth/auth-redirect'

export const metadata = {
  title: "Sign In - Simple",
  description: "Page description",
};

export default function SignIn() {
  return (
    <AuthRedirect>
      <SignInForm />
    </AuthRedirect>
  )
}
