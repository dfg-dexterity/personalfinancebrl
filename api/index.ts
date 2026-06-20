// Vercel serverless entry — the whole Express API is served from this function.
// vercel.json rewrites every /api/* request here, and Express matches its
// /api/* routes against the original (preserved) request path.
import app from '../server/src/app'

export default app
