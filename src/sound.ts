// Short tones made with Web Audio, so there are no sound files. Lives outside lib/ because it uses a browser API.
let context: AudioContext | undefined;

export function playSound(kind: "step" | "quest") {
  if (typeof AudioContext === "undefined") return;
  const audio = (context ??= new AudioContext());
  const notes = kind === "step" ? [660] : [523, 659, 784];

  notes.forEach((frequency, index) => {
    const start = audio.currentTime + index * 0.12;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.25);
  });
}
