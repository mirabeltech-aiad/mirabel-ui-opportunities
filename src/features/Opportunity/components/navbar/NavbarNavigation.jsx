
import { Link, useLocation } from "react-router-dom";

const NavbarNavigation = ({ navItems }) => {
  const location = useLocation();

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <nav className="hidden lg:flex items-center">
      {navItems.map((item, index) => {
        const active = isActive(item.href);
        
        return item.onClick ? (
          <button
            key={item.name}
            onClick={item.onClick}
            className={`transition-colors duration-200 font-medium px-3 py-1 rounded-sm ${
              active 
                ? 'text-white bg-white/20' 
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.name}
          </button>
        ) : (
          <Link 
            key={item.name}
            to={item.href} 
            className={`transition-colors duration-200 font-medium px-3 py-1 rounded-sm ${
              active 
                ? 'text-white bg-white/20' 
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavbarNavigation;
