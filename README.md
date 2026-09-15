# Conecta · Repaso de Redes Sociales e IA

Plataforma de repaso para el curso de **Redes Sociales e Inteligencia Artificial**.
Sitio estático, sin cuentas y sin base de datos: los alumnos consultan cada tema
después de la clase presencial.

- **Alumnado:** adultos de 55–60 años, consulta desde el celular.
- **Principios:** mobile-first (360–420px), tipografía legible (Atkinson Hyperlegible,
  18px de base), contraste alto (AA/AAA), y nada de instrucciones de uso en la portada.

## Tecnología

Stacks recomendados por la documentación vigente:

- [Astro](https://astro.build) (estático, sin JavaScript por defecto)
- [Tailwind CSS v4](https://tailwindcss.com) por el plugin Vite `@tailwindcss/vite`
- MDX (`@astrojs/mdx`) para el contenido curricular
- JS vanilla mínimo: las animaciones de los ejemplos y el interruptor claro/oscuro

## Comandos

```bash
npm install        # instalar
npm run dev        # servidor local de desarrollo (http://localhost:4321)
npm run build      # comprobación de tipos + build final en dist/
npm run preview    # previsualizar el build
```

## Cómo trabaja el profesor (flujo después de cada clase)

1. **Imparte la clase** en persona.
2. **Añade el contenido** de esa clase:

   - Crea un archivo por tema en `src/content/temas/`, por ejemplo
     `c3-comentar-publicaciones.mdx`.
   - En el encabezado (frontmatter) escribe:

     ```mdx
     ---
     clase: 3
     orden: 1
     titulo: "Comentar publicaciones"
     resumen: "Una frase breve para la tarjeta del tema."
     ---
     ```

   - Puedes usar los componentes del sitio dentro del contenido:

     ```mdx
     import Pasos from "../../components/Pasos.astro";
     import Nota from "../../components/Nota.astro";
     import PostExample from "../../components/PostExample.astro";
     import Tarea from "../../components/Tarea.astro";

     <Pasos pasos={["Paso 1 para los alumnos", "Paso 2…"]} />
     <Nota nombre="Para recordar">Explicación de un término nuevo.</Nota>
     <PostExample tipo="like" boton="Ver cómo se da me gusta" />
     ```

     Tipos de `PostExample`: `like`, `comentar`, `repost`, `compartir`, `mencionar`.

3. **Desbloquea la clase** en `src/config/progreso.json`:

   ```json
   { "claseActual": 3 }
   ```

   - `claseActual` marca la clase de hoy: «la clase actual».
   - Las anteriores se muestran como «Completada» y las posteriores, «Bloqueada».

4. **Vuelve a desplegar** (push a Vercel/Netlify/GitHub Pages). El sitio se regenera solo.

## Sistema de desbloqueo

`src/config/progreso.json` → `{ "claseActual": N }`.

- `numero < N` → ✅ Completada (accesible).
- `numero === N` → 🔵 Clase de hoy (destacada).
- `numero > N` → 🔒 Bloqueada (candado + texto «Disponible próximamente»), sin enlace.

Sin usuarios ni lógica en el navegador.

## Estructura

```
src/
├── config/            progreso.json, plan.json (las 8 clases), sitio.json
├── content/
│   ├── content.config.ts   esquema de los temas
│   └── temas/              un archivo MDX por tema
├── components/        Layout, Timeline, ClassCard, PostExample, Pasos, Nota, Tarea…
├── scripts/           post-example.js (hidratación vanilla de los ejemplos)
├── styles/            global.css (tokens de diseño y modo oscuro)
└── pages/             index + /clase/[numero]/ y /clase/[numero]/[tema]/
```

## Accesibilidad

Enlace para saltar al contenido, HTML semántico, foco visible, ARIA en los estados
bloqueados, `prefers-reduced-motion` respetado en todas las animaciones, y modo
claro/oscuro que respeta la preferencia del sistema y se puede cambiar a mano
(se guarda en `localStorage`).