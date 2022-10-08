//PROYECTO
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

const importUser = document.querySelector("#import");
const formBud = document.querySelector("#presu");

const menu = document.querySelector(".contenido-principal");

eventListeners();
function eventListeners() {
  document.addEventListener("DOMContentLoaded", questionBudget);

  formulario.addEventListener("submit", addGasto);

  gastoListado.addEventListener("click", deleteGasto);
}

//si hay presupuesto ingresado,cambia el text del boton y su funcion
function changeBtn() {
  const textBtn = document.querySelector(".btn");
  const totalPre = document.querySelector("#total"); //el valor del presupuesto ingresado
  if (Number(totalPre) > 0 || importUser.value !== "") {
    textBtn.textContent = "Realizar nuevo Presupuesto";
    textBtn.addEventListener("click", () => location.reload());
  }
}

//clases
class Budget {
  constructor(budget) {
    this.budget = Number(budget);
    this.restante = Number(budget);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.budget - gastado;
  }

  deleteGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {
  insertBudget(cantidad) {
    const { budget, restante } = cantidad;

    document.querySelector("#total").textContent = budget;
    document.querySelector("#restante").textContent = restante;
  }
  printAlert(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }
    divMensaje.textContent = mensaje;

    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    setTimeout(() => {
      divMensaje.remove();
    }, 2000);
  }

  addGastoListado(gastos) {
    this.cleanHTML();

    gastos.forEach((gasto) => {
      const { cantidad, name, id } = gasto;

      const nuevoGasto = document.createElement("li");
      nuevoGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.dataset.id = id;

      nuevoGasto.innerHTML = `${name} <span class="badge badge-primary badge-pill"> ${cantidad} </span>
    `;

      const btnDelete = document.createElement("button");
      btnDelete.classList.add("btn", "btn-danger", "borrar-gasto");
      btnDelete.innerHTML = "Borrar &times;";

      btnDelete.onclick = () => {
        deleteGasto(id);
      };

      nuevoGasto.appendChild(btnDelete);

      gastoListado.appendChild(nuevoGasto);
    });
  }

  cleanHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarBudget(budgetObj) {
    const { budget, restante } = budgetObj;
    const restanteDiv = document.querySelector(".restante");

    if (budget / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");

      restanteDiv.classList.add("alert-danger");
    } else if (budget / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    if (restante <= 0) {
      ui.printAlert("Presupuesto agotado :c");
    }
  }
}

const ui = new UI();
let budget;

function questionBudget() {
  //Valido el importe ingresado
  formBud.addEventListener("submit", (e) => {
    e.preventDefault();
    if (importUser.value === "" || importUser.value <= 0) {
      alert("Ingrese un numero valido");
    } else {
      menu.style.display = "block";
    }
    budget = new Budget(importUser.value);

    ui.insertBudget(budget);
  });
}

function addGasto(e) {
  e.preventDefault();

  const name = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  if (name === "" || cantidad === "") {
    ui.printAlert("ambos campos son obligatorios", "error");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.printAlert("cantidad No valida", "error");
    return;
  }

  const gasto = {
    name,
    cantidad,
    id: Date.now(),
  };

  budget.nuevoGasto(gasto);
  ui.printAlert("gasto agregado");

  const { gastos, restante } = budget;
  ui.addGastoListado(gastos);

  ui.actRestante(restante);

  ui.comprobarBudget(budget);

  formulario.reset();
  // intento de agregado de local
  sincroStorage();
}

function sincroStorage() {
  localStorage.setItem("gasto", UI);
}

function deleteGasto(id) {
  budget.deleteGasto(id);
  const { gastos, restante } = budget;
  ui.addGastoListado(gastos);

  ui.actRestante(restante);

  ui.comprobarBudget(budget);
}
