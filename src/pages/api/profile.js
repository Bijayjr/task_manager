import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { parse } from 'cookie'; // Fix: safer cookie parsing

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // ✅ Verify token from cookies
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // ✅ Parse form data
    const form = formidable({ keepExtensions: true }); // Safer config
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    const name = fields.name?.toString();
    const email = fields.email?.toString();
    const password = fields.password?.toString();

    let avatarUrl = null;

    // ✅ Handle file upload if exists
    if (files.avatar && files.avatar[0]) {
      const avatar = files.avatar[0];
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `avatar-${userId}-${Date.now()}${path.extname(avatar.originalFilename)}`;
      const filePath = path.join(uploadDir, fileName);

      const fileData = fs.readFileSync(avatar.filepath);
      fs.writeFileSync(filePath, fileData);
      fs.unlinkSync(avatar.filepath);

      avatarUrl = `/uploads/${fileName}`;
    }

    // ✅ Hash password if provided
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // ✅ Prepare update payload
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(hashedPassword && { password: hashedPassword }),
      ...(avatarUrl && { avatarUrl })
    };

    // ✅ Update in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}
