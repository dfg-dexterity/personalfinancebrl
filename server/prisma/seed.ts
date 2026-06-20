import bcrypt from 'bcryptjs'
import { CATEGORIES } from '../src/data/catalog'
import { prisma } from '../src/prisma'
import { seedUserData } from '../src/seedUser'

async function main() {
  // Global category catalog
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { key: c.key },
      update: { name: c.name, icon: c.icon, color: c.color, bg: c.bg, sort: c.sort },
      create: { key: c.key, name: c.name, icon: c.icon, color: c.color, bg: c.bg, sort: c.sort },
    })
  }
  console.log(`✔ Categorias: ${CATEGORIES.length}`)

  // Demo user for quick testing
  const email = 'marina@financas.app'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`• Usuário demo já existe: ${email}`)
  } else {
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Marina Ribeiro',
        passwordHash: await bcrypt.hash('demo1234', 10),
        initials: 'MR',
      },
    })
    await seedUserData(user.id)
    console.log(`✔ Usuário demo criado: ${email} / demo1234`)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
