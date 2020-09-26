(function () {
  let DB;
  document.addEventListener('DOMContentLoaded', () => {
    crearDB();
    if (window.indexedDB.open('CRM', 1)) {
      obtenerClientes();
    }
  });

  //Crear la base de datos en index DB

  function crearDB() {
    const crearDB = window.indexedDB.open('CRM', 1);

    crearDB.onerror = function () {
      console.log('Hubo un error');
    };

    crearDB.onsuccess = function () {
      DB = crearDB.result;
    };

    crearDB.onupgradeneeded = function (e) {
      const db = e.target.result;
      const objectStore = db.createObjectStore('CRM', {
        keyPath: 'id',
        autoIncrement: true,
      });

      objectStore.createIndex('nombre', 'nombre', { unique: false });
      objectStore.createIndex('email', 'email', { unique: true });
      objectStore.createIndex('telefono', 'telefono', { unique: false });
      objectStore.createIndex('empresa', 'empresa', { unique: false });
      objectStore.createIndex('id', 'id', { unique: true });
    };
  }

  function obtenerClientes() {
    const abrirConexion = window.indexedDB.open('CRM', 1);

    abrirConexion.onerror = () => {
      console.log('hubo un error');
    };
    abrirConexion.onsuccess = () => {
      DB = abrirConexion.result;

      const objectStore = DB.transaction('CRM').objectStore('CRM');

      objectStore.openCursor().onsuccess = function (e) {
        const cursor = e.target.result;

        if (cursor) {
          const { nombre, empresa, email, telefono, id } = cursor.value;

          const listadoClientes = document.querySelector('#listado-clientes');

          listadoClientes.innerHTML += ` 
          <tr>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
              <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
              <p class="text-sm leading-10 text-gray-700"> ${email} </p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
              <p class="text-gray-700">${telefono}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
              <p class="text-gray-600">${empresa}</p>
          </td>
          <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
              <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
              <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
          </td>
           </tr>`;
          cursor.continue();
        } else {
          console.log('no hay mas registros');
        }
      };
    };
  }
})();
