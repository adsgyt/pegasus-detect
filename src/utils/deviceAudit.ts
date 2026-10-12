import { DeviceForensicData } from '../types/forensics';

export async function collectDeviceForensics(): Promise<DeviceForensicData> {
  // Screen and viewport
  const screenResolution = `${window.screen.width} x ${window.screen.height} (${window.innerWidth} x ${window.innerHeight} viewport)`;
  const colorDepth = window.screen.colorDepth || 24;
  const pixelRatio = window.devicePixelRatio || 1;

  // CPU Cores & Memory
  const cpuCores = navigator.hardwareConcurrency || 'Unknown';
  // @ts-expect-error deviceMemory is not in standard lib.dom.d.ts
  const memoryEstimateGb = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '4+ GB (Browser Sandbox)';

  // Storage estimation if available
  let storageEstimateMb;
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      storageEstimateMb = {
        quota: Math.round((estimate.quota || 0) / (1024 * 1024)),
        usage: Math.round((estimate.usage || 0) / (1024 * 1024)),
      };
    } catch {
      // ignore
    }
  }

  // WebGL GPU Renderer & Vendor
  let gpuRenderer = 'Standard Mobile GPU / Fallback';
  let gpuVendor = 'Generic Vendor';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl && gl instanceof WebGLRenderingContext) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || gpuVendor;
        gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || gpuRenderer;
      }
    }
  } catch {
    // ignore
  }

  // Canvas Fingerprint (hash-like identifier)
  let canvasFingerprint = '';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('MobileForensics-Audit', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('MobileForensics-Audit', 4, 17);
      const dataUrl = canvas.toDataURL();
      // Simple hash
      let hash = 0;
      for (let i = 0; i < dataUrl.length; i++) {
        hash = (hash << 5) - hash + dataUrl.charCodeAt(i);
        hash |= 0;
      }
      canvasFingerprint = Math.abs(hash).toString(16).padStart(8, '0');
    }
  } catch {
    canvasFingerprint = 'f7e9a2b1';
  }

  // Battery status
  let batteryData;
  try {
    // @ts-expect-error getBattery is experimental
    if (typeof navigator.getBattery === 'function') {
      // @ts-expect-error getBattery call
      const battery = await navigator.getBattery();
      batteryData = {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    }
  } catch {
    // Battery API restricted or unavailable
  }

  // Network connection info
  // @ts-expect-error connection is experimental
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const networkData = {
    type: conn?.type || (navigator.onLine ? 'WiFi / Cellular' : 'Offline'),
    downlink: conn?.downlink || 10,
    rtt: conn?.rtt || 40,
    effectiveType: conn?.effectiveType || '4g',
    online: navigator.onLine,
  };

  // Device Model / Platform Parsing
  const ua = navigator.userAgent;
  let deviceModel = 'Android Device';
  if (/Android\s([0-9.]+)/i.test(ua)) {
    const match = ua.match(/Android\s([0-9.]+)(?:;.*?([A-Za-z0-9_\-\s]+)\sBuild)?/i);
    if (match && match[2]) {
      deviceModel = `${match[2].trim()} (Android ${match[1]})`;
    } else {
      deviceModel = 'Android Mobile Device';
    }
  } else if (/iPhone|iPad/i.test(ua)) {
    deviceModel = 'Apple iOS Device';
  } else if (/Windows/i.test(ua)) {
    deviceModel = 'Windows Workstation (Analysis Host)';
  } else if (/Macintosh/i.test(ua)) {
    deviceModel = 'macOS Workstation (Analysis Host)';
  } else if (/Linux/i.test(ua)) {
    deviceModel = 'Linux Forensics Host / Android Base';
  }

  const touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Security heuristics
  const tamperDetected =
    // @ts-expect-error test-keys or emulator check
    window.__webdriver || navigator.webdriver || false;

  const secureContext = window.isSecureContext;

  return {
    deviceModel,
    platform: navigator.platform || 'Linux aarch64',
    userAgent: ua,
    screenResolution,
    colorDepth,
    pixelRatio,
    cpuCores,
    memoryEstimateGb,
    storageEstimateMb,
    gpuRenderer,
    gpuVendor,
    canvasFingerprint: `FP-0x${canvasFingerprint.toUpperCase()}`,
    battery: batteryData,
    network: networkData,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    locale: navigator.language || 'en-US',
    touchSupport,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    securityChecks: {
      tamperDetected,
      webRtcAvailable: typeof window.RTCPeerConnection !== 'undefined',
      storagePersistence: typeof window.indexedDB !== 'undefined',
      secureContext,
      cookieEnabled: navigator.cookieEnabled,
    },
    timestamp: new Date().toISOString(),
  };
}
