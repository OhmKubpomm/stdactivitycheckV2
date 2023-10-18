/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const MenuResponNav: React.FC = () => {
  const [menuLinks, setMenuLinks] = useState<HTMLElement | null>(null);

  const updateMenuDisplay = () => {
    if (window.innerWidth >= 1024) {
      if (menuLinks) {
        menuLinks.style.display = "flex";
      }
    } else {
      if (menuLinks && menuLinks.style.display === "flex") {
        menuLinks.style.display = "none";
      }
    }
  };

  useEffect(() => {
    const element = document.getElementById("menu-links");
    setMenuLinks(element);
    window.addEventListener("resize", updateMenuDisplay);
    updateMenuDisplay(); // Call it once on initial render

    return () => {
      window.removeEventListener("resize", updateMenuDisplay);
    };
  }, [menuLinks, updateMenuDisplay]);

  const toggleMenu = () => {
    if (menuLinks) {
      if (menuLinks.style.display === "block") {
        menuLinks.style.display = "none";
      } else {
        menuLinks.style.display = "block";
      }
    }
  };

  return (
    <div>
      <button onClick={toggleMenu}>
        <MenuIcon />
      </button>
    </div>
  );
};

export default MenuResponNav;
