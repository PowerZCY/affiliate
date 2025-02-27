import jwt from 'jsonwebtoken';


// Token 负载类型定义
interface TokenPayload {
    authenticated: boolean;
    domain: string;
    iat?: number;
    exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const DOMAIN = process.env.DOMAIN || 'localhost';
const EXPIRES_TIME = process.env.EXPIRES_TIME || '1h';

export function verifyToken(token: string): boolean {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

        // Check if we're in a development environment
        if (process.env.NODE_ENV === 'development') {
            // In development, we'll accept 'localhost' or '127.0.0.1'
            return decoded && (decoded.domain === 'localhost' || decoded.domain === '127.0.0.1');
        } else {
            // In production, strictly check the domain
            return decoded && decoded.domain === DOMAIN;
        }
    } catch (error) {
        return false;
    }
}

export function createToken(): string {
    return jwt.sign(
        {
            authenticated: true,
            domain: DOMAIN
        } as TokenPayload,
        JWT_SECRET,
        { expiresIn: EXPIRES_TIME }
    );
}