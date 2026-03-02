import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
)

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { local, visitante, golesLocal, golesVisitante } = req.body

  const { error } = await supabase.rpc('registrar_partido', {
    p_local: local,
    p_visitante: visitante,
    p_goles_local: golesLocal,
    p_goles_visitante: golesVisitante
  })

  if (error) return res.status(500).json({ error })

  return res.status(200).json({ success: true })
}