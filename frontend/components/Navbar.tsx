import { FC, memo } from "react";

import { useRouter } from "next/router";
import { useTheme } from "@contexts";

import { twMerge } from "tailwind-merge";
import { Moon, Sun } from "@icons";

type NavbarProps = {
  className?: string;
};

const Navbar: FC<NavbarProps> = memo(({ className }) => {
  const { pathname } = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <nav
      className={twMerge(
        "navbar sticky top-0 z-10 flex items-center",
        className
      )}
    >
      <div className="navbar-start space-x-2">
        {pathname !== "/" && <h3>Ask Med</h3>}
      </div>

      <div className="navbar-end space-x-2">
        <input
          className="toggle toggle-primary toggle-sm"
          type="checkbox"
          checked={theme === "winter"}
          onChange={(e) => setTheme(e.target.checked ? "winter" : "night")}
        />

        <label className="swap swap-rotate">
          <input
            type="checkbox"
            checked={theme === "winter"}
            onChange={(e) => setTheme(e.target.checked ? "winter" : "night")}
          />

          <Sun className="swap-on text-primary" />
          <Moon className="swap-off text-base-content/50" />
        </label>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";
export { Navbar };
