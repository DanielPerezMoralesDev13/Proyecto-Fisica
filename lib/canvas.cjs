// 110 -> 160
// localStorage.setItem('angulo', '110');
// 5 -> 200
// localStorage.setItem('tamañoPala', '150');

// Crear una imagen
const img = new Image();
img.src = '/images/paisaje.jpg'; // Ruta de la imagen

// Cuando la imagen esté cargada, dibujarla en el lienzo
img.onload = () => {
    // Primero dibujamos la imagen de fondo
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Luego dibujamos la catapulta al cargar la página
    dibujarCatapulta(baseX, baseY, anguloRad);
};

// Obtener el contexto de renderizado 2D del lienzo con ID 'catapultaCanvas'
const canvas = document.getElementById('catapultaCanvas');
const ctx = canvas.getContext('2d');

// Recuperar los valores desde localStorage
const tamañoPalaDibujar = parseFloat(localStorage.getItem('tamañoPala')) + 140 || 170; // Valor por defecto 170 cm
const anguloDibujar = parseFloat(localStorage.getItem('angulo')) || 145; // Valor por defecto 145°
const pesoPiedra = parseFloat(localStorage.getItem('peso')) + 19 || 75; // Valor por defecto 75 kg

// Calcular propiedades del brazo
const baseX = 250; // Punto de pivote en X
const baseY = 310; // Punto de pivote en Y

// Convertir el ángulo a radianes
let anguloRad = (anguloDibujar * Math.PI) / 180;

