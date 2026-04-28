(function () {
  const cfg = {
    dir: "image_tongquan",
    prefix: "Tongthe360_",
    start: 0,
    end: 236,
    step: 2,
    pad: 5,
    ext: ".jpg",
    dragSensitivity: 0.16,
    wheelSensitivity: 1,
    preloadRadius: 4,
  };
  const viTriCandidates = [
    "media/media_F69C78E4_E5E4_FD16_41D6_93F5BD15BD4C_poster_en.jpg",
  ];
  const phanKhuCandidates = [
    "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_0/f/0/4_3.avif",
    "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_0/f/0/4_4.avif",
    "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_0/f/0/4_5.avif",
    "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_0/f/0/4_6.avif",
    "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_0/f/0/5_3.avif",
    "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_0/f/0/5_4.avif",
    "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_0/f/0/5_5.avif",
    "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_0/f/0/5_6.avif",
  ];

  function pad(n, width) {
    const s = String(n);
    return s.length >= width ? s : "0".repeat(width - s.length) + s;
  }

  function wrap(i, len) {
    return ((i % len) + len) % len;
  }

  const frames = [];
  for (let i = cfg.start; i <= cfg.end; i += cfg.step) {
    frames.push(`${cfg.dir}/${cfg.prefix}${pad(i, cfg.pad)}${cfg.ext}`);
  }

  const viewer = document.getElementById("viewer");
  const frame1 = document.getElementById("frame1");
  const frame2 = document.getElementById("frame2");
  const topbar = document.querySelector(".topbar");
  const hint = document.querySelector(".hint");
  const goldNav = document.querySelector(".gold-nav");
  const loading = document.getElementById("loading");
  const status = document.getElementById("status");
  const zoneHotspots = document.getElementById("zoneHotspots");
  const zoneClickLayer = document.getElementById("zoneClickLayer");
  const zoneDimmer = document.getElementById("zoneDimmer");
  const zoneInfo325 = document.getElementById("zoneInfo325");
  const zoneInfo325Sprite = document.getElementById("zoneInfo325Sprite");
  const zoneDebugButtons = document.getElementById("zoneDebugButtons");
  const zoneLedElements = Array.from(document.querySelectorAll("[data-zone-led]"));
  const sectionButtons = document.querySelectorAll("[data-section]");
  const zoneS1Overlay = document.getElementById("zoneS1Overlay");
  const zoneS1InfoSprite = document.getElementById("zoneS1InfoSprite");
  const zoneS1MapSprite = document.getElementById("zoneS1MapSprite");
  const maunhaOverlay = document.getElementById("maunhaOverlay");
  const maunhaHero = document.getElementById("maunhaHero");
  const maunhaModelButtons = Array.from(document.querySelectorAll("[data-maunha-model]"));
  const maunhaFloorButtons = Array.from(document.querySelectorAll("[data-maunha-floor]"));
  const maunhaCloseButtons = Array.from(document.querySelectorAll("[data-maunha-close]"));

  if (!viewer || !frame1 || !frame2 || !frames.length) return;

  const cache = new Map();
  let current = 0;
  let target = 0;
  let floatFrame = 0;
  let locked = false;
  let scale = 1;
  let dragging = false;
  let lastX = 0;
  let section = "tongquan";
  let sectionRequestId = 0;
  let ledTimer = null;
  let zoneInfoTimer = null;
  let zoneS1Timer = null;
  let s1OverlayVisible = false;
  let maunhaActiveModel = "parkhouse";
  let maunhaActiveFloor = "1";
  const zoneMaskCache = new Map();
  const zoneInfoCfgMap = {
    khu325: {
      image: "media/res_2E15B688_BB5A_258C_41CA_8A65196F7099_0.avif",
    },
    khu337: {
      image: "media/res_20A38194_BCBA_3F9B_41D2_3ABF6FDF593A_0.avif",
    },
    khu101: {
      image: "media/res_20A45195_BCBA_3F85_41C6_0FDAF0CB89C8_0.avif",
    },
    khu217: {
      image: "media/res_1299303C_BB4E_3C84_41DD_D07EF5EB6FDE_0.avif",
    },
  };
  const zoneInfoBaseCfg = {
    frameCount: 11,
    colCount: 3,
    rowCount: 4,
    frameDuration: 30,
  };
  const zoneS1SpriteCfg = {
    frameCount: 11,
    colCount: 3,
    rowCount: 4,
    frameDuration: 41,
    infoImage: "media/res_296C29C3_BCD6_2FFC_41DF_67C2663996F8_0.avif",
    mapImage: "media/res_296C39C3_BCD6_2FFC_41DB_70D038E4BB93_0.avif",
  };
  const maunhaModelTiles = {
    "parkhouse": [
      "media/panorama_A7C5B4E2_BB56_25BF_41D3_CD04CBA4511A_0/f/0/4_3.avif",
      "media/panorama_A7C5B4E2_BB56_25BF_41D3_CD04CBA4511A_0/f/0/4_4.avif",
      "media/panorama_A7C5B4E2_BB56_25BF_41D3_CD04CBA4511A_0/f/0/4_5.avif",
      "media/panorama_A7C5B4E2_BB56_25BF_41D3_CD04CBA4511A_0/f/0/4_6.avif",
      "media/panorama_A7C5B4E2_BB56_25BF_41D3_CD04CBA4511A_0/f/0/5_3.avif",
      "media/panorama_A7C5B4E2_BB56_25BF_41D3_CD04CBA4511A_0/f/0/5_4.avif",
      "media/panorama_A7C5B4E2_BB56_25BF_41D3_CD04CBA4511A_0/f/0/5_5.avif",
      "media/panorama_A7C5B4E2_BB56_25BF_41D3_CD04CBA4511A_0/f/0/5_6.avif",
    ],
    "boulevard-shop": [
      "media/MauNha3/3_2.avif",
      "media/MauNha3/3_3.avif",
      "media/MauNha3/3_4.avif",
    ],
    "waterfront-mansion": [
      "media/MauNha4/4_3.avif",
      "media/MauNha4/4_4.avif",
      "media/MauNha4/4_5.avif",
      "media/MauNha4/4_6.avif",
      "media/MauNha4/5_3.avif",
      "media/MauNha4/5_4.avif",
      "media/MauNha4/5_5.avif",
      "media/MauNha4/5_6.avif",
    ],
    "duo-mansion": [
      "media/MauNha5/4_3.avif",
      "media/MauNha5/4_4.avif",
      "media/MauNha5/4_5.avif",
      "media/MauNha5/4_6.avif",
      "media/MauNha5/5_3.avif",
      "media/MauNha5/5_4.avif",
      "media/MauNha5/5_5.avif",
      "media/MauNha5/5_6.avif",
    ],
    "outlet-center": [
      "media/MauNha6/4_3.avif",
      "media/MauNha6/4_4.avif",
      "media/MauNha6/4_5.avif",
      "media/MauNha6/4_6.avif",
      "media/MauNha6/5_3.avif",
      "media/MauNha6/5_4.avif",
      "media/MauNha6/5_5.avif",
      "media/MauNha6/5_6.avif",
    ],
  };

  const maunhaFloorImages = {
    "parkhouse": {
      "1": "skin/parkhouse/ph1.png",
      "2": "skin/parkhouse/ph2.png",
      "3": "skin/parkhouse/ph3.png",
      "4": "skin/parkhouse/ph4.png",
    },
  };

  const s1TienIchTiles = [
    "media/S1_TienIch/4_3.avif",
    "media/S1_TienIch/4_4.avif",
    "media/S1_TienIch/4_5.avif",
    "media/S1_TienIch/4_6.avif",
    "media/S1_TienIch/5_3.avif",
    "media/S1_TienIch/5_4.avif",
    "media/S1_TienIch/5_5.avif",
    "media/S1_TienIch/5_6.avif",
  ];

  const phanKhuLedMap = {
    khu325: {
      image: "media/res_2E158687_BB5A_2585_41E3_0519C116A9AC_0.avif",
      mask: "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_HS_ey4dl6r3.avif",
      bounds: { left: 15.5, top: 35, width: 50, height: 68 },
      ledStyle: { left: 30, top: 63, width: 46, height: 55 },
      frameCount: 11,
      colCount: 3,
      rowCount: 4,
      frameDuration: 41,
    },
    khu217: {
      image: "media/res_1299103C_BB4E_3C84_41C1_DCB3CFF0358D_0.avif",
      mask: "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_HS_1gtckhfo.avif",
      bounds: { left: 45.7, top: 49, width: 22, height: 16 },
      ledStyle: { left: 57.5, top: 57, width: 40, height: 37 },
      frameCount: 11,
      colCount: 3,
      rowCount: 4,
      frameDuration: 41,
    },
    khu337: {
      image: "media/res_20A39194_BCBA_3F9B_41B1_22539B989362_0.avif",
      mask: "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_HS_zvnn8hy8.avif",
      bounds: { left: 46, top: 60, width: 30, height: 18 },
      ledStyle: { left: 59, top: 81, width: 55, height: 51 },
      frameCount: 11,
      colCount: 3,
      rowCount: 4,
      frameDuration: 41,
    },
    khu101: {
      image: "media/res_20A4B194_BCBA_3F9B_41E0_D99862109EE8_0.avif",
      mask: "media/panorama_A1AA3052_B58B_63E3_41E2_AEC2EDE439E6_HS_e2wvgk1l.avif",
      bounds: { left: 75, top: 65, width: 20, height: 20 },
      ledStyle: { left: 85, top: 77, width: 36, height: 46 },
      frameCount: 11,
      colCount: 3,
      rowCount: 4,
      frameDuration: 41,
    },
  };

  const ledElementMap = new Map();
  zoneLedElements.forEach((el) => {
    const zoneId = el.getAttribute("data-zone-led") || "";
    if (zoneId) ledElementMap.set(zoneId, el);
  });

  function applyZoneBounds() {
    Object.keys(phanKhuLedMap).forEach((zoneId) => {
      const cfg = phanKhuLedMap[zoneId];
      const el = ledElementMap.get(zoneId);
      if (!cfg || !cfg.bounds || !el) return;

      if (cfg.ledStyle) {
        el.style.left = `${cfg.ledStyle.left}%`;
        el.style.top = `${cfg.ledStyle.top}%`;
        el.style.width = `${cfg.ledStyle.width}%`;
        el.style.height = `${cfg.ledStyle.height}%`;
        return;
      }

      const b = cfg.bounds;
      el.style.left = `${b.left + b.width / 2}%`;
      el.style.top = `${b.top + b.height / 2}%`;
      el.style.width = `${b.width}%`;
      el.style.height = `${b.height}%`;
    });
  }

  function renderZoneDebugButtons() {
    if (!zoneDebugButtons) return;
    zoneDebugButtons.innerHTML = "";

    Object.keys(phanKhuLedMap).forEach((zoneId) => {
      const cfg = phanKhuLedMap[zoneId];
      if (!cfg || !cfg.bounds) return;
      const b = cfg.bounds;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "zone-hotspot-debug";
      btn.textContent = zoneId.replace("khu", "").toUpperCase();
      btn.style.left = `${b.left + b.width * 0.35}%`;
      btn.style.top = `${b.top + b.height * 0.45}%`;
      btn.addEventListener("click", () => {
        startLedAnimation(zoneId);
      });
      zoneDebugButtons.appendChild(btn);
    });
  }

  function setLedFrame(el, cfg, frameIndex) {
    const col = frameIndex % cfg.colCount;
    const row = Math.floor(frameIndex / cfg.colCount);
    const x = cfg.colCount > 1 ? (col / (cfg.colCount - 1)) * 100 : 0;
    const y = cfg.rowCount > 1 ? (row / (cfg.rowCount - 1)) * 100 : 0;
    el.style.backgroundImage = `url(${cfg.image})`;
    el.style.backgroundSize = `${cfg.colCount * 100}% ${cfg.rowCount * 100}%`;
    el.style.backgroundPosition = `${x}% ${y}%`;
  }

  async function getZoneMask(zoneId) {
    if (zoneMaskCache.has(zoneId)) return zoneMaskCache.get(zoneId);
    const cfg = phanKhuLedMap[zoneId];
    if (!cfg || !cfg.mask) return null;

    const img = await loadImage(cfg.mask);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);

    let maskData;
    try {
      maskData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    } catch (_secErr) {
      // Canvas tainted (file:// CORS) — mask pixel check unavailable, fallback to bounds only
      zoneMaskCache.set(zoneId, null);
      return null;
    }

    const mask = {
      width: canvas.width,
      height: canvas.height,
      data: maskData,
    };
    zoneMaskCache.set(zoneId, mask);
    return mask;
  }

  async function isPointInsideZoneMask(zoneId, xPercent, yPercent) {
    const cfg = phanKhuLedMap[zoneId];
    if (!cfg || !cfg.bounds) return false;

    const b = cfg.bounds;
    if (
      xPercent < b.left ||
      xPercent > b.left + b.width ||
      yPercent < b.top ||
      yPercent > b.top + b.height
    ) {
      return false;
    }

    const mask = await getZoneMask(zoneId);
    if (!mask) return false;

    const mx = Math.floor(((xPercent - b.left) / b.width) * (mask.width - 1));
    const my = Math.floor(((yPercent - b.top) / b.height) * (mask.height - 1));
    if (mx < 0 || my < 0 || mx >= mask.width || my >= mask.height) return false;

    const idx = (my * mask.width + mx) * 4;
    return mask.data[idx + 3] > 18;
  }

  function clearLedState() {
    if (ledTimer) {
      window.clearInterval(ledTimer);
      ledTimer = null;
    }
    if (zoneInfoTimer) {
      window.clearInterval(zoneInfoTimer);
      zoneInfoTimer = null;
    }
    if (zoneS1Timer) {
      window.clearInterval(zoneS1Timer);
      zoneS1Timer = null;
    }
    zoneLedElements.forEach((el) => {
      el.classList.remove("active");
    });
    if (zoneDimmer) zoneDimmer.classList.remove("active");
    if (zoneInfo325) zoneInfo325.classList.remove("active");
    if (zoneInfo325Sprite) {
      zoneInfo325Sprite.style.backgroundImage = "none";
    }
    hideS1Overlay();
    if (zoneS1InfoSprite) zoneS1InfoSprite.style.backgroundImage = "none";
    if (zoneS1MapSprite) zoneS1MapSprite.style.backgroundImage = "none";
  }

  function setMaunhaActive() {
    maunhaModelButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-maunha-model") === maunhaActiveModel);
    });
    maunhaFloorButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-maunha-floor") === maunhaActiveFloor);
    });
  }

  function setLegacySceneVisible(visible) {
    if (viewer) viewer.style.display = visible ? "block" : "none";
    if (topbar) topbar.style.display = visible ? "flex" : "none";
    if (hint) hint.style.display = visible && section === "tongquan" ? "block" : "none";
    if (status) status.style.display = visible ? "block" : "none";
    if (loading) loading.style.display = visible ? loading.style.display : "none";
    if (zoneHotspots) zoneHotspots.style.display = visible && section === "phankhu" ? "block" : "none";
  }

  async function loadMaunhaHero(model) {
    const tilePaths = maunhaModelTiles[model] || maunhaModelTiles["parkhouse"];
    if (!maunhaHero || !tilePaths) return;
    const composedSrc = await composeTwoRowsTiles(tilePaths);
    if (composedSrc) {
      maunhaHero.style.backgroundImage = `url(${composedSrc})`;
    }
  }

  async function showMaunhaSection() {
    clearLedState();
    setLegacySceneVisible(false);
    if (maunhaOverlay) maunhaOverlay.classList.add("active");
    await loadMaunhaHero(maunhaActiveModel);
    setMaunhaActive();
    if (status) status.textContent = "Dang xem: Mau nha";
  }

  function hideMaunhaSection() {
    if (maunhaOverlay) maunhaOverlay.classList.remove("active");
  }

  function showS1Overlay() {
    s1OverlayVisible = true;
    if (zoneDimmer) zoneDimmer.classList.add("active");
    if (zoneS1Overlay) zoneS1Overlay.classList.add("active");
    if (zoneS1InfoSprite) zoneS1InfoSprite.style.display = "block";
    if (zoneS1MapSprite) zoneS1MapSprite.style.display = "block";
    if (zoneS1Timer) {
      window.clearInterval(zoneS1Timer);
      zoneS1Timer = null;
    }

    let frame = 0;
    const applyFrame = () => {
      const col = frame % zoneS1SpriteCfg.colCount;
      const row = Math.floor(frame / zoneS1SpriteCfg.colCount);
      const x = zoneS1SpriteCfg.colCount > 1 ? (col / (zoneS1SpriteCfg.colCount - 1)) * 100 : 0;
      const y = zoneS1SpriteCfg.rowCount > 1 ? (row / (zoneS1SpriteCfg.rowCount - 1)) * 100 : 0;

      if (zoneS1InfoSprite) {
        zoneS1InfoSprite.style.backgroundImage = `url(${zoneS1SpriteCfg.infoImage})`;
        zoneS1InfoSprite.style.backgroundSize = `${zoneS1SpriteCfg.colCount * 100}% ${zoneS1SpriteCfg.rowCount * 100}%`;
        zoneS1InfoSprite.style.backgroundPosition = `${x}% ${y}%`;
      }

      if (zoneS1MapSprite) {
        zoneS1MapSprite.style.backgroundImage = `url(${zoneS1SpriteCfg.mapImage})`;
        zoneS1MapSprite.style.backgroundSize = `${zoneS1SpriteCfg.colCount * 100}% ${zoneS1SpriteCfg.rowCount * 100}%`;
        zoneS1MapSprite.style.backgroundPosition = `${x}% ${y}%`;
      }
    };

    applyFrame();
    zoneS1Timer = window.setInterval(() => {
      frame += 1;
      if (frame >= zoneS1SpriteCfg.frameCount) {
        window.clearInterval(zoneS1Timer);
        zoneS1Timer = null;
        return;
      }
      applyFrame();
    }, zoneS1SpriteCfg.frameDuration);
  }

  function hideS1Overlay() {
    s1OverlayVisible = false;
    if (zoneS1Timer) {
      window.clearInterval(zoneS1Timer);
      zoneS1Timer = null;
    }
    if (zoneS1Overlay) zoneS1Overlay.classList.remove("active");
    if (zoneS1InfoSprite) zoneS1InfoSprite.style.backgroundImage = "none";
    if (zoneS1MapSprite) zoneS1MapSprite.style.backgroundImage = "none";
  }

  function setZoneInfoFrame(zoneId, frameIndex) {
    if (!zoneInfo325Sprite) return;
    const cfg = zoneInfoCfgMap[zoneId];
    if (!cfg) return;

    const col = frameIndex % zoneInfoBaseCfg.colCount;
    const row = Math.floor(frameIndex / zoneInfoBaseCfg.colCount);
    const x = zoneInfoBaseCfg.colCount > 1 ? (col / (zoneInfoBaseCfg.colCount - 1)) * 100 : 0;
    const y = zoneInfoBaseCfg.rowCount > 1 ? (row / (zoneInfoBaseCfg.rowCount - 1)) * 100 : 0;

    zoneInfo325Sprite.style.backgroundImage = `url(${cfg.image})`;
    zoneInfo325Sprite.style.backgroundSize = `${zoneInfoBaseCfg.colCount * 100}% ${zoneInfoBaseCfg.rowCount * 100}%`;
    zoneInfo325Sprite.style.backgroundPosition = `${x}% ${y}%`;
  }

  function startZoneInfoReveal(zoneId) {
    if (zoneInfoTimer) {
      window.clearInterval(zoneInfoTimer);
      zoneInfoTimer = null;
    }

    let frame = 0;
    setZoneInfoFrame(zoneId, frame);

    if (zoneInfo325) zoneInfo325.classList.add("active");

    zoneInfoTimer = window.setInterval(() => {
      frame += 1;
      if (frame >= zoneInfoBaseCfg.frameCount) {
        window.clearInterval(zoneInfoTimer);
        zoneInfoTimer = null;
        return;
      }
      setZoneInfoFrame(zoneId, frame);
    }, zoneInfoBaseCfg.frameDuration);
  }

  function startLedAnimation(zoneId) {
    const cfg = phanKhuLedMap[zoneId];
    const targetEl = ledElementMap.get(zoneId);
    if (!cfg || !targetEl) return;

    hideS1Overlay();

    if (ledTimer) {
      window.clearInterval(ledTimer);
      ledTimer = null;
    }

    zoneLedElements.forEach((el) => {
      el.classList.toggle("active", el === targetEl);
    });
    if (zoneDimmer) zoneDimmer.classList.add("active");

    if (zoneInfoCfgMap[zoneId]) {
      startZoneInfoReveal(zoneId);
    } else {
      if (zoneInfoTimer) {
        window.clearInterval(zoneInfoTimer);
        zoneInfoTimer = null;
      }
      if (zoneInfo325) zoneInfo325.classList.remove("active");
      if (zoneInfo325Sprite) zoneInfo325Sprite.style.backgroundImage = "none";
    }

    let frame = 0;
    setLedFrame(targetEl, cfg, frame);
    ledTimer = window.setInterval(() => {
      frame += 1;
      if (frame >= cfg.frameCount) {
        window.clearInterval(ledTimer);
        ledTimer = null;
        return;
      }
      setLedFrame(targetEl, cfg, frame);
    }, cfg.frameDuration);

    if (status) status.textContent = `Dang nhan phan khu: ${zoneId.toUpperCase()}`;
  }

  function setPhanKhuUIVisible(visible) {
    if (zoneHotspots) zoneHotspots.style.display = visible ? "block" : "none";
    if (!visible) {
      clearLedState();
    }
  }

  function imageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  }

  async function resolveFirstAvailable(paths) {
    for (const path of paths) {
      const ok = await imageExists(path);
      if (ok) return path;
    }
    return "";
  }

  async function composeTwoRowsTiles(paths) {
    const images = await Promise.all(paths.map((p) => loadImage(p)));
    if (!images.length) return "";

    const baseImage = images[0];
    if (!baseImage) return "";

    const tileWidth = baseImage.naturalWidth;
    const tileHeight = baseImage.naturalHeight;
    const columns = 4;
    const rows = Math.ceil(images.length / columns);
    const canvas = document.createElement("canvas");
    canvas.width = tileWidth * columns;
    canvas.height = tileHeight * rows;

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    images.forEach((img, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      ctx.drawImage(img, col * tileWidth, row * tileHeight, tileWidth, tileHeight);
    });

    // Some source tiles include black/transparent padding; crop to visible content.
    // getImageData throws SecurityError when canvas is tainted (e.g. file:// protocol)
    let minX, minY, maxX, maxY;
    try {
      const source = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      minX = canvas.width; minY = canvas.height; maxX = -1; maxY = -1;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = source[idx];
          const g = source[idx + 1];
          const b = source[idx + 2];
          const a = source[idx + 3];
          const isVisible = a > 8 && r + g + b > 30;

          if (isVisible) {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
    } catch (_secErr) {
      // Canvas tainted (file:// CORS) — skip crop, use full canvas
      return canvas.toDataURL("image/jpeg", 0.92);
    }

    if (maxX >= minX && maxY >= minY) {
      const croppedWidth = maxX - minX + 1;
      const croppedHeight = maxY - minY + 1;
      const cropped = document.createElement("canvas");
      cropped.width = croppedWidth;
      cropped.height = croppedHeight;
      const croppedCtx = cropped.getContext("2d");
      if (croppedCtx) {
        croppedCtx.drawImage(
          canvas,
          minX,
          minY,
          croppedWidth,
          croppedHeight,
          0,
          0,
          croppedWidth,
          croppedHeight
        );
        return cropped.toDataURL("image/jpeg", 0.92);
      }
    }

    return canvas.toDataURL("image/jpeg", 0.92);
  }

  function preload(index) {
    const idx = wrap(index, frames.length);
    if (cache.has(idx)) return;
    const img = new Image();
    img.src = frames[idx];
    cache.set(idx, img);
  }

  function preloadAround() {
    const base = Math.round(target);
    for (let i = 1; i <= cfg.preloadRadius; i++) {
      preload(base + i);
      preload(base - i);
    }
  }

  function applyScale() {
    frame1.style.transform = `scale(${scale})`;
    frame2.style.transform = `scale(${scale})`;
  }

  function setActiveSectionUI(nextSection) {
    sectionButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-section") === nextSection);
    });
  }

  function setSection(nextSection) {
    section = nextSection;
    setActiveSectionUI(nextSection);
    setPhanKhuUIVisible(false);
    setLegacySceneVisible(nextSection !== "maunha");
    hideMaunhaSection();

    if (nextSection === "vitri") {
      showStaticSection("Vi tri", viTriCandidates);
      return;
    }

    if (nextSection === "phankhu") {
      showCompositeSection("Phan khu", phanKhuCandidates);
      return;
    }

    if (nextSection === "maunha") {
      void showMaunhaSection();
      return;
    }

    viewer.style.cursor = "grab";
    render(Math.round(current));
    if (status) status.textContent = `Frame: ${Math.floor(current)}`;
  }

  async function showStaticSection(label, candidates) {
    sectionRequestId += 1;
    const requestId = sectionRequestId;

    dragging = false;
    viewer.classList.remove("dragging");
    viewer.style.cursor = "default";
    frame2.style.opacity = "0";

    if (loading) {
      loading.style.display = "flex";
      loading.textContent = `Dang tai anh ${label}...`;
    }

    const imagePath = await resolveFirstAvailable(candidates);
    if (requestId !== sectionRequestId) return;

    if (!imagePath) {
      if (status) status.textContent = `Khong tim thay anh cho muc ${label}.`;
      if (loading) {
        loading.style.display = "none";
      }
      return;
    }

    frame1.src = imagePath;
    if (status) status.textContent = `Dang xem: ${label}`;
    if (loading) {
      loading.style.display = "none";
    }
  }

  async function showCompositeSection(label, tilePaths, isSubSection = false) {
    sectionRequestId += 1;
    const requestId = sectionRequestId;

    dragging = false;
    viewer.classList.remove("dragging");
    viewer.style.cursor = "default";
    frame2.style.opacity = "0";

    if (loading) {
      loading.style.display = "flex";
      loading.textContent = `Dang ghep tile anh ${label}...`;
    }

    try {
      const composedSrc = await composeTwoRowsTiles(tilePaths);
      if (requestId !== sectionRequestId) return;

      if (!composedSrc) {
        if (status) status.textContent = `Khong ghep duoc anh cho muc ${label}.`;
        if (loading) loading.style.display = "none";
        return;
      }

      frame1.src = composedSrc;
      setPhanKhuUIVisible(true);

      if (isSubSection) {
        if (zoneDebugButtons) zoneDebugButtons.style.display = "none";
        if (zoneClickLayer) zoneClickLayer.style.pointerEvents = "none";
      } else {
        if (zoneDebugButtons) zoneDebugButtons.style.display = "";
        if (zoneClickLayer) zoneClickLayer.style.pointerEvents = "auto";
        applyZoneBounds();
        renderZoneDebugButtons();
        Object.keys(phanKhuLedMap).forEach((zoneId) => {
          void getZoneMask(zoneId);
        });
      }

      if (status) status.textContent = `Dang xem: ${label} (4_3 den 5_6)`;
    } catch (error) {
      if (status) status.textContent = `Loi tai tile ${label}.`;
    } finally {
      if (loading) loading.style.display = "none";
    }
  }

  function update() {
    locked = false;
    let f = target % frames.length;
    if (f < 0) f += frames.length;
    current = f;
    floatFrame = f;

    const i1 = Math.floor(f);
    const i2 = (i1 + 1) % frames.length;
    const alpha = f - i1;

    const s1 = frames[i1];
    const s2 = frames[i2];
    if (!frame1.src.endsWith(s1)) frame1.src = s1;
    if (!frame2.src.endsWith(s2)) frame2.src = s2;
    frame2.style.opacity = String(alpha);
    if (status) status.textContent = `Frame: ${i1}`;

    preloadAround();
  }

  function render(value) {
    target = value;
    if (locked) return;
    locked = true;
    requestAnimationFrame(update);
  }

  function snap() {
    render(Math.round(current));
  }

  function onDown(e) {
    if (section !== "tongquan") return;
    if (e.button !== undefined && e.button !== 0) return;
    if (e.cancelable) e.preventDefault();
    dragging = true;
    lastX = e.touches ? e.touches[0].clientX : e.clientX;
    floatFrame = current;
    viewer.classList.add("dragging");
  }

  function onMove(e) {
    if (section !== "tongquan") return;
    if (!dragging) return;
    if (e.cancelable) e.preventDefault();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - lastX;
    lastX = x;
    floatFrame += dx * cfg.dragSensitivity;
    render(floatFrame);
  }

  function onUp() {
    if (!dragging) return;
    dragging = false;
    viewer.classList.remove("dragging");
    snap();
  }

  function onWheel(e) {
    if (section !== "tongquan") return;
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1 : -1;
    floatFrame = current + dir * cfg.wheelSensitivity;
    render(floatFrame);
    window.clearTimeout(onWheel._t);
    onWheel._t = window.setTimeout(snap, 120);
  }

  sectionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextSection = btn.getAttribute("data-section");
      setSection(nextSection);
    });
  });

  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-action");
      if (action === "zoom-in") scale = Math.min(1.8, scale + 0.08);
      if (action === "zoom-out") scale = Math.max(1, scale - 0.08);
      if (action === "reset") {
        scale = 1;
        render(Math.round(current));
      }
      applyScale();
    });
  });

  maunhaModelButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      maunhaActiveModel = btn.getAttribute("data-maunha-model") || "parkhouse";
      setMaunhaActive();
      if (status) status.textContent = `Dang xem mau nha: ${maunhaActiveModel.toUpperCase()}`;
      void loadMaunhaHero(maunhaActiveModel);
    });
  });

  const matbangLightbox = document.getElementById("matbangLightbox");
  const matbangImg = document.getElementById("matbangImg");
  const matbangClose = document.getElementById("matbangClose");

  function showMatBang(model, floor) {
    const src = (maunhaFloorImages[model] || {})[floor];
    if (!src || !matbangLightbox || !matbangImg) return;
    matbangImg.src = src;
    matbangLightbox.classList.add("active");
  }

  function hideMatBang() {
    if (matbangLightbox) matbangLightbox.classList.remove("active");
    if (matbangImg) matbangImg.src = "";
  }

  if (matbangClose) matbangClose.addEventListener("click", hideMatBang);
  if (matbangLightbox) {
    matbangLightbox.addEventListener("click", (e) => {
      if (e.target === matbangLightbox) hideMatBang();
    });
  }

  maunhaFloorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      maunhaActiveFloor = btn.getAttribute("data-maunha-floor") || "1";
      setMaunhaActive();
      if (status) status.textContent = `Dang xem mat bang tang ${maunhaActiveFloor}`;
      showMatBang(maunhaActiveModel, maunhaActiveFloor);
    });
  });

  maunhaCloseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      hideMaunhaSection();
      setSection("tongquan");
    });
  });

  document.querySelectorAll("[data-unready='1']").forEach((el) => {
    el.addEventListener("click", () => {
      if (status) status.textContent = "Muc nay se lam tiep o buoc sau.";
    });
  });

  document.querySelectorAll("[data-s1='1']").forEach((el) => {
    el.addEventListener("click", () => {
      setSection("phankhu");
      showS1Overlay();
      if (status) status.textContent = "Dang xem: Phan khu S1 Limassol";
    });
  });

  const s1BtnTienIch = document.getElementById("s1BtnTienIch");
  if (s1BtnTienIch) {
    s1BtnTienIch.addEventListener("click", () => {
      if (zoneS1InfoSprite) zoneS1InfoSprite.style.display = "none";
      if (zoneS1MapSprite) zoneS1MapSprite.style.display = "none";
      if (zoneDimmer) zoneDimmer.classList.remove("active");

      void showCompositeSection("Tien Ich S1", s1TienIchTiles, true);
    });
  }

  const s1BtnView360 = document.getElementById("s1BtnView360");
  if (s1BtnView360) {
    s1BtnView360.addEventListener("click", () => {
      if (status) status.textContent = "Dang xem: S1 View 360 (Can cap nhat anh)";
    });
  }

  if (zoneClickLayer) {
    zoneClickLayer.addEventListener("click", async (e) => {
      if (section !== "phankhu") return;
      const rect = zoneClickLayer.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      const zoneOrder = ["khu325", "khu217", "khu337", "khu101"];

      for (const zoneId of zoneOrder) {
        const hit = await isPointInsideZoneMask(zoneId, xPercent, yPercent);
        if (hit) {
          startLedAnimation(zoneId);
          return;
        }
      }

      clearLedState();
      if (status) status.textContent = "Dang xem: Phan khu";
    });
  }

  viewer.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  window.addEventListener("blur", onUp);

  viewer.addEventListener("touchstart", onDown, { passive: false });
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp, { passive: true });
  window.addEventListener("touchcancel", onUp, { passive: true });

  window.addEventListener("wheel", onWheel, { passive: false });

  frame1.addEventListener("load", () => {
    if (loading) loading.style.display = "none";
  });

  frame1.addEventListener("error", () => {
    if (loading) loading.textContent = "Khong tai duoc frame dau tien. Kiem tra duong dan image_tongquan.";
  });

  frame1.src = frames[0];
  frame2.src = frames[1] || frames[0];
  applyScale();
  preloadAround();
  setSection("tongquan");
})();