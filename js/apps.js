console.log('JS cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // VARIABLES PRINCIPALES
    // ===============================
    const formulario = document.querySelector('#formularioPedido');

    const galeriaPedidos = document.createElement('section');
    galeriaPedidos.id = 'galeriaPedidos';
    galeriaPedidos.innerHTML = `
        <h2>Pedidos añadidos</h2>
        <div class="pedidos-container"></div>
    `;
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

    const mostrarPedido = pedido => {
        const articulo = document.createElement('article');
        articulo.classList.add('pedido');
        articulo.dataset.producto = pedido.producto;

        articulo.innerHTML = `
            <img src="${imagenesProductos[pedido.producto]}" alt="${pedido.producto}" width="150">
            <p><strong>Nombre:</strong> ${pedido.nombre}</p>
            <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
            <p><strong>Dirección:</strong> ${pedido.direccion}</p>
            <p><strong>Producto:</strong> ${pedido.producto}</p>
            <p><strong>Cantidad:</strong> ${pedido.cantidad}</p>
            <button class="boton-eliminar">Eliminar</button>
        `;

        articulo.querySelector('.boton-eliminar').addEventListener('click', () => {
            articulo.classList.add('desaparecer'); 
            articulo.addEventListener('transitionend', () => articulo.remove(), { once: true });
            pedidos = pedidos.filter(p => p !== pedido);
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
        });

        pedidosContainer.appendChild(articulo);
    };

    // ===============================
    // VALIDACIÓN DE CAMPOS
    // ===============================
    const campos = formulario.querySelectorAll('input, select');

    const validarCampo = campo => {
    let valor = campo.value.trim();

    if (campo.id === 'cantidad') {
        valor = parseInt(valor, 10);
        campo.value = valor; 
    }

    const valido = campo.checkValidity();
    campo.classList.toggle('invalido', !valido);
    campo.classList.toggle('valido', valido);
    return valido;
};

    formulario.addEventListener('input', e => {
        if ([...campos].includes(e.target)) validarCampo(e.target);
    });

    formulario.addEventListener('submit', e => {
        e.preventDefault();
        let valido = true;
        campos.forEach(campo => {
            if (!validarCampo(campo)) valido = false;
        });
        if (!valido) return;

        const pedido = {
            nombre: formulario.querySelector('#nombre').value.trim(),
            telefono: formulario.querySelector('#telefono').value.trim(),
            direccion: formulario.querySelector('#direccion').value.trim(),
            producto: formulario.querySelector('#producto').value,
            cantidad: formulario.querySelector('#cantidad').value
        };

        pedidos.push(pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));

        mostrarPedido(pedido);
        formulario.reset();
        campos.forEach(campo => campo.classList.remove('valido'));
    });

    pedidos.forEach(pedido => mostrarPedido(pedido));

    // ===============================
    // FILTRO DE PEDIDOS
    // ===============================
    selectFiltro.addEventListener('change', () => {
        const valor = selectFiltro.value;
        const articulos = pedidosContainer.querySelectorAll('article');

        articulos.forEach(a => {
            a.classList.toggle('oculto', !(valor === 'todos' || a.dataset.producto === valor));
        });
    });
    
});