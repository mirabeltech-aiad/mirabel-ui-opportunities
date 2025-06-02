import { Header } from "./Header";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
        {children}
    </div>
  );
} 