import { createClient } from '@supabase/supabase-js'

export async function onRequest({ request, env }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)

  if (request.method === 'DELETE') {
    const { email } = await request.json()
    if (!email) return new Response('Missing email', { status: 400 })
    await supabase.from('participants').delete().eq('email', email)
    return Response.json({ ok: true })
  }

  if (request.method === 'POST') {
    const { email, nombre, data } = await request.json()
    if (!email || !nombre) return new Response('Missing email or nombre', { status: 400 })
    const { error } = await supabase.from('participants').upsert(
      { email, nombre, data: data || {}, updated_at: new Date().toISOString() },
      { onConflict: 'email' }
    )
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json({ ok: true })
  }

  return new Response('Method not allowed', { status: 405 })
}
