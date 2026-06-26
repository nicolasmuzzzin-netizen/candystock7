// ===============================
// CandyStock - Versión 1
// Productos + Stock + Movimientos
// ===============================

let productos = JSON.parse(localStorage.getItem("candystock_productos")) || [];
let movimientos = JSON.parse(localStorage.getItem("candystock_movimientos")) || [];

const productoForm = document.getElementById("productoForm");
const movimientoForm = document.getElementById("movimientoForm");

const tablaProductos = document.getElementById("tablaProductos");
const tablaMovimientos = document.getElementById("tablaMovimientos");
const tablaPedidos = document.getElementById("tablaPedidos");

const productoMovimiento = document.getElementById("productoMovimiento");

const totalProductos = document.getElementById("totalProductos");
const stockTotal = document.getElementById("stockTotal");
const stockBajo = document.getElementById("stockBajo");
const valorInventario = document.getElementById("valorInventario");

// ===============================
// PRODUCTOS
// ===============================

productoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const producto = {
    id: Date.now(),
    nombre: document.getElementById("nombreProducto").value.trim(),
    categoria: document.getElementById("categoriaProducto").value.trim(),
    stock: Number(document.getElementById("stockInicial").value),
    minimo: Number(document.getElementById("stockMinimo").value),
    precio: Number(document.getElementById("precioCompra").value)
  };

  productos.push(producto);
  guardarDatos();
  productoForm.reset();
  renderizarTodo();
});

// ===============================
// MOVIMIENTOS
// ===============================

movimientoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const productoID = Number(document.getElementById("productoMovimiento").value);
  const tipo = document.getElementById("tipoMovimiento").value;
  const cantidad = Number(document.getElementById("cantidadMovimiento").value);
  const detalle = document.getElementById("detalleMovimiento").value.trim();

  const producto = productos.find((p) => p.id === productoID);

  if (!producto) {
    alert("Seleccione un producto.");
    return;
  }

  if (tipo === "entrada") {
    producto.stock += cantidad;
  }

  if (tipo === "salida") {
    if (producto.stock < cantidad) {
      alert("Stock insuficiente.");
      return;
    }
    producto.stock -= cantidad;
  }

  if (tipo === "ajuste") {
    producto.stock = cantidad;
  }

  movimientos.unshift({
    fecha: new Date().toLocaleString(),
    producto: producto.nombre,
    tipo,
    cantidad,
    detalle: detalle || "-"
  });

  guardarDatos();
  movimientoForm.reset();
  renderizarTodo();
});

// ===============================
// GUARDADO
// ===============================

function guardarDatos() {
  localStorage.setItem("candystock_productos", JSON.stringify(productos));
  localStorage.setItem("candystock_movimientos", JSON.stringify(movimientos));
}

// ===============================
// RENDER GENERAL
// ===============================

function renderizarTodo() {
  renderDashboard();
  renderProductos();
  renderMovimientos();
  renderPedidos();
}

// ===============================
// DASHBOARD
// ===============================

function renderDashboard() {
  const stockGeneral = productos.reduce((acc, p) => acc + p.stock, 0);
  const valorTotal = productos.reduce((acc, p) => acc + p.stock * p.precio, 0);
  const productosBajos = productos.filter((p) => p.stock <= p.minimo).length;

  totalProductos.textContent = productos.length;
  stockTotal.textContent = stockGeneral;
  stockBajo.textContent = productosBajos;
  valorInventario.textContent = "$" + valorTotal.toLocaleString("es-AR");
}

// ===============================
// TABLA PRODUCTOS
// ===============================

function renderProductos() {
  tablaProductos.innerHTML = "";
  productoMovimiento.innerHTML = '<option value="">Seleccionar producto</option>';

  if (productos.length === 0) {
    tablaProductos.innerHTML = `
      <tr>
        <td colspan="6">Todavía no hay productos cargados.</td>
      </tr>
    `;
    return;
  }

  productos.forEach((prod) => {
    let estado = "OK";
    let clase = "ok";

    if (prod.stock <= prod.minimo) {
      estado = "BAJO";
      clase = "low";
    }

    if (prod.stock === 0) {
      estado = "SIN STOCK";
      clase = "danger";
    }

    tablaProductos.innerHTML += `
      <tr>
        <td>${prod.nombre}</td>
        <td>${prod.categoria}</td>
        <td>${prod.stock}</td>
        <td>${prod.minimo}</td>
        <td>$${prod.precio.toLocaleString("es-AR")}</td>
        <td><span class="badge ${clase}">${estado}</span></td>
      </tr>
    `;

    productoMovimiento.innerHTML += `
      <option value="${prod.id}">${prod.nombre}</option>
    `;
  });
}

// ===============================
// TABLA MOVIMIENTOS
// ===============================

function renderMovimientos() {
  tablaMovimientos.innerHTML = "";

  if (movimientos.length === 0) {
    tablaMovimientos.innerHTML = `
      <tr>
        <td colspan="5">Todavía no hay movimientos registrados.</td>
      </tr>
    `;
    return;
  }

  movimientos.forEach((mov) => {
    tablaMovimientos.innerHTML += `
      <tr>
        <td>${mov.fecha}</td>
        <td>${mov.producto}</td>
        <td>${mov.tipo}</td>
        <td>${mov.cantidad}</td>
        <td>${mov.detalle}</td>
      </tr>
    `;
  });
}

// ===============================
// PEDIDO SUGERIDO
// ===============================

function renderPedidos() {
  tablaPedidos.innerHTML = "";

  const productosParaPedir = productos.filter((p) => p.stock <= p.minimo);

  if (productosParaPedir.length === 0) {
    tablaPedidos.innerHTML = `
      <tr>
        <td colspan="4">No hay productos por debajo del stock mínimo.</td>
      </tr>
    `;
    return;
  }

  productosParaPedir.forEach((prod) => {
    const sugerencia = Math.max(prod.minimo * 2 - prod.stock, 0);

    tablaPedidos.innerHTML += `
      <tr>
        <td>${prod.nombre}</td>
        <td>${prod.stock}</td>
        <td>${prod.minimo}</td>
        <td>Comprar ${sugerencia}</td>
      </tr>
    `;
  });
}

// ===============================
// INICIO
// ===============================

renderizarTodo();
