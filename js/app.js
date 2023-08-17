//Variable que mantiene el estado visible del carrito 
let carritoVisible = false;

//Esperamos que todos los elementos de la pagina se carguen para continuar con el script

if(document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded',ready)
}else{
    ready();
}

function ready(){
    //Agregamos funcionalidad de los botones eliminar del carrito
    let botonesEliminarItem = document.getElementsByClassName('btn-eliminar')
    for(let i=0; i < botonesEliminarItem.length; i++){
        let button = botonesEliminarItem [i]
        button.addEventListener('click', eliminarItemCarrito);
    }

    //Agregamoos la funcion de sumar la cantidad del producto
    let botonesSumarCantidad = document.getElementsByClassName ('sumar-cantidad');
    for (let i = 0; i < botonesSumarCantidad.length;i++){
        let button = botonesSumarCantidad [i];
        button.addEventListener('click', sumarCantidad);
    }
    //Agregamoos la funcion de restar la cantidad del producto
    let botonesRestarCantidad = document.getElementsByClassName ('restar-cantidad');
    for (let i = 0; i < botonesRestarCantidad.length;i++){
        let button = botonesRestarCantidad [i];
        button.addEventListener('click', restarCantidad);
    }
    //agregamos la funcionalidad de agregar al carrito
    let botonesAgregarAlCarrito = document.getElementsByClassName ('boton-item');
    for(var i = 0; i<botonesAgregarAlCarrito.length;i++){
        let button = botonesAgregarAlCarrito [i];
        button.addEventListener('click', agregarAlCarritoClicked)
    }
    //Agregamos funcionalidad al boton de pagar 
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked)
}

//Elimino el item seleccionado del carrito
function eliminarItemCarrito(event){
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();

    //Actualizamos el total del carrito una ves hemos eliminado un item
    actualizarTotalCarrito();

    //la siguiente funcion controla si hay elementos en el carrito una vez que se elimino
    //sino debo ocultar 
    ocultarCarrito()
}
//acutalizar total carrito 
function actualizarTotalCarrito(){
    //Seleccionamos contenedor del carrito
    let carritoContenedor = document.getElementsByClassName('carrito') [0];
    let carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    let total = 0
    
    //Recorremos cada elemento del carrito para actualizar el total 
    for (let i=0; i < carritoItems.length; i++){
        let item = carritoItems[i];
        let precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        console.log(precioElemento);    
        //Quitamos el simbolo de soles y punto milesimo 
        let precio = parseFloat(precioElemento.innerText.replace('$', '').replace ('.',''));
        console.log(precio);
        let cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        let cantidad = cantidadItem.value;
        console.log(cantidad)
        total = total + (precio * cantidad)
    }
    total = Math.round(total * 100)/100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ',00';
}

function ocultarCarrito(){
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    if(carritoItems.childElementCount == 0){
        let carrito = document.getElementsByClassName ('carrito') [0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false; 

        //ahora maximizo el contenedor de los elementos 
        let items = document.getElementsByClassName('contenedor-items')[0]
        items.style.width = '100%';
    }
}

//Aumento en uno el producto seleccionado 

function sumarCantidad(event){
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.getElementsByClassName ('carrito-item-cantidad')[0].value;
    console.log(cantidadActual)
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad') [0].value = cantidadActual
    //Actualizamos el total 
    actualizarTotalCarrito();
}

function restarCantidad(event){
    let buttonClicked = event.target;
    let selector = buttonClicked.parentElement;
    let cantidadActual = selector.getElementsByClassName ('carrito-item-cantidad')[0].value;
    console.log(cantidadActual)
    cantidadActual--;

    //Controlemos que no sea menor que 1
    if(cantidadActual >=1){
    selector.getElementsByClassName('carrito-item-cantidad') [0].value = cantidadActual
    //Actualizamos el total 
    actualizarTotalCarrito();     
}
}

function agregarAlCarritoClicked(event){
    let button = event.target;
    let item = button.parentElement;
    let titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    console.log(titulo)
    let precio = item.getElementsByClassName('precio-item')[0].innerText;
    let imagenSrc = item.getElementsByClassName('img-item')[0].src;
    console.log(imagenSrc);

    //La siguiente funcion de agregar al carrito, le mandamos por parametros los valores 
    agregarItemAlCarrito(titulo, precio, imagenSrc);

    //hacemos visible el carrito cuando agrega primera vez 
    hacerVisibleCarrito();
    
}

function agregarItemAlCarrito (titulo, precio, imagenSrc){
    let item = document.createElement('div');
    item.classList.add = 'item';
    let itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    //vamos a controlar  que el item  que esta ingresando no se encuentra en el carrito
    let nombresItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for(let i=0; i < nombresItemsCarrito.length;i++){
        if(nombresItemsCarrito[i].innerText==titulo){
            alert("El producto ya se encuentra en el carrito");
            return;
        }
    }

    let itemCarritoContenido = `
    <div class="carrito-item">
        <img src="${imagenSrc}" alt="" width="80px">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
            <span class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </span>
        </div>
    </div>
    `
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    //agregamos la funcionalidad de eliminar del nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    //agregamos la funcion de sumar el nuevo item 
    let botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener ('click', sumarCantidad);

    //agregamos la funcion de restar el nuevo item 
    let botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener ('click', restarCantidad);
}

function pagarClicked(event){
    alert("Gracias por su compra")
    //Elimino todos los elemntos del carrito
    let carritoItems = document.getElementsByClassName('carrito-items')[0];
    while(carritoItems.hasChildNodes()){
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();

    //funcion ocultar carrito
    ocultarCarrito()
}

function hacerVisibleCarrito(){
    carritoVisible = true
    let carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1'

    let items = document.getElementsByClassName ('contenedor-carrito')[0];
    items.style.width = '60%';
}