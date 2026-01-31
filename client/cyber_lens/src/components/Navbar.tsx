import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import Avatar from "./Avatar";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    setTimeout(() => {
      logout();
      setProfileDropdownOpen(false);
      setOpen(false);
      navigate("/");
      setIsSigningOut(false);
    }, 800);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const baseLink =
    "relative px-4 py-2 text-base font-medium tracking-wide transition-colors";
  const inactive = "text-slate-400 hover:text-slate-200";
  const active =
    "text-cyan-400 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-cyan-400";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `${baseLink} ${isActive ? active : inactive}`;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-lock text-white text-xl" />
            <span className="text-xl font-bold text-slate-100">
              Cyber <span className="text-cyan-500">Lens</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/history" className={linkClass}>
              History
            </NavLink>

            <NavLink to="/news" className={linkClass}>
              News
            </NavLink>

            <NavLink to="/analytics" className={linkClass}>
              Analytics
            </NavLink>

            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
                  aria-label="Profile menu"
                >
                  <Avatar email={user.email} size="sm" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-100 truncate">
                            {user.email.split("@")[0]}
                          </p>
                          <p className="text-xs text-cyan-400 truncate mt-1">
                            {user.email}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(user.email);
                          }}
                          className="ml-2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                          aria-label="Copy email"
                        >
                          <i className="fa-solid fa-copy text-xs" />
                        </button>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="py-2">
                      {/* Analysis button removed */}
                      <NavLink
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                      >
                        <i className="fa-solid fa-user text-slate-400" />
                        <span>Profile</span>
                      </NavLink>
                      <NavLink
                        to="/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-3"
                      >
                        <i className="fa-solid fa-gear text-slate-400" />
                        <span>Settings</span>
                      </NavLink>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-800 py-2">
                      <button
                        onClick={handleLogout}
                        disabled={isSigningOut}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 transition-colors
                          ${
                            isSigningOut
                              ? "text-slate-500 cursor-not-allowed"
                              : "text-slate-300 hover:bg-slate-800"
                          }`}
                      >
                        <i className="fa-solid fa-right-from-bracket text-orange-400" />
                        <span>{isSigningOut ? "Signing out…" : "Logout"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className={linkClass}>
                Sign In
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-200"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <i
              className={`fa-solid ${open ? "fa-xmark" : "fa-bars"} text-xl`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-slate-800 py-3 flex flex-col">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/history"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              History
            </NavLink>

            <NavLink
              to="/news"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              News
            </NavLink>

            <NavLink
              to="/settings"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Settings
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className={linkClass}
            >
              Profile
            </NavLink>

            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-2 border-t border-slate-800 mt-2 pt-3">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar email={user.email} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">
                        {user.email.split("@")[0]}
                      </p>
                      <p className="text-xs text-cyan-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    disabled={isSigningOut}
                    className={`w-full px-4 py-2 text-left text-sm rounded transition-colors flex items-center gap-3
                        ${
                          isSigningOut
                            ? "text-slate-500 cursor-not-allowed"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                  >
                    <i className="fa-solid fa-right-from-bracket text-orange-400" />
                    <span>{isSigningOut ? "Signing out…" : "Logout"}</span>
                  </button>
                </div>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className={linkClass}
              >
                Sign In
              </NavLink>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
