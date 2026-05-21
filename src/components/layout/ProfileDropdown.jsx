/* eslint-disable no-unused-vars */

import { useState, useRef, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CgLogIn } from "react-icons/cg";

const ProfileDropdown = ({ isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [userMail, setUsermail] = useState("");
  const [profileDp, setProfileDp] = useState("");

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateProfileData = () => {
      const storedName = sessionStorage.getItem("uname");
      const storedMail = sessionStorage.getItem("email");
      const storedDp = sessionStorage.getItem("dp");

      if (storedName && storedMail) {
        setUsername(storedName);
        setUsermail(storedMail);
        setProfileDp(storedDp);
      } else {
        setUsername("");
        setUsermail("");
        setProfileDp("");
      }
    };

    // INITIAL LOAD
    updateProfileData();

    // LISTEN PROFILE UPDATE EVENT
    window.addEventListener("profileUpdated", updateProfileData);

    return () => {
      window.removeEventListener("profileUpdated", updateProfileData);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();

    setIsOpen(false);

    navigate("/", { replace: true });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-[2px] cursor-pointer shadow-lg shadow-blue-500/20 focus:outline-none"
      >
        <div className="bg-slate-900 w-full h-full rounded-full flex items-center justify-center">
          {profileDp ? (
            <img
              src={profileDp}
              className="rounded-full h-6 w-6 object-cover"
              alt="profile-pic"
            />
          ) : (
            <User className="w-4 h-4 text-slate-300" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.95,
            }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 rounded-xl glass-panel border border-slate-800/80 shadow-2xl py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-800/80">
              {username && (
                <p className="text-sm font-bold text-white">{username}</p>
              )}

              {userMail && (
                <p className="text-xs font-bold text-slate-400 truncate">
                  {userMail}
                </p>
              )}
            </div>

            {username ? (
              <>
                <div className="py-1">
                  {isAdmin ? (
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                    >
                      <Settings className="w-4 h-4 font-bold" />

                      <span>Admin Settings</span>
                    </Link>
                  ) : (
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
                    >
                      <User className="w-4 h-4" />

                      <span>My Profile</span>
                    </Link>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-800/80">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 cursor-pointer hover:text-red-300 hover:bg-red-500/10 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />

                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="pt-1 border-t border-slate-800/80">
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-green-400 cursor-pointer hover:text-green-300 hover:bg-green-500/10 w-full text-left transition-colors"
                  >
                    <CgLogIn className="w-4 h-4" />

                    <span>Login</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
