import { createClient } from '@supabase/supabase-js'

export async function onRequestGet({ env }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY)

  const [{ data: parts }, { data: res }, { data: pays }, { data: metas }] = await Promise.all([
    supabase.from('participants').select('*'),
    supabase.from('results').select('*').eq('id', 'main').single(),
    supabase.from('payments').select('*'),
    supabase.from('meta').select('*').eq('id', 'main').single(),
  ])

  const participantsMap = {}
  for (const p of (parts || [])) {
    participantsMap[p.email] = { nombre: p.nombre, email: p.email, ...(p.data || {}) }
  }

  const paymentsMap = {}
  for (const p of (pays || [])) {
    if (p.pagado) paymentsMap[p.email] = { pagado: true, fecha: p.fecha }
  }

  return Response.json({
    participants: participantsMap,
    results: res?.data || {},
    payments: paymentsMap,
    meta: { cuota: parseInt(metas?.cuota || '15'), locked: metas?.locked || false },
  })
}
