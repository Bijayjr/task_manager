import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'yoursecretkey'

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch (err) {
    return null
  }
}
