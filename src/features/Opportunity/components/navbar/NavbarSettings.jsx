
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const NavbarSettings = () => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-white hover:bg-white/20 px-2 py-0 h-8 transition-colors duration-200"
      onClick={() => navigate('/settings')}
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
};

export default NavbarSettings;
