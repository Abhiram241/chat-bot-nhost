import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaGlobe, FaSignOutAlt } from "react-icons/fa";
import { useUserData, useSignOut } from "@nhost/react";

const Header = () => {
  const user = useUserData();
  const { signOut } = useSignOut();

  const socialLinks = [
    {
      icon: FaGithub,
      href: "https://github.com/Abhiram241",
      label: "GitHub Profile",
      color: "hover:text-purple-400",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/in/abhiram-ys-8a3a2b266/",
      label: "LinkedIn Profile",
      color: "hover:text-blue-400",
    },
    {
      icon: FaGlobe,
      href: "https://abhiramys.netlify.app/",
      label: "Portfolio Website",
      color: "hover:text-green-400",
    },
  ];

  return (
    <motion.header
      className="bg-gradient-to-r from-slate-900 via-purple-900/20 to-slate-900 border-b border-purple-500/20 backdrop-blur-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-7 w-7 sm:h-8 sm:w-8 filter drop-shadow-lg"
          />
          <h1 className="text-lg sm:text-xl font-mono font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Synapse
          </h1>
        </motion.div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="hidden sm:flex items-center space-x-4">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-gray-400 transition-colors duration-200 ${link.color}`}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                title={link.label}
              >
                <link.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-mono text-purple-300">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 font-mono">Authenticated</p>
              </div>

              <motion.button
                onClick={signOut}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-mono text-sm transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <FaSignOutAlt className="h-5 w-5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;