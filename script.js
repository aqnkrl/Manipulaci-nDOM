//AGREGAR NUEVAS TAREAS 
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
});

//ELIMINAR TAREAS 
const listaTareasParaEliminar = document.getElementById('listaTareas');

listaTareasParaEliminar.addEventListener('click', (e) => {
    const botonEliminar = e.target.closest('[data-action="del"]');
    
    if (botonEliminar) {
        const tarjeta = botonEliminar.closest('.card');
        tarjeta.remove();
    }
});

// Marcar como completada
const listaParaCompletar = document.getElementById('listaTareas');

listaParaCompletar.addEventListener('click', (e) => {
    const btnHecho = e.target.closest('[data-action="done"]');
    if (btnHecho) {
        const tarjeta = btnHecho.closest('.card');
        tarjeta.classList.toggle('is-done');
    }
});

// Marcar como favorita 
const listaParaFavoritos = document.getElementById('listaTareas');

listaParaFavoritos.addEventListener('click', (e) => {
    const btnFav = e.target.closest('[data-action="fav"]');
    
    if (btnFav) {
        const tarjeta = btnFav.closest('.card');
        
        const esFav = tarjeta.dataset.fav === '1';
        
        tarjeta.dataset.fav = esFav ? '0' : '1';
        
        btnFav.textContent = esFav ? '☆' : '★';
    }
});

