// Hidratación de los ejemplos de publicación (PostExample).
// Vanilla JS: busca cada [data-post-example], controla clases y contadores.
// Respeta prefers-reduced-motion: si está activo, no hay transiciones (CSS).

function hidratar() {
  const docs = document.querySelectorAll('[data-post-example]');

  function entretener() {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function pausa(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  docs.forEach((raiz) => {
    if (raiz.dataset.listos) return;
    raiz.dataset.listos = '1';

    const tipo = raiz.dataset.tipo || 'like';
    const caja = (sel) => raiz.querySelector(sel);
    const salida = caja('[data-salida]');
    const anunciar = (mensaje) => {
      if (salida) salida.textContent = mensaje;
    };

    const contadores = {
      like: {
        base: Number(raiz.dataset.sinLike || 0),
        n: Number(raiz.dataset.sinLike || 0),
      },
      repost: {
        base: Number(raiz.dataset.sinRepost || 0),
        n: Number(raiz.dataset.sinRepost || 0),
      },
    };

    const actualizarContador = (clave) => {
      const c = contadores[clave];
      const el = caja(`[data-contador="${clave}"]`);
      if (el) el.textContent = String(c.n);
    };

    const actualizarCaret = () => {
      const caret = caja('[data-caret]');
      if (!caret) return;
      const campo = caja('[data-campo]');
      const vacio = !campo || campo.value === '';
      caret.classList.toggle('hidden', !vacio);
    };

    const resetar = () => {
      raiz.dataset.estado = 'inicial';
      ['like', 'repost', 'comentar', 'compartir'].forEach((clave) => {
        caja(`[data-accion="${clave}"]`)?.classList.remove(
          'demo-destacado',
          'demo-rebote',
          'demo-giro',
          'demo-resaltar',
        );
      });
      contadores.like.n = contadores.like.base;
      contadores.repost.n = contadores.repost.base;
      actualizarContador('like');
      actualizarContador('repost');

      const compo = caja('[data-compositor]');
      compo?.classList.remove('demo-resaltar');
      const campo = caja('[data-campo]');
      if (campo) campo.value = '';
      actualizarCaret();
      caja('[data-caret]')?.classList.add('hidden');
      caja('[data-sugerencias]')?.classList.add('hidden');
      const chip = caja('[data-chip]');
      if (chip) {
        chip.classList.add('hidden');
        chip.setAttribute('aria-hidden', 'true');
      }

      // Estados propios de los ejemplos nuevos.
      caja('[data-cuerpo]')?.classList.remove('demo-doble-toque');
      const pastilla = caja('[data-suscribir]');
      if (pastilla) {
        pastilla.textContent = 'Suscribirse';
        pastilla.classList.remove('postex-suscribir--activo');
      }
      const fila = caja('[data-reacciones]');
      fila?.classList.add('hidden');
      fila
        ?.querySelectorAll('[data-reaccion]')
        .forEach((r) => r.classList.remove('postex-emoji--elegida', 'demo-rebote'));

      anunciar('');
    };

    const correr = async () => {
      resetar();

      if (tipo === 'like') {
        const el = caja('[data-accion="like"]');
        el?.classList.add('demo-destacado');
        if (entretener()) {
          el?.classList.add('demo-rebote');
          await pausa(650);
          el?.classList.remove('demo-rebote');
        }
        contadores.like.n += 1;
        actualizarContador('like');
        anunciar(
          'Paso 2: el corazón se llenó de color y el contador de «me gusta» subió a ' +
            contadores.like.n +
            '.',
        );
        return;
      }

      if (tipo === 'repost') {
        const el = caja('[data-accion="repost"]');
        el?.classList.add('demo-destacado');
        if (entretener()) {
          el?.classList.add('demo-giro');
          await pausa(750);
          el?.classList.remove('demo-giro');
        }
        contadores.repost.n += 1;
        actualizarContador('repost');
        anunciar(
          'El icono de repost giró, cambió de color y el contador subió a ' +
            contadores.repost.n +
            '.',
        );
        return;
      }

      if (tipo === 'compartir') {
        const el = caja('[data-accion="compartir"]');
        el?.classList.add('demo-destacado');
        if (entretener()) {
          el?.classList.add('demo-giro');
          await pausa(650);
        }
        anunciar(
          'Al tocar el icono de compartir se abren las opciones: enviar por mensaje, copiar el enlace u otra aplicación.',
        );
        return;
      }

      if (tipo === 'comentar') {
        const compo = caja('[data-compositor]');
        const campo = caja('[data-campo]');
        compo?.classList.add('demo-resaltar');
        actualizarCaret();
        anunciar('Paso 1: aparece el campo de comentario.');
        if (campo) {
          if (entretener()) {
            const texto = '¡Muy buena explicación!';
            for (let i = 1; i <= texto.length; i += 1) {
              campo.value = texto.slice(0, i);
              await pausa(55);
            }
          } else {
            campo.value = '¡Muy buena explicación!';
          }
          actualizarCaret();
          if (entretener()) await pausa(200);
          campo.focus({ preventScroll: true });
        }
        anunciar(
          'Paso 2: el campo tiene el texto escrito y el cursor listo. Pulsas «Publicar» y el comentario queda publicado.',
        );
        return;
      }

      if (tipo === 'suscribir') {
        const pastilla = caja('[data-suscribir]');
        anunciar('Paso 1: toca el botón rojo «Suscribirse».');
        if (entretener()) await pausa(700);
        if (pastilla) {
          pastilla.textContent = '✓ Suscrito';
          pastilla.classList.add('postex-suscribir--activo');
        }
        anunciar(
          'Paso 2: el botón cambió de estado y ahora dice «Suscrito». Desde ese momento verás un aviso cada vez que el canal suba un video nuevo.',
        );
        return;
      }

      if (tipo === 'dobleToque') {
        const cuerpo = caja('[data-cuerpo]');
        anunciar(
          'Paso 1: da dos toques seguidos sobre la foto o el video (también puedes tocar el corazón).',
        );
        if (cuerpo && entretener()) {
          cuerpo.classList.add('demo-doble-toque');
          await pausa(720);
          cuerpo.classList.remove('demo-doble-toque');
        }
        const icono = caja('[data-accion="like"]');
        icono?.classList.add('demo-destacado');
        if (entretener()) {
          icono?.classList.add('demo-rebote');
          await pausa(650);
          icono?.classList.remove('demo-rebote');
        }
        contadores.like.n += 1;
        actualizarContador('like');
        anunciar(
          'Paso 2: el corazón se llenó de color y el contador de «me gusta» subió a ' +
            contadores.like.n +
            '.',
        );
        return;
      }

      if (tipo === 'reaccion') {
        const fila = caja('[data-reacciones]');
        const icono = caja('[data-accion="like"]');
        anunciar('Paso 1: mantén presionado el ícono de «Me gusta», sin soltarlo.');
        fila?.classList.remove('hidden');
        if (entretener()) await pausa(1500);
        const elegida =
          fila?.querySelector('[data-reaccion="❤️"]') || fila?.querySelector('[data-reaccion]');
        elegida?.classList.add('postex-emoji--elegida', 'demo-rebote');
        icono?.classList.add('demo-destacado');
        if (entretener()) await pausa(650);
        elegida?.classList.remove('demo-rebote');
        contadores.like.n += 1;
        actualizarContador('like');
        anunciar(
          'Paso 2: eligió la reacción ' +
            (elegida?.textContent ?? '') +
            ' sin soltar el dedo y quedó registrada. El contador de «me gusta» subió a ' +
            contadores.like.n +
            '.',
        );
        elegida?.classList.remove('postex-emoji--elegida');
        fila?.classList.add('hidden');
        return;
      }

      // mencionar
      const compo = caja('[data-compositor]');
      const campo = caja('[data-campo]');
      const sugs = caja('[data-sugerencias]');
      compo?.classList.add('demo-resaltar');
      actualizarCaret();
      anunciar('Paso 1: aparece el campo de texto con el cursor listo.');
      if (entretener()) await pausa(400);
      if (campo) {
        campo.value = '@';
        actualizarCaret();
        campo.focus({ preventScroll: true });
        if (entretener()) await pausa(350);
        sugs?.classList.remove('hidden');
        anunciar(
          'Paso 2: al escribir el símbolo @ aparece la lista de cuentas sugeridas. Elige una tocándola o con el teclado.',
        );
      }
      return;
    };

    const trigger = caja('.demo-trigger');
    trigger?.addEventListener('click', correr);

    caja('[data-campo]')?.addEventListener('input', actualizarCaret);

    caja('[data-sugerencias]')?.querySelectorAll('[data-elegir]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nombre = btn.dataset.elegir || '';
        const handle = '@' + nombre.replace(/\s+/g, '');
        const campo = caja('[data-campo]');
        if (campo) campo.value = handle + ' ';
        const chip = caja('[data-chip]');
        if (chip) {
          const texto = chip.querySelector('[data-chip-texto]');
          if (texto) texto.textContent = handle;
          chip.classList.remove('hidden');
          chip.setAttribute('aria-hidden', 'false');
        }
        anunciar(
          'Paso 3: se insertó la cuenta ' + handle + ' en el texto, resaltada. Sigue escribiendo si quieres.',
        );
      });
    });
  });
}

// Con ClientRouter cada navegación reconstruye los ejemplos en el DOM;
// `astro:page-load` se dispara en la carga inicial y en cada transición.
document.addEventListener('astro:page-load', hidratar);
hidratar();