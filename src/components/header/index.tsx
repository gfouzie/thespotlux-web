import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 lg:px-12 bg-bg-col text-text-col">
      <div className="text-2xl font-bold text-primary-col">Spotlux</div>
      <Link
        href="/login"
        className="bg-primary-col text-bg-col px-6 py-2 rounded-lg font-semibold hover:bg-primary-col/90 transition-colors"
      >
        Sign In
      </Link>
    </header>
  );
}