// Calcular la longitud del brazo basada en el tamaño de la pala
const longitudBrazo = tamañoPalaDibujar; // Mantiene constante la longitud de la pala
// Función para dibujar la catapulta
function dibujarCatapulta(baseX, baseY, anguloRad) {
    // Calcular las posiciones finales del brazo basadas en el ángulo actual
    const finalX = baseX + longitudBrazo * Math.cos(anguloRad);
    const finalY = baseY - longitudBrazo * Math.sin(anguloRad);
    // Limpiar el canvas antes de redibujar la catapulta, pero no borrar la imagen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redibujar el paisaje para no borrarlo
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Dibujar la base de la catapulta
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(100, 300, 230, 30); // Hacer la base menos ancha

    // Dibujar el brazo de la catapulta
    ctx.strokeStyle = "#8B4513";
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(baseX, baseY);
    ctx.lineTo(finalX, finalY);
    ctx.stroke();

    // Dibujar la cubeta (para las rocas)
    ctx.beginPath();
    ctx.arc(finalX, finalY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#8B4513";
    ctx.fill();
    ctx.stroke();

    // Dibujar las ruedas
    const wheelRadius = 30;
    ctx.beginPath();
    ctx.arc(150, 330, wheelRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(330, 330, wheelRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.stroke();
}

// Dibuja la catapulta al cargar la página con el ángulo inicial
// Esto ya se hace cuando se carga la imagen en img.onload()

// Animación del lanzamiento
let animando = false; // Controla si la animación está en curso
const velocidadMovimiento = 0.05; // Velocidad de rotación del brazo
const anguloInicial = anguloRad; // Ángulo inicial del brazo

function lanzar() {
    if (animando) return; // Evita múltiples animaciones simultáneas
    animando = true; // Establece que la animación está en curso

    // Ejecuta la animación del brazo
    const intervalBrazo = setInterval(() => {
        // Actualizar el ángulo del brazo
        anguloRad -= velocidadMovimiento;

        // Redibuja la catapulta con el nuevo ángulo
        dibujarCatapulta(baseX, baseY, anguloRad);

        // Verifica si el brazo ha alcanzado el ángulo final (por ejemplo, 90 grados)
        if (anguloRad <= (90 * Math.PI) / 180) {
            clearInterval(intervalBrazo); // Detiene la animación
            animando = false;
            anguloRad = anguloInicial; // Restablece el ángulo inicial

            // Inicia la animación de la piedra después de que el brazo haya rotado
            lanzarPiedra(baseX + longitudBrazo * Math.cos((90 * Math.PI) / 180), baseY - longitudBrazo * Math.sin((90 * Math.PI) / 180), pesoPiedra, anguloDibujar, tamañoPalaDibujar);
        }
    }, 1000 / 60); // Aproximadamente 60 FPS
}

function lanzarPiedra(finalX, finalY, peso, angulo, tamañoPala) {
    let piedraX = finalX; // Posición inicial en X de la piedra
    let piedraY = finalY; // Posición inicial en Y de la piedra
    const velocidadPiedra = 4; // Velocidad de movimiento de la piedra

    const alturaMaxima = (peso >= 31 && peso <= 37)
        ? (peso / 100) * (angulo - 40) * (longitudBrazo / 200) - 0.10 // Hule
        : (peso >= 38 && peso <= 46)
            ? (peso / 100) * (angulo - 61) * (longitudBrazo / 200) - 0.21 // Piedra
            : (peso / 100) * (angulo - 86) * (longitudBrazo / 200) - 0.31 // Metal

    const desplazamientoMaximoX = (peso / 100) * (longitudBrazo * 2);

    const tiempoVuelo = (peso >= 31 && peso <= 37)
        ? Math.sqrt(869 * alturaMaxima / 9.81 + 4) // Hule
        : (peso >= 38 && peso <= 46)
            ? Math.sqrt(869 * alturaMaxima / 9.81 + 1) // Piedra
            : Math.sqrt(763 * alturaMaxima / 9.81 + 3) // Metal

    const distanciaTotal = (peso >= 31 && peso <= 37)
        ? Math.sqrt(Math.pow(desplazamientoMaximoX * 0.55, 2) + Math.pow(alturaMaxima * 1.1, 2)) - 0.27 // Hule
        : (peso >= 38 && peso <= 46)
            ? Math.sqrt(Math.pow(desplazamientoMaximoX * 0.25, 2) + Math.pow(alturaMaxima * 1.1, 2)) + 0.28// Piedra
            : Math.sqrt(Math.pow(desplazamientoMaximoX * 0.23, 2) + Math.pow(alturaMaxima * 1.1, 2)) - 0.66 // Metal

    const velocidadInicial = Math.sqrt(2 * 9.81 * alturaMaxima);

    const trayectoria = []; // Guarda la trayectoria de la piedra
    const vectores = []; // Guarda los vectores para redibujarlos en cada cuadro

    function calcularPuntoFinal(x1, y1, vx, vy, longitudFlecha) {
        const magnitud = Math.sqrt(vx * vx + vy * vy);
        const factor = longitudFlecha / magnitud;
        return {
            x2: x1 + vx * factor * 3,
            y2: y1 + vy * factor * 3
        };
    }
    const intervalPiedra = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el lienzo
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Redibuja el fondo

        dibujarCatapulta(baseX, baseY, (90 * Math.PI) / 180); // Redibuja la catapulta

        // Actualiza la posición de la piedra
        piedraX += velocidadPiedra;

        const a = -alturaMaxima / Math.pow(desplazamientoMaximoX / 2, 2);
        const h = finalX + desplazamientoMaximoX / 2;
        const k = finalY - alturaMaxima;

        piedraY = k - a * Math.pow(piedraX - h, 2);

        if (piedraY > 350) {
            piedraY = 350;
            clearInterval(intervalPiedra);
            mostrarResultados(tiempoVuelo, distanciaTotal, alturaMaxima, velocidadInicial, 9.81);
        }

        // Dibuja la piedra
        ctx.beginPath();
        ctx.arc(piedraX, piedraY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.stroke();

        // Guarda la trayectoria de la piedra
        trayectoria.push({ x: piedraX, y: piedraY });
        // Dibuja la trayectoria
        ctx.fillStyle = "#0000FF";
        let alturaMaximaDibujada = false;

        trayectoria.forEach((pos) => {
            if (!alturaMaximaDibujada && pos.y === Math.min(...trayectoria.map((p) => p.y))) {
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(pos.x, pos.y, 3, 3);
                ctx.fillText(`  Altura Máxima`, pos.x, pos.y - 15);
                ctx.fillStyle = "#0000FF";
                alturaMaximaDibujada = true; // Marcar que la altura máxima ya se ha dibujado
            } else {
                ctx.fillRect(pos.x, pos.y, 3, 3);
            }
        });

        // Calcula y almacena los vectores si aún no están guardados
        if (trayectoria.length > 5 && vectores.length === 0) {
            const inicioVector = trayectoria[5];
            const longitudFlecha = 20; // Longitud constante para todas las flechas
            const vx = velocidadInicial * Math.cos((angulo * Math.PI) / 180);
            const vy = velocidadInicial * Math.sin((angulo * Math.PI) / 180);
            const v = Math.sqrt(vx * vx + vy * vy);

            let puntoFinal = calcularPuntoFinal(inicioVector.x, inicioVector.y, -vx, 0, longitudFlecha);
            vectores.push({
                x1: inicioVector.x,
                y1: inicioVector.y,
                x2: puntoFinal.x2,
                y2: puntoFinal.y2,
                color: "#ffffff",
                nombre: `vx: ${vx.toFixed(2)}`
            });

            puntoFinal = calcularPuntoFinal(inicioVector.x, inicioVector.y, 0, -vy, longitudFlecha);
            vectores.push({
                x1: inicioVector.x,
                y1: inicioVector.y,
                x2: puntoFinal.x2,
                y2: puntoFinal.y2,
                color: "#ffffff",
                nombre: `vy: ${vy.toFixed(2)}`
            });

            puntoFinal = calcularPuntoFinal(inicioVector.x, inicioVector.y, -vx, -vy, longitudFlecha);
            vectores.push({
                x1: inicioVector.x,
                y1: inicioVector.y,
                x2: puntoFinal.x2,
                y2: puntoFinal.y2,
                color: "#ffffff",
                nombre: `v: ${v.toFixed(2)}`
            });
        }

        // Hule
        if (peso >= 31 && peso <= 37) {
            if (
                trayectoria.length >= Math.floor(desplazamientoMaximoX / (2 * velocidadPiedra)) + 22 &&
                vectores.length < 6
            ) {
                const mitadVector = trayectoria[Math.floor(trayectoria.length / 2) + 10]; // Aumentar el índice para alejar más
                const longitudFlecha = 20; // Longitud constante para todas las flechas
                const vx = velocidadInicial * Math.cos((angulo * Math.PI) / 180);
                const vy = velocidadInicial * Math.sin((angulo * Math.PI) / 180) / 2;
                const v = Math.sqrt(vx * vx + vy * vy);

                // Verificar si ya existe un vector en la posición del vector del medio
                const existeVectorMedio = vectores.some(vector =>
                    vector.x1 === mitadVector.x && vector.y1 === mitadVector.y &&
                    vector.x2 === calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha).x2 &&
                    vector.y2 === calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha).y2
                );

                if (!existeVectorMedio) {
                    // Flecha horizontal apuntando hacia la izquierda
                    let puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff",
                        nombre: `vx: ${v.toFixed(2)}`
                    });

                    // Flecha vertical apuntando hacia abajo
                    puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, 0, vy, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff", // color verde transaparente hexadecimal
                        nombre: ` vy: ${vy.toFixed(2)}`
                    });

                    // Flecha inclinada hacia abajo y hacia la izquierda
                    puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, vy, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff",
                        nombre: `v: ${vx.toFixed(2)}`
                    });
                }
            }

            if (trayectoria.length >= Math.floor(desplazamientoMaximoX / (2 * velocidadPiedra)) + 30 && vectores.length < 9) {
                const finalVector = trayectoria[trayectoria.length - 1]; // Colocar al final de la trayectoria
                const longitudFlecha = 20; // Aumentar la longitud de la flecha para que sea visible

                // Validar y calcular los componentes de velocidad
                const anguloRad = (angulo * Math.PI) / 180;
                const vx = velocidadInicial * Math.cos(anguloRad);
                const vy = velocidadInicial * Math.sin(anguloRad);
                const v = Math.sqrt(vx * vx + vy * vy);

                // Asegurarse de que los valores de velocidad sean válidos
                if (isNaN(vx) || isNaN(vy) || isNaN(v)) {
                    console.error('Error en los cálculos de velocidad. Verifique los valores de entrada.');
                    return;
                }

                // Desplazar el vector más hacia la derecha en el eje x
                const desplazamientoX = 1; // Ajusta este valor según sea necesario

                // Flecha inclinada hacia abajo y hacia la izquierda
                let puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, -vx, vy, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: `v: ${v.toFixed(2)}`
                });

                // Flecha horizontal apuntando hacia la izquierda
                puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, -vx, 0, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: `vx: ${vx.toFixed(2)}`
                });

                // Flecha vertical apuntando hacia abajo
                puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, 0, vy, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: ` vy: ${vy.toFixed(2)}`
                });
            }
        }

        // Piedra
        if (peso >= 38 && peso <= 46) {
            if (
                trayectoria.length >= Math.floor(desplazamientoMaximoX / (2 * velocidadPiedra)) + 31 &&
                vectores.length < 6
            ) {
                const mitadVector = trayectoria[Math.floor(trayectoria.length / 2) + 10]; // Aumentar el índice para alejar más
                const longitudFlecha = 20; // Longitud constante para todas las flechas
                const vx = velocidadInicial * Math.cos((angulo * Math.PI) / 180);
                const vy = velocidadInicial * Math.sin((angulo * Math.PI) / 180) / 2;
                const v = Math.sqrt(vx * vx + vy * vy);

                // Verificar si ya existe un vector en la posición del vector del medio
                const existeVectorMedio = vectores.some(vector =>
                    vector.x1 === mitadVector.x && vector.y1 === mitadVector.y &&
                    vector.x2 === calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha).x2 &&
                    vector.y2 === calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha).y2
                );

                if (!existeVectorMedio) {
                    // Flecha horizontal apuntando hacia la izquierda
                    let puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff",
                        nombre: `vx: ${v.toFixed(2)}`
                    });

                    // Flecha vertical apuntando hacia abajo
                    puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, 0, vy, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff", // color verde transaparente hexadecimal
                        nombre: ` vy: ${vy.toFixed(2)}`
                    });

                    // Flecha inclinada hacia abajo y hacia la izquierda
                    puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, vy, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff",
                        nombre: `v: ${vx.toFixed(2)}`
                    });
                }
            }

            if (trayectoria.length >= Math.floor(desplazamientoMaximoX / (2 * velocidadPiedra)) + 35 && vectores.length < 9) {
                const finalVector = trayectoria[trayectoria.length - 1]; // Colocar al final de la trayectoria
                const longitudFlecha = 20; // Aumentar la longitud de la flecha para que sea visible

                // Validar y calcular los componentes de velocidad
                const anguloRad = (angulo * Math.PI) / 180;
                const vx = velocidadInicial * Math.cos(anguloRad);
                const vy = velocidadInicial * Math.sin(anguloRad);
                const v = Math.sqrt(vx * vx + vy * vy);

                // Asegurarse de que los valores de velocidad sean válidos
                if (isNaN(vx) || isNaN(vy) || isNaN(v)) {
                    console.error('Error en los cálculos de velocidad. Verifique los valores de entrada.');
                    return;
                }

                // Desplazar el vector más hacia la derecha en el eje x
                const desplazamientoX = 1; // Ajusta este valor según sea necesario

                // Flecha inclinada hacia abajo y hacia la izquierda
                let puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, -vx, vy, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: `v: ${v.toFixed(2)}`
                });

                // Flecha horizontal apuntando hacia la izquierda
                puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, -vx, 0, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: `vx: ${vx.toFixed(2)}`
                });

                // Flecha vertical apuntando hacia abajo
                puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, 0, vy, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: ` vy: ${vy.toFixed(2)}`
                });
            }
        } // Metal
        else {
            if (
                trayectoria.length >= Math.floor(desplazamientoMaximoX / (2 * velocidadPiedra)) + 40 &&
                vectores.length < 6
            ) {
                const mitadVector = trayectoria[Math.floor(trayectoria.length / 2) + 10]; // Aumentar el índice para alejar más
                const longitudFlecha = 20; // Longitud constante para todas las flechas
                const vx = velocidadInicial * Math.cos((angulo * Math.PI) / 180);
                const vy = velocidadInicial * Math.sin((angulo * Math.PI) / 180) / 2;
                const v = Math.sqrt(vx * vx + vy * vy);

                // Verificar si ya existe un vector en la posición del vector del medio
                const existeVectorMedio = vectores.some(vector =>
                    vector.x1 === mitadVector.x && vector.y1 === mitadVector.y &&
                    vector.x2 === calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha).x2 &&
                    vector.y2 === calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha).y2
                );

                if (!existeVectorMedio) {
                    // Flecha horizontal apuntando hacia la izquierda
                    let puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, 0, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff",
                        nombre: `vx: ${v.toFixed(2)}`
                    });

                    // Flecha vertical apuntando hacia abajo
                    puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, 0, vy, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff", // color verde transaparente hexadecimal
                        nombre: ` vy: ${vy.toFixed(2)}`
                    });

                    // Flecha inclinada hacia abajo y hacia la izquierda
                    puntoFinal = calcularPuntoFinal(mitadVector.x, mitadVector.y, -vx, vy, longitudFlecha);
                    vectores.push({
                        x1: mitadVector.x,
                        y1: mitadVector.y,
                        x2: puntoFinal.x2,
                        y2: puntoFinal.y2,
                        color: "#ffffff",
                        nombre: `v: ${vx.toFixed(2)}`
                    });
                }
            }

            if (trayectoria.length >= Math.floor(desplazamientoMaximoX / (2 * velocidadPiedra)) + 45 && vectores.length < 9) {
                const finalVector = trayectoria[trayectoria.length - 1]; // Colocar al final de la trayectoria
                const longitudFlecha = 20; // Aumentar la longitud de la flecha para que sea visible

                // Validar y calcular los componentes de velocidad
                const anguloRad = (angulo * Math.PI) / 180;
                const vx = velocidadInicial * Math.cos(anguloRad);
                const vy = velocidadInicial * Math.sin(anguloRad);
                const v = Math.sqrt(vx * vx + vy * vy);

                // Asegurarse de que los valores de velocidad sean válidos
                if (isNaN(vx) || isNaN(vy) || isNaN(v)) {
                    console.error('Error en los cálculos de velocidad. Verifique los valores de entrada.');
                    return;
                }

                // Desplazar el vector más hacia la derecha en el eje x
                const desplazamientoX = 1; // Ajusta este valor según sea necesario

                // Flecha inclinada hacia abajo y hacia la izquierda
                let puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, -vx, vy, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: `v: ${v.toFixed(2)}`
                });

                // Flecha horizontal apuntando hacia la izquierda
                puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, -vx, 0, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: `vx: ${vx.toFixed(2)}`
                });

                // Flecha vertical apuntando hacia abajo
                puntoFinal = calcularPuntoFinal(finalVector.x + desplazamientoX, finalVector.y, 0, vy, longitudFlecha);
                vectores.push({
                    x1: finalVector.x + desplazamientoX,
                    y1: finalVector.y,
                    x2: puntoFinal.x2,
                    y2: puntoFinal.y2,
                    color: "#ffffff",
                    nombre: ` vy: ${vy.toFixed(2)}`
                });
            }
        }

        // Redibuja todos los vectores
        vectores.forEach((vector) => {
            dibujarFlecha(ctx, vector.x1, vector.y1, vector.x2, vector.y2, vector.color);
            // Dibujar el nombre del vector
            ctx.fillStyle = vector.color;
            // que la fuente se de 17 px y bold
            ctx.font = "17px bold";
            ctx.fillText(vector.nombre, vector.x2, vector.y2);
        });

        if (piedraX > 1330) {
            clearInterval(intervalPiedra);
            mostrarResultados(tiempoVuelo, distanciaTotal, alturaMaxima, velocidadInicial, 9.81);
        }
    }, 1000 / 60);

    function dibujarFlecha(ctx, x1, y1, x2, y2, color) {
        const headlen = 10;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - headlen * Math.cos(angle - Math.PI / 6),
            y2 - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x2 - headlen * Math.cos(angle + Math.PI / 6),
            y2 - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.lineTo(x2, y2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function mostrarResultados(tiempoVuelo, distanciaTotal, alturaMaxima, velocidadInicial, aceleracion) {
    // Cálculo de la Velocidad Final
    const velocidadFinal = Math.sqrt(Math.pow(velocidadInicial, 2) + 2 * aceleracion * alturaMaxima);

    const resultadosDiv = document.getElementById('resultadosFisica');

    // Mostrar los resultados en formato LaTeX usando MathJax
    resultadosDiv.innerHTML = `
        <h3 style="text-align: center; font-size: 24px;">Resultados de la Simulación de la Catapulta</h3>
        <p style="text-align: center; font-size: 18px;">Tiempo de Vuelo: \\( t = ${tiempoVuelo.toFixed(2)} \, \\text{ms} \\)</p>
        <p style="text-align: center; font-size: 18px;">Distancia Total: \\( d = ${distanciaTotal.toFixed(2)} \, \\text{cm} \\)</p>
        <p style="text-align: center; font-size: 18px;">Altura Máxima: \\( h_{max} = ${alturaMaxima.toFixed(2)} \, \\text{cm} \\)</p>
        <p style="text-align: center; font-size: 18px;">Velocidad Inicial: \\( v_{0} = ${velocidadInicial.toFixed(2)} \, \\text{cm/s} \\)</p>
        <p style="text-align: center; font-size: 18px;">Velocidad Final: \\( v_{f} = ${velocidadFinal.toFixed(2)} \, \\text{cm/s} \\)</p>
        <p style="text-align: center; font-size: 18px;">Aceleración: \\( a = ${aceleracion} \, \\text{m/s}^{2} \\)</p>
        
        <h4 style="text-align: center; font-size: 20px;">Fórmulas Usadas</h4>
        <p style="text-align: center; font-size: 18px;">Tiempo de Vuelo: \\( t = \\sqrt{\\frac{2h_{max}}{g}} \\)</p>
        <p style="text-align: center; font-size: 18px;">Distancia Total: \\( d = \\sqrt{x_{max}^2 + h_{max}^2} \\)</p>
        <p style="text-align: center; font-size: 18px;">Altura Máxima: \\( h_{max} = \\frac{peso}{100} \\cdot (\\theta - 110) \\cdot \\frac{longitudBrazo}{200} \\)</p>
        <p style="text-align: center; font-size: 18px;">Velocidad Inicial: \\( v_{0} = \\sqrt{2gh_{max}} \\)</p>
        <p style="text-align: center; font-size: 18px;">Velocidad Final: \\( v_{f} = \\sqrt{v_{0}^2 + 2gh_{max}} \\)</p>
        <p style="text-align: center; font-size: 18px;">Aceleración: \\( a = g = 9.81 \, \\text{m/s}^2 \\)</p>
    `;

    // Renderizar las fórmulas de LaTeX
    MathJax.typeset();
}
