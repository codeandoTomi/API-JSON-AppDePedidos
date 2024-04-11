let cliente = {
    mesa: '',
    hora: '',
    platos: []
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
    console.log('desde la funcion');
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
    // console.log(producto)
    let { pedido } = cliente;

    if(producto.cantidad > 0){
        cliente.pedido = [...pedido, producto]
    } else{

    }
    console.log(cliente.pedido)
}