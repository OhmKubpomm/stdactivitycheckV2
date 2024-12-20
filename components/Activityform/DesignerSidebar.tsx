/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import useDesigner from "@/hooks/useDesigner";
import FormElementsSidebar from "@/components/Activityform/FormElementsSidebar";
import PropertiesFormSidebar from "@/components/Activityform/PropertiesFormSidebar";

function DesignerSidebar() {
  const { selectedElement } = useDesigner();
  return (
    <aside className="border-muted flex h-full w-[400px] max-w-[400px] grow flex-col gap-2 overflow-y-auto border-l-2 bg-background p-4">
      {!selectedElement && <FormElementsSidebar />}
      {selectedElement && <PropertiesFormSidebar />}
    </aside>
  );
}

export default DesignerSidebar;
