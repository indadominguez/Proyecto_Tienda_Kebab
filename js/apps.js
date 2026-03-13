console.log('JS cargado correctamente');

document.addEventListener('DOMContentLoaded', () => {

    // ===============================
    // VARIABLES PRINCIPALES
    // ===============================

    /**
    * Seleccionamos el formulario principal y creamos secciones
    * dinámicas para mostrar los pedidos y el filtro de productos.
    */

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

    // Cargar los pedidos guardados en localStorage o iniciar array vacío
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Definimos las imágenes de los productos para mostrarlas dinámicamente
    const imagenesProductos = {
        'Kebab clásico': 'assets/img/Kebab-Patatas-Coca-Cola.png',
        'Durum mixto': 'assets/img/menu-durum.png',
        'Patatas con carne': 'assets/img/patatas-carne.png'
    };

    // ===============================
    // FUNCIONES
    // ===============================

    /**
     * mostrarPedido
     * Esta función recibe un objeto pedido y genera dinámicamente un artículo
     * dentro de la galería de pedidos. Cada artículo incluye imagen, datos del pedido,
     * y un botón para eliminarlo. La función también actualiza localStorage
     * cuando un pedido es eliminado, manteniendo sincronizados los datos.
     */
    const mostrarPedido = pedido => {
        const articulo = document.createElement('article');
        articulo.classList.add('pedido');
        articulo.dataset.producto = pedido.producto;
        articulo.dataset.nombre = pedido.nombre;

        articulo.innerHTML = `
            <img src="${imagenesProductos[pedido.producto]}" alt="${pedido.producto}" width="150">
            <p><strong>Nombre:</strong> ${pedido.nombre}</p>
            <p><strong>Teléfono:</strong> ${pedido.telefono}</p>
            <p><strong>Dirección:</strong> ${pedido.direccion}</p>
            <p><strong>Producto:</strong> ${pedido.producto}</p>
            <p><strong>Cantidad:</strong> ${pedido.cantidad}</p>
            <button class="boton-eliminar">Eliminar</button>
        `;

        // Configuramos la eliminación del pedido de forma segura y animada
        articulo.querySelector('.boton-eliminar').addEventListener('click', () => {
            articulo.classList.add('desaparecer'); 
            articulo.addEventListener('transitionend', () => articulo.remove(), { once: true });
            pedidos = pedidos.filter(p => !(p.nombre === pedido.nombre && p.producto === pedido.producto));
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
        });

        pedidosContainer.appendChild(articulo);

        agregarValoracion(articulo, pedido.valoracion);
    };

    // ===============================
    // SISTEMA DE VALORACIONES
    // ===============================


    /**
     * agregarValoracion
     * Esta función añade un sistema de valoración por estrellas a un pedido.
     * Crea dinámicamente 5 estrellas dentro del artículo del pedido
     * Resaltar visualmente las estrellas al pasar el ratón (hover).
     * Guarda la puntuación seleccionada al hacer clic, actualizando
     * tanto el atributo data del artículo como el localStorage.
     * Muestra una valoración previamente guardada al cargar la página.
     * Cada estrella es interactiva y se gestiona de forma dinámica,
     * evitando contenido hardcodeado y manteniendo sincronizados
     * el DOM y los datos guardados.
     */
    const agregarValoracion = (articulo, valorGuardado = 0) => {
        const contenedor = document.createElement('div');
        contenedor.classList.add('estrellas');

        for (let i = 1; i <= 5; i++) {
            const estrella = document.createElement('span');
            estrella.classList.add('estrella');
            estrella.innerHTML = '★';
            estrella.dataset.valor = i;

            // Eventos para que se resalte y deje de resaltar las estrellas al pasar el ratón
            estrella.addEventListener('mouseenter', () => {
                contenedor.querySelectorAll('.estrella').forEach(e => {
                    e.classList.toggle('hover', e.dataset.valor <= i);
                });
            });

            estrella.addEventListener('mouseleave', () => {
                contenedor.querySelectorAll('.estrella').forEach(e => e.classList.remove('hover'));
            });
            
            // Evento click para guardar la valoración seleccionada
            estrella.addEventListener('click', () => {
                const valor = i;
                articulo.dataset.valoracion = valor;
                contenedor.querySelectorAll('.estrella').forEach(e => {
                    e.classList.toggle('activa', e.dataset.valor <= valor);
                });

                // Actualiza la valoración en localStorage
                const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos')) || [];
                const index = pedidosGuardados.findIndex(p => p.nombre === articulo.dataset.nombre && p.producto === articulo.dataset.producto);
                if (index !== -1) {
                    pedidosGuardados[index].valoracion = valor;
                    localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));
                }
            });

            contenedor.appendChild(estrella);
        }

        articulo.appendChild(contenedor);

        // Si existe una valoración previamente guardada, la muestra activada
        if (valorGuardado) {
            contenedor.querySelectorAll('.estrella').forEach(e => e.classList.toggle('activa', e.dataset.valor <= valorGuardado));
        }
    };

    // ===============================
    // VALIDACIÓN DE CAMPOS
    // ===============================

    /**
     * validarCampo
     * Función general de validación de campos del formulario usando la validación
     * nativa de HTML5 (checkValidity). También convierte la cantidad a número
     * para evitar valores como '0000001'. Aplica clases CSS de estado para
     * mostrar visualmente si un campo es válido o no.
     */
    const campos = formulario.querySelectorAll('input, select');

    const validarCampo = campo => {
        let valor = campo.value.trim();

        if (campo.id === 'cantidad') {
            valor = parseInt(valor, 10);
            if (isNaN(valor) || valor < 1) valor = 1;
            campo.value = valor;
        }

        const valido = campo.checkValidity();
        campo.classList.toggle('invalido', !valido);
        campo.classList.toggle('valido', valido);
        return valido;
    };

    // Validación en tiempo real mientras el usuario escribe
    formulario.addEventListener('input', e => {
        if ([...campos].includes(e.target)) validarCampo(e.target);
    });

    /**
     * submit
     * Evento que se activa al enviar el formulario. Valida todos los campos,
     * crea un objeto pedido, lo añade al array de pedidos y a localStorage,
     * y finalmente muestra el pedido en la galería. También limpia el formulario
     * y los estilos de validación para la próxima entrada.
     */
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

    /**
     * selectFiltro change
     * Filtra los pedidos visibles en la galería según el producto seleccionado
     * en el filtro. Oculta los que no coinciden usando la clase 'oculto'.
     */
    selectFiltro.addEventListener('change', () => {
        const valor = selectFiltro.value;
        const articulos = pedidosContainer.querySelectorAll('article');

        articulos.forEach(a => {
            a.classList.toggle('oculto', !(valor === 'todos' || a.dataset.producto === valor));
        });
    });

});