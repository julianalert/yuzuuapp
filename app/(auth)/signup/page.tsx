import SignUpForm from '../../../components/auth/signup-form'
import AuthRedirect from '../../../components/auth/auth-redirect'

export const metadata = {
  title: "Sign Up - Simple",
  description: "Page description",
};

export default function SignUp() {
  return (
    <AuthRedirect>
      <SignUpForm />
    </AuthRedirect>
  )
}
