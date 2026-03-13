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
    };

    const eliminarPedido = pedido => {
        pedidos = pedidos.filter(p => p !== pedido);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    };

    const campos = ['nombre','correo','telefono','direccion','producto','cantidad'];

    const validarCampo = campo => {
    const valor = campo.value.trim();
    campo.classList.toggle('invalido', !valor); 
    campo.classList.toggle('valido', !!valor);  
    return !!valor; 
};

    formulario.addEventListener('input', e => {
        if (campos.includes(e.target.id)) validarCampo(e.target);
    });

    formulario.addEventListener('submit', e => {
        e.preventDefault();

        let valido = true;
        campos.forEach(id => {
            const campo = document.querySelector(`#${id}`);
            if (!validarCampo(campo)) valido = false;
        });
        if (!valido) return;

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