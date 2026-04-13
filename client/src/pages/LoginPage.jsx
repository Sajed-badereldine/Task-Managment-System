import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PublicAuthLayout } from '@/components/layout/PublicAuthLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { extractErrorMessage } from '@/lib/utils';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export function LoginPage() {
  const [submitError, setSubmitError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values) {
    try {
      setSubmitError('');
      const user = await login(values);
      const redirectTarget =
        user.role === 'admin'
          ? '/admin'
          : location.state?.from?.pathname || '/app';

      navigate(redirectTarget, { replace: true });
    } catch (error) {
      const message = extractErrorMessage(error);
      if (message.toLowerCase().includes('not approved yet')) {
        setSubmitError(
          'This account cannot sign in yet. Pending and rejected accounts are blocked until an admin approves access.',
        );
        return;
      }

      setSubmitError(message);
    }
  }

  return (
    <PublicAuthLayout>
      <Card className="p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
          Welcome Back
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Sign in to continue</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Use your approved account credentials to open your task workspace.
        </p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="login-email" className="label">
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="label">
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          {submitError ? (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
              {submitError}
            </div>
          ) : null}
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Need an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-700 hover:text-brand-800">
            Sign up
          </Link>
        </p>
      </Card>
    </PublicAuthLayout>
  );
}
