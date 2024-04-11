let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebida',
    3: 'Postre'
};


const btnAgregar = document.querySelector('#btn-agregar');
const form = document.querySelector('#form');

btnAgregar.addEventListener('click', guardarCliente);

function guardarCliente(){
    // console.log('desde la funcion');
    const btnMesa = document.querySelector('#mesa').value;
    const btnHora = document.querySelector('#hora').value;

    const camposVacios = [ btnMesa, btnHora ].some( campo => campo === '');

    if(camposVacios){
        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('DIV');
            alerta.classList.add('d-block', 'text-center', 'text-danger', 'p-3', 'invalid-feedback');
            alerta.textContent = 'Todos los campos son obligatorios.';
            form.appendChild(alerta);

            setTimeout(() =>{
                alerta.remove();
            }, 3000)
        }

        return;
    }

    cliente = {...cliente, btnHora, btnMesa }
    cliente.mesa = btnMesa;
    cliente.hora = btnHora;
    // console.log(cliente)
    // ocultar modal
    const modalElement = document.getElementById('exampleModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    
    mostrarSeccion();

    obtenerPlato();


}
/////////////////////////////////////////////////////////////////////////////////////////////////////
function mostrarSeccion(){
    const seccionOculta = document.querySelectorAll('.d-none');
    seccionOculta.forEach(seccion => {
        seccion.classList.remove('d-none');
    })
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
function obtenerPlato(){
    const url = 'http://localhost:3000/platillos'


    fetch(url)
        .then( respuesta => respuesta.json())
        .then( resultado => mostrarPlato(resultado))
        .catch( error => console.log(error))
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
function mostrarPlato(plato){
    // console.log(plato)
    const contenido = document.querySelector('#platos .contenido');
    plato.forEach( plt => {
        // console.log(plt);
        const row = document.createElement('DIV');
        row.classList.add('row', 'border-top', 'p-1', 'text-center');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-6','col-md-3','m-1','text-uppercase', 'text-center');
        nombre.textContent = plt.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-6','col-md-3','m-1', 'p-1', 'fw-bold', 'text-center');
        precio.textContent = `$${plt.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-6','col-md-3','m-1', 'p-1', 'text-center');
        categoria.textContent = categorias[ plt.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${plt.id}`;
        inputCantidad.classList.add('form-control');
                    ///////////
        inputCantidad.onchange = function(){
            const cantidad = parseInt( inputCantidad.value );
            agregarPlato({...plt, cantidad});
        };

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-8', 'col-md-2');
        
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar)

        contenido.appendChild(row);

    })
}

function agregarPlato(producto){
    // console.log( producto)
    let { pedido } = cliente;
        
    if( producto.cantidad > 0 ){
        // console.log('mayor a 0')
        //console.log(pedido.some( articulo => articulo.id === producto.id))
        if(pedido.some( articulo => articulo.id === producto.id)){
            // EL ARTICULO YA EXISTE
            const pedidoActualizado = pedido.map( articulo =>{
                if( articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad
                } 
                return articulo;
            });
            // se asigna al nuevo array 
            cliente.pedido = [...pedidoActualizado];
        } else{

            cliente.pedido = [...pedido, producto];
        }
        

    } else{
        // console.log('no es mayor a 0')
        // eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado]
    }
    // console.log(cliente.pedido)
    // limpiar HTML
    limpiarHTML();
//////////////////////////////
    if(cliente.pedido.length){
        actualizarResumen();
    } else{
        mensajePedidoVacio();
    }

    

} 

function actualizarResumen(){
    // console.log('desde act resumen.')
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-5', 'm-2', 'p-1', 'border', 'rounded', 'shadow', 'card');

    // console.log(cliente.mesa)
    // console.log(cliente.hora)

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    const heading = document.createElement('H4');
    heading.textContent = 'Platos consumidos';
    heading.classList.add('m-1');

    // iterar sobre el array de pedidos..
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group')

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        // console.log(articulo)
        const { nombre ,cantidad, precio, id } = articulo;

        const li = document.createElement('LI');
        li.classList.add('list-group-item');

        const nombreLi = document.createElement('H4');
        nombreLi.classList.add('p-1');
        nombreLi.textContent = nombre;

        const cantidadLi = document.createElement('P');
        cantidadLi.classList.add('fw-bold');
        cantidadLi.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN')
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        const precioLi = document.createElement('P');
        precioLi.classList.add('fw-bold');
        precioLi.textContent = 'Cantidad: ';

        const precioValor = document.createElement('SPAN')
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        const subtotalLi = document.createElement('P');
        subtotalLi.classList.add('fw-bold');
        subtotalLi.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('SPAN')
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio,cantidad);

        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar Pedido';

        btnEliminar.onclick = function(){
            eliminarProdID(id);
        }

        cantidadLi.appendChild(cantidadValor);
        precioLi.appendChild(precioValor);
        subtotalLi.appendChild(subtotalValor);

        li.appendChild(nombreLi);
        li.appendChild(cantidadLi);
        li.appendChild(precioLi);
        li.appendChild(subtotalLi);
        li.appendChild(btnEliminar);


        grupo.appendChild(li);

    })

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);


    contenido.appendChild(resumen);

    ////// PROPINAS ////

    formularioPropinas();

    // console.log(contenido)
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido')
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}

