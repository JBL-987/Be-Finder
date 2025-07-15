import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar_Component = ({isAuthenticated, logout}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-black/80 backdrop-blur-md fixed w-full z-50 top-0 start-0 border-b border-blue-900/30 shadow-lg">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link to="/" className="flex items-center space-x-2">
            <span className="self-center text-2xl font-bold whitespace-nowrap text-white bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Locatify
            </span>
          </Link>
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white hover:text-blue-400 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-gray-300 hover:text-blue-400 transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
            Contact
          </Link>
          <Link to="/documentation" className="text-gray-300 hover:text-blue-400 transition-colors">
            Documentation
          </Link>
                  
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
            >
              Logout
            </button>
          ) : (
            <>
            </>
          )}
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden w-full mt-4 bg-gray-900 rounded-lg p-4 border border-blue-900/30">
            <div className="flex flex-col space-y-4">
              <Link
                to="/features"
                className="text-gray-300 hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-gray-300 hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/documentation"
                className="text-gray-300 hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
                </Link>
                {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
                >
                  Logout
                </button>
              ) : (
                <>
                </>
              )}          
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar_Component;