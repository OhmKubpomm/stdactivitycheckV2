'use client'
import { experimental_useFormStatus as useFormStatus } from "react-dom"
import { Button } from "antd";



const ButtonLoad = ({ value, htmlType: any, ...props }) => {
    const { pending } = useFormStatus();
    return (
        <button  {...props} disabled={pending}>
            {pending ? "Loading..." : value}
        </button>
    )
}

export default ButtonLoad;

