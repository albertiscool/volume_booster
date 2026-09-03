# 🔊 Volume Booster (影片音量放大與聲音增強器)

<div align="center">

[![GitHub License](https://img.shields.io/github/license/albertiscool/volume_booster?style=flat-square&color=teal)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-2dd4bf?style=flat-square&logo=github)](https://albertiscool.github.io/volume_booster/)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-06b6d4?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![FFmpeg.wasm](https://img.shields.io/badge/Video-FFmpeg.wasm-7928ca?style=flat-square)](https://ffmpegwasm.netlify.app/)
[![Pure Client-Side](https://img.shields.io/badge/Privacy-100%25%20Local-10b981?style=flat-square)](#-隱私與安全性保障)

**一個現代化、功能強大且 100% 本地運算的影片音量放大與音質增強網站。**  
無需安裝複雜軟體，直接在瀏覽器中將影片聲音放大最高至 600%（或更高），具備智慧防破音、人聲清晰強化，並能極速無損匯出影片！

[線上體驗 Live Demo](https://albertiscool.github.io/volume_booster/) • [功能特色](#-核心特色) • [本機執行](#-本機快速啟動) • [GitHub Pages 部署](#-github-pages-線上部署教學)

</div>

---

## ✨ 核心特色

- 🚀 **即調即聽，無需等待匯出**  
  採用先進的瀏覽器原生 **Web Audio API**，拖入影片即可直接播放，並動態調整音量與音效，體驗絲滑無延遲。
- 📢 **高達 2000% 音量增強（+26.0 dB）**  
  滑桿支援直接滑動至 2000% (+26 dB)，並附帶 `50%`、`100%`、`200%`、`300%`、`500%`、`1000%`、`1500%`、`2000%` 等常用快速預設按鈕，亦可自訂輸入任意數值。
- 🛡️ **智慧防破音限制器 (Soft Limiter / Dynamic Compressor)**  
  大幅提升分貝時，自動平滑音訊峰值（Threshold: -12dB, Ratio: 14:1），有效杜絕爆音、破音與數位失真。
- 🗣️ **人聲清晰增強 (Vocal Clarity Boost)**  
  專為對話細小、旁白微弱的影片設計，智慧加強 1kHz ~ 3kHz 人聲核心頻段，讓說話聲清楚浮現。
- 🔊 **重低音共鳴強化 (Bass Boost)**  
  提升 100Hz 飽滿低頻，看電影或聽音樂更具沉浸感。
- 📊 **即時動態頻譜儀與立體聲 VU 電平表**  
  即時以 Canvas 渲染 48 頻段動態光譜，具備 L/R 雙聲道電平表與過載紅燈警告（Clipping Alert）。
- ⚡ **無損視訊流極速匯出 (`-c:v copy`)**  
  匯出時採用視訊流直接複製技術，**視訊畫面 100% 不重新編碼**，數百 MB 的影片僅需 3~5 秒即可完成合成，原畫質完全零損失！
- 🔄 **雙核心自動備援 (FFmpeg.wasm + MediaStream)**  
  優先採用極速 FFmpeg.wasm 核心，在受限環境或舊款裝置下無縫自動切換至瀏覽器原生錄製核心，確保 100% 成功匯出。
- 📱 **手機友善雙模選取（本機檔案 / 相簿影片）**  
  特別為 Android / iOS 手機優化，除預設媒體相簿外，更提供「選取本機檔案」按鈕，可直接喚起手機檔案總管選取「下載項目 (Downloads)」、LINE 接收影片或手機內部儲存空間檔案，不再受限於 Google 相簿。
- 🌐 **雙語介面**  
  內建繁體中文（繁中）與英文（EN）一鍵即時切換。

---

## 🔒 隱私與安全性保障

- **100% 本地端執行**：所有影片讀取、音訊處理與檔案合成都在您的本機瀏覽器內進行。
- **絕不上傳雲端**：您的個人、私密或工作影片**絕不會被上傳到任何第三方伺服器**，無資安洩漏風險，檔案大小亦不受雲端頻寬限制。

---

## 🖥️ 介面預覽與操作步驟

```
   [ 1. 拖曳或選取影片 ]
           │
           ▼
   [ 2. 即時預覽播放器 ] ──▶ [ 調整音量滑桿 (0% ~ 600%) ]
           │              ──▶ [ 開啟人聲清晰化 / 防破音保護 ]
           │              ──▶ [ 查看即時音訊頻譜儀與 VU 表 ]
           ▼
   [ 3. 一鍵極速匯出 ]   ──▶ [ 視訊無損複製 + 音訊重編碼 ]
           │
           ▼
   [ 4. 下載增強後的新影片 (.mp4) ]
```

---

## 🚀 本機快速啟動

若您想在自己的電腦本地端執行本網站：

### 方法一：使用 Node.js（推薦）

```bash
# 1. 複製倉庫
git clone https://github.com/albertiscool/volume_booster.git
cd volume_booster

# 2. 啟動本機伺服器
npm start
# 或直接執行
node server.js
```
開啟瀏覽器訪問：`http://localhost:3000`

---

### 方法二：使用 Python

```bash
# 1. 進入目錄
cd volume_booster

# 2. 啟動 Python 服務器
python app.py
```
開啟瀏覽器訪問：`http://localhost:8080`

---

## 🌐 GitHub Pages 線上部署教學

本專案已內建 `.github/workflows/deploy.yml` 自動部署腳本，只需在 GitHub 倉庫開啟 Pages 設定即可免費線上運行：

1. 開啟 GitHub 倉庫頁面：[albertiscool/volume_booster](https://github.com/albertiscool/volume_booster)
2. 點擊頂部 **Settings** 標籤頁。
3. 在左側欄位點擊 **Pages**。
4. 在 **Build and deployment** 下方的 **Source** 選擇 **GitHub Actions**。
5. 只要推送代碼至 `main` 分支，GitHub Actions 就會自動構建並上線！
6. 您的線上網址即為：
   `https://albertiscool.github.io/volume_booster/`

> **提示**：專案已包含 `coi-serviceworker.js`，自動解決 GitHub Pages 上的跨域隔離與 `SharedArrayBuffer` 支援，讓 FFmpeg.wasm 能夠完美在線運行！

---

## 📂 專案檔案結構

```
volume_booster/
├── index.html                  # 網站主結構與現代化 UI 畫面
├── style.css                   # 霓虹深色模式與自訂視覺樣式
├── app.js                      # Web Audio API 音訊圖、Visualizer 與匯出核心邏輯
├── coi-serviceworker.js        # 啟用 SharedArrayBuffer 的跨域 Service Worker
├── server.js                   # Node.js 本機隔離伺服器
├── app.py                      # Python 本機隔離伺服器
├── package.json                # npm 專案定義與腳本
├── .gitignore                  # Git 忽略檔案設定
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自動部署工作流
├── LICENSE                     # MIT 開源授權條款
└── README.md                   # 專案中文與英文說明手冊
```

---

## 🛠️ 支援的影片格式

| 格式 | 副檔名 | 備註 |
|:---:|:---:|:---:|
| **MP4** | `.mp4` | 支援度最佳，相容所有主流平台 |
| **WebM** | `.webm` | Google WebM 影片格式 |
| **QuickTime** | `.mov` | 蘋果相機與 iPhone 錄影格式 |
| **Matroska** | `.mkv` | 常見高畫質影片封裝 |
| **AVI** | `.avi` | 經典視訊格式 |

---

## 📄 開源授權 (License)

本專案採用 [MIT License](LICENSE) 開源授權，歡迎自由使用、學習、修改或分發。
