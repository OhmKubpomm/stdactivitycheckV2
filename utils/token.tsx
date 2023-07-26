import jwt, { Secret } from 'jsonwebtoken'

export const generateToken = (payload: string | object) => {
    try {
        const token = jwt.sign(payload, process.env.TOKEN_SECRET as Secret, { expiresIn: '1d' })
        return token
    } catch (error) {
        console.error('Error generating token:', error)
        return null
    }
}


export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.TOKEN_SECRET as Secret)
}   