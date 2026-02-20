

//quiero añadir un script antes de mi footer, a ese div le añado una clase que tenga padding, margin, un background y el color y textplaile y
//width 100% le quiero añadir a travas de js un mensaje de subcripcion y al final del contenido le añadws un enlace de ver mas


const div = document.createElement('div');

div.style.padding = '1rem ';
div.style.margin = '1rem ';
div.style.background = '#f5f5f5';
div.style.color = '#333';
div.style.textAlign = 'center';
div.style.width = '100%';


const texto = document.createElement('p');
texto.textContent = 'Suscríbete a nuestro boletín para recibir las últimas novedades.';

const enlace = document.createElement('a');
enlace.href = '#';
enlace.textContent = 'Ver mas'


div.appendChild(texto);
div.appendChild(enlace);

const footer = document.querySelector('footer');
footer.parentNode.insertBefore(div, footer);

