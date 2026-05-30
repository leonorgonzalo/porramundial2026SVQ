import { createClient } from '@supabase/supabase-js'

export async function onRequestPost({ request, env }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
  const body = await request.json()
  const updates = { id: 'main', updated_at: new Date().toISOString() }
  if (typeof body.locked === 'boolean') updates.locked = body.locked
  if (body.cuota !== undefined) updates.cuota = String(body.cuota)
  const { error } = await supabase.from('meta').upsert(updates, { onConflict: 'id' })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
