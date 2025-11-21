# Visualización de datos de adultos con Matplotlib y Plotly

Este proyecto muestra un flujo completo de análisis exploratorio y visualización de datos a partir de un dataset de adultos (por ejemplo, el clásico *Adult Census Income*), combinando:

- **Gráficos estáticos** en formato PNG usando `matplotlib.pyplot`.
- **Gráficos interactivos** en formato HTML usando `Plotly`.
- Un **manifiesto JSON** que lista todos los gráficos generados.
- Una **galería web en HTML + JavaScript** que carga y muestra automáticamente todos los gráficos.

El resultado final es una página HTML que funciona como **dashboard ligero**: permite explorar tanto imágenes estáticas como figuras interactivas, filtrarlas por tipo y abrir cada gráfico en una pestaña dedicada.

## Flujo general del proyecto

1. Carga del dataset de adultos.
2. Preprocesamiento básico:
    - Estandarización de strings (mayúsculas/minúsculas, espacios, etc.).
    - Imputación de valores faltantes simples.
    - Eliminación de registros duplicados.
    - Detección y selección de columnas útiles para el análisis.
3. Generación de visualizaciones:
    - Gráficos estáticos en PNG utilizando matplotlib.pyplot.
    - Gráficos dinámicos/interactivos en HTML con Plotly.
4. Compilación de metadatos en JSON:
    - Se recorre la carpeta `output/` y sus subcarpetas (por ejemplo: `scatter`, `boxplot`, `bar`, `heatmap`).
    - Se detecta automáticamente si cada archivo es una imagen (`.png`, `.jpg`, …) o un gráfico interactivo (`.html`).
    - Se genera un archivo `output/plots.json` con la información necesaria para la galería.
5. Visualización en la galería HTML:
    - Un archivo `index.html` lee `output/plots.json` con fetch.
    - Renderiza las tarjetas de cada gráfico (imagen o iframe).
    - Permite filtrar por carpeta (scatter, boxplot, etc.) y por tipo (imagen / interactivo).
    - Al hacer clic sobre una tarjeta, se abre el gráfico completo en una nueva pestaña.

## Tecnologías utilizadas

- Python
    - `pandas` (carga y limpieza del dataset).
    - `numpy` (operaciones numéricas básicas).
    - `matplotlib.pyplot` (gráficos estáticos en PNG).
    - `plotly` (gráficos interactivos y exportación a HTML).
    - `pathlib`, `os`, `json` (gestión de rutas y generación del manifiesto `plots.json`).
- Frontend
    - `HTML5`, `CSS3`, `JavaScript` puro.
    - Diseño de galería responsiva para visualizar los gráficos.
    - Uso de `fetch` para cargar el archivo `plots.json`.