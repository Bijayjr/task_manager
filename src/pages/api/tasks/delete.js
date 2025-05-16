import { PrismaClient } from '@prisma/client'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { taskId } = req.body
  const cookies = parse(req.headers.cookie || '')
  const token = cookies.token || null

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const task = await prisma.task.delete({
      where: {
        id: taskId,
      },
    })

    return res.status(200).json(task)
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
