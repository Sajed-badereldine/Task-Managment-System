import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { signup } from '@/api/auth';
import { PublicAuthLayout } from '@/components/layout/PublicAuthLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { extractErrorMessage } from '@/lib/utils';

const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]/]).+$/,
      'Password must include one uppercase letter, one number, and one special character',
    ),
});

export function SignupPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
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
      await signup(values);
      setIsSuccess(true);
      reset();
    } catch (error) {
      setSubmitError(extractErrorMessage(error));
    }
  }

  return (
    <PublicAuthLayout>
      <Card className="p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
          Create Account
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
          Request access to your workspace
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          New accounts are created with pending status and need admin approval before login.
        </p>
        {isSuccess ? (
          <div className="mt-8 rounded-3xl bg-emerald-50 p-5 text-sm text-emerald-800 ring-1 ring-emerald-200">
            Your signup request was submitted successfully. An administrator needs to approve your account before you can sign in.
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label htmlFor="signup-email" className="label">
                Email
              </label>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="label">
                Password
              </label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Strong password"
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
              Submit Request
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already approved?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Sign in
          </Link>
        </p>
      </Card>
    </PublicAuthLayout>
  );
}
