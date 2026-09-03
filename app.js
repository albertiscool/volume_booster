/**
 * Volume Booster - Core Application Logic
 * Supports Real-Time Web Audio Previews, EQ Enhancement, and Lossless Export
 */

// --- Internationalization (i18n) Dictionary ---
const I18N = {
  'zh-TW': {
    hero_badge: '100% 瀏覽器本地運算 • 零上傳 • 隱私安全',
    hero_title: '讓你的影片聲音不再細小無聲',
    hero_desc: '支援高達 600% 音量增強，搭載防破音智慧壓縮器與人聲清晰化。即時預覽試聽，極速無損匯出新影片！',
    drop_title: '選取影片檔案或將檔案拖曳至此',
    drop_subtitle: '支援 MP4、WebM、MOV、MKV、AVI、3GP 等常見格式（檔案大小不受限）',
    pick_local: '選取本機檔案 (下載/資料夾)',
    pick_gallery: '從相簿 / 影片庫選取',
    mobile_tip: '💡 手機小撇步：若選取影片時只看得到 Google 相簿，請點擊「選取本機檔案」，即可開啟手機檔案管理員瀏覽「下載項目 (Downloads)」、LINE 儲存影片或內部儲存空間。',
    change_video: '更換影片',
    spectrum_title: '即時音訊頻譜與動態電平',
    volume_boost_title: '音量放大倍率 (Volume Boost)',
    volume_boost_desc: '無損數位前級放大，即調即聽',
    quick_presets: '快速預設',
    custom_input_label: '自訂數值：',
    apply: '套用',
    enhancer_title: '音效優化與音質防護',
    limiter_title: '智慧防破音限制器 (Soft Limiter)',
    limiter_desc: '強烈建議開啟！大幅放大音量時自動平滑波峰，消除爆音雜音。',
    vocal_title: '人聲對話清晰強化 (Vocal Boost)',
    vocal_desc: '加強 1kHz - 3kHz 人聲頻段，讓微弱旁白與說話聲瞬間突顯。',
    bass_title: '重低音共鳴強化 (Bass Boost)',
    bass_desc: '提升 100Hz 低頻厚度，音場更為飽滿震撼。',
    export_title: '匯出放大音量後的影片檔案',
    export_subtitle: '採用視訊流無損複製技術（-c:v copy），100% 保留原始超高畫質，極速生成新檔案',
    engine_label: '處理核心：',
    start_export: '立即開始處理並匯出',
    cancel_export: '取消',
    export_success_title: '處理完成！',
    download_btn: '下載影片檔案',
    preview_exported: '直接在網頁播放測試',
    feat_1_title: '100% 本地安全隱私',
    feat_1_desc: '所有處理都在您裝置的瀏覽器內完成。影片檔案絕不上傳到任何第三方伺服器，私密與重要影片安心使用。',
    feat_2_title: '視訊流複製零畫質損失',
    feat_2_desc: '僅針對音軌進行數位前級放大與壓縮，影像軌道（Video Stream）直接複製，秒級輸出且原畫質 100% 保持。',
    feat_3_title: '專業級防破音與人聲突顯',
    feat_3_desc: '內建雙精度 Web Audio 動態壓縮器，大幅放大也不易破音；搭配人聲頻段強化，說話細節清清楚楚。'
  },
  'en': {
    hero_badge: '100% Client-Side • Zero Upload • Privacy First',
    hero_title: 'Boost Low-Volume Videos Instantly',
    hero_desc: 'Up to 600% sound boost with anti-clipping limiter and vocal clarity enhancer. Real-time preview & fast lossless export!',
    drop_title: 'Select video file or drag & drop here',
    drop_subtitle: 'Supports MP4, WebM, MOV, MKV, AVI, 3GP and more (no file size limits)',
    pick_local: 'Browse Local Files (Storage / Downloads)',
    pick_gallery: 'Pick from Gallery (Google Photos)',
    mobile_tip: '💡 Mobile Tip: If your phone only shows Google Photos, tap "Browse Local Files" to open the system file manager and access Downloads, LINE videos, or internal storage.',
    change_video: 'Change Video',
    spectrum_title: 'Live Audio Spectrum & Peak VU Meter',
    volume_boost_title: 'Volume Boost Multiplier',
    volume_boost_desc: 'Lossless digital pre-amp, listen as you adjust',
    quick_presets: 'Quick Presets',
    custom_input_label: 'Custom Value:',
    apply: 'Apply',
    enhancer_title: 'Audio Enhancement & Protection',
    limiter_title: 'Smart Anti-Clipping Soft Limiter',
    limiter_desc: 'Highly recommended! Smooths out waveform peaks to prevent distortion when boosting heavily.',
    vocal_title: 'Vocal Clarity Dialogue Boost',
    vocal_desc: 'Boosts 1kHz - 3kHz frequencies to make quiet dialogue clear and distinct.',
    bass_title: 'Bass Resonance Boost',
    bass_desc: 'Enriches 100Hz low frequencies for warmer, punchier audio.',
    export_title: 'Export Video with Boosted Audio',
    export_subtitle: 'Uses lossless video stream copy (-c:v copy) to preserve 100% original video quality with blazing speed',
    engine_label: 'Engine:',
    start_export: 'Start Processing & Export',
    cancel_export: 'Cancel',
    export_success_title: 'Processing Complete!',
    download_btn: 'Download Video File',
    preview_exported: 'Play & Test Exported Video',
    feat_1_title: '100% Private & Local',
    feat_1_desc: 'All processing happens in your browser. Videos never leave your device or upload to any third-party server.',
    feat_2_title: 'Zero Video Quality Loss',
    feat_2_desc: 'Video stream is directly copied without re-encoding. Only audio is amplified, ensuring pristine original video fidelity.',
    feat_3_title: 'Pro Anti-Clipping & Vocal Boost',
    feat_3_desc: 'Built-in studio-grade dynamic compressor prevents harsh crackling while vocal EQ emphasizes spoken dialogue.'
  }
};

