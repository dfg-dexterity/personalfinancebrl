import type { NextFunction, Request, RequestHandler, Response } from 'express'

/** Error carrying an HTTP status, surfaced by the global error handler. */
export class AppError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/** Wraps an async route so rejected promises reach Express' error handler. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next)
  }
