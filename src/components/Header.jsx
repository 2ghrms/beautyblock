import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import ToggleTheme from "./ToggleTheme";

function Header() {

  const location = useLocation();

  return (
    <Navbar isBordered maxWidth="xl">
      <NavbarBrand>
        <AcmeLogo />
        <p className="text-lg font-bold">BrandLogo</p>
      </NavbarBrand>
      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        <NavbarItem className={`hover:text-primary ${location.pathname === "/" ? "text-primary" : null} `}>
          <Link to="/">유저관리</Link>
        </NavbarItem>
        <NavbarItem className={`hover:text-primary ${location.pathname === "/Videos" ? "text-primary" : null} `}>
          <Link to="/Videos">영상승인</Link>
        </NavbarItem>
        <NavbarItem className={`hover:text-primary ${location.pathname === "/Upload" ? "text-primary" : null} `}>
          <Link to="/Upload">영상 업로드</Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <ToggleTheme />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default Header;
