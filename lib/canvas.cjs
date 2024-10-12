// https://chatgpt.com/c/6709ab66-7e04-8003-87cf-96c038305746
// 110 -> 160
// localStorage.setItem('angulo', '110');
// 5 -> 200
// localStorage.setItem('tamañoPala', '150');

// Obtener el contexto de renderizado 2D del lienzo con ID 'catapultaCanvas'
const canvas = document.getElementById('catapultaCanvas'); 
const ctx = canvas.getContext('2d'); 

// Recuperar los valores desde localStorage
const tamañoPalaDibujar = parseFloat(localStorage.getItem('tamañoPala')) || 170; // Valor por defecto 170 cm
const anguloDibujar = parseFloat(localStorage.getItem('angulo')) || 145; // Valor por defecto 145°
const pesoPiedra = parseFloat(localStorage.getItem('peso')) || 75; // Valor por defecto 75 kg

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

    // Limpiar el canvas antes de redibujar
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    // Dibujar la base de la catapulta
    ctx.fillStyle = "#8B4513"; 
    ctx.fillRect(50, 300, 330, 30); 

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
    ctx.arc(100, 330, wheelRadius, 0, Math.PI * 2); 
    ctx.fillStyle = "#000000"; 
    ctx.fill(); 
    ctx.stroke(); 

    ctx.beginPath(); 
    ctx.arc(400, 330, wheelRadius, 0, Math.PI * 2); 
    ctx.fillStyle = "#000000"; 
    ctx.fill(); 
    ctx.stroke(); 
}

// Dibuja la catapulta al cargar la página con el ángulo inicial
dibujarCatapulta(baseX, baseY, anguloRad);

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

    // Ajustar la altura máxima y el desplazamiento en X basado en el peso, el ángulo y la longitud de la pala
    const alturaMaxima = (peso / 100) * (angulo - 110) * (longitudBrazo / 200); 
    const desplazamientoMaximoX = (peso / 100) * (longitudBrazo * 2); 
    const tiempoVuelo = Math.sqrt(2 * alturaMaxima / 9.81); // Tiempo de vuelo (segundos)
    const distanciaTotal = Math.sqrt(Math.pow(desplazamientoMaximoX, 2) + Math.pow(alturaMaxima, 2)); // Distancia total (m)
    const velocidadInicial = Math.sqrt(2 * 9.81 * alturaMaxima); // Velocidad inicial (m/s)
    const aceleracion = 9.81; // Aceleración por gravedad (m/s²)

    const intervalPiedra = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el lienzo

        // Redibuja la catapulta
        dibujarCatapulta(baseX, baseY, (90 * Math.PI) / 180);

        // Actualiza la posición de la piedra
        piedraX += velocidadPiedra; // Aumenta el desplazamiento en X
        
        // Cálculo de la trayectoria de la piedra utilizando una parábola
        const a = -alturaMaxima / Math.pow(desplazamientoMaximoX / 2, 2); // Parámetro de la parábola
        const h = finalX + desplazamientoMaximoX / 2; // Punto de máximo de la parábola
        const k = finalY - alturaMaxima; // Punto inicial en Y ajustado hacia arriba

        // Calcula la nueva posición en Y usando la fórmula cuadrática
        piedraY = k - a * Math.pow(piedraX - h, 2);

        // Asegura que la piedra no caiga por debajo del suelo
        if (piedraY > 350) {
            piedraY = 350; 
            clearInterval(intervalPiedra); 
            mostrarResultados(tiempoVuelo, distanciaTotal, alturaMaxima, velocidadInicial, aceleracion);
        }

        // Dibuja la piedra
        ctx.beginPath(); 
        ctx.arc(piedraX, piedraY, 10, 0, Math.PI * 2); 
        ctx.fillStyle = "#FF0000"; 
        ctx.fill();
        ctx.stroke(); 

        // Verifica si la piedra ha salido del canvas
        if (piedraX > 1330) {
            clearInterval(intervalPiedra); 
            mostrarResultados(tiempoVuelo, distanciaTotal, alturaMaxima, velocidadInicial, aceleracion);
        }
    }, 1000 / 60); // Aproximadamente 60 FPS
}

