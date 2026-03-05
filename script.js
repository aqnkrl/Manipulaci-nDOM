// 1. AGREGAR NUEVAS TAREAS
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

// 2. ELIMINAR TAREAS
const listaParaEliminar = document.getElementById('listaTareas');

listaParaEliminar.addEventListener('click', (e) => {
    const botonEliminar = e.target.closest('[data-action="del"]');
    
    if (botonEliminar) {
        const tarjeta = botonEliminar.closest('.card');
        tarjeta.remove();
        actualizarEstadisticas();
    }
});

// 3. MARCAR COMO COMPLETADA 
const listaParaCompletar = document.getElementById('listaTareas');

listaParaCompletar.addEventListener('click', (e) => {
    const btnHecho = e.target.closest('[data-action="done"]');
    if (btnHecho) {
        const tarjeta = btnHecho.closest('.card');
        tarjeta.classList.toggle('is-done');
        actualizarEstadisticas(); 
    }
});

// 4. MARCAR COMO FAVORITA
const listaParaFavoritos = document.getElementById('listaTareas');

listaParaFavoritos.addEventListener('click', (e) => {
    const btnFav = e.target.closest('[data-action="fav"]');

    if (btnFav) {
        const tarjeta = btnFav.closest('.card');

        const esFav = tarjeta.dataset.fav === '1';

        tarjeta.dataset.fav = esFav ? '0' : '1';

        btnFav.textContent = esFav ? '☆' : '★';
        actualizarEstadisticas();
    }
});

// 5. FILTRAR POR CATEGORÍA
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

// 6. BUSCAR POR TEXTO
const inputBusqueda = document.getElementById('inputBuscar');

inputBusqueda.addEventListener('input', () => {
    const texto = inputBusqueda.value.toLowerCase();
    document.querySelectorAll('.card').forEach(tarjeta => {
        const titulo = tarjeta.querySelector('.card__title').textContent.toLowerCase();
        
        if (titulo.includes(texto)) {
            tarjeta.classList.remove('is-hidden');
        } else {
            tarjeta.classList.add('is-hidden');
        }
    });
    actualizarEstadisticas();
});

// 7. LIMPIAR BÚSQUEDA
const btnLimpiarCheck = document.getElementById('btnLimpiarBuscar');

btnLimpiarCheck.addEventListener('click', () => {
    document.getElementById('inputBuscar').value = '';
    document.querySelectorAll('.card').forEach(tarjeta => {
        tarjeta.classList.remove('is-hidden');
    });
    actualizarEstadisticas();
});

// 8Y9. ACTUALIZAR ESTADÍSTICAS Y ESTADO VACIO
function actualizarEstadisticas() {
    const todas = document.querySelectorAll('.card').length;
    const favoritas = document.querySelectorAll('.card[data-fav="1"]').length;

    const visibles = document.querySelectorAll('.card:not(.is-hidden):not(.is-done)').length;

    document.getElementById('statTotal').textContent = todas;
    document.getElementById('statVisibles').textContent = visibles;
    document.getElementById('statFavs').textContent = favoritas;

    const enPantalla = document.querySelectorAll('.card:not(.is-hidden)').length;
    document.getElementById('emptyState').classList.toggle('is-hidden', enPantalla > 0);
}

actualizarEstadisticas();

