const productos = [
  {
    id: 1,
    nombre: "~ Haru Matcha Bear ~",
    categoria: "videojuegos",
    precio: 24.99,
    imagen: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400&auto=format&fit=crop",
    descripcion: "Oso de felpa verde salvia tradicional, súper suave."
  },
  {
    id: 2,
    nombre: "~ Haru Moss Mini Llavero ~",
    categoria: "llaveros",
    precio: 12.50,
    imagen: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&auto=format&fit=crop",
    descripcion: "Tamaño bolsillo con enganche de metal vintage."
  },
  {
    id: 3,
    nombre: "~ Haru Fairy Forest Bear ~",
    categoria: "combos",
    precio: 32.00,
    imagen: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&auto=format&fit=crop",
    descripcion: "Combo edición limitada con alitas de duende tejido."
  },
  {
    id: 4,
    nombre: "~ Cardigan Verde para Oso ~",
    categoria: "liquidacion",
    precio: 9.99,
    imagen: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&auto=format&fit=crop",
    descripcion: "Suéter tejido a mano a la medida del oso clásico."
  },
  {
    id: 5,
    nombre: "~ Haru Clover Honey Bear ~",
    categoria: "videojuegos",
    precio: 26.50,
    imagen: "https://images.unsplash.com/photo-1556012018-50c5c0da73bf?w=400&auto=format&fit=crop",
    descripcion: "Color crema con detalles de tréboles bordados."
  },
  {
    id: 6,
    nombre: "~ Haru Froggy Hat Bear ~",
    categoria: "combos",
    precio: 29.99,
    imagen: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop",
    descripcion: "Combo oso con sombrerito tejido de rana + llavero."
  }
];

let carrito = [];
let categoriaActual = "all";
let productoSeleccionado = null;
let reproduciendoMusica = false;
const NUMERO_WHATSAPP = "59170000000";

window.addEventListener("load", () => {
  const cargador = document.getElementById("pantallaCarga");
  if (cargador) {
    cargador.style.display = "none";
  }
});

function alternarBarraLateral() {
  document.getElementById("barraLateral").classList.toggle("barra-lateral--abierta");
}

function renderizarProductos(lista) {
  const cuadricula = document.getElementById("cuadriculaProductos");
  const contador = document.getElementById("contadorProductos");

  cuadricula.innerHTML = "";
  contador.textContent = `Mostrando ${lista.length} productos`;

  if (lista.length === 0) {
    cuadricula.innerHTML = "<p>No se encontraron ositos :(</p>";
    return;
  }

  lista.forEach((producto) => {
    cuadricula.innerHTML += `
      <article class="tarjeta-producto">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="tarjeta-producto__imagen" onclick="abrirModalProducto(${producto.id})">
        <h3 class="tarjeta-producto__nombre" onclick="abrirModalProducto(${producto.id})">${producto.nombre}</h3>
        <p class="tarjeta-producto__descripcion">${producto.descripcion}</p>
        <div class="tarjeta-producto__pie">
          <span class="tarjeta-producto__precio">$${producto.precio.toFixed(2)}</span>
          <button type="button" class="boton" onclick="agregarAlCarrito(${producto.id})">+ Agregar</button>
        </div>
      </article>
    `;
  });
}

function filtrarCategoria(categoria, boton) {
  categoriaActual = categoria;
  document.querySelectorAll(".categorias__boton").forEach((b) => {
    b.classList.remove("categorias__boton--activa");
  });
  boton.classList.add("categorias__boton--activa");
  filtrarProductos();
}

function filtrarProductos() {
  const texto = document.getElementById("entradaBusqueda").value.toLowerCase();

  const filtrados = productos.filter((producto) => {
    const coincideCategoria = categoriaActual === "all" || producto.categoria === categoriaActual;
    const coincideTexto =
      producto.nombre.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto);
    return coincideCategoria && coincideTexto;
  });

  renderizarProductos(filtrados);
}

function abrirModalProducto(id) {
  productoSeleccionado = productos.find((p) => p.id === id);
  document.getElementById("tituloModal").textContent = productoSeleccionado.nombre;
  document.getElementById("imagenModal").src = productoSeleccionado.imagen;
  document.getElementById("descripcionModal").textContent = productoSeleccionado.descripcion;
  document.getElementById("precioModal").textContent = `$${productoSeleccionado.precio.toFixed(2)}`;
  document.getElementById("modalProducto").classList.add("ventana--activa");
}

function cerrarModalProducto() {
  document.getElementById("modalProducto").classList.remove("ventana--activa");
}

function agregarDesdeModal() {
  if (productoSeleccionado) {
    agregarAlCarrito(productoSeleccionado.id);
    cerrarModalProducto();
  }
}

function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const elemento = carrito.find((i) => i.id === id);

  if (elemento) {
    elemento.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarInterfazCarrito();
  document.getElementById("panelCarrito").classList.add("carrito--abierto");
}

function quitarDelCarrito(indice) {
  carrito.splice(indice, 1);
  actualizarInterfazCarrito();
}

function actualizarInterfazCarrito() {
  const contenedor = document.getElementById("elementosCarrito");
  const contador = document.getElementById("contadorCarrito");
  const totalElemento = document.getElementById("totalCarrito");

  contenedor.innerHTML = "";
  let total = 0;
  let cantidadTotal = 0;

  carrito.forEach((elemento, indice) => {
    const subtotal = elemento.precio * elemento.cantidad;
    total += subtotal;
    cantidadTotal += elemento.cantidad;

    contenedor.innerHTML += `
      <div class="carrito__elemento">
        <div>
          <div class="carrito__titulo-elemento">${elemento.nombre} (x${elemento.cantidad})</div>
          <div class="carrito__precio-elemento">$${subtotal.toFixed(2)}</div>
        </div>
        <button type="button" class="boton" onclick="quitarDelCarrito(${indice})">✕</button>
      </div>
    `;
  });

  contador.textContent = cantidadTotal;
  totalElemento.textContent = `$${total.toFixed(2)}`;
}

function alternarCarrito() {
  document.getElementById("panelCarrito").classList.toggle("carrito--abierto");
}

function enviarPedidoWhatsApp() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío 🧸");
    return;
  }

  let total = 0;
  let mensaje = "¡Hola Haru Store! 🌸 Quiero pedir:\n\n";

  carrito.forEach((elemento, i) => {
    const subtotal = elemento.precio * elemento.cantidad;
    total += subtotal;
    mensaje += `${i + 1}. ${elemento.nombre} (x${elemento.cantidad}) - $${subtotal.toFixed(2)}\n`;
  });

  mensaje += `\nTotal: $${total.toFixed(2)}`;
  window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank");
}

function alternarMusica() {
  reproduciendoMusica = !reproduciendoMusica;
  document.getElementById("vinilo").classList.toggle("reproductor__vinilo--reproduciendo", reproduciendoMusica);
  document.getElementById("ecualizador").classList.toggle("reproductor__ecualizador--activo", reproduciendoMusica);
}

function abrirModalAdmin() {
  document.getElementById("modalAdmin").classList.add("ventana--activa");
}

function cerrarModalAdmin() {
  document.getElementById("modalAdmin").classList.remove("ventana--activa");
}

function iniciarSesionAdmin() {
  document.getElementById("formularioAdmin").style.display = "none";
  document.getElementById("panelAdmin").style.display = "block";
}

function cerrarSesionAdmin() {
  document.getElementById("formularioAdmin").style.display = "block";
  document.getElementById("panelAdmin").style.display = "none";
}

renderizarProductos(productos);
