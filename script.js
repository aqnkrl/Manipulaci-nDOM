// --- 1. AGREGAR NUEVAS TAREAS ---
const formTarea = document.getElementById('formTarea');

formTarea.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const inputTitulo = document.getElementById('inputTitulo');
    const selectTag = document.getElementById('selectTag');
    const listaTareas = document.getElementById('listaTareas');

    const titulo = inputTitulo.value.trim();
    const tag = selectTag.value;

    if (titulo === "") return;

    const nuevaTarea = document.createElement('li');
    nuevaTarea.className = 'card';
    nuevaTarea.dataset.id = 't' + Date.now();
    nuevaTarea.dataset.tag = tag;
    nuevaTarea.dataset.fav = '0';

    nuevaTarea.innerHTML = `
        <div class="card__head">
            <span class="badge">${tag}</span>
            <div class="actions">
                <button class="icon" type="button" data-action="fav" aria-label="Marcar favorito">☆</button>
                <button class="icon" type="button" data-action="done" aria-label="Marcar completada">✓</button>
                <button class="icon danger" type="button" data-action="del" aria-label="Eliminar">🗑</button>
            </div>
        </div>
        <p class="card__title">${titulo}</p>
    `;

    listaTareas.appendChild(nuevaTarea);
    inputTitulo.value = '';
    
    actualizarEstadisticas();
});

// --- 2. ELIMINAR TAREAS ---
const listaParaEliminar = document.getElementById('listaTareas');

listaParaEliminar.addEventListener('click', (e) => {
    const botonEliminar = e.target.closest('[data-action="del"]');
    if (botonEliminar) {
        botonEliminar.closest('.card').remove();
        actualizarEstadisticas();
    }
});

// --- 3. MARCAR COMO COMPLETADA ---
const listaParaCompletar = document.getElementById('listaTareas');

listaParaCompletar.addEventListener('click', (e) => {
    const btnHecho = e.target.closest('[data-action="done"]');
    if (btnHecho) {
        btnHecho.closest('.card').classList.toggle('is-done');
        actualizarEstadisticas(); 
    }
});

// --- 4. MARCAR COMO FAVORITA ---
const listaParaFavoritos = document.getElementById('listaTareas');

listaParaFavoritos.addEventListener('click', (e) => {
    const btnFav = e.target.closest('[data-action="fav"]');

    if (btnFav) {
        const tarjeta = btnFav.closest('.card');
        const esFavActual = tarjeta.dataset.fav === '1';

        tarjeta.dataset.fav = esFavActual ? '0' : '1';
        btnFav.textContent = esFavActual ? '☆' : '★';

        const filtroActivo = document.querySelector('.chip.is-active').dataset.filter;
        if (filtroActivo === 'fav' && esFavActual) {
            tarjeta.classList.add('is-hidden');
        }

        actualizarEstadisticas();
    }
});

// --- 5. FILTRAR POR CATEGORÍA ---
const chips = document.querySelectorAll('.chip');

chips.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.chip.is-active').classList.remove('is-active');
        btn.classList.add('is-active');

        const filtro = btn.dataset.filter;
        document.querySelectorAll('.card').forEach(card => {
            const esFav = card.dataset.fav === '1';
            const tag = card.dataset.tag;

            const cumple = (filtro === 'all') || 
                           (filtro === 'fav' && esFav) || 
                           (filtro === tag);

            card.classList.toggle('is-hidden', !cumple);
        });
        actualizarEstadisticas();
    });
});

// --- 6. BUSCAR POR TEXTO ---
const inputBusqueda = document.getElementById('inputBuscar');

inputBusqueda.addEventListener('input', () => {
    const texto = inputBusqueda.value.toLowerCase();
    const filtroActivo = document.querySelector('.chip.is-active').dataset.filter;

    document.querySelectorAll('.card').forEach(tarjeta => {
        const titulo = tarjeta.querySelector('.card__title').textContent.toLowerCase();
        const esFav = tarjeta.dataset.fav === '1';
        const tag = tarjeta.dataset.tag;

        // Para que la búsqueda respete el filtro activo
        const cumpleFiltro = (filtroActivo === 'all') || 
                             (filtroActivo === 'fav' && esFav) || 
                             (filtroActivo === tag);
        
        const coincideTexto = titulo.includes(texto);

        tarjeta.classList.toggle('is-hidden', !(cumpleFiltro && coincideTexto));
    });
    actualizarEstadisticas();
});

// --- 7. LIMPIAR BÚSQUEDA (CORREGIDO PARA RESPETAR FILTROS) ---
const btnLimpiarCheck = document.getElementById('btnLimpiarBuscar');

btnLimpiarCheck.addEventListener('click', () => {
    // 1. Limpiamos el texto
    document.getElementById('inputBuscar').value = '';

    // 2. Obtenemos el filtro que está seleccionado actualmente
    const filtroActivo = document.querySelector('.chip.is-active').dataset.filter;

    // 3. Mostramos solo las tarjetas que pertenecen a ese filtro
    document.querySelectorAll('.card').forEach(tarjeta => {
        const esFav = tarjeta.dataset.fav === '1';
        const tag = tarjeta.dataset.tag;

        const cumpleFiltro = (filtroActivo === 'all') || 
                             (filtroActivo === 'fav' && esFav) || 
                             (filtroActivo === tag);

        // Si cumple el filtro de arriba, le quitamos el hidden, si no, se queda oculto
        tarjeta.classList.toggle('is-hidden', !cumpleFiltro);
    });

    actualizarEstadisticas();
});

// --- 8 Y 9. ESTADÍSTICAS Y MENSAJE DE VACÍO ---
function actualizarEstadisticas() {
    const todas = document.querySelectorAll('.card').length;
    const favoritas = document.querySelectorAll('.card[data-fav="1"]').length;
    const visibles = document.querySelectorAll('.card:not(.is-hidden)').length;

    document.getElementById('statTotal').textContent = todas;
    document.getElementById('statVisibles').textContent = visibles;
    document.getElementById('statFavs').textContent = favoritas;

    const emptyState = document.getElementById('emptyState');
    if (visibles === 0) {
        emptyState.classList.remove('is-hidden');
    } else {
        emptyState.classList.add('is-hidden');
    }
}

actualizarEstadisticas();