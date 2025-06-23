/**
 * @author Pol Pleguezuelos Cascales
 * @version 1.0
 * @school estudiant 1r DAW
 * @date 2025-06-18
 * @description Juego de adivinar un número secreto de 4 cifras, con diferentes niveles de dificultad (fácil, normal y difícil). El jugador tiene que introducir números en bloques y el juego le indica cuántos números son correctos y cuántos están descolocados.
 */

let numeroSecreto = [];
let intentoActual = "";
let intentosMaximos = [];
let intentosRealizados = 0;
let dificultad = "normal";
let bloqueActivo = null;

//Esta es una funcion que te deja escoger la dificultat y en base a eso te crea un numero secreto con sus diferentes posibilidades
function crearNumeroSecreto() {
    let posibles;
    if (dificultad === "easy") {
        posibles = [1, 2, 3, 4, 5, 6];
    } else if (dificultad === "normal") {
        posibles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    } else if (dificultad === "hard") {
        posibles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    numeroSecreto = [];

    //Usando el math random escogiendo 4 numeros basados en la dificultad que hayas escogido te crea el numero secreto y lo que hace el punto push se encarga de meterlo en el array del numero secreto. El .includes se asegura de que no se repitan los numeros en el array del numero secreto, y el math.floor se encarga de que el numero sea un entero y no un decimal.
    while (numeroSecreto.length < 4) {
        const numerorandom = posibles[Math.floor(Math.random() * posibles.length)];
        if (!numeroSecreto.includes(numerorandom)) {
            numeroSecreto.push(numerorandom);
        }
    }
    console.log(numeroSecreto)
}

//Esta funcion lo que coge es cada id de cada numero secreto y si le clicas o estas encima de el lo que hace es añadir un estilo u otro
function agregarEventos() {
    const ids = ["primer", "segon", "tercer", "quart"];

    ids.forEach(id => {
        const estilovisible = document.getElementById(id);

        estilovisible.addEventListener("mouseover", function () {
            this.classList.add("sobre");
        });

        estilovisible.addEventListener("mouseout", function () {
            this.classList.remove("sobre");
        });

        estilovisible.addEventListener("click", function () {
            document.querySelectorAll(".numero span").forEach(span => span.classList.remove("seleccionat"));
            this.classList.add("seleccionat");
            bloqueActivo = this;
        });
    });

    //este event listener hace que detecte las teclas del ordenador y la funcion bloquea las demas teclas para que solo te deje introducir numeros del 0 al 9 sin exepción, y si no es un numero del 0 al 9 te salta un alert diciendo que no es un numero valido. El bloqueActivo.textContent lo que hace es que cuando le das a una tecla te la ponga en el bloque activo donde la has añadido.
    document.addEventListener("keydown", function(solonumeros) {
        
        //aqui lo que hace es que cuando introduces un numero en un bloque te pasa al siguiente automaticamente y para debbugear es mas comodo y tambien te deja navegar entre los bloques con las flechas del teclado, y si le das al enter te comprueba el intento actual.
        const siguientebloque = Array.from(document.querySelectorAll(".numero span"));
        let indiceActual = siguientebloque.indexOf(bloqueActivo);
    
        if (bloqueActivo && solonumeros.key >= '0' && solonumeros.key <= '9') {
            bloqueActivo.textContent = solonumeros.key;
            actualizarIntento();
    
            if (indiceActual < siguientebloque.length - 1) {
                bloqueActivo.classList.remove("seleccionat");
    
                const siguiente = siguientebloque[indiceActual + 1];
                siguiente.classList.add("seleccionat");
                bloqueActivo = siguiente;
            }
        }
    
        if (solonumeros.key === "Enter") {
            comprobarIntento();
        }
    
        // Si presionamos cualquier flechita de izquierda o derecha se nos irá moviendo entre las diferentes cajitas
        if (solonumeros.key === "ArrowLeft") {
            if (indiceActual > 0) {
                bloqueActivo.classList.remove("seleccionat");
                bloqueActivo = siguientebloque[indiceActual - 1];
                bloqueActivo.classList.add("seleccionat");
            }
        } else if (solonumeros.key === "ArrowRight") {
            if (indiceActual < siguientebloque.length - 1) {
                bloqueActivo.classList.remove("seleccionat");
                bloqueActivo = siguientebloque[indiceActual + 1];
                bloqueActivo.classList.add("seleccionat");
            }
        }
    });
    //aqui cuando le damos a comrpovar entiende que le has dado a clicar entonces llama a la funcion comprobarIntento, y si le das al enter tambien te hace lo mismo.
    document.getElementById("comprovar").addEventListener("click", comprobarIntento);
    //aqui cuando le das al boton reiniciar te llama a la funcion iniciarJuego que es la que se encarga de reiniciar el juego y de mostrar la dificultad.
    document.getElementById("reinici").addEventListener("click", mostrarModalDificultat);
}

//actualizar el intento actual cada vez que se cambia un numero en los bloques.
function actualizarIntento() {
    const numerosnovisibles = document.querySelectorAll(".numero span");
    intentoActual = Array.from(numerosnovisibles).map(span => span.textContent).join('');
}

// Esta funcion se encarga de comprobar el intento actual contra el numero secreto y calcular los aciertos y descolocados.
function comprobarIntento() {
    //primero comprueba si has introducido los 4 numeros y no has dejado un hueco sin introducir
    if (intentoActual.length !== 4 || intentoActual.includes("?")) {
        alert("Has d'introduir 4 xifres vàlides.");
        return;
    }
    //sino lo aciertas te incrementa en 1 los intentos hasta llegar al maximo del nivel que hayas escogido.
    intentosRealizados++;

    // te dice el numero que tienes acertados o si tienes algun numero que si entra pero no esta en la posicion que toca
    const propuesta = intentoActual.split('').map(encertado => parseInt(encertado));
    let aciertos = 0;
    let descolocados = 0;
    const usados = [];

    for (let i = 0; i < 4; i++) {
        if (propuesta[i] === numeroSecreto[i]) {
            aciertos++;
            usados.push(i);
        }
    }
    // si tienes algun numero que si entra pero no esta en la posicion que toca te lo cuenta como descolocado
    for (let i = 0; i < 4; i++) {
        if (propuesta[i] !== numeroSecreto[i]) {
            const idx = numeroSecreto.findIndex((n, j) => n === propuesta[i] && !usados.includes(j));
            if (idx !== -1) {
                descolocados++;
                usados.push(idx);
            }
        }
    }
    //actualiza el intento actual con los aciertos y descolocados
    const intentSpan = document.getElementById(`intent_${intentosRealizados}`);
    if (intentSpan) {
        intentSpan.textContent = `${intentoActual} : ${aciertos} / ${descolocados}`;
    }
    //resetea el intento actual y el bloque activo para que puedas seguir jugando
    if (aciertos === 4) {
            alert(`Has encertat el número en ${intentosRealizados} intents.`);
    } else if (intentosRealizados >= intentosMaximos) {
            alert(`Has perdido El número era ${numeroSecreto.join('')}.`);
    }
}

// Esta funcion inicia el juego, resetea los valores y crea un nuevo numero secreto.
function iniciarJuego() {
    numeroSecreto = [];
    intentoActual = "";
    intentosRealizados = 0;
    bloqueActivo = null;

    crearNumeroSecreto();
    
    document.querySelectorAll(".numero span").forEach(span => {
        span.textContent = '?';
        span.classList.remove("seleccionat");
    });

    for (let i = 1; i <= 10; i++) {
        document.getElementById(`intent_${i}`).textContent = '';
    }

    document.getElementById("modalDificultat").style.display = "none";
}

// Esta funcion se encarga de cambiar la dificultad del juego y reiniciar el juego con la nueva dificultad.
function setDificultad(nivell) {
    dificultad = nivell;
    intentosMaximos = {
        easy: 10,
        normal: 8,
        hard: 5
    }[nivell];
    iniciarJuego();
}

// Esta funcion se encarga de mostrar el modal de la dificultad al iniciar el juego.
function mostrarModalDificultat() {
    document.getElementById("modalDificultat").style.display = "flex";
}
// Esta funcion se encarga de cerrar el modal de la dificultad.
document.addEventListener("DOMContentLoaded", () => {
    agregarEventos();
    mostrarModalDificultat();
});