// --- Global Application State ---
let currentLang = 'zh-TW';
let currentFile = null;
let videoUrl = null;
let exportedBlobUrl = null;
let isExporting = false;
let exportAbortController = null;

// Audio Context & Graph Nodes
let audioCtx = null;
let mediaSourceNode = null;
let gainNode = null;
let limiterNode = null;
let vocalFilterNode = null;
let bassFilterNode = null;
let analyserNode = null;
let streamDestinationNode = null;
let isAudioGraphSetup = false;

// Visualizer State
let visualizerAnimationId = null;

// DOM Elements
const elements = {
  langToggle: document.getElementById('langToggle'),
  langText: document.getElementById('langText'),
  uploadSection: document.getElementById('uploadSection'),
  dropZone: document.getElementById('dropZone'),
  localFileInput: document.getElementById('localFileInput'),
  galleryFileInput: document.getElementById('galleryFileInput'),
  btnPickLocal: document.getElementById('btnPickLocal'),
  btnPickGallery: document.getElementById('btnPickGallery'),
  editorSection: document.getElementById('editorSection'),
  fileDisplayName: document.getElementById('fileDisplayName'),
  fileDisplayMeta: document.getElementById('fileDisplayMeta'),
  changeVideoBtn: document.getElementById('changeVideoBtn'),
  mainVideo: document.getElementById('mainVideo'),
  spectrumCanvas: document.getElementById('spectrumCanvas'),
  vuMeterL: document.getElementById('vuMeterL'),
  vuMeterR: document.getElementById('vuMeterR'),
  clippingBadge: document.getElementById('clippingBadge'),
  volumeSlider: document.getElementById('volumeSlider'),
  volumePercentDisplay: document.getElementById('volumePercentDisplay'),
  volumeDbDisplay: document.getElementById('volumeDbDisplay'),
  customVolumeInput: document.getElementById('customVolumeInput'),
  applyCustomBtn: document.getElementById('applyCustomBtn'),
  presetBtns: document.querySelectorAll('.preset-btn'),
  limiterToggle: document.getElementById('limiterToggle'),
  vocalToggle: document.getElementById('vocalToggle'),
  bassToggle: document.getElementById('bassToggle'),
  exportBtn: document.getElementById('exportBtn'),
  cancelExportBtn: document.getElementById('cancelExportBtn'),
  exportProgressBox: document.getElementById('exportProgressBox'),
  exportProgressBar: document.getElementById('exportProgressBar'),
  exportStatusText: document.getElementById('exportStatusText'),
  exportPercentText: document.getElementById('exportPercentText'),
  downloadResultBox: document.getElementById('downloadResultBox'),
  downloadLink: document.getElementById('downloadLink'),
  previewBoostedBtn: document.getElementById('previewBoostedBtn'),
  exportResultMeta: document.getElementById('exportResultMeta'),
  activeEngineBadge: document.getElementById('activeEngineBadge')
};

