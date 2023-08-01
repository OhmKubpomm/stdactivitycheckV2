
import { FC, MouseEventHandler, ReactNode } from 'react';
import { MailOutlined, LockOutlined, GoogleOutlined ,CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface ButtonProps {
    onClick: MouseEventHandler;
    children: ReactNode;
    className?: string; 
}

const Button: FC<ButtonProps> = ({ onClick, children, className }) => {
    return (
        <button
            onClick={onClick}
            className={className}
           
        >
            {children}
        </button>
    );
}

export default Button;
