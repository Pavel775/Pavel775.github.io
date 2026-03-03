import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {

  const { data, error } = await supabase
    .from('equipos')   // 👈 IMPORTANTE
    .select('*')

  if (error)
    return res.status(500).json({ error: error.message })

  const equiposCalculados = data.map(e => {

    const pj = e.pg + e.pe + e.pp
    const dg = e.gf - e.gc

    return {
      ...e,
      pj,
      dg
    }
  })

  equiposCalculados.sort((a, b) =>
    b.pts - a.pts ||
    b.dg - a.dg ||
    b.gf - a.gf
  )

  res.status(200).json(equiposCalculados)
}