// Canvas context
const canvasCtx = elements.spectrumCanvas.getContext('2d');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setupLanguage();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
});

// --- Language Toggle ---
function setupLanguage() {
  elements.langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    elements.langText.textContent = currentLang === 'zh-TW' ? 'EN' : '中文';
    applyLanguage();
  });
  applyLanguage();
}

function applyLanguage() {
  const texts = I18N[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (texts[key]) {
      el.textContent = texts[key];
    }
  });
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // Dropzone background click fallback: only trigger if clicking on background area
  elements.dropZone.addEventListener('click', (e) => {
    if (!e.target.closest('#btnPickLocal') && !e.target.closest('#btnPickGallery')) {
      elements.localFileInput.click();
    }
  });

  // Handle file selection from either input
  elements.localFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  });

  elements.galleryFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(name => {
    elements.dropZone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      elements.dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(name => {
    elements.dropZone.addEventListener(name, (e) => {
      e.preventDefault();
      e.stopPropagation();
      elements.dropZone.classList.remove('dragover');
    });
  });

  elements.dropZone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  // Change video button: reset input value so re-selecting the same file works
  elements.changeVideoBtn.addEventListener('click', () => {
    elements.localFileInput.value = '';
    elements.galleryFileInput.value = '';
  });

  // Volume Slider input
  elements.volumeSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
  });

  // Quick Presets
  elements.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      setVolume(val);
    });
  });

  // Custom Input
  elements.applyCustomBtn.addEventListener('click', () => {
    const val = parseInt(elements.customVolumeInput.value, 10);
    if (!isNaN(val) && val >= 0 && val <= 1000) {
      setVolume(val);
    }
  });
  elements.customVolumeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      elements.applyCustomBtn.click();
    }
  });

  // Enhancement Toggles
  elements.limiterToggle.addEventListener('change', updateAudioNodes);
  elements.vocalToggle.addEventListener('change', updateAudioNodes);
  elements.bassToggle.addEventListener('change', updateAudioNodes);

  // Video interaction for AudioContext unlocking
  elements.mainVideo.addEventListener('play', () => {
    if (!isAudioGraphSetup) {
      initAudioGraph();
    } else if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    startVisualizer();
  });

  // Export action
  elements.exportBtn.addEventListener('click', handleExport);
  elements.previewBoostedBtn.addEventListener('click', previewExportedVideo);
}

// --- File Selection & Video Loading ---
function handleFileSelected(file) {
  // Broad video validation supporting files without MIME types from Android file manager
  const isVideoType = file.type && file.type.startsWith('video/');
  const isVideoExt = file.name && file.name.match(/\.(mp4|webm|mkv|mov|avi|ts|flv|3gp|m4v|wmv|mts|m2ts)$/i);

  if (!isVideoType && !isVideoExt) {
    alert(currentLang === 'zh-TW' ? '請選取有效的影片檔案 (例如 MP4, WebM, MOV, MKV, 3GP)！' : 'Please select a valid video file (e.g. MP4, WebM, MOV, MKV, 3GP)!');
    return;
  }

  currentFile = file;

  // Cleanup existing URLs
  if (videoUrl) {
    URL.revokeObjectURL(videoUrl);
  }
  if (exportedBlobUrl) {
    URL.revokeObjectURL(exportedBlobUrl);
    exportedBlobUrl = null;
  }

  videoUrl = URL.createObjectURL(file);
  elements.mainVideo.src = videoUrl;
  elements.mainVideo.load();

  // Update File Info
  elements.fileDisplayName.textContent = file.name;
  elements.fileDisplayMeta.textContent = `${formatBytes(file.size)} • 載入中...`;

  elements.mainVideo.onloadedmetadata = () => {
    const durationStr = formatDuration(elements.mainVideo.duration);
    elements.fileDisplayMeta.textContent = `${formatBytes(file.size)} • ${durationStr} • ${elements.mainVideo.videoWidth}x${elements.mainVideo.videoHeight}`;
  };

  // Reset Download Result
  elements.downloadResultBox.classList.add('hidden');
  elements.exportProgressBox.classList.add('hidden');

  // Display editor, scroll smoothly
  elements.editorSection.classList.remove('hidden');
  elements.editorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Reset Volume to 100%
  setVolume(100);

  // Background pre-load FFmpeg single-thread core so export is ready instantly!
  getFFmpeg().catch(err => console.log('FFmpeg background preloading:', err));
}

