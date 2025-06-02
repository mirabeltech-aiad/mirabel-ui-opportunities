import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center h-14">
        <div className="flex mr-4">
          <a className="flex items-center mr-6 space-x-2" href="/">
            <span className="font-bold">Mirabel</span>
          </a>
        </div>
        <div className="flex items-center justify-between flex-1 space-x-2 md:justify-end">
          <nav className="flex items-center">
            <ThemeSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
} 