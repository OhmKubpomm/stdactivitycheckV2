import { FC, MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
    onClick: MouseEventHandler;
    children: ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick, children }) => {
    return (
        <button
            onClick={onClick}
            
           
        >
            {children}
        </button>
    );
}

export default Button;
