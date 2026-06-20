import type { NextFunction, Request, Response } from 'express'
import { AppError } from '../http'
import { verifyToken } from './jwt'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

/** Requires a valid `Authorization: Bearer <jwt>` header; sets req.userId. */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'Não autenticado')
  }
  try {
    req.userId = verifyToken(header.slice('Bearer '.length)).userId
  } catch {
    throw new AppError(401, 'Sessão inválida ou expirada')
  }
  next()
}
