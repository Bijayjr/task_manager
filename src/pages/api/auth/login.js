import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validate credentials (in a real app, you'd use proper password hashing)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true
      }
    })

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', [
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24}`
    ])

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}