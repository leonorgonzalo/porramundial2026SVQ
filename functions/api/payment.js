import { createClient } from '@supabase/supabase-js'

export async function onRequestPost({ request, env }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
  const { email, paid, fecha } = await request.json()
  if (!email) return new Response('Missing email', { status: 400 })

  if (!paid) {
    await supabase.from('payments').delete().eq('email', email)
  } else {
    const { error } = await supabase.from('payments').upsert(
      { email, pagado: true, fecha: fecha || null, updated_at: new Date().toISOString() },
      { onConflict: 'email' }
    )
    if (error) return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json({ ok: true })
}
