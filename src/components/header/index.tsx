import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 lg:px-12 bg-bg-col text-text-col">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <Image
          src="/thespotlux_logo.png"
          alt="Spotlux Logo"
          width={180}
          height={45}
          className="object-contain"
          priority
        />
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/register"
          className="text-text-col hover:text-accent-col transition-colors font-medium"
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="bg-accent-col text-bg-col px-6 py-2 rounded-lg font-semibold hover:bg-accent-col/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
