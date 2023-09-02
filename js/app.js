// Variable que mantiene el estado visible del carrito
let carritoVisible = false;
let carritoItems = [];

// Esperamos a que todos los elementos de la página se carguen para continuar con el script
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    // Agregamos funcionalidad de los botones eliminar del carrito
    let botonesEliminarItem = Array.from(document.getElementsByClassName('btn-eliminar'));
    botonesEliminarItem.forEach(button => {
        button.addEventListener('click', eliminarItemCarrito);
    });
}

// Agregamoos la funcion de sumar la cantidad del producto
let botonesSumarCantidad = Array.from(document.getElementsByClassName('sumar-cantidad'));
botonesSumarCantidad.forEach(button => {
    button.addEventListener('click', sumarCantidad);
});

// Agregamoos la funcion de restar la cantidad del producto
let botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
for (let i = 0; i < botonesRestarCantidad.length; i++) {
    let button = botonesRestarCantidad[i];
    button.addEventListener('click', restarCantidad);
}

// Agregamos la funcionalidad de agregar al carrito
let botonesAgregarAlCarrito = Array.from(document.getElementsByClassName('boton-item'));
botonesAgregarAlCarrito.forEach(button => {
    button.addEventListener('click', agregarAlCarritoClicked);
});


// Agregamos funcionalidad al botón de pagar
document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);

// Cargar elementos del carrito desde el almacenamiento local al cargar la página
let savedCart = localStorage.getItem('cart');
if (savedCart) {
    carritoItems = JSON.parse(savedCart);
    actualizarCarritoUI();

}
function pagarClicked(event) {
    alert("Gracias por su compra");
    // Elimino todos los elementos del carrito
    carritoItems = [];
    actualizarCarritoUI();
    actualizarTotalCarrito();

    // Función para ocultar el carrito
    ocultarCarrito();
    guardarCarritoEnLocal();


}

function eliminarItemCarrito(event) {
    let buttonClicked = event.target;
    let parentElement = buttonClicked.parentElement.parentElement;

    // Eliminar el elemento del carritoItems
    let itemIndex = carritoItems.findIndex(item => item.titulo === parentElement.querySelector('.carrito-item-titulo').innerText);
    if (itemIndex !== -1) {
        carritoItems.splice(itemIndex, 1);
    }

    parentElement.remove();

    // Actualizamos el total del carrito después de eliminar un item
    actualizarTotalCarrito();

    // La siguiente función controla si hay elementos en el carrito después de eliminar, sino debemos ocultar
    ocultarCarrito();
    guardarCarritoEnLocal();
}

function actualizarTotalCarrito() {
    let total = 0;

    carritoItems.forEach(item => {
        let precio = parseFloat(item.precio.replace('$', '').replace('.', ''));
        total += precio * item.cantidad;
    });

    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ',00';

    guardarCarritoEnLocal();
}

function ocultarCarrito() {
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount === 0) {
        let carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        // Ahora maximizamos el contenedor de los elementos
        let items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

function sumarCantidad(event) {
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.querySelector('.carrito-item-cantidad');
    let cantidad = parseInt(cantidadActual.value);
    cantidad++;
    cantidadActual.value = cantidad;

    // Actualizamos el total
    actualizarTotalCarrito();
    guardarCarritoEnLocal();
}

function restarCantidad(event) {
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.querySelector('.carrito-item-cantidad');
    let cantidad = parseInt(cantidadActual.value);
    cantidad--;

    // Controlamos que no sea menor que 1
    if (cantidad >= 1) {
        cantidadActual.value = cantidad;
        // Actualizamos el total
        actualizarTotalCarrito();
        guardarCarritoEnLocal();
    }
}

function agregarAlCarritoClicked(event) {
    let button = event.target;
    let item = button.parentElement;
    let titulo = item.querySelector('.titulo-item').innerText;
    let precio = item.querySelector('.precio-item').innerText;
    let imagenSrc = item.querySelector('.img-item').src;

    // Verificamos si el producto ya existe en el carrito
    let existingItem = carritoItems.find(item => item.titulo === titulo);
    if (existingItem) {
        existingItem.cantidad++;
    } else {
        carritoItems.push({
            titulo: titulo,
            precio: precio,
            imagenSrc: imagenSrc,
            cantidad: 1
        });
    }

    // Actualizamos la UI del carrito
    actualizarCarritoUI();
    guardarCarritoEnLocal();
    hacerVisibleCarrito();
}

function actualizarCarritoUI() {
    let itemsCarrito = document.getElementsByClassName('carrito-items')[0];
    itemsCarrito.innerHTML = "";

    carritoItems.forEach(item => {
        let itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${item.imagenSrc}" alt="" width="80px">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${item.titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="${item.cantidad}" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${item.precio}</span>
                <span class="btn-eliminar">
                    <i class="fa-solid fa-trash"></i>
                </span>
            </div>
        </div>
        `;
        let itemElement = document.createElement('div');
        itemElement.innerHTML = itemCarritoContenido;
        itemsCarrito.appendChild(itemElement);

        // Agregamos la funcionalidad de eliminar al nuevo item
        itemElement.querySelector('.btn-eliminar').addEventListener('click', eliminarItemCarrito);

        // Agregamos la funcionalidad de sumar al nuevo item
        itemElement.querySelector('.sumar-cantidad').addEventListener('click', sumarCantidad);

        // Agregamos la funcionalidad de restar al nuevo item
        itemElement.querySelector('.restar-cantidad').addEventListener('click', restarCantidad);
    });
}

function guardarCarritoEnLocal() {
    localStorage.setItem('cart', JSON.stringify(carritoItems));
}

function pagarClicked(event) {
    alert("Gracias por su compra");
    // Elimino todos los elementos del carrito
    carritoItems = [];
    actualizarCarritoUI();
    actualizarTotalCarrito();

    // Funcion para ocultar el carrito
    ocultarCarrito();
    guardarCarritoEnLocal();
}

function hacerVisibleCarrito() {
    carritoVisible = true;
    let carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    let items = document.getElementsByClassName('contenedor-carrito')[0];
    items.style.width = '60%';
}
