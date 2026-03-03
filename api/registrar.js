import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {

  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' })

  const { local, visitante, golesLocal, golesVisitante } = req.body

  const { data: equipos } = await supabase
    .from('equipos')
    .select('*')
    .in('nombre', [local, visitante])

  const equipoLocal = equipos.find(e => e.nombre === local)
  const equipoVisitante = equipos.find(e => e.nombre === visitante)

  if (!equipoLocal || !equipoVisitante)
    return res.status(400).json({ error: 'Equipo no encontrado' })

  equipoLocal.gf += golesLocal
  equipoLocal.gc += golesVisitante
  equipoVisitante.gf += golesVisitante
  equipoVisitante.gc += golesLocal

  if (golesLocal > golesVisitante) {
    equipoLocal.pg++
    equipoLocal.pts += 3
    equipoVisitante.pp++
    equipoLocal.historial.push("V")
    equipoVisitante.historial.push("D")
  }
  else if (golesLocal < golesVisitante) {
    equipoVisitante.pg++
    equipoVisitante.pts += 3
    equipoLocal.pp++
    equipoLocal.historial.push("D")
    equipoVisitante.historial.push("V")
  }
  else {
    equipoLocal.pe++
    equipoVisitante.pe++
    equipoLocal.pts++
    equipoVisitante.pts++
    equipoLocal.historial.push("E")
    equipoVisitante.historial.push("E")
  }

  equipoLocal.historial = equipoLocal.historial.slice(-5)
  equipoVisitante.historial = equipoVisitante.historial.slice(-5)

  equipoLocal.dg = equipoLocal.gf - equipoLocal.gc
  equipoVisitante.dg = equipoVisitante.gf - equipoVisitante.gc

  await supabase.from('clasificacion').update(equipoLocal).eq('id', equipoLocal.id)
  await supabase.from('clasificacion').update(equipoVisitante).eq('id', equipoVisitante.id)

  res.status(200).json({ success: true })
}