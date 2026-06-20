import jwt from 'jsonwebtoken'
import { env } from '../env'

export interface JwtPayload {
  userId: string
}

export function signToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtSecret, { expiresIn: '30d' })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload
}
