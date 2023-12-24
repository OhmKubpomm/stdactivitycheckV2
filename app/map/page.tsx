import dynamic from "next/dynamic";
import React from "react";
const Maplayout = dynamic(() => import("@/components/maptool/Maplayout"), {
  ssr: false,
});

const Mapleaflet = () => {
  return <Maplayout />;
};

export default Mapleaflet;
