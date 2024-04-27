// Variables globales
let player, obstacle, score;
let obstacleInterval; // Variable para almacenar el intervalo de generación de obstáculos
let runningInterval; // Variable para almacenar el intervalo de movimiento continuo del jugador

// Inicialización del juego
function init() {
    player = document.getElementById("player");
    obstacle = document.getElementById("obstacle");
    score = 0;
    movePlayer();
    generateObstacles();
}

// Mover al jugador
function movePlayer() {
    clearInterval(runningInterval);

    // Hacer que el jugador salte al hacer clic en la pantalla
    document.addEventListener("click", function () {
        jump();
    });
}

function jump() {
    // Verificar si el jugador ya está saltando
    if (player.classList.contains("jumping")) {
        return;
    }

    player.classList.add("jumping");

    let jumpHeight = 250; // Altura máxima del salto
    let jumpSpeed = 400; // Velocidad del salto
    let jumpDuration = 4000; // Duración máxima del salto (en milisegundos)
    let jumpTime = 0; // Tiempo transcurrido durante el salto
    let jumpInterval = setInterval(() => {
        // Hacer que el jugador suba
        if (player.offsetTop > 150 && jumpHeight > 0 && jumpTime < jumpDuration) {
            player.style.top = player.offsetTop - jumpSpeed + "px";
            jumpHeight -= jumpSpeed;
            jumpTime += 20; // Incrementar el tiempo transcurrido
        }
        // Hacer que el jugador baje
        else {
            clearInterval(jumpInterval);
            let fallInterval = setInterval(() => {
                // Hacer que el jugador vuelva al suelo
                if (player.offsetTop < 340) {
                    player.style.top = player.offsetTop + 10 + "px";
                    // Ajustar la posición del jugador para que se quede en el suelo
                    if (player.offsetTop > 340) {
                        player.style.top = "340px";
                    }
                } else {
                    clearInterval(fallInterval);
                    player.classList.remove("jumping");
                }
            }, 20);
        }
    }, 20);
}

// Generar obstáculos continuamente
// Generar obstáculos continuamente
function generateObstacles() {
    const maxObstacles = 3; // Establecer el número máximo de obstáculos en pantalla
    const obstacleHeightRange = [100, 200, 300]; // Rango de alturas para las bombas

    function generateSingleObstacle() {
        const newObstacle = obstacle.cloneNode(true); // Clonar el obstáculo existente
        newObstacle.classList.add("obstacle"); // Agregar la clase "obstacle"
        newObstacle.style.left = window.innerWidth + "px"; // Posicionar el nuevo obstáculo fuera del área visible

        // Seleccionar una posición vertical aleatoria dentro del rango establecido
        const randomIndex = Math.floor(Math.random() * obstacleHeightRange.length);
        const obstacleTop = obstacleHeightRange[randomIndex];
        newObstacle.style.top = obstacleTop + "px"; // Posicionar verticalmente de manera aleatoria

        document.body.appendChild(newObstacle); // Agregar el nuevo obstáculo al DOM

        // Mover el obstáculo hacia la izquierda
        function moveSingleObstacle() {
            let obstaclePosition = parseInt(newObstacle.style.left); // Obtener la posición actual del obstáculo
            if (obstaclePosition < -50) {
                // Si el obstáculo sale del área visible, eliminarlo del DOM
                document.body.removeChild(newObstacle);
            } else {
                // Mover el obstáculo hacia la izquierda
                obstaclePosition -= 5; // Reducir este valor para mover el obstáculo más lento
                newObstacle.style.left = obstaclePosition + "px";
        
                // Verificar colisión con el jugador
                const playerRect = player.getBoundingClientRect();
                const obstacleRect = newObstacle.getBoundingClientRect();
                if (
                    playerRect.top < obstacleRect.bottom &&
                    playerRect.bottom > obstacleRect.top &&
                    playerRect.right > obstacleRect.left &&
                    playerRect.left < obstacleRect.right
                ) {
                    // Colisión detectada, el jugador pierde
                    clearInterval(obstacleInterval); // Detener la generación de obstáculos
                    clearInterval(runningInterval); // Detener el movimiento del jugador
                    alert("Carlitos, puedes hacerlo bastante mejor jeje"); // Mostrar mensaje de perder
                    return;
                }
            }
            requestAnimationFrame(moveSingleObstacle);
        }
        
        moveSingleObstacle();
    }

    setInterval(() => {
        if (document.getElementsByClassName("obstacle").length < maxObstacles) { // Verificar si hay espacio para más obstáculos
            generateSingleObstacle();
        }
    }, 2000); // Genera un nuevo obstáculo cada 2 segundos
}


// Reiniciar la posición del obstáculo
function resetObstacle() {
    obstacle.style.left = "600px"; // Aparece desde el borde derecho
    obstacle.style.top = "400px"; // Posición fija en el suelo
}

function playMusic() {
    let music = document.getElementById('gameMusic');
    music.play();
}

// Iniciar el juego al cargar la página
window.onload = function() {
    init();
};
