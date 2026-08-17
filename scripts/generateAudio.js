import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to create a clean WAV file buffer
function createWavBuffer(sampleRate, durationSec, generateSample) {
  const numChannels = 2;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // bits per sample

  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const [left, right] = generateSample(t, durationSec);
    
    const clLeft = Math.max(-1, Math.min(1, left));
    const clRight = Math.max(-1, Math.min(1, right));
    
    const sLeft = Math.floor(clLeft < 0 ? clLeft * 0x8000 : clLeft * 0x7FFF);
    const sRight = Math.floor(clRight < 0 ? clRight * 0x8000 : clRight * 0x7FFF);

    buffer.writeInt16LE(sLeft, offset);
    buffer.writeInt16LE(sRight, offset + 2);
    offset += 4;
  }

  return buffer;
}

const sampleRate = 44100;

// Track Definitions with Melodic Frequency Sequences
const tracks = [
  {
    id: 'deewani_mastani',
    title: 'Deewani Mastani',
    duration: 35,
    rootFreq: 293.66, // D4
    scale: [293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 554.37, 587.33], // Raag Yaman
    tempo: 96,
  },
  {
    id: 'sunn_raha_hai',
    title: 'Sunn Raha Hai Na Tu',
    duration: 35,
    rootFreq: 261.63, // C4
    scale: [261.63, 277.18, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25], // Raag Bhairavi
    tempo: 84,
  },
  {
    id: 'barso_re',
    title: 'Barso Re',
    duration: 32,
    rootFreq: 329.63, // E4
    scale: [329.63, 369.99, 392.00, 440.00, 493.88, 587.33, 659.25], // Raag Megh
    tempo: 108,
  },
  {
    id: 'yeh_ishq_hai',
    title: 'Yeh Ishq Hai',
    duration: 30,
    rootFreq: 440.00, // A4
    scale: [440.00, 493.88, 554.37, 659.25, 739.99, 880.00], // Pahadi
    tempo: 124,
  },
  {
    id: 'mohe_rang_do_laal',
    title: 'Mohe Rang Do Laal',
    duration: 32,
    rootFreq: 277.18, // C#4
    scale: [277.18, 311.13, 349.23, 369.99, 415.30, 466.16, 554.37], // Thumri
    tempo: 78,
  },
  {
    id: 'jaadu_hai_nasha_hai',
    title: 'Jaadu Hai Nasha Hai',
    duration: 34,
    rootFreq: 349.23, // F4
    scale: [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 698.46],
    tempo: 80,
  },
  {
    id: 'chalo_tumko_lekar',
    title: 'Chalo Tumko Lekar Chale',
    duration: 32,
    rootFreq: 392.00, // G4
    scale: [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 783.99],
    tempo: 82,
  },
  {
    id: 'rozana',
    title: 'Rozana',
    duration: 32,
    rootFreq: 440.00,
    scale: [440.00, 493.88, 523.25, 587.33, 659.25, 783.99, 880.00],
    tempo: 86,
  },
  {
    id: 'chikni_chameli',
    title: 'Chikni Chameli',
    duration: 30,
    rootFreq: 440.00,
    scale: [440.00, 493.88, 554.37, 659.25, 739.99, 880.00],
    tempo: 132,
  },
  {
    id: 'leja_leja_re',
    title: 'Leja Leja Re',
    duration: 32,
    rootFreq: 392.00,
    scale: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99],
    tempo: 92,
  },
  {
    id: 'aadha_ishq',
    title: 'Aadha Ishq',
    duration: 32,
    rootFreq: 440.00,
    scale: [440.00, 493.88, 554.37, 587.33, 659.25, 739.99],
    tempo: 94,
  },
  {
    id: 'jhalla_wallah',
    title: 'Jhalla Wallah',
    duration: 32,
    rootFreq: 493.88,
    scale: [493.88, 554.37, 659.25, 739.99, 830.61, 987.77],
    tempo: 114,
  },
  {
    id: 'nagada_sang_dhol',
    title: 'Nagada Sang Dhol',
    duration: 30,
    rootFreq: 523.25,
    scale: [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50],
    tempo: 126,
  },
  {
    id: 'ghoomar',
    title: 'Ghoomar',
    duration: 32,
    rootFreq: 392.00,
    scale: [392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 783.99],
    tempo: 104,
  },
  {
    id: 'silsila_ye_chahat',
    title: 'Silsila Ye Chahat Ka',
    duration: 32,
    rootFreq: 440.00,
    scale: [440.00, 493.88, 554.37, 659.25, 739.99, 880.00],
    tempo: 88,
  },
  {
    id: 'agar_tum_mil_jao',
    title: 'Agar Tum Mil Jao',
    duration: 34,
    rootFreq: 349.23,
    scale: [349.23, 392.00, 440.00, 523.25, 587.33, 698.46],
    tempo: 76,
  },
];

