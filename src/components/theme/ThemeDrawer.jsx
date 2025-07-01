import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette, Settings2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function ThemeDrawer() {
  const { theme, setTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed right-4 top-4 z-50 rounded-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <Settings2 className="w-5 h-5" />
          <span className="sr-only">Open theme settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Theme Settings</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Choose Theme</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="w-5 h-5" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="w-5 h-5" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant={theme === "orange" ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-20 gap-2"
                  onClick={() => setTheme("orange")}
                >
                  <Palette className="w-5 h-5" />
                  <span>Orange</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
} 