function mostrarResultados(tiempoVuelo, distanciaTotal, alturaMaxima, velocidadInicial, aceleracion) {
    // Cálculo de la Velocidad Final
    const velocidadFinal = Math.sqrt(Math.pow(velocidadInicial, 2) + 2 * aceleracion * alturaMaxima);
    
    const resultadosDiv = document.getElementById('resultadosFisica');
    
    // Mostrar los resultados en formato LaTeX usando MathJax
    resultadosDiv.innerHTML = `
        <h3 style="text-align: center; font-size: 24px;">Resultados de la Simulación de la Catapulta</h3>
        <p style="text-align: center; font-size: 18px;">Tiempo de Vuelo: \\( t = ${tiempoVuelo.toFixed(2)} \, \\text{s} \\)</p>
        <p style="text-align: center; font-size: 18px;">Distancia Total: \\( d = ${distanciaTotal.toFixed(2)} \, \\text{m} \\)</p>
        <p style="text-align: center; font-size: 18px;">Altura Máxima: \\( h_{max} = ${alturaMaxima.toFixed(2)} \, \\text{m} \\)</p>
        <p style="text-align: center; font-size: 18px;">Velocidad Inicial: \\( v_{0} = ${velocidadInicial.toFixed(2)} \, \\text{m/s} \\)</p>
        <p style="text-align: center; font-size: 18px;">Velocidad Final: \\( v_{f} = ${velocidadFinal.toFixed(2)} \, \\text{m/s} \\)</p>
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

// Agregar el evento para iniciar el lanzamiento
document.getElementById('launchButton').addEventListener('click', lanzar);



// https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/
// git clone https://github.com/cloudflare/cloudflared.git --depth=1 \
// && cd cloudflared \
// && git ls-remote --tags https://github.com/cloudflare/cloudflared.git \
// && git fetch --tags \
// && git checkout tags/2024.9.1 \
// && make cloudflared \
// && go install github.com/cloudflare/cloudflared/cmd/cloudflared \
// && mv /root/cloudflared/cloudflared /usr/bin/cloudflared

/* 
El error que estás viendo parece estar relacionado con la configuración de `cloudflared` y problemas de permisos. Aquí te explico los mensajes más relevantes y qué podrías hacer para solucionarlos:

1. **GID fuera del rango `ping_group_range`**:
   - El mensaje indica que el GID (ID de grupo) del usuario que está ejecutando `cloudflared` no está dentro del rango permitido para hacer ping. Puedes corregir esto de dos maneras:
     - **Añadir el usuario a un grupo dentro del rango**: Busca un grupo con un ID que esté dentro del rango de `ping_group_range`, y añade tu usuario a ese grupo.
     - **Modificar el rango**: Cambia el rango de `ping_group_range` para incluir el GID de tu usuario. Esto se puede hacer ejecutando el siguiente comando como root:
       ```bash
       echo "1 1000" > /proc/sys/net/ipv4/ping_group_range
       ```

2. **Proxies ICMP deshabilitados**:
   - El error menciona que no se puede crear un proxy ICMPv4 debido a los problemas de permisos. Esto probablemente se resolverá al ajustar el `ping_group_range` como se mencionó anteriormente.

3. **Problema de tamaño de búfer**:
   - El error que dice "failed to sufficiently increase receive buffer size" sugiere que `cloudflared` no pudo aumentar el tamaño del búfer de recepción. Esto podría estar relacionado con la configuración de red o el límite de recursos de tu sistema. Para solucionarlo, puedes intentar aumentar el tamaño del búfer UDP, modificando la configuración del sistema. Puedes hacerlo con los siguientes comandos (ejecutándolos como root):
     ```bash
     sysctl -w net.core.rmem_max=16777216
     sysctl -w net.core.wmem_max=16777216
     ```

4. **Configuración faltante**:
   - El mensaje sobre la configuración indica que no se encuentra un archivo de configuración (`config.yml` o `config.yaml`). Si no tienes una configuración específica, puedes ignorar esto, pero si deseas usar configuraciones avanzadas, considera crear un archivo de configuración en `~/.cloudflared/`.

### Pasos a seguir:
1. Ajusta el `ping_group_range` o añade tu usuario a un grupo adecuado.
2. Aumenta el tamaño del búfer UDP si es necesario.
3. Si es relevante para tu caso, considera crear un archivo de configuración.

Una vez que realices estos cambios, prueba de nuevo a ejecutar `cloudflared`. Si sigues teniendo problemas, no dudes en preguntar.
*/
// sudo docker container cp goolang-temporal:/usr/bin/cloudflared /usr/bin/cloudflared
// cloudflared tunnel --url http://127.0.0.1:3000

