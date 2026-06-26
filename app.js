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
