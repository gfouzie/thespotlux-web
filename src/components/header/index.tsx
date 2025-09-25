import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 lg:px-12 bg-bg-col text-text-col">
      <Link
        href="/"
        className="text-2xl font-bold text-primary-col hover:text-primary-col/80 transition-colors"
      >
        Spotlux
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/register"
          className="text-text-col hover:text-primary-col transition-colors font-medium"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="bg-primary-col text-bg-col px-6 py-2 rounded-lg font-semibold hover:bg-primary-col/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
