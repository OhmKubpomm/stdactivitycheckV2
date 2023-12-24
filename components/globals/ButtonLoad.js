"use client";
import { useFormStatus } from "react-dom";

const ButtonLoad = ({ value, htmlType: any, ...props }) => {
  const { pending } = useFormStatus();

  return (
    <button aria-disabled={pending} {...props}>
      {pending ? "Loading..." : value}
    </button>
  );
};

export default ButtonLoad;
