(function () {
  let DB;
  let idCliente;
  const nombreInput = document.querySelector('#nombre');
  const emailInput = document.querySelector('#email');
  const telefonoInput = document.querySelector('#telefono');
  const empresaInput = document.querySelector('#empresa');

  const formulario = document.querySelector('#formulario');

  document.addEventListener('DOMContentLoaded', () => {
    conectarDB();
    //Actualiza el registro
    formulario.addEventListener('submit', actualizarCliente);
    // Verificar el ID de la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    idCliente = parametrosURL.get('id');
    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 1000);
    }
  });

  function obtenerCliente(id) {
    const transaction = DB.transaction(['CRM'], 'readwrite');
    const objectStore = transaction.objectStore('CRM');
    const cliente = objectStore.openCursor();

    cliente.onsuccess = function (e) {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value.id === Number(id)) {
          llenarFormulario(cursor.value);
        }
        cursor.continue();
      }
    };
  }
  function conectarDB() {
    const abrirConexion = window.indexedDB.open('CRM', 1);

    abrirConexion.onerror = function () {
      console.log('Hubo un error');
    };
    abrirConexion.onsuccess = function () {
      DB = abrirConexion.result;
    };
  }

  function llenarFormulario(datosClientes) {
    const { nombre, email, telefono, empresa } = datosClientes;
    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }

  function actualizarCliente(e) {
    e.preventDefault();
    if (
      nombreInput.value === '' ||
      emailInput.value === '' ||
      telefonoInput.value === '' ||
      empresaInput.value === ''
    ) {
      imprimirAlerta('Todos los campos son obligatorios', 'error');
      return;
    }
    //Actualizat Cliente
    const clienteAcutualizado = {
      nombre: nombreInput.value,
      email: emailInput.value,
      telefono: telefonoInput.value,
      empresa: empresaInput.value,
      id: Number(idCliente),
    };
    const transaction = DB.transaction(['CRM'], 'readwrite');
    const objectStore = transaction.objectStore('CRM');
    objectStore.put(clienteAcutualizado);
    transaction.oncomplete = function () {
      imprimirAlerta('El cliente se agrego correctamente');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    };
    transaction.onerror = function () {
      imprimirAlerta('Hubo un error', 'error');
    };
  }
})();
