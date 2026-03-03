import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {

  const { data, error } = await supabase
    .from('equipos')
    .select('*')

  if (error)
    return res.status(500).json({ error: error.message })

  const tabla = data.map(e => ({
    ...e,
    dg: e.gf - e.gc
  }))

  tabla.sort((a, b) =>
    b.pts - a.pts ||
    b.dg - a.dg ||
    b.gf - a.gf
  )

  res.status(200).json(tabla)
}