// Seleziona gli elementi necessari dal DOM
const timer = document.querySelector(".timer");
const hourglassWrapper = document.querySelector(".hourglass-wrapper");
const hourglass = document.querySelector(".hourglass");
const countdown = document.getElementById("countdown");
const minus30 = document.getElementById("minus30");
const x2 = document.getElementById("x2");
const plus30 = document.getElementById("plus30");

// Crea un'istanza dell'API Web Audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Funzione per creare e riprodurre il suono del temple bell
function playTempleBell(repetitionCount = 2) {
  if (repetitionCount === 0) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);

  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 4
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 4);

  setTimeout(() => {
    playTempleBell(repetitionCount - 1);
  }, 4000);
}

// Imposta le variabili per il timer
let timeLeft = 30000;
let isRunning = false;
let timerInterval;
let rotation = 0;

// Funzione per aggiornare il display del timer
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  countdown.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

// Funzione per resettare il timer allo stato iniziale
function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 30000;
  isRunning = false;
  hourglassWrapper.classList.remove("active");
  hourglass.classList.remove("spin");
  hourglass.classList.remove("vibrate");
  hourglass.style.backgroundImage = 'url("./img/hourglass_full.svg")';
  updateTimer();
}

// Funzione per avviare, mettere in pausa e ripristinare il timer
function toggleTimer() {
  if (timeLeft <= 0) {
    resetTimer();
    return;
  }

  if (!isRunning) {
    timerInterval = setInterval(function () {
      timeLeft -= 1000;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        hourglass.classList.remove("spin");
        hourglass.classList.add("vibrate");
        hourglass.style.backgroundImage = 'url("./img/alarm.svg")';
        playTempleBell();
        isRunning = false;
      } else {
        updateTimer();
      }
    }, 1000);
    hourglass.classList.add("spin"); // Aggiungi questa riga
    hourglass.classList.remove("pause"); // Aggiungi questa riga
  } else {
    clearInterval(timerInterval);
    hourglass.classList.add("pause"); // Aggiungi questa riga
  }

  isRunning = !isRunning;
}

// Aggiunge event listener ai bottoni
timer.addEventListener("click", toggleTimer);
minus30.addEventListener("click", () => {
  if (timeLeft > 31000) {
    // Verifica se il tempo è maggiore di 31 secondi
    timeLeft -= 30000; // Sottrae 30 secondi dal tempo rimanente
    updateTimer(); // Aggiorna il display del timer
  }
});

x2.addEventListener("click", () => {
  timeLeft *= 2; // Moltiplica il tempo rimanente per 2
  updateTimer(); // Aggiorna il display del timer
});

plus30.addEventListener("click", () => {
  timeLeft += 30000; // Aggiunge 30 secondi al tempo rimanente
  updateTimer(); // Aggiorna il display del timer
});
