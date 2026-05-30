import { createClient } from '@supabase/supabase-js'

export async function onRequestPost({ request, env }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)
  const { data } = await request.json()
  const { error } = await supabase.from('results').upsert(
    { id: 'main', data: data || {}, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  )
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
