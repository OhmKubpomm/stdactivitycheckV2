import dynamic from "next/dynamic";
import React from "react";
const Maplayout = dynamic(() => import("@/components/maptool/Maplayout"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const AddMap = () => {
  return <Maplayout />;
};

export default AddMap;
