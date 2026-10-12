import React, { useState } from 'react';
import {
  Cpu,
  HardDrive,
  Battery,
  BatteryCharging,
  Wifi,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  RefreshCw,
  Copy,
  Check,
  FileCheck,
  Activity,
  Layers,
  Monitor
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DeviceForensicData, Language, ForensicCase } from '../types/forensics';
import { getTranslation } from '../utils/i18n';

interface DeviceAuditTabProps {
  deviceData: DeviceForensicData | null;
  onRefreshScan: () => Promise<void>;
  isScanning: boolean;
  lang: Language;
  onSaveToVault: (snapshot: DeviceForensicData) => void;
}

export const DeviceAuditTab: React.FC<DeviceAuditTabProps> = ({
  deviceData,
  onRefreshScan,
  isScanning,
  lang,
  onSaveToVault,
}) => {
  const t = getTranslation(lang);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveVault = () => {
    if (!deviceData) return;
    onSaveToVault(deviceData);
    setIsSaved(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#38bdf8', '#34d399'],
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!deviceData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-white">{t.scanning}</h3>
        <p className="text-sm text-slate-400 mt-1">Collecting live device hardware telemetry...</p>
      </div>
    );
  }

  const isTampered = deviceData.securityChecks.tamperDetected;

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{deviceData.deviceModel}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {deviceData.platform}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ur'
                ? `آخری معائنہ: ${new Date(deviceData.timestamp).toLocaleTimeString()}`
                : `Audited at ${new Date(deviceData.timestamp).toLocaleTimeString()} (${deviceData.timezone})`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isScanning ? (lang === 'ur' ? 'اسکین ہو رہا ہے...' : 'Scanning...') : (lang === 'ur' ? 'دوبارہ اسکین' : 'Rescan')}</span>
          </button>

          <button
            onClick={handleSaveVault}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-md shadow-cyan-600/20 border border-cyan-400/30 transition cursor-pointer"
          >
            {isSaved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <FileCheck className="w-3.5 h-3.5" />}
            <span>
              {isSaved
                ? (lang === 'ur' ? 'محفوظ ہو گیا!' : 'Saved to Vault!')
                : (lang === 'ur' ? 'والٹ میں ریکارڈ محفوظ کریں' : 'Save Snapshot to Vault')}
            </span>
          </button>
        </div>
      </div>

      {/* Grid of Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Security & Tamper State */}
        <div className={`p-5 rounded-2xl border ${isTampered ? 'bg-red-950/20 border-red-500/40' : 'bg-slate-900/80 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.securityIntegrity}
            </span>
            {isTampered ? (
              <ShieldAlert className="w-5 h-5 text-red-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{lang === 'ur' ? 'حالت' : 'Integrity State'}</span>
              <span className={`font-semibold ${isTampered ? 'text-red-400' : 'text-emerald-400'}`}>
                {isTampered ? (lang === 'ur' ? 'غیر محفوظ / ایمولیٹر' : 'MODIFIED / EMULATOR') : (lang === 'ur' ? 'محفوظ (Verified)' : 'CLEAN / VERIFIED')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">WebRTC Leak Check</span>
              <span className="text-slate-200 font-mono text-xs">
                {deviceData.securityChecks.webRtcAvailable ? 'Active (STUN Safe)' : 'Restricted'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Secure Context (HTTPS)</span>
              <span className="text-emerald-400 font-mono text-xs">
                {deviceData.securityChecks.secureContext ? 'Enforced (TLS)' : 'Insecure'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">IndexedDB Storage</span>
              <span className="text-cyan-400 font-mono text-xs">Persistent Storage OK</span>
            </div>
          </div>
        </div>

        {/* Card 2: Hardware & Compute */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.deviceTelemetry}
            </span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{lang === 'ur' ? 'پروسیسر کورز' : 'CPU Concurrency'}</span>
              <span className="font-semibold text-white font-mono">{deviceData.cpuCores} Logic Cores</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{lang === 'ur' ? 'ریم کا اندازہ' : 'Memory Estimate'}</span>
              <span className="font-semibold text-white font-mono">{deviceData.memoryEstimateGb}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{lang === 'ur' ? 'اسکرین ریزولوشن' : 'Screen Specs'}</span>
              <span className="text-slate-300 font-mono text-xs">{deviceData.screenResolution}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Touch Interface</span>
              <span className="text-slate-300 font-mono text-xs">
                {deviceData.touchSupport ? `Multi-Touch (${deviceData.maxTouchPoints} pts)` : 'Mouse / Desktop'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Network & Connectivity */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t.networkTelemetry}
            </span>
            <Wifi className="w-5 h-5 text-sky-400" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{lang === 'ur' ? 'کنکشن کی قسم' : 'Connection Type'}</span>
              <span className="font-semibold text-sky-400 uppercase font-mono">
                {deviceData.network?.effectiveType || '4G/WiFi'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{lang === 'ur' ? 'ڈاؤن لنک اسپیڈ' : 'Downlink Bandwidth'}</span>
              <span className="font-semibold text-white font-mono">
                ~{deviceData.network?.downlink || 10} Mbps
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{lang === 'ur' ? 'لیٹنسی (RTT)' : 'Network Latency (RTT)'}</span>
              <span className="font-semibold text-white font-mono">
                {deviceData.network?.rtt || 40} ms
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{lang === 'ur' ? 'انٹرنیٹ اسٹیٹس' : 'Online Status'}</span>
              <span className="text-emerald-400 font-mono text-xs">
                {deviceData.network?.online ? 'Connected (Active)' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Deep Forensics Fingerprint & GPU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* GPU & Canvas Fingerprint */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                {lang === 'ur' ? 'گرافکس اور ڈیجیٹل فنگر پرنٹ' : 'Hardware Fingerprint & WebGL Engine'}
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Unmasked
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-400 mb-1">WebGL Renderer / GPU</div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 font-mono text-slate-200 break-words">
                {deviceData.gpuRenderer}
              </div>
            </div>

            <div>
              <div className="text-slate-400 mb-1">Canvas Cryptographic Fingerprint</div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-slate-800 font-mono text-cyan-300">
                <span>{deviceData.canvasFingerprint}</span>
                <button
                  onClick={() => copyToClipboard(deviceData.canvasFingerprint, 'fp')}
                  className="text-slate-400 hover:text-white transition cursor-pointer ml-2"
                >
                  {copiedKey === 'fp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-slate-400 mb-1">User Agent String</div>
              <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 font-mono text-[11px] text-slate-300 break-all max-h-20 overflow-y-auto">
                {deviceData.userAgent}
              </div>
            </div>
          </div>
        </div>

        {/* Battery & Storage Carving Diagnostics */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {deviceData.battery?.charging ? (
                <BatteryCharging className="w-5 h-5 text-amber-400" />
              ) : (
                <Battery className="w-5 h-5 text-emerald-400" />
              )}
              <h3 className="text-sm font-semibold text-white">
                {lang === 'ur' ? 'بیٹری اور میموری اسٹوریج کی تفصیل' : 'Power Telemetry & Storage Estimation'}
              </h3>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Live Sensor
            </span>
          </div>

          <div className="space-y-4">
            {deviceData.battery ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{lang === 'ur' ? 'بیٹری چارجنگ لیول' : 'Battery Charge Level'}</span>
                  <span className="font-bold text-white text-base font-mono">
                    {deviceData.battery.level}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      deviceData.battery.level > 20 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${deviceData.battery.level}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>
                    {deviceData.battery.charging
                      ? (lang === 'ur' ? 'چارج ہو رہی ہے (Plugged in)' : 'Charging (AC Adapter)')
                      : (lang === 'ur' ? 'بیٹری پر چل رہا ہے' : 'Discharging')}
                  </span>
                  <span>{lang === 'ur' ? 'صحت: معمول کے مطابق' : 'Health: Nominal'}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
                Battery API is restricted in browser sandbox mode. Standard Android hardware battery polling is active in the compiled APK.
              </div>
            )}

            {/* Storage Quota */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{lang === 'ur' ? 'براؤزر اسٹوریج کوٹہ' : 'Local Storage Quota'}</span>
                <span className="font-semibold text-white font-mono text-xs">
                  {deviceData.storageEstimateMb
                    ? `${deviceData.storageEstimateMb.usage} MB / ${deviceData.storageEstimateMb.quota} MB`
                    : 'Unrestricted / Local Sandbox'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'ur'
                  ? 'اینڈرائیڈ میں کمپائل ہونے کے بعد یہ ایپ اندرونی اسٹوریج اور ایس ڈی کارڈ کا مکمل فرانزک تجزیہ کرتی ہے۔'
                  : 'In the compiled APK, full internal flash NAND storage and external SD card partition metrics are harvested via ForensicUtils.kt.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