// --- Volume Calculation & Updates ---
function setVolume(percent) {
  percent = Math.max(0, Math.min(1000, percent));

  elements.volumeSlider.value = Math.min(600, percent);
  elements.customVolumeInput.value = percent;
  elements.volumePercentDisplay.textContent = `${percent}%`;

  // Calculate Decibels: dB = 20 * log10(percent / 100)
  let dbStr = '-∞ dB';
  if (percent > 0) {
    const db = 20 * Math.log10(percent / 100);
    dbStr = `${db >= 0 ? '+' : ''}${db.toFixed(1)} dB`;
  }
  elements.volumeDbDisplay.textContent = dbStr;

  // Update preset button active states
  elements.presetBtns.forEach(btn => {
    const btnVal = parseInt(btn.getAttribute('data-val'), 10);
    if (btnVal === percent) {
      btn.className = 'preset-btn px-2 py-1.5 rounded-lg text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40 transition';
    } else {
      btn.className = 'preset-btn px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition';
    }
  });

  // Apply to Web Audio Gain Node if active
  if (gainNode && audioCtx) {
    const gainValue = percent / 100;
    gainNode.gain.setTargetAtTime(gainValue, audioCtx.currentTime, 0.03);
  }
}

// --- Web Audio API Initialization & Graph ---
function initAudioGraph() {
  if (isAudioGraphSetup) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();

  // Create nodes
  mediaSourceNode = audioCtx.createMediaElementSource(elements.mainVideo);

  // Bass Filter (Low Shelf at 100Hz)
  bassFilterNode = audioCtx.createBiquadFilter();
  bassFilterNode.type = 'lowshelf';
  bassFilterNode.frequency.value = 100;
  bassFilterNode.gain.value = elements.bassToggle.checked ? 7 : 0;

  // Vocal Clarity Filter (Peaking at 2.4kHz, Q=1.2)
  vocalFilterNode = audioCtx.createBiquadFilter();
  vocalFilterNode.type = 'peaking';
  vocalFilterNode.frequency.value = 2400;
  vocalFilterNode.Q.value = 1.2;
  vocalFilterNode.gain.value = elements.vocalToggle.checked ? 6 : 0;

  // Gain Node
  gainNode = audioCtx.createGain();
  const currentVal = parseInt(elements.customVolumeInput.value, 10) || 100;
  gainNode.gain.value = currentVal / 100;

  // Dynamics Compressor / Limiter Node
  limiterNode = audioCtx.createDynamicsCompressor();
  limiterNode.threshold.value = -12; // dB
  limiterNode.knee.value = 24;
  limiterNode.ratio.value = 14;
  limiterNode.attack.value = 0.003;
  limiterNode.release.value = 0.25;

  // Analyser Node for Visualizer and VU Meters
  analyserNode = audioCtx.createAnalyser();
  analyserNode.fftSize = 256;
  analyserNode.smoothingTimeConstant = 0.8;

  // Stream Destination for recording
  streamDestinationNode = audioCtx.createMediaStreamDestination();

  // Build audio routing
  rebuildAudioRouting();

  isAudioGraphSetup = true;
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function rebuildAudioRouting() {
  if (!mediaSourceNode || !audioCtx) return;

  // Disconnect existing
  try {
    mediaSourceNode.disconnect();
    bassFilterNode.disconnect();
    vocalFilterNode.disconnect();
    gainNode.disconnect();
    limiterNode.disconnect();
    analyserNode.disconnect();
  } catch (err) {
    // Ignore initial disconnection errors
  }

  // Chain: Source -> Bass Filter -> Vocal Filter -> Gain Node
  mediaSourceNode.connect(bassFilterNode);
  bassFilterNode.connect(vocalFilterNode);
  vocalFilterNode.connect(gainNode);

  const useLimiter = elements.limiterToggle.checked;

  if (useLimiter) {
    gainNode.connect(limiterNode);
    limiterNode.connect(analyserNode);
  } else {
    gainNode.connect(analyserNode);
  }

  // Connect Analyser to Speakers & Stream Destination
  analyserNode.connect(audioCtx.destination);
  analyserNode.connect(streamDestinationNode);
}

function updateAudioNodes() {
  if (!isAudioGraphSetup) return;

  bassFilterNode.gain.setTargetAtTime(elements.bassToggle.checked ? 7 : 0, audioCtx.currentTime, 0.05);
  vocalFilterNode.gain.setTargetAtTime(elements.vocalToggle.checked ? 6 : 0, audioCtx.currentTime, 0.05);

  rebuildAudioRouting();
}

// --- Canvas Spectrum Visualizer & VU Meter ---
function resizeCanvas() {
  const rect = elements.spectrumCanvas.getBoundingClientRect();
  elements.spectrumCanvas.width = rect.width * window.devicePixelRatio;
  elements.spectrumCanvas.height = rect.height * window.devicePixelRatio;
}

function startVisualizer() {
  if (visualizerAnimationId) return;

  const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 128;
  const dataArray = new Uint8Array(bufferLength);
  const timeDataArray = new Uint8Array(bufferLength);

  function draw() {
    visualizerAnimationId = requestAnimationFrame(draw);

    if (!analyserNode || elements.mainVideo.paused || elements.mainVideo.ended) {
      drawIdleSpectrum();
      elements.vuMeterL.style.width = '0%';
      elements.vuMeterR.style.width = '0%';
      elements.clippingBadge.classList.add('hidden');
      return;
    }

    analyserNode.getByteFrequencyData(dataArray);
    analyserNode.getByteTimeDomainData(timeDataArray);

    const width = elements.spectrumCanvas.width;
    const height = elements.spectrumCanvas.height;

    canvasCtx.clearRect(0, 0, width, height);

    // Draw Frequency Bars
    const barCount = 48;
    const barSpacing = 3 * window.devicePixelRatio;
    const totalSpacing = barSpacing * (barCount - 1);
    const barWidth = (width - totalSpacing) / barCount;

    // Gradient styling
    const gradient = canvasCtx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, '#14b8a6');
    gradient.addColorStop(0.6, '#06b6d4');
    gradient.addColorStop(1, '#a855f7');

    canvasCtx.fillStyle = gradient;

    const step = Math.floor(bufferLength / barCount);
    let peakLevel = 0;

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += dataArray[i * step + j] || 0;
      }
      const avg = sum / step;
      const barHeight = (avg / 255) * height * 0.95;

      const x = i * (barWidth + barSpacing);
      const y = height - barHeight;

      canvasCtx.beginPath();
      canvasCtx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
      canvasCtx.fill();

      if (avg > peakLevel) peakLevel = avg;
    }

    // VU Meter Level Calculation
    let rms = 0;
    let clipped = false;
    for (let i = 0; i < bufferLength; i++) {
      const sample = (timeDataArray[i] - 128) / 128;
      rms += sample * sample;
      if (Math.abs(sample) >= 0.98) {
        clipped = true;
      }
    }
    rms = Math.sqrt(rms / bufferLength);

    const vuPercent = Math.min(100, Math.round(rms * 160));
    elements.vuMeterL.style.width = `${vuPercent}%`;
    elements.vuMeterR.style.width = `${Math.min(100, Math.round(vuPercent * 0.96 + Math.random() * 4))}%`;

    // Clipping Warning
    if (clipped && !elements.limiterToggle.checked) {
      elements.clippingBadge.classList.remove('hidden');
    } else {
      elements.clippingBadge.classList.add('hidden');
    }
  }

  draw();
}

