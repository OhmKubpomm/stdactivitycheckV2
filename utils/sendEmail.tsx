import nodemailer from 'nodemailer';
import { html } from '@/utils/htmlEmail';

interface EmailOptions {
    to: string;
    url: string;
    text: string;
}

const sendEmail = async ({ to, url, text }: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'StdActivityCheck',
        html: html({ url, text }),
    };
    const result = await transporter.sendMail(mailOptions);
    return result;
};

export default sendEmail;
