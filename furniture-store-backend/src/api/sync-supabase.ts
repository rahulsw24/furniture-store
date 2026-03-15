import { createClient } from '@supabase/supabase-js'
import { PayloadHandler } from 'payload'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
)

export const syncSupabaseUser: PayloadHandler = async (req) => {
  try {
    const { token } = req.json ? await req.json() : (req as any).body

    if (!token) {
      return Response.json({ error: 'No token provided' }, { status: 400 })
    }

    // 1️⃣ Verify Supabase token
    const {
      data: { user: sbUser },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !sbUser) {
      return Response.json({ error: 'Invalid Supabase token' }, { status: 401 })
    }

    const email = sbUser.email!

    // 2️⃣ SECURE PASSWORD GENERATION
    const securePassword = crypto
      .createHmac('sha256', process.env.PAYLOAD_SECRET!)
      .update(sbUser.id)
      .digest('hex')

    // 3️⃣ Find User
    const existing = await req.payload.find({
      collection: 'users',
      where: { email: { equals: email } },
    })

    let userDoc = existing.docs[0]

    // 4️⃣ ACCOUNT LINKING LOGIC
    if (!userDoc) {
      // Create new user if they don't exist
      userDoc = await req.payload.create({
        collection: 'users',
        data: {
          email: email,
          name: sbUser.user_metadata?.full_name || email.split('@')[0],
          role: 'customer',
          password: securePassword,
        },
      })
    } else {
      // User exists. Try to login.
      try {
        await req.payload.login({
          collection: 'users',
          data: { email, password: securePassword },
          req,
        })
      } catch (loginErr) {
        // If login fails, it means they have a manual password.
        // Since Google verified them, we update their password to the secure hash.
        userDoc = await req.payload.update({
          collection: 'users',
          id: userDoc.id,
          data: {
            password: securePassword,
          },
        })
      }
    }

    // 5️⃣ Final Login (Guaranteed to work now)
    const result = await req.payload.login({
      collection: 'users',
      data: {
        email: email,
        password: securePassword,
      },
      req,
    })

    return Response.json(
      { user: result.user },
      {
        status: 200,
        headers: {
          'Set-Cookie': `boltless-token=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000;`,
        },
      },
    )
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
