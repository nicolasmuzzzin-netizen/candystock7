// ===============================
// CandyStock - Módulo 2
// Productos + Dashboard + LocalStorage
// ===============================

let productos = JSON.parse(localStorage.getItem("candystock_productos")) || [];

const productoForm = document.getElementById("productoForm");
const tablaProductos = document.getElementById("tablaProductos");
const productoMovimiento = document.getElementById("productoMovimiento");

const totalProductos = document.getElementById("totalProductos");
const stockTotal = document.getElementById("stockTotal");
const stockBajo = document.getElementById("stockBajo");
const valorInventario = document.getElementById("valorInventario");

productoForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const producto = {
        id: Date.now(),

        nombre: document.getElementById("nombreProducto").value,

        categoria: document.getElementById("categoriaProducto").value,

        stock: Number(document.getElementById("stockInicial").value),

        minimo: Number(document.getElementById("stockMinimo").value),

        precio: Number(document.getElementById("precioCompra").value)
    };

    productos.push(producto);

    guardar();

    productoForm.reset();

    renderizar();
    // ========================================
// MÓDULO 3
// Movimientos de Stock
// ========================================

let movimientos =
JSON.parse(localStorage.getItem("candystock_movimientos")) || [];

const movimientoForm =
document.getElementById("movimientoForm");

const tablaMovimientos =
document.getElementById("tablaMovimientos");

movimientoForm.addEventListener("submit", function(e){

    e.preventDefault();

    const productoID =
        Number(document.getElementById("productoMovimiento").value);

    const tipo =
        document.getElementById("tipoMovimiento").value;

    const cantidad =
        Number(document.getElementById("cantidadMovimiento").value);

    const detalle =
        document.getElementById("detalleMovimiento").value;

    const producto =
        productos.find(p=>p.id===productoID);

    if(!producto){

        alert("Seleccione un producto");

        return;

    }

    if(tipo==="entrada"){

        producto.stock += cantidad;

    }

    if(tipo==="salida"){

        if(producto.stock<cantidad){

            alert("Stock insuficiente");

            return;

        }

        producto.stock -= cantidad;

    }

    if(tipo==="ajuste"){

        producto.stock=cantidad;

    }

    movimientos.unshift({

        fecha:new Date().toLocaleString(),

        producto:producto.nombre,

        tipo,

        cantidad,

        detalle

    });

    guardar();

    guardarMovimientos();

    renderizar();

    renderizarMovimientos();

    movimientoForm.reset();

});

function guardarMovimientos(){

    localStorage.setItem(

        "candystock_movimientos",

        JSON.stringify(movimientos)

    );

}

function renderizarMovimientos(){

    tablaMovimientos.innerHTML="";

    if(movimientos.length===0){

        tablaMovimientos.innerHTML=`

        <tr>

            <td colspan="5">

                Sin movimientos registrados.

            </td>

        </tr>

        `;

        return;

    }

    movimientos.forEach(m=>{

        tablaMovimientos.innerHTML+=`

        <tr>

            <td>${m.fecha}</td>

            <td>${m.producto}</td>

            <td>${m.tipo}</td>

            <td>${m.cantidad}</td>

            <td>${m.detalle}</td>

        </tr>

        `;

    });

}

renderizarMovimientos();

});

function guardar() {

    localStorage.setItem(
        "candystock_productos",
        JSON.stringify(productos)
    );

}

function renderizar() {

    tablaProductos.innerHTML = "";

    productoMovimiento.innerHTML =
        '<option value="">Seleccionar producto</option>';

    if(productos.length===0){

        tablaProductos.innerHTML=`
        <tr>
            <td colspan="6">
                Todavía no hay productos cargados.
            </td>
        </tr>`;

    }

    let stockGeneral=0;
    let inventario=0;
    let bajos=0;

    productos.forEach(prod=>{

        stockGeneral+=prod.stock;

        inventario+=prod.stock*prod.precio;

        let estado="OK";
        let clase="ok";

        if(prod.stock<=prod.minimo){

            bajos++;

            estado="BAJO";

            clase="low";

        }

        if(prod.stock===0){

            estado="SIN STOCK";

            clase="danger";

        }

        tablaProductos.innerHTML+=`

        <tr>

            <td>${prod.nombre}</td>

            <td>${prod.categoria}</td>

            <td>${prod.stock}</td>

            <td>${prod.minimo}</td>

            <td>$${prod.precio.toLocaleString()}</td>

            <td>
                <span class="badge ${clase}">
                    ${estado}
                </span>
            </td>

        </tr>

        `;

        productoMovimiento.innerHTML+=`
            <option value="${prod.id}">
                ${prod.nombre}
            </option>
        `;

    });

    totalProductos.textContent=productos.length;

    stockTotal.textContent=stockGeneral;

    stockBajo.textContent=bajos;

    valorInventario.textContent="$"+inventario.toLocaleString();

}

renderizar();
