const heroShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
let aliens = document.querySelectorAll('.alien');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let topPosition = parseInt(getComputedStyle(heroShip).getPropertyValue('top'));
let alienInterval;

//função de subir
function moveUp() {
    if (topPosition <= 0) {
        return
    } else {
        //let position = parseInt(topPosition); //pego a propriedade com o valor inteiro
        topPosition -= 30;
        heroShip.style.top = `${topPosition}px`;
    }
}

//função de descer
function moveDown() {
    if (topPosition >= 710) {
        return
    } else {
        topPosition += 30;
        heroShip.style.top = `${topPosition}px`;
    }
}


//funcionalidade de tiro
function fireLaser() {
    let xPosition = parseInt(window.getComputedStyle(heroShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(heroShip).getPropertyValue('top'));

    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;

    playArea.appendChild(newLaser);

    moveLaser(newLaser);

}

//movimento e tiro da nave
function flyShip(event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if (checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if (xPosition === 400) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 10}px`;
        }



    }, 10);


}

//função para criar inimigos aleatórios
function createAliens() {
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens até 3

    let newAlien = document.createElement('img');
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '400px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;

    playArea.appendChild(newAlien);

    moveAlien(newAlien);
}

//função para movimentar os inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

        if (xPosition <= 50) {
            if (Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

//função para  colisão
function checkLaserCollision(laser, alien) {

    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if (laserLeft != 400 && laserLeft + 30 >= alienLeft) {
        if (laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


//inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();


})

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);

}

//função de game over
function gameOver() {
    let aliens = document.querySelectorAll('.alien');
    let lasers = document.querySelectorAll('.laser');
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    aliens.forEach((alien) => alien.remove());
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('Game Over! :(');
        heroShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });

}

