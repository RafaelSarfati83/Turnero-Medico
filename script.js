const especialidades = [
    " ", "ORTOPEDIA", "CX GENERAL", "OTORRINO", "ECO", "CX PLASTICA", "CARDIOLOGIA", 
    "FISIATRIA", "CX VASCULAR", "ECO GINE", "OBSTETRICIA", "NEUROLOGIA", "DERMATOLOGIA", 
    "NEUROCIRUGIA", "GASTROENTEROLOGIA", "PROCEDIMIENTO", "GINECOLOGIA"
];

const horas = ["6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", 
               "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

const consultorios = [201, 202, 203, 204, 205, 207, 209, 210, 211];

// Inicializar datos de consultorios 
const datosConsultorios = {};
consultorios.forEach(c => datosConsultorios[c] = Array.from({ length: 4 }, () => 
    Array.from({ length: horas.length }, () => Array(7).fill(" "))
));

// 🎛️ Crear botones de consultorios mejorados
const botonesDiv = document.getElementById("botones-consultorios");
consultorios.forEach(c => {
    const btn = document.createElement("button");
    btn.textContent = `Consultorio ${c}`;
    btn.dataset.consultorio = c;
    btn.onclick = () => mostrarConsultorio(c);
    botonesDiv.appendChild(btn);
});

// Crear título del consultorio
const consultorioTitle = document.createElement("div");
consultorioTitle.className = "consultorio-title";
document.body.insertBefore(consultorioTitle, document.getElementById("tablas-container"));

// 📋 Generar 4 semanas por consultorio
const tablasContainer = document.getElementById("tablas-container");
let consultorioActual = consultorios[0];
mostrarConsultorio(consultorioActual);

function mostrarConsultorio(numero) {
    guardarDatos(consultorioActual);
    consultorioActual = numero;

    // Actualizar título
    consultorioTitle.textContent = `Consultorio ${numero}`;
    
    // Actualizar estado de botones
    document.querySelectorAll('#botones-consultorios button').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.consultorio) === numero);
    });

    // Limpiar y generar nuevas tablas
    tablasContainer.innerHTML = "";
    datosConsultorios[numero].forEach((semana, idx) => {
        const tabla = crearTablaSemana(idx + 1, semana);
        tablasContainer.appendChild(tabla);
    });

    actualizarTotalHoras();
}

function crearTablaSemana(num, semana) {
    const tabla = document.createElement("table");
    tabla.innerHTML = `<caption>Semana ${num}</caption>
    <thead>
        <tr>
            <th>Horas</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miércoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
            <th>Sábado</th>
            <th>Domingo</th>
        </tr>
    </thead>`;

    const tbody = document.createElement("tbody");
    horas.forEach((hora, idxHora) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${hora}</td>`;

        for (let dia = 0; dia < 7; dia++) {
            const celda = document.createElement("td");
            const select = document.createElement("select");

            especialidades.forEach(e => {
                const op = document.createElement("option");
                op.value = e;
                op.textContent = e;
                select.appendChild(op);
            });

            // Asignar valor del select si existe
            select.value = semana[idxHora][dia] || " ";
            
            select.onchange = () => {
                semana[idxHora][dia] = select.value;
                actualizarTotalHoras();
            };

            celda.appendChild(select);
            fila.appendChild(celda);
        }
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    return tabla;
}

function guardarDatos(consultorio) {
    const tablas = tablasContainer.querySelectorAll("table tbody");
    tablas.forEach((tbody, idx) => {
        const semana = datosConsultorios[consultorio][idx];

        tbody.querySelectorAll("tr").forEach((tr, filaIdx) => {
            const selects = tr.querySelectorAll("select");

            selects.forEach((select, diaIdx) => {
                semana[filaIdx][diaIdx] = select.value;
            });
        });
    });
}

// 🕒 Calcular total de horas por especialidad
function actualizarTotalHoras() {
    const conteo = {};

    especialidades.forEach(esp => {
        if (esp !== " ") {
            conteo[esp] = 0;
        }
    });

    const datosConsultorio = datosConsultorios[consultorioActual];

    datosConsultorio.forEach(semana => {
        semana.forEach(fila => {
            fila.forEach(esp => {
                if (esp && esp !== " ") {
                    conteo[esp] = (conteo[esp] || 0) + 1;
                }
            });
        });
    });

    const resumen = document.getElementById("resumen-horas");
    resumen.innerHTML = "";

    const especialidadesOrdenadas = Object.entries(conteo)
        .filter(([_, total]) => total > 0)
        .sort((a, b) => b[1] - a[1]);

    for (const [esp, total] of especialidadesOrdenadas) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${esp}:</strong> ${total} horas`;
        resumen.appendChild(li);
    }
}

// Inicializar el primer botón como activo
document.querySelector('#botones-consultorios button').classList.add('active');
