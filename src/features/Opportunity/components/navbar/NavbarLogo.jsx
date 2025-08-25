
import { Link } from "react-router-dom";

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-white text-blue-900 rounded-sm flex items-center justify-center">
        <span className="font-bold text-lg">M</span>
      </div>
    </Link>
  );
};

export default NavbarLogo;
