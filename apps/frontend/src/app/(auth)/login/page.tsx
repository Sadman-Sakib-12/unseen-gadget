import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Login - Unseen Gadget',
  description: 'Sign in to your Unseen Gadget account',
};

export default function LoginPage() {
  return <LoginForm />;
}
