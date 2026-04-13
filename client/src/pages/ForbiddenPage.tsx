import { Link } from 'react-router-dom';
import { PublicAuthLayout } from '@/components/layout/PublicAuthLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ForbiddenPage() {
  return (
    <PublicAuthLayout>
      <Card className="p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-rose-600">
          403 Forbidden
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
          You do not have access to this page
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The backend still enforces authorization. This page is just a friendly frontend guardrail.
        </p>
        <Link to="/" className="mt-8 inline-flex">
          <Button>Back to home</Button>
        </Link>
      </Card>
    </PublicAuthLayout>
  );
}
