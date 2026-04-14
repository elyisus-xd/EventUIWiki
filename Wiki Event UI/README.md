# EventUI Wiki

Documentación oficial de EventUI — sistema de misiones y eventos para Minecraft.

## Estructura

```
eventui-wiki/
├── index.html              ← Introducción (página principal)
├── primeros-pasos.html
├── guias/
│   ├── instalacion.html
│   ├── crear-eventos.html
│   ├── disenar-uis.html
│   ├── objetivos.html
│   ├── recompensas.html
│   └── dependencias.html
├── referencia/
│   ├── comandos.html
│   ├── config.html
│   ├── tipos-ui.html
│   └── animaciones.html
├── desarrollo/
│   └── api-bridge.html
├── css/
│   ├── global.css
│   └── search.css
├── js/
│   └── main.js
└── netlify.toml
```

## Deploy en Netlify + GitHub

1. Sube esta carpeta a un repositorio de GitHub
2. Ve a [netlify.com](https://netlify.com) → "Add new site" → "Import an existing project"
3. Conecta tu cuenta de GitHub y selecciona el repositorio
4. En "Build settings":
   - **Build command**: dejar vacío
   - **Publish directory**: `.`
5. Haz clic en "Deploy site"

Netlify detectará el `netlify.toml` automáticamente. Cada push a la rama `main` desplegará la wiki actualizada.

## Desarrollo local

No necesitas instalar nada. Abre `index.html` directamente en el navegador, o usa un servidor local simple:

```bash
# Python
python3 -m http.server 3000

# Node (si tienes npx)
npx serve .
```

Luego abre `http://localhost:3000` en el navegador.
