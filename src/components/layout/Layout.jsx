import { NavigationFeature } from "@/features/Navbar";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <NavigationFeature />
      {children}
    </div>
  );
} 