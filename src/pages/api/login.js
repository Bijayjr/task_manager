import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { email, password } = req.body

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' })
  }

  // Compare the entered password with the stored hashed password
  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return res.status(400).json({ message: 'Invalid email or password' })
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })

  // Set the token in the cookie
  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=86400; Path=/; SameSite=Strict`)

  return res.status(200).json({ message: 'Login successful' })
}
