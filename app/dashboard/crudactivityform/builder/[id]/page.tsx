import { GetFormById } from "@/actions/ActivityAction";
import FormBuilder from "@/components/Activityform/FormBuilder";
import React from "react";

async function BuilderPage({
  params,
}: {
  params: {
    id: String;
  };
}) {
  const { id } = params;
  const form = await GetFormById(Object(id));

  if (!form) {
    return <div>Form not found</div>;
  }

  return <FormBuilder form={form} />;
}

export default BuilderPage;