function calcularSubtotal(precio,cantidad){

    return precio * cantidad;
}

function eliminarProdID(id){
    // console.log('eliminando producto... ')
    const { pedido } = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id);
    cliente.pedido = [...resultado]

    // console.log(cliente.pedido)
    limpiarHTML();
//////////////////////////////
    if(cliente.pedido.length){
        actualizarResumen();
    } else{
        mensajePedidoVacio();
    }    


    const productoEliminado = `#producto-${id}`
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
    console.log(productoEliminado)
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido.';

    contenido.appendChild(texto);



}

function formularioPropinas(){
    // console.log('mostrando frm');
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-6', 'formulario');

    const divForm = document.createElement('DIV');
    divForm.classList.add('card', 'p-1', 'shadow')


    const heading = document.createElement('H4');
    heading.classList.add('m-1', 'p-1');
    heading.textContent = 'Propina';

    const radioBtn10 = document.createElement('INPUT');
    radioBtn10.type = 'radio';
    radioBtn10.name = 'propina';
    radioBtn10.value= '10';
    radioBtn10.classList.add('form-check-input');

    const radioBtn10Label = document.createElement('LABEL');
    radioBtn10Label.textContent = ' %10 ';
    radioBtn10Label.classList.add('form-check-label', 'ms-3');

    const radioBtn10Div = document.createElement('DIV');
    radioBtn10Div.classList.add('form-check');

    radioBtn10.onclick = calcularPropina;

    /////////////////////////////////////////////////////////////////////////
    const radioBtn30 = document.createElement('INPUT');
    radioBtn30.type = 'radio';
    radioBtn30.name = 'propina';
    radioBtn30.value= '30';
    radioBtn30.classList.add('form-check-input');

    const radioBtn30Label = document.createElement('LABEL');
    radioBtn30Label.textContent = ' %30 ';
    radioBtn30Label.classList.add('form-check-label', 'ms-3');

    const radioBtn30Div = document.createElement('DIV');
    radioBtn30Div.classList.add('form-check');

    radioBtn30.onclick = calcularPropina;

    /////////////////////////////////////////////////////////////////////////
    const radioBtn50 = document.createElement('INPUT');
    radioBtn50.type = 'radio';
    radioBtn50.name = 'propina';
    radioBtn50.value= '50';
    radioBtn50.classList.add('form-check-input');

    const radioBtn50Label = document.createElement('LABEL');
    radioBtn50Label.textContent = ' %50 ';
    radioBtn50Label.classList.add('form-check-label', 'ms-3');

    const radioBtn50Div = document.createElement('DIV');
    radioBtn50Div.classList.add('form-check');

    radioBtn50.onclick = calcularPropina;

    /////////////////////////////////////////////////////////////////////////
    
    
    radioBtn10Div.appendChild(radioBtn10);
    radioBtn10Div.appendChild(radioBtn10Label);
    
    radioBtn30Div.appendChild(radioBtn30);
    radioBtn30Div.appendChild(radioBtn30Label);

    radioBtn50Div.appendChild(radioBtn50);
    radioBtn50Div.appendChild(radioBtn50Label);


    divForm.appendChild(heading);
    divForm.appendChild(radioBtn10Div);
    divForm.appendChild(radioBtn30Div);
    divForm.appendChild(radioBtn50Div);

    formulario.appendChild(divForm);
    

    contenido.appendChild(formulario);


}

function calcularPropina(){
    // console.log('desde calcularxd')
    const { pedido } = cliente;
    let subTotal = 0;

    pedido.forEach( articulo => {
        // console.log(articulo)
        subTotal += articulo.cantidad * articulo.precio;
        // console.log(subTotal);
    })
    

    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;
    // console.log(propinaSeleccionada);

    const propina = ((subTotal * parseInt( propinaSeleccionada)) / 100 );
    // console.log(propina);

    const total = subTotal + propina;
    // console.log(total)
    mostrarTotalHTML( subTotal , total, propina);


}

function mostrarTotalHTML( subTotal , total, propina){


    const formulario = document.querySelector('.formulario > div');
     // Limpiamos el contenido anterior

    const divTotal = document.createElement('DIV');
    divTotal.classList.add('total-pagar');

    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.textContent = 'Subtotal de la compra: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-bold');
    subtotalSpan.textContent = `$${subTotal}`;

    subtotalParrafo.appendChild(subtotalSpan);
    divTotal.appendChild(subtotalParrafo);

    const propinaParrafo = document.createElement('P');
    propinaParrafo.textContent = 'La propina es de: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-bold');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);
    divTotal.appendChild(propinaParrafo);

    const totalParrafo = document.createElement('P');
    totalParrafo.textContent = 'Total a pagar: ';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-bold');
    totalSpan.textContent = `$${total}`;
    
    const totalApagaR = document.querySelector('.total-pagar');
    if(totalApagaR){
        totalApagaR.remove();
    }

    totalParrafo.appendChild(totalSpan);
    divTotal.appendChild(totalParrafo);

    formulario.appendChild(divTotal);

}