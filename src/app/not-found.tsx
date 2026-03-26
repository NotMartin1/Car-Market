import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-6 py-20">
        <h1 className="text-8xl font-display font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-accent transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
