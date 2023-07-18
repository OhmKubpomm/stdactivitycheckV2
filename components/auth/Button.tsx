import { FC, MouseEventHandler, ReactNode } from 'react';

interface ButtonProps {
    onClick: MouseEventHandler;
    children: ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4"
        >
            {children}
        </button>
    );
}

export default Button;
