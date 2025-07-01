import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
export default function WelcomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-background">
      <Card className="w-full max-w-lg text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            Welcome to Mirabel React JS 3.0
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link to="/sitewidesettings" className="w-full">
            <Button className="w-full">
              To the Site Wide Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
