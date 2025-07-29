import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar_Component = ({isAuthenticated, logout}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md fixed w-full z-50 top-0 start-0 border-b border-border shadow-lg">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link to="/" className="flex items-center space-x-2">
            <span className="self-center text-xl sm:text-2xl font-bold whitespace-nowrap bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Be-Finder
            </span>
          </Link>
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-foreground hover:text-blue-400 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <Link to="/features" className="text-muted-foreground hover:text-blue-400 transition-colors text-sm lg:text-base">
            Features
          </Link>
          <Link to="/pricing" className="text-muted-foreground hover:text-blue-400 transition-colors text-sm lg:text-base">
            Pricing
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-blue-400 transition-colors text-sm lg:text-base">
            About
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-blue-400 transition-colors text-sm lg:text-base">
            Contact
          </Link>
          <Link to="/documentation" className="text-muted-foreground hover:text-blue-400 transition-colors text-sm lg:text-base">
            Documentation
          </Link>
                  
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-primary-foreground bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 text-center transition-all"
            >
              Logout
            </button>
          ) : (
            <>
            </>
          )}
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden w-full mt-4 bg-card rounded-lg p-4 border border-border">
            <div className="flex flex-col space-y-4">
              <Link
                to="/features"
                className="text-muted-foreground hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-muted-foreground hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/documentation"
                className="text-muted-foreground hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
                </Link>
                {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-primary-foreground bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all"
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