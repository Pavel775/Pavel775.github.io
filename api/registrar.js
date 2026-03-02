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

  // Insertar partido
  const { error: errorPartido } = await supabase
    .from('partidos')
    .insert([
      {
        local,
        visitante,
        goles_local: golesLocal,
        goles_visitante: golesVisitante
      }
    ])

  if (errorPartido) {
    return res.status(500).json({ error: errorPartido })
  }

  return res.status(200).json({ success: true })
}