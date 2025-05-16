import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { title, userId } = req.body

    const newTask = await prisma.task.create({
      data: {
        title,
        user: {
          connect: { id: userId }
        }
      }
    })

    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ message: 'Error creating task' })
  }
}




////////////////////
// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { title, userId } = req.body

//     if (!title || !userId) {
//       return res.status(400).json({ error: 'Title and userId are required' })
//     }

//     try {
//       // Create a new task and associate it with the user
//       const newTask = await prisma.task.create({
//         data: {
//           title,
//           userId,  // Link the task to the user by their userId
//         },
//       })
//       return res.status(201).json(newTask)  // Return the created task
//     } catch (error) {
//       console.error('Error creating task:', error)
//       return res.status(500).json({ error: 'Failed to create task' })
//     }
//   }

//   return res.status(405).json({ error: 'Method not allowed' })
// }
