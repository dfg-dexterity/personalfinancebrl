import app from './app'
import { env } from './env'

// Local development entry point. On Vercel the Express app is imported directly
// by the serverless function in /api, which must not call listen().
app.listen(env.port, () => {
  console.log(
    `finanças API em http://localhost:${env.port}  ·  Open Finance: ${env.openFinanceProvider}`,
  )
})
