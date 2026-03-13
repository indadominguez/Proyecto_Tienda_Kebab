console.log('JS cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // INSERTAR CSS DINÁMICO MEJORADO
    // ===============================
    const estilos = document.createElement('style');
estilos.textContent = `
    body{
        font-family: Georgia, serif;
        background-color: var(--color-blanco);
    }

    form{
        max-width:700px;
        margin:20px auto;
        padding:20px;
        border-radius:10px;
        background-color:var(--color-blanco);
        border:2px solid var(--color-primario);
    }

    input, select{
        font-size:1rem;
        padding:10px;
        border-radius:6px;
        border:1px solid #ccc;
    }

    input.valido, select.valido{
        border-color:var(--color-secundario);
    }

    input.invalido, select.invalido{
        border-color:var(--color-primario);
    }

    #filtroProducto{
        display:block;
        margin:25px auto;
        padding:8px;
        border-radius:6px;
        border:2px solid var(--color-primario);
    }

    #galeriaPedidos{
        max-width:1000px;
        margin:30px auto;
        overflow-x:auto;
    }

    #galeriaPedidos h2{
        text-align:center;
        color:var(--color-primario);
    }

    .pedidos-container{
        display:flex;
        gap:20px;
    }

    article.pedido{
        flex:0 0 auto;
        width:260px;
        background-color:var(--color-blanco);
        border-radius:10px;
        border:2px solid var(--color-secundario);
        padding:15px;
        text-align:center;
        transition:transform .2s, box-shadow .2s;
    }

    article.pedido:hover{
        transform:translateY(-5px);
        box-shadow:0 6px 12px rgba(0,0,0,0.15);
    }

    article.pedido img{
        width:100%;
        border-radius:6px;
        margin-bottom:10px;
    }

    .boton-eliminar{
        background-color:var(--color-primario);
        color:var(--color-blanco);
        border:none;
        padding:8px 14px;
        border-radius:6px;
        cursor:pointer;
    }

    .boton-eliminar:hover{
        background-color:var(--color-secundario);
        color:var(--color-oscuro);
    }
`;
document.head.appendChild(estilos);

    // ===============================
    // VARIABLES PRINCIPALES
    // ===============================
    const formulario = document.querySelector('#formularioPedido');

    const galeriaPedidos = document.createElement('section');
    galeriaPedidos.id = 'galeriaPedidos';
    galeriaPedidos.innerHTML = '<h2>Pedidos añadidos</h2><div class="pedidos-container"></div>';
    formulario.parentNode.insertBefore(galeriaPedidos, formulario.nextSibling);

    const pedidosContainer = galeriaPedidos.querySelector('.pedidos-container');

    const selectFiltro = document.createElement('select');
    selectFiltro.id = 'filtroProducto';
    selectFiltro.innerHTML = `
        <option value="todos">Todos</option>
        <option value="Kebab clásico">Kebab clásico</option>
        <option value="Durum mixto">Durum mixto</option>
        <option value="Patatas con carne">Patatas con carne</option>
    `;
    formulario.parentNode.insertBefore(selectFiltro, galeriaPedidos);

    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    const imagenesProductos = {
        'Kebab clásico': 'assets/img/Kebab-Patatas-Coca-Cola.png',
        'Durum mixto': 'assets/img/menu-durum.png',
        'Patatas con carne': 'assets/img/patatas-carne.png'
    };
    
    // ===============================
    // FUNCIONES
    // ===============================
    function mostrarPedido(pedido) {
        const articulo = document.createElement('article');
        articulo.classList.add('pedido');
        articulo.dataset.producto = pedido.producto;

        articulo.innerHTML = `
            <img src="${imagenesProductos[pedido.producto]}" alt="${pedido.producto}" width="150">
            <p><strong>Nombre:</strong> ${pedido.nombre}</p>
            <p><strong>Correo:</strong> ${pedido.correo}</p>
            <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
            <p><strong>Dirección:</strong> ${pedido.direccion}</p>
            <p><strong>Producto:</strong> ${pedido.producto}</p>
            <p><strong>Cantidad:</strong> ${pedido.cantidad}</p>
            <button class="boton-eliminar">Eliminar</button>
        `;

        articulo.querySelector('.boton-eliminar').addEventListener('click', () => {
            eliminarPedido(pedido);
            articulo.remove();
        });

        pedidosContainer.appendChild(articulo);
    }

    function eliminarPedido(pedido) {
        pedidos = pedidos.filter(p => p !== pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    
    const campos = ['nombre','correo','telefono','direccion','producto','cantidad'];

    function validarCampo(campo) {
        const valor = campo.value.trim();
        if(!valor) {
            campo.classList.add('invalido');
            campo.classList.remove('valido');
            return false;
        } else {
            campo.classList.add('valido');
            campo.classList.remove('invalido');
            return true;
        }
    }

    formulario.addEventListener('input', e => {
        if(campos.includes(e.target.id)) validarCampo(e.target);
    });

    formulario.addEventListener('submit', e => {
        e.preventDefault();
        let valido = true;

        campos.forEach(id => {
            const campo = document.querySelector(`#${id}`);
            if(!validarCampo(campo)) valido = false;
        });

        if(!valido) return;

        const pedido = {
            nombre: document.querySelector('#nombre').value.trim(),
            correo: document.querySelector('#correo').value.trim(),
            telefono: document.querySelector('#telefono').value.trim(),
            direccion: document.querySelector('#direccion').value.trim(),
            producto: document.querySelector('#producto').value,
            cantidad: document.querySelector('#cantidad').value
        };

        pedidos.push(pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));

        mostrarPedido(pedido);

        formulario.reset();
        campos.forEach(id => document.querySelector(`#${id}`).classList.remove('valido'));
    });

    pedidos.forEach(pedido => mostrarPedido(pedido));

    selectFiltro.addEventListener('change', () => {
        const valor = selectFiltro.value;
        const articulos = pedidosContainer.querySelectorAll('article');

        articulos.forEach(a => {
            if(valor === 'todos' || a.dataset.producto === valor) {
                a.style.display = 'block';
            } else {
                a.style.display = 'none';
            }
        });
    });
});