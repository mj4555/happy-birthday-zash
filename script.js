/* ===============================
   Config + Helpers
   =============================== */

// Read name & date from <html> dataset so it's easy to edit
const ROOT = document.documentElement;
const bdayName = document.documentElement.dataset.bdayName || "My Love";
const bdayDateStr = document.documentElement.dataset.bdayDate || "2025-10-07T00:00:00";
const bdayDate = new Date(bdayDateStr);

// Insert name in a few spots
document.getElementById("bday-name").textContent = bdayName;
document.getElementById("bday-name-foot").textContent = bdayName;

// Cute childish letter (your approved version)
const LOVE_LETTER = `Zashhh 🩷 hiiii birthday boyyy 🎉 I love you sooo much, like more than I can even say 🫶 You make me so happy every single day, and I pinky promise I’ll never ever leave you 😤💞 You’re mine and I’m yours, forever okay? hehehe 💋 Happy 17th Birthday my loveee 🎂💖`;

/* ===============================
   Countdown
   =============================== */
function updateCountdown() {
  const now = new Date();
  let diff = bdayDate - now;
  if (diff < 0) diff = 0;

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  document.getElementById("cd-days").textContent = String(d).padStart(2, "0");
  document.getElementById("cd-hours").textContent = String(h).padStart(2, "0");
  document.getElementById("cd-mins").textContent = String(m).padStart(2, "0");
  document.getElementById("cd-secs").textContent = String(s).padStart(2, "0");
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* ===============================
   Typewriter Effect
   =============================== */
const typeEl = document.getElementById("typewriter-text");
const caretEl = document.querySelector(".caret");
let i = 0;
function typeLetter() {
  if (i <= LOVE_LETTER.length) {
    typeEl.textContent = LOVE_LETTER.slice(0, i);
    const rect = typeEl.getBoundingClientRect();
    caretEl.style.left = rect.left + window.scrollX + (typeEl.clientWidth + 3) + "px";
    caretEl.style.top = rect.top + window.scrollY + "px";
    i++;
    setTimeout(typeLetter, 28); // typing speed
  } else {
    caretEl.style.display = "none";
  }
}

/* ===============================
   Canvas: Confetti + Fireworks
   =============================== */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let W, H, particles = [], rockets = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Simple confetti particle
function spawnConfettiBurst(x, y, count = 120, power = 6) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * power + 1.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 3 + 2,
      life: Math.random() * 60 + 60,
      color: randomConfettiColor(),
      shape: Math.random() < 0.5 ? "rect" : "circle"
    });
  }
}
function randomConfettiColor(){
  const palette = ["#ff7aa2","#ff5c8a","#ff3b6b","#ffd166","#fff9fb"];
  return palette[Math.floor(Math.random()*palette.length)];
}

// Firework rocket -> bursts into confetti
function launchFirework() {
  const x = Math.random() * (W * 0.8) + W * 0.1;
  rockets.push({
    x, y: H + 10,
    vx: (Math.random() - 0.5) * 1.2,
    vy: - (7 + Math.random() * 2),
    life: 60 + Math.random()*20,
    color: randomConfettiColor()
  });
}
function animate() {
  ctx.clearRect(0,0,W,H);

  // rockets
  for (let r = rockets.length - 1; r >= 0; r--) {
    const rocket = rockets[r];
    rocket.x += rocket.vx;
    rocket.y += rocket.vy;
    rocket.vy += 0.06;        // gravity
    rocket.life--;

    // trail
    ctx.fillStyle = rocket.color;
    ctx.beginPath();
    ctx.arc(rocket.x, rocket.y, 2.2, 0, Math.PI*2);
    ctx.fill();

    if (rocket.life <= 0 || rocket.vy >= 0) {
      // burst
      spawnConfettiBurst(rocket.x, rocket.y, 140, 7);
      rockets.splice(r,1);
    }
  }

  // confetti
  for (let p = particles.length - 1; p >= 0; p--) {
    const part = particles[p];
    part.x += part.vx;
    part.y += part.vy;
    part.vy += 0.05; // gravity
    part.vx *= 0.995;
    part.life--;

    ctx.save();
    ctx.translate(part.x, part.y);
    ctx.rotate((60 - part.life) * 0.1);
    ctx.fillStyle = part.color;
    if (part.shape === "rect") {
      ctx.fillRect(-part.size/2, -part.size/2, part.size, part.size*0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, part.size/2, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();

    if (part.life <= 0 || part.y > H + 10) particles.splice(p,1);
  }

  requestAnimationFrame(animate);
}
animate();

/* ===============================
   Buttons: mini-confetti & fireworks
   =============================== */
document.getElementById("mini-confetti").addEventListener("click", (e)=>{
  const rect = e.target.getBoundingClientRect();
  const x = rect.left + rect.width/2;
  const y = rect.top + window.scrollY;
  spawnConfettiBurst(x, y, 100, 5);
});
const surpriseBtn = document.getElementById("surprise-btn");
const finalWish = document.getElementById("final-wish");
surpriseBtn.addEventListener("click", ()=>{
  // multiple fireworks
  for (let i = 0; i < 6; i++) setTimeout(launchFirework, i*250);
  spawnConfettiBurst(W/2, H*0.35, 180, 8);
  finalWish.hidden = false;
  finalWish.scrollIntoView({behavior:"smooth", block:"center"});
});

/* ===============================
   Hidden YouTube Player Control
   - Autoplay muted (embed params)
   - Unmute & play after Start tap
   - Toggle sound with top-right button
   =============================== */
const yt = document.getElementById("ytplayer");
let soundOn = false;
const soundBtn = document.getElementById("sound-btn");

function ytCommand(func, args=[]) {
  // postMessage to iframe to control YT player
  yt.contentWindow?.postMessage(JSON.stringify({
    event: "command",
    func,
    args
  }), "*");
}

// Some browsers need a tiny delay after load before commands work
function unmuteAndPlay(){
  ytCommand("unMute");
  ytCommand("setVolume", [70]);
  ytCommand("playVideo");
  soundOn = true;
  soundBtn.setAttribute("aria-pressed","true");
  soundBtn.textContent = "🔊 Music";
}
function mutePause(){
  ytCommand("mute");
  soundOn = false;
  soundBtn.setAttribute("aria-pressed","false");
  soundBtn.textContent = "🔈 Music";
}
soundBtn.addEventListener("click", ()=>{
  if (soundOn) mutePause(); else unmuteAndPlay();
});

/* ===============================
   Gate Start
   =============================== */
const gate = document.getElementById("gate");
document.getElementById("start-btn").addEventListener("click", ()=>{
  gate.style.display = "none";
  // Start the typewriter, light confetti
  typeLetter();
  spawnConfettiBurst(W/2, H*0.6, 160, 7);
  // Unmute music
  setTimeout(unmuteAndPlay, 150);
});

/* ===============================
   Accessibility niceties
   =============================== */
// Keyboard "Enter" starts too
document.addEventListener("keydown", (e)=>{
  if (gate.style.display !== "none" && (e.key === "Enter" || e.key === " ")) {
    document.getElementById("start-btn").click();
  }
});

