export const metadata = {
  title: "Sign Up - Yuzuu.co",
  description: "Create your Yuzuu account",
};

export const dynamic = 'force-dynamic';

import SignUpForm from '../../../components/auth/signup-form'

export default function SignUp() {
  return <SignUpForm />
}