console.log('Generating high-fidelity acoustic tracks for Shreya Ghoshal listening room...');

tracks.forEach(track => {
  const filePath = path.join(outputDir, `${track.id}.wav`);
  const secPerBeat = 60 / track.tempo;

  const wavData = createWavBuffer(sampleRate, track.duration, (t, total) => {
    // 1. Tanpura Resonance Drone (Sa - Pa - Sa')
    const sa = track.rootFreq;
    const pa = track.rootFreq * 1.5;
    const saHigh = track.rootFreq * 2;

    const drone = 
      0.14 * Math.sin(2 * Math.PI * sa * t) +
      0.08 * Math.sin(2 * Math.PI * (sa * 0.5) * t) +
      0.09 * Math.sin(2 * Math.PI * pa * t) +
      0.05 * Math.sin(2 * Math.PI * saHigh * t);

    // Subtle chorus modulation
    const lfo = Math.sin(2 * Math.PI * 0.25 * t);
    const chorusDrone = drone * (0.85 + 0.15 * lfo);

    // 2. Melodic Lead Arpeggiation / Theme (Flute / Sitar timbre)
    const beatIndex = Math.floor(t / secPerBeat);
    const noteIndex = (beatIndex * 3 + Math.floor(t * 2)) % track.scale.length;
    const currentFreq = track.scale[noteIndex];
    
    // Note envelope
    const beatPos = (t % secPerBeat) / secPerBeat;
    const noteEnv = Math.exp(-beatPos * 3.5);

    // Sitar / Flute overtones
    const lead =
      0.22 * Math.sin(2 * Math.PI * currentFreq * t) +
      0.11 * Math.sin(2 * Math.PI * currentFreq * 2 * t) +
      0.05 * Math.sin(2 * Math.PI * currentFreq * 3 * t) +
      0.03 * Math.sin(2 * Math.PI * currentFreq * 4 * t);

    const leadOutput = lead * noteEnv;

    // 3. Gentle Tabla / Rhythmic Percussion Pulse
    const barPos = (t % (secPerBeat * 2)) / (secPerBeat * 2);
    const bassKick = Math.sin(2 * Math.PI * (60 + 40 * Math.exp(-barPos * 18)) * t) * Math.exp(-barPos * 8) * 0.18;
    const highHat = (Math.random() * 2 - 1) * Math.exp(-((t % (secPerBeat * 0.5)) / (secPerBeat * 0.5)) * 25) * 0.04;

    // 4. Overall Fade In & Fade Out
    const fadeIn = Math.min(1, t / 1.5);
    const fadeOut = Math.min(1, (total - t) / 1.5);
    const masterEnv = fadeIn * fadeOut;

    const left = (chorusDrone * 0.7 + leadOutput * 0.85 + bassKick * 0.6 + highHat * 0.8) * masterEnv;
    const right = (chorusDrone * 0.7 + leadOutput * 0.85 + bassKick * 0.6 + highHat * 0.4) * masterEnv;

    return [left * 0.75, right * 0.75];
  });

  fs.writeFileSync(filePath, wavData);
  console.log(`Generated: ${track.id}.wav (${track.duration}s)`);
});

console.log('All 16 acoustic Shreya Ghoshal solo tracks generated successfully in public/audio/');
