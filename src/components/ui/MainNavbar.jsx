
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import apiService from "@/features/Opportunity/Services/apiService";
import NavbarLogo from "../../features/Opportunity/components/navbar/NavbarLogo";
import NavbarSearch from "../../features/Opportunity/components/navbar/NavbarSearch";
import NavbarSettings from "../../features/Opportunity/components/navbar/NavbarSettings";
import NavbarNavigation from "../../features/Opportunity/components/navbar/NavbarNavigation";

const MainNavbar = () => {
  const navigate = useNavigate();

  const handleOpportunitiesClick = async (e) => {
    e.preventDefault();
    
    try {
      console.log('Opportunities tab clicked, checking settings...');
      const response = await apiService.get('/services/Reports/Settings/1/-1');
      console.log('Settings response:', response);
      
      if (response?.content?.Data?.ShowType !== undefined) {
        const showType = response.content.Data.ShowType;
        console.log('ShowType value:', showType);
        
        // ShowType 1 = Navigate to Opportunities table, ShowType 0 = Navigate to Advanced Search
        if (showType === 1) {
          console.log('Navigating to Opportunities table based on ShowType 1');
          navigate('/opportunities');
        } else {
          console.log('Navigating to Advanced Search based on ShowType 0');
          navigate('/advanced-search');
        }
      } else {
        // Fallback to opportunities page if no settings found
        navigate('/opportunities');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fallback to opportunities page on error
      navigate('/opportunities');
    }
  };

  const navItems = [
    { name: "Opportunities", href: "/opportunities", onClick: handleOpportunitiesClick },
    { name: "Proposals", href: "/proposals" },
    { name: "Reports", href: "/reports" },
  ];

  return (
    <header className="bg-ocean-gradient text-white shadow-sm sticky top-0 z-50 w-full">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <NavbarLogo />
          <NavbarNavigation navItems={navItems} />
        </div>
        
        <div className="flex items-center gap-4">
          <NavbarSearch navItems={navItems} />
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 px-3 py-0 h-8 transition-colors duration-200 flex items-center gap-2"
            onClick={() => navigate('/admin')}
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm font-medium">Admin</span>
          </Button>
          
          <NavbarSettings />
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;
