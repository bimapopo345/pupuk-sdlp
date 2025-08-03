import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
            <h1 className="text-2xl font-bold">Pupuk SDL</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-green-200 transition-colors">
              Dashboard
            </Link>
            <Link
              to="/raw-data"
              className="hover:text-green-200 transition-colors"
            >
              Data Mentah
            </Link>
            <Link
              to="/calibrated-data"
              className="hover:text-green-200 transition-colors"
            >
              Data Terkalibrasi
            </Link>
            <Link
              to="/recommendation"
              className="hover:text-green-200 transition-colors"
            >
              Rekomendasi
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4">
            <Link
              to="/"
              className="block py-2 hover:text-green-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/raw-data"
              className="block py-2 hover:text-green-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Data Mentah
            </Link>
            <Link
              to="/calibrated-data"
              className="block py-2 hover:text-green-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Data Terkalibrasi
            </Link>
            <Link
              to="/recommendation"
              className="block py-2 hover:text-green-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Rekomendasi
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
