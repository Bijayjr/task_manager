export default function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' })
    }
  
    // Set cookie to expire immediately
    res.setHeader('Set-Cookie', [
      'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
    ])
  
    return res.status(200).json({ message: 'Logged out successfully' })
  }