# Votación híbrida

Hecho:

- Reacciones con emojis mientras alguien canta o se califica (máximo por celular en Ajustes); flotan en la pantalla.
- Calificación al terminar: Bien (1) · Muy bien (2) · ¡Increíble! (3); un voto por celular, nadie califica su propia canción.
- Aplausómetro con el micrófono de la pantalla (Web Audio API) con sensibilidad baja/media/alta.
- Puntaje (`puntaje.ts`): aplausos 50% + calificación 30% + energía 20% (pesos en Ajustes); si falta una parte, su peso se reparte.
- Niveles ¡BIEN! · ¡FUEGO! · ¡OVACIÓN! · ¡LEYENDA!, y cierre automático de la votación al vencer el tiempo.
