import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {

  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Método no permitido' })

  const { local, visitante, golesLocal, golesVisitante } = req.body

  const { data: equipos } = await supabase
    .from('equipos')
    .select('*')
    .in('nombre', [local, visitante])

  const equipoLocal = equipos.find(e => e.nombre === local)
  const equipoVisitante = equipos.find(e => e.nombre === visitante)

  let updateLocal = {
    pj: equipoLocal.pj + 1,
    gf: equipoLocal.gf + golesLocal,
    gc: equipoLocal.gc + golesVisitante
  }

  let updateVisitante = {
    pj: equipoVisitante.pj + 1,
    gf: equipoVisitante.gf + golesVisitante,
    gc: equipoVisitante.gc + golesLocal
  }

  if (golesLocal > golesVisitante) {
    updateLocal.pg = equipoLocal.pg + 1
    updateLocal.pts = equipoLocal.pts + 3
    updateVisitante.pp = equipoVisitante.pp + 1
  }
  else if (golesLocal < golesVisitante) {
    updateVisitante.pg = equipoVisitante.pg + 1
    updateVisitante.pts = equipoVisitante.pts + 3
    updateLocal.pp = equipoLocal.pp + 1
  }
  else {
    updateLocal.pe = equipoLocal.pe + 1
    updateLocal.pts = equipoLocal.pts + 1
    updateVisitante.pe = equipoVisitante.pe + 1
    updateVisitante.pts = equipoVisitante.pts + 1
  }

  await supabase.from('equipos').update(updateLocal).eq('nombre', local)
  await supabase.from('equipos').update(updateVisitante).eq('nombre', visitante)

  res.status(200).json({ success: true })
}