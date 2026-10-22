# Cola (fila justa)

Hecho:

- Pedir canción (del catálogo o escrita), con "¿quién canta?" (varias personas por celular), dueto, nota al DJ y "quiero competir".
- Límite de canciones en espera por persona y fila abierta/cerrada (Ajustes y Bandeja).
- Estados: en revisión → aprobada → llamada → cantando → valorando → terminada (o rechazada / cancelada).
- Rondas (`reglas.ts`): la ronda es 1 + canciones ya aprobadas de esa persona; la fila se ordena por (ronda, orden).
- Bandeja del DJ (aprobar, rechazar con motivo, aprobar todas, aviso de canción repetida) y Fila (subir/bajar, llamar, saltar, no vino, quitar, empezar, terminó).
- Mi turno: lugar, espera estimada, cancelar; vibración y aviso al faltar 2 turnos y al ser llamado.
- `simularPedidos()` para probar sin celulares.

Pendiente: tiempo real entre dispositivos (llega con Supabase) y el Puente con la computadora del DJ.
