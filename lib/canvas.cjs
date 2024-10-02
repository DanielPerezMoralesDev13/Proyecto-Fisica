// 110 -> 160
// localStorage.setItem('angulo', '110');
// 5 -> 200
// localStorage.setItem('tamañoPala', '150');

// Obtener el contexto de renderizado 2D del lienzo con ID 'catapultaCanvas'
const canvas = document.getElementById('catapultaCanvas'); 
const ctx = canvas.getContext('2d'); 

// Recuperar los valores desde localStorage
const tamañoPalaDibujar = parseFloat(localStorage.getItem('tamañoPala')); 
const anguloDibujar = parseFloat(localStorage.getItem('angulo'));

// Calcular propiedades del brazo
const baseX = 250; // Punto de pivote en X
const baseY = 310; // Punto de pivote en Y

// Convertir el ángulo a radianes para el cálculo
const anguloRad = (anguloDibujar * Math.PI) / 180;

// Calcular la longitud del brazo basada en el tamaño de la pala
const longitudBrazo = Math.max(20, (tamañoPalaDibujar - 5) * 0.5 + 50); // Longitud del brazo crece con el tamaño de la pala, asegurando un mínimo de 20 px

// Calcular las posiciones finales del brazo
const finalX = baseX + longitudBrazo * Math.cos(anguloRad); // Cálculo de X según el ángulo
const finalY = baseY - longitudBrazo * Math.sin(anguloRad); // Cálculo de Y según el ángulo (inverso para +Y)

// Dibujar la base de la catapulta
ctx.fillStyle = "#8B4513"; 
ctx.fillRect(50, 300, 330, 30); 

// Dibujar el brazo de la catapulta
ctx.strokeStyle = "#8B4513"; 
ctx.lineWidth = 10; 
ctx.beginPath(); 
ctx.moveTo(baseX, baseY); 
ctx.lineTo(finalX, finalY); // Usa las posiciones finales calculadas
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
ctx.fill(); 
ctx.fill(); 
ctx.stroke(); 


let animando = false; // Controla si la animación está en curso
let desplazamientoX = 0; // Desplazamiento inicial en X
let lanzandoPiedra = false; // Controla si la piedra está en movimiento
const velocidadMovimiento = 5; // Velocidad de movimiento del brazo
const maxDesplazamiento = 200; // Distancia máxima que el brazo puede desplazarse
const velocidadPiedra = 4; // Velocidad de movimiento de la piedra

function lanzar() {
    if (animando) return; // Evita múltiples animaciones simultáneas
    animando = true; // Establece que la animación está en curso

    const baseX = 250; // Punto de pivote en X
    const baseY = 310; // Punto de pivote en Y
    const tamañoPalaDibujar = parseFloat(localStorage.getItem('tamañoPala')); 
    const anguloDibujar = parseFloat(localStorage.getItem('angulo')); // Recupera el ángulo
    const pesoPiedra = parseFloat(localStorage.getItem('peso')) || 1; // Recupera el peso de la piedra
    const anguloRad = (anguloDibujar * Math.PI) / 180; // Convierte a radianes

    // Ejecuta la animación del brazo
    const intervalBrazo = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el lienzo

        // Calcula las nuevas posiciones
        const finalX = baseX + desplazamientoX + (150 * Math.cos(anguloRad)); // Se mantiene el movimiento en X
        const alturaAjuste = Math.max(5, Math.min(200, tamañoPalaDibujar)); // Ajuste para el tamaño de la pala
        const finalY = baseY - (150 * Math.sin(anguloRad) * (alturaAjuste / 200)); // Mantiene la altura ajustada por el tamaño de la pala

        // Redibuja la catapulta
        dibujarCatapulta(baseX, baseY, finalX, finalY);

        // Actualiza el desplazamiento
        desplazamientoX += velocidadMovimiento; // Aumenta el desplazamiento

        // Verifica si se ha alcanzado el desplazamiento máximo
        if (desplazamientoX > maxDesplazamiento) {
            clearInterval(intervalBrazo); // Detiene la animación del brazo
            animando = false; // Permite una nueva animación
            desplazamientoX = 0; // Resetea el desplazamiento

            // Inicia la animación de la piedra
            lanzandoPiedra = true; 
            lanzarPiedra(finalX, finalY, pesoPiedra, anguloDibujar, tamañoPalaDibujar);
        }
    }, 1000 / 60); // Aproximadamente 60 FPS
}

function lanzarPiedra(finalX, finalY, peso, angulo, tamañoPala) {
    let piedraX = finalX; // Posición inicial en X de la piedra
    let piedraY = finalY; // Posición inicial en Y de la piedra
    let tiempo = 0; // Variable para controlar el tiempo de la animación

    // Ajustar la altura máxima y el desplazamiento en X basado en el peso y el ángulo
    const alturaMaxima = (peso / 100) * (angulo - 110) * 1.5; // Ajuste de altura basado en peso y ángulo
    const desplazamientoMaximoX = (peso / 100) * 500; // Desplazamiento máximo en el eje +X

    const intervalPiedra = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el lienzo

        // Redibuja la catapulta
        dibujarCatapulta(250, 310, finalX, finalY);

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
            piedraY = 350; // Ajusta al suelo
            clearInterval(intervalPiedra); // Detiene la animación de la piedra
        }

        // Dibuja la piedra
        ctx.beginPath(); 
        ctx.arc(piedraX, piedraY, 10, 0, Math.PI * 2); // Dibuja la piedra
        ctx.fillStyle = "#FF0000"; // Color de la piedra
        ctx.fill();
        ctx.stroke(); 

        // Verifica si la piedra ha salido del canvas
        if (piedraX > 1330) {
            clearInterval(intervalPiedra); // Detiene la animación de la piedra
            lanzandoPiedra = false; // Permite un nuevo lanzamiento
        }
    }, 1000 / 60); // Aproximadamente 60 FPS
}

function dibujarCatapulta(baseX, baseY, finalX, finalY) {
    // Redibuja la base de la catapulta
    ctx.fillStyle = "#8B4513"; 
    ctx.fillRect(50, 300, 330, 30); 

    // Redibuja el brazo de la catapulta
    ctx.strokeStyle = "#8B4513"; 
    ctx.lineWidth = 10; 
    ctx.beginPath(); 
    ctx.moveTo(baseX, baseY); 
    ctx.lineTo(finalX, finalY); // Usa las posiciones finales calculadas
    ctx.stroke(); 

    // Redibuja la cubeta (para las rocas)
    ctx.beginPath(); 
    ctx.arc(finalX, finalY, 20, 0, Math.PI * 2); 
    ctx.fillStyle = "#8B4513"; 
    ctx.fill(); 
    ctx.stroke(); 

    // Redibuja las ruedas
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

