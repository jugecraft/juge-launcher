const audio = document.getElementById("intro-audio");
const intro = document.getElementById("intro-screen");

const ocultarIntro = () => {
  intro.classList.add("hide-intro");
  setTimeout(() => {
    intro.remove();
  }, 1000);
};

document.addEventListener("DOMContentLoaded", () => {
  audio.addEventListener("canplaythrough", () => {
    document.addEventListener("click", () => {
      audio.play().catch(err => console.warn("Audio bloqueado:", err));
    }, { once: true });
  });
});
