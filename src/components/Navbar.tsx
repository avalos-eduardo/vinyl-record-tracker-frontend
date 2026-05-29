import { useState } from "react";
import { NavLink } from "react-router";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) =>
    isPending
      ? ""
      : isActive
        ? "text-white bg-[#718b74] rounded-2xl px-4 py-1.5"
        : "";

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/collection", label: "My Collection" },
    { to: "/wishlist", label: "Wishlist" },
  ];

  return (
    <header className="relative px-6 shadow-lg">
      <div className="flex justify-between items-center h-20">
        <div className="flex items-center">
          <img
            src="./src/assets/vinyl-record.jpeg"
            className="h-9 w-9 rounded-lg md:h-12 md:w-12 md:rounded-2xl"
          />
          <p className="text-lg pl-3 font-semibold text-[#3C3B3B] md:text-2xl md:pl-4">
            Vinyl Record Tracker
          </p>
        </div>

        {/* desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-8 *:text-lg font-semibold text-[#3C3B3B]">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={navLinkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* menu icon for mobile view */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-6 bg-[#3C3B3B] transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#3C3B3B] transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-[#3C3B3B] transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* mobile dropdown */}
      {menuOpen && (
        <nav className="md:hidden pb-4">
          <ul className="flex flex-col gap-3 font-semibold text-[#3C3B3B] text-lg">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={navLinkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
