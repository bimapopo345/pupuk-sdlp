import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FaLeaf,
  FaChartLine,
  FaSeedling,
  FaTint,
  FaThermometerHalf,
  FaCloud,
  FaBolt,
  FaFlask,
  FaCalculator,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <FaChartLine /> },
    { path: "/raw-data", label: "Data Mentah", icon: <FaFlask /> },
    {
      path: "/calibrated-data",
      label: "Data Terkalibrasi",
      icon: <FaThermometerHalf />,
    },
    { path: "/recommendation", label: "Rekomendasi", icon: <FaCalculator /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
          : "bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-lg"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative"
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <FaLeaf className="text-white text-xl" />
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent"
            >
              Pupuk SDL
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                  isActive(item.path)
                    ? "text-white bg-green-600/20 shadow-inner"
                    : "text-gray-700 hover:text-white hover:bg-white/20"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                {isActive(item.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-lg"
                    layoutId="navIndicator"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg bg-white/20 text-gray-800 hover:bg-white/30 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden py-4 border-t border-gray-200/50"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`relative px-4 py-3 rounded-lg flex items-center space-x-3 transition-all duration-300 ${
                      isActive(item.path)
                        ? "text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
                        : "text-gray-700 hover:text-white hover:bg-white/30"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-lg">{item.label}</span>
                    {isActive(item.path) && (
                      <motion.div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