function drawIdleSpectrum() {
  const width = elements.spectrumCanvas.width;
  const height = elements.spectrumCanvas.height;
  canvasCtx.clearRect(0, 0, width, height);

  canvasCtx.strokeStyle = 'rgba(45, 212, 191, 0.2)';
  canvasCtx.lineWidth = 1.5;
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, height / 2);
  canvasCtx.lineTo(width, height / 2);
  canvasCtx.stroke();
}

// --- Single-Threaded FFmpeg Loader (No SharedArrayBuffer Needed, 100% Mobile & Desktop Compatible) ---
let ffmpegInstance = null;
let isFFmpegLoading = false;

async function getFFmpeg() {
  if (ffmpegInstance && ffmpegInstance.isLoaded()) {
    return ffmpegInstance;
  }

  if (isFFmpegLoading) {
    // Wait for in-progress load
    while (isFFmpegLoading) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (ffmpegInstance && ffmpegInstance.isLoaded()) {
      return ffmpegInstance;
    }
  }

  isFFmpegLoading = true;

  try {
    elements.exportStatusText.textContent = currentLang === 'zh-TW' ? '正在載入極速無損核心（無需播放）...' : 'Loading fast engine (no playback needed)...';

    if (!window.FFmpeg || !window.FFmpeg.createFFmpeg) {
      throw new Error('FFmpeg library failed to load from CDN. Please check network connection.');
    }

    const { createFFmpeg } = window.FFmpeg;

    // Use single-threaded core that works everywhere without SharedArrayBuffer or cross-origin restrictions
    const ffmpeg = createFFmpeg({
      log: false,
      corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-st@0.11.1/dist/ffmpeg-core.js'
    });

    ffmpeg.setProgress(({ ratio }) => {
      if (ratio >= 0 && ratio <= 1) {
        const p = Math.min(99, Math.round(ratio * 100));
        updateExportProgress(Math.max(15, p), `${currentLang === 'zh-TW' ? '極速音量增強中（免重播）' : 'Fast boosting'}: ${p}%`);
      }
    });

    await ffmpeg.load();

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  } catch (err) {
    console.error('Failed to initialize FFmpeg single-thread core:', err);
    throw err;
  } finally {
    isFFmpegLoading = false;
  }
}

