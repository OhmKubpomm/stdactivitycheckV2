import { GetFormContentByUrl } from "@/actions/ActivityAction";
import { FormElementInstance } from "@/components/Activityform/FormElements";
import FormSubmitComponent from "@/components/Activityform/FormSubmitComponent";
import React from "react";

async function SubmitPage({
  params,
}: {
  params: {
    formUrl: string;
  };
}) {
  const form = await GetFormContentByUrl(params.formUrl);

  if (!form) {
    throw new Error("form not found");
  }

  const formContent = JSON.parse(form.ActivityContent) as FormElementInstance[];

  return <FormSubmitComponent formUrl={params.formUrl} content={formContent} />;
}

export default SubmitPage;
