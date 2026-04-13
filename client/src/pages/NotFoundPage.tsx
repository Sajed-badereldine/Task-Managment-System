import { Link } from 'react-router-dom';
import { PublicAuthLayout } from '@/components/layout/PublicAuthLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function NotFoundPage() {
  return (
    <PublicAuthLayout>
      <Card className="p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          404
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The page you requested does not exist or may have moved.
        </p>
        <Link to="/" className="mt-8 inline-flex">
          <Button>Back to home</Button>
        </Link>
      </Card>
    </PublicAuthLayout>
  );
}
