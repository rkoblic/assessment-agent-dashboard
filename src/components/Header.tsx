import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white print:hidden">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Assessment Agent
        </Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Launch
          </Link>
          <Link href="/demo" className="text-gray-600 hover:text-gray-900">
            Demo
          </Link>
          <Link href="/prompt" className="text-gray-600 hover:text-gray-900">
            Prompt
          </Link>
          <Link href="/assessments" className="text-gray-600 hover:text-gray-900">
            History
          </Link>
        </nav>
      </div>
    </header>
  );
}
