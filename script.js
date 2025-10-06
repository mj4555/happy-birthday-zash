// === Config + Name insertion ===
const ROOT = document.documentElement;
const bdayName = ROOT.dataset.bdayName || "My Love";
const bdayDateStr = ROOT.dataset.bdayDate || "2025-10-07T00:00:00";
const bdayDate = new Date(bdayDateStr);

document.getElementById("bday-name").textContent = bdayName;
document.getElementById("bday-name-foot").textContent = bdayName;

// === Cute childish letter ===
const LOVE_LETTER = `Zashhh 🩷 hiiii birthday boyyy 🎉 I love you sooo much, like more than I can even say 🫶 You make me so happy every single day, and I pinky promise I’ll never ever leave you 😤💞 You’re mine and I’m yours, forever okay? hehehe 💋 Happy 17th Birthday my loveee 🎂💖`;

// === Countdown ===
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

// === Typewriter ===
const typeEl = document.getElementById("typewriter-text");
const caretEl = document.querySelector(".caret");
let i = 0;
function typeLetter() {
  if (i <= LOVE_LETTER.length) {
    typeEl.textContent = LOVE_LETTER.slice(0, i);
    i++;
    setTimeout(typeLetter, 28);
  } else {
    caretEl.style.display = "none";
  }
}

// === Surprise Button (simple reveal) ===
const surpriseBtn = document.getElementById("surprise-btn");
const finalWish = document.getElementById("final-wish");
surpriseBtn.addEventListener("click", () => {
  finalWish.hidden = false;
  surpriseBtn.style.display = "none";
  finalWish.scrollIntoView({ behavior: "smooth", block: "center" });
});

// === YouTube Music Controls ===
const yt = document.getElementById("ytplayer");
let soundOn = false;
const soundBtn = document.getElementById("sound-btn");
function ytCommand(func, args = []) {
  yt.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
}
function unmuteAndPlay(){
  ytCommand("unMute");
  ytCommand("setVolume", [70]);
  ytCommand("playVideo");
  soundOn = true;
  soundBtn.textContent = "🔊 Music";
}
function mutePause(){
  ytCommand("mute");
  soundOn = false;
  soundBtn.textContent = "🔈 Music";
}
soundBtn.addEventListener("click", () => soundOn ? mutePause() : unmuteAndPlay());

// === Gate Start ===
const gate = document.getElementById("gate");
document.getElementById("start-btn").addEventListener("click", ()=>{
  gate.style.display = "none";
  typeLetter();
  setTimeout(unmuteAndPlay, 150);
});
document.addEventListener("keydown", (e)=>{
  if (gate.style.display !== "none" && (e.key === "Enter" || e.key === " ")) {
    document.getElementById("start-btn").click();
  }
});
