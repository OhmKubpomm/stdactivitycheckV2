import { FC, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  onClick: MouseEventHandler;
  children: ReactNode;
  className?: string;
}

const Button: FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
