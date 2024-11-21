document.getElementById('catapultaForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let isValid = true;
    const angulo = document.getElementById('angulo');
    const peso = document.getElementById('peso');
    const tamañoPala = document.getElementById('tamañoPala');

    // Validación de los campos
    if (angulo.value < 130 || angulo.value > 160) {
        isValid = false;
    }

    if (peso.value < 12 || peso.value > 100) {
        isValid = false;
    }

    if (tamañoPala.value < 15 || tamañoPala.value > 50) {
        isValid = false;
    }

    if (isValid) {
        // Almacena los datos en localStorage
        localStorage.setItem('angulo', angulo.value);
        localStorage.setItem('peso', peso.value);
        localStorage.setItem('tamañoPala', tamañoPala.value);

        // Redirige a la página catapulta.html
        window.location.href = './catapulta.html';
    }
});
