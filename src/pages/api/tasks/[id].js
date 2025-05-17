import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: { id } // Use id as a string
      })
      return res.status(200).json({ message: 'Task deleted successfully' })
    } catch (error) {
      console.error('Delete error:', error)
      return res.status(500).json({ message: 'Error deleting task' })
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { completed } = req.body
      const updatedTask = await prisma.task.update({
        where: { id }, // Use id as a string
        data: { completed }
      })
      return res.status(200).json(updatedTask)
    } catch (error) {
      console.error('Update error:', error)
      return res.status(500).json({ message: 'Error updating task' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
