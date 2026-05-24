# Murdoku Map Generator

Generador interactivo de tableros para el juego **Murdoku**, construido con React.

## Características

- Configuración de partida con rango de sospechosos (ej: `a-h`), filas, columnas y número de habitaciones
- **Fase de preparación del mapa:**
  - Dibujo de habitaciones de forma libre (formas irregulares) arrastrando el dedo
  - Colocación de obstáculos bloqueantes (🟫 Mesa, 📺 TV, 🪴 Planta) y ocupables (🟥 Alfombra, 🛋️ Sofá, 💧 Agua, 🛏️ Cama)
  - Guardado de configuraciones con persistencia entre sesiones
- **Fase de juego:**
  - Colocación de sospechosos con pulsación larga
  - Marcado automático de fila y columna con ✕ al colocar un sospechoso
  - Víctima marcada en verde
  - Descarte manual de casillas en rojo
  - Validación: un sospechoso solo puede colocarse una vez, no se puede colocar en casillas cruzadas
  - Borrado de sospechosos con restauración de casillas

## Tecnología

- React (JSX)
- Sin dependencias externas
- Persistencia con Artifact Storage API

## Uso

Abre el archivo `murdoku.jsx` como artifact en Claude.ai para jugar directamente en el navegador.