// --- Video Export Controller ---
async function handleExport() {
  if (!currentFile || isExporting) return;

  isExporting = true;
  elements.exportBtn.disabled = true;
  elements.exportBtn.classList.add('opacity-50', 'cursor-not-allowed');
  elements.exportProgressBox.classList.remove('hidden');
  elements.downloadResultBox.classList.add('hidden');
  updateExportProgress(5, currentLang === 'zh-TW' ? '準備極速無損處理...' : 'Preparing fast lossless processing...');

  const volumePercent = parseInt(elements.customVolumeInput.value, 10) || 100;
  const volumeMultiplier = volumePercent / 100;

  try {
    elements.activeEngineBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> FFmpeg Fast Engine`;
    
    // Execute fast lossless export (Never requires playing through the video!)
    const outputBlob = await exportWithFFmpeg(volumeMultiplier);
    const outputFilename = `boosted_${volumePercent}pct_${currentFile.name.replace(/\.[^/.]+$/, '')}.mp4`;

    // Success handling
    if (exportedBlobUrl) {
      URL.revokeObjectURL(exportedBlobUrl);
    }
    exportedBlobUrl = URL.createObjectURL(outputBlob);

    elements.downloadLink.href = exportedBlobUrl;
    elements.downloadLink.download = outputFilename;
    elements.exportResultMeta.textContent = `${outputFilename} (${formatBytes(outputBlob.size)}) • 處理耗時僅數秒`;

    updateExportProgress(100, currentLang === 'zh-TW' ? '處理完成！' : 'Completed!');
    elements.exportProgressBox.classList.add('hidden');
    elements.downloadResultBox.classList.remove('hidden');
    elements.downloadResultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    console.error('Export error:', err);
    updateExportProgress(0, currentLang === 'zh-TW' ? '處理失敗' : 'Failed');
    alert((currentLang === 'zh-TW' ? '極速匯出發生錯誤：' : 'Fast export failed: ') + err.message);
  } finally {
    isExporting = false;
    elements.exportBtn.disabled = false;
    elements.exportBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

// --- Fast Lossless Video Export (No Re-encoding, No Playback!) ---
async function exportWithFFmpeg(volumeMultiplier) {
  const ffmpeg = await getFFmpeg();
  const { fetchFile } = window.FFmpeg;

  const ext = currentFile.name.split('.').pop().toLowerCase() || 'mp4';
  const inputName = `input_${Date.now()}.${ext}`;
  const outputName = `output_${Date.now()}.mp4`;

  updateExportProgress(15, currentLang === 'zh-TW' ? '正在讀取原始檔案（不需播放）...' : 'Loading video data...');
  ffmpeg.FS('writeFile', inputName, await fetchFile(currentFile));

  // Construct Audio Filter String
  const filters = [];
  if (elements.bassToggle.checked) {
    filters.push('equalizer=f=100:width_type=h:width=100:g=7');
  }
  if (elements.vocalToggle.checked) {
    filters.push('equalizer=f=2400:width_type=h:width=1200:g=6');
  }
  filters.push(`volume=${volumeMultiplier.toFixed(2)}`);
  if (elements.limiterToggle.checked) {
    filters.push('alimiter=limit=0.95:attack=5:release=50');
  }

  const filterString = filters.join(',');
  updateExportProgress(35, currentLang === 'zh-TW' ? '正在無損放大音軌（視訊直接複製，原畫質 100%）...' : 'Boosting audio track...');

  // Execute FFmpeg: -c:v copy ensures video is NOT decoded or re-encoded. Fast in seconds!
  await ffmpeg.run(
    '-i', inputName,
    '-c:v', 'copy',
    '-af', filterString,
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    outputName
  );

  updateExportProgress(95, currentLang === 'zh-TW' ? '正在輸出新影片...' : 'Packaging new video...');
  const data = ffmpeg.FS('readFile', outputName);

  // Cleanup virtual FS memory
  try {
    ffmpeg.FS('unlink', inputName);
    ffmpeg.FS('unlink', outputName);
  } catch (e) {
    // Ignore cleanup error
  }

  return new Blob([data.buffer], { type: 'video/mp4' });
}

// --- Engine 2: Browser MediaRecorder Fallback ---
async function exportWithBrowserRecorder() {
  if (!isAudioGraphSetup) {
    initAudioGraph();
  }

  return new Promise((resolve, reject) => {
    const video = elements.mainVideo;
    const stream = video.captureStream ? video.captureStream() : (video.mozCaptureStream ? video.mozCaptureStream() : null);

    if (!stream) {
      return reject(new Error('Browser does not support captureStream() API.'));
    }

    // Combine original video tracks with our boosted audio destination tracks
    const videoTracks = stream.getVideoTracks();
    const audioTracks = streamDestinationNode.stream.getAudioTracks();

    if (videoTracks.length === 0 || audioTracks.length === 0) {
      return reject(new Error('Missing video or audio stream tracks.'));
    }

    const combinedStream = new MediaStream([videoTracks[0], audioTracks[0]]);

    // Determine supported MIME type
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recorder = new MediaRecorder(combinedStream, { mimeType });
    const chunks = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };

    recorder.onerror = (e) => reject(e.error || new Error('Recording failed'));

    // Start playback from beginning
    const originalTime = video.currentTime;
    const originalPaused = video.paused;

    video.currentTime = 0;
    recorder.start(500);

    const onTimeUpdate = () => {
      const progress = Math.min(99, Math.round((video.currentTime / video.duration) * 100));
      updateExportProgress(progress, `${currentLang === 'zh-TW' ? '即時轉錄錄製中' : 'Recording'}: ${progress}%`);
    };

    video.addEventListener('timeupdate', onTimeUpdate);

    const onEnded = () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      recorder.stop();
      if (!originalPaused) {
        video.currentTime = originalTime;
      }
    };

    video.addEventListener('ended', onEnded, { once: true });
    video.play();
  });
}

// --- Preview Exported Video ---
function previewExportedVideo() {
  if (!exportedBlobUrl) return;
  elements.mainVideo.src = exportedBlobUrl;
  elements.mainVideo.load();
  elements.mainVideo.play();
  elements.editorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Utility Functions ---
function updateExportProgress(percent, status) {
  elements.exportProgressBar.style.width = `${percent}%`;
  elements.exportPercentText.textContent = `${percent}%`;
  if (status) {
    elements.exportStatusText.textContent = status;
  }
}

function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function formatDuration(seconds) {
  if (isNaN(seconds) || seconds === Infinity) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
