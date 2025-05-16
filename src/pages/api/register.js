// pages/api/register.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return res.status(201).json({ message: 'User registered successfully', user: newUser })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
