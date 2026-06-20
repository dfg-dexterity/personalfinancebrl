import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../auth/middleware'
import { signToken } from '../auth/jwt'
import { AppError, asyncHandler } from '../http'
import { prisma } from '../prisma'
import { seedUserData } from '../seedUser'

const router = Router()

const registerSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/)
  const two = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
  return (two || parts[0]?.[0] || 'U').toUpperCase()
}

interface UserRow {
  id: string
  name: string
  email: string
  plan: string
  initials: string
}
const publicUser = (u: UserRow) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  plan: u.plan,
  initials: u.initials,
})

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body)
    const email = data.email.toLowerCase()
    if (await prisma.user.findUnique({ where: { email } })) {
      throw new AppError(409, 'Já existe uma conta com esse e-mail')
    }
    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({
      data: { email, name: data.name, passwordHash, initials: initialsFrom(data.name) },
    })
    await seedUserData(user.id)
    res.status(201).json({ token: signToken(user.id), user: publicUser(user) })
  }),
)

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new AppError(401, 'E-mail ou senha inválidos')
    }
    res.json({ token: signToken(user.id), user: publicUser(user) })
  }),
)

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.userId! } })
    res.json({ user: publicUser(user) })
  }),
)

export default router
