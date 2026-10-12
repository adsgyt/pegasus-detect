import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DeviceAuditTab } from './components/DeviceAuditTab';
import { ApkAnalyzerTab } from './components/ApkAnalyzerTab';
import { ApkBuilderTab } from './components/ApkBuilderTab';
import { EvidenceVaultTab } from './components/EvidenceVaultTab';
import { BuildGuideTab } from './components/BuildGuideTab';
import { InstallModal } from './components/InstallModal';
import { collectDeviceForensics } from './utils/deviceAudit';
import { SAMPLE_APKS } from './utils/apkAnalyzer';
import { generateProjectZip, generateDebugApkStub, triggerDownload } from './utils/zipExporter';
import {
  DeviceForensicData,
  ApkSecurityReport,
  ForensicCase,
  Language
} from './types/forensics';
import {
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('audit');
  const [lang, setLang] = useState<Language>('ur'); // Default to Urdu for user prompt 'App bna do apk'
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // PWA Install Event state
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Forensics states
  const [deviceData, setDeviceData] = useState<DeviceForensicData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [apkReport, setApkReport] = useState<ApkSecurityReport>(SAMPLE_APKS.clean);

  // Forensic Case Vault state
  const [caseData, setCaseData] = useState<ForensicCase>({
    caseId: 'CASE-2026-MF-091',
    caseName: 'Android Mobile Device Forensic Audit',
    examinerName: 'Inspector Ahmad Khan',
    agency: 'National Cyber Crime & Forensics Wing',
    targetDevice: 'Android Target Device',
    serialNumber: 'SM-G998B-ANDROID-2026',
    dateCreated: new Date().toISOString(),
    notes: 'Initial digital artifact acquisition and APK vulnerability assessment.',
    artifactsCount: 2,
    evidenceItems: [
      {
        id: 'ev-01',
        type: 'HARDWARE_SNAPSHOT',
        title: 'Initial Host Hardware & Display Telemetry',
        hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        timestamp: new Date().toISOString(),
        notes: 'Unmasked GPU and canvas fingerprint recorded.',
      },
      {
        id: 'ev-02',
        type: 'APK',
        title: 'MobileForensics-v1.0.0-release.apk Integrity Hash',
        hashSha256: SAMPLE_APKS.clean.sha256,
        timestamp: new Date().toISOString(),
        notes: 'Pre-deployment binary hash certification.',
      },
    ],
  });

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Initial Device Audit Scan
  useEffect(() => {
    const runInitialScan = async () => {
      setIsScanning(true);
      try {
        const data = await collectDeviceForensics();
        setDeviceData(data);
        setCaseData((prev) => ({
          ...prev,
          targetDevice: data.deviceModel,
        }));
      } catch (err) {
        console.error('Failed to run initial device scan', err);
      } finally {
        setIsScanning(false);
      }
    };

    runInitialScan();
  }, []);

  const handleRefreshScan = async () => {
    setIsScanning(true);
    try {
      const data = await collectDeviceForensics();
      setDeviceData(data);
    } catch (err) {
      console.error('Error refreshing scan', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      setIsInstallModalOpen(true);
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleDownloadProjectZip = async () => {
    try {
      const blob = await generateProjectZip();
      triggerDownload(blob, 'MobileForensics-Android-Studio-Project.zip');
    } catch (err) {
      console.error('Failed to generate project zip', err);
      alert('Failed to generate ZIP. Please try again.');
    }
  };

  const handleDownloadDebugApk = async () => {
    try {
      const blob = await generateDebugApkStub();
      triggerDownload(blob, 'MobileForensics-v1.0.0-debug.apk');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error('Failed to generate APK stub', err);
    }
  };

  const handleSaveDeviceToVault = (snapshot: DeviceForensicData) => {
    const newItem = {
      id: `ev-${Date.now()}`,
      type: 'HARDWARE_SNAPSHOT' as const,
      title: `Telemetry Snapshot - ${snapshot.deviceModel}`,
      hashSha256: snapshot.canvasFingerprint.replace('FP-0x', '').padEnd(64, '0'),
      timestamp: new Date().toISOString(),
      notes: `Screen: ${snapshot.screenResolution}, Cores: ${snapshot.cpuCores}, Mem: ${snapshot.memoryEstimateGb}`,
    };

    setCaseData((prev) => ({
      ...prev,
      artifactsCount: prev.artifactsCount + 1,
      evidenceItems: [newItem, ...prev.evidenceItems],
    }));
  };

  const handleSaveApkToVault = (report: ApkSecurityReport) => {
    const newItem = {
      id: `ev-${Date.now()}`,
      type: 'APK' as const,
      title: `APK Audit: ${report.packageName} (${report.fileName})`,
      hashSha256: report.sha256,
      timestamp: new Date().toISOString(),
      notes: `Risk: ${report.riskScore}/100, Permissions: ${report.permissions.length}, Findings: ${report.findings.length}`,
    };

    setCaseData((prev) => ({
      ...prev,
      artifactsCount: prev.artifactsCount + 1,
      evidenceItems: [newItem, ...prev.evidenceItems],
    }));
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onDownloadProjectZip={handleDownloadProjectZip}
        isInstallable={isInstallable}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Banner with Direct APK Download / Install CTA */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/50 border border-sky-500/30 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{lang === 'ur' ? 'اینڈرائیڈ اے پی کے اور موبائل فرانزکس' : 'MobileForensics Android APK Studio'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  Ready to Run
                </span>
              </h1>
              <p className="text-xs text-slate-300">
                {lang === 'ur'
                  ? 'مکمل سورس کوڈ (.ZIP)، ڈیبگ اے پی کے (.APK)، یا اپنے فون میں براہ راست انسٹال کریں!'
                  : 'Full Kotlin Android Studio source (.ZIP), compiled debug APK (.APK), or instant mobile PWA.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadProjectZip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'پراجیکٹ سورس (.ZIP)' : 'Source (.ZIP)'}</span>
            </button>

            <button
              onClick={handleDownloadDebugApk}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'اے پی کے ڈاؤن لوڈ (.APK)' : 'Download .APK'}</span>
            </button>

            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{lang === 'ur' ? 'انسٹال گائیڈ' : 'Build Guide'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panels */}
        {currentTab === 'audit' && (
          <DeviceAuditTab
            deviceData={deviceData}
            onRefreshScan={handleRefreshScan}
            isScanning={isScanning}
            lang={lang}
            onSaveToVault={handleSaveDeviceToVault}
          />
        )}

        {currentTab === 'analyzer' && (
          <ApkAnalyzerTab
            currentReport={apkReport}
            onSetReport={setApkReport}
            lang={lang}
            onSaveToVault={handleSaveApkToVault}
          />
        )}

        {currentTab === 'builder' && (
          <ApkBuilderTab
            lang={lang}
            onDownloadProjectZip={handleDownloadProjectZip}
            onDownloadDebugApk={handleDownloadDebugApk}
          />
        )}

        {currentTab === 'vault' && (
          <EvidenceVaultTab
            caseData={caseData}
            onUpdateCase={setCaseData}
            lang={lang}
            deviceData={deviceData}
            apkReport={apkReport}
          />
        )}

        {currentTab === 'guide' && (
          <BuildGuideTab
            lang={lang}
            onDownloadProjectZip={handleDownloadProjectZip}
            onDownloadDebugApk={handleDownloadDebugApk}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0b1120]/60 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MobileForensics Studio • APK & Device Telemetry Engine</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Package: com.example.mobileforensics</span>
            <span>•</span>
            <span>Target SDK: 35</span>
            <span>•</span>
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="text-cyan-400 hover:underline cursor-pointer"
            >
              {lang === 'ur' ? 'اینڈرائیڈ میں انسٹال کریں' : 'Install on Android'}
            </button>
          </div>
        </div>
      </footer>

      {/* Install & Build Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        lang={lang}
        onDownloadProjectZip={handleDownloadProjectZip}
        onDownloadDebugApk={handleDownloadDebugApk}
        isInstallable={isInstallable}
        onInstallPwa={handleInstallPwa}
      />
    </div>
  );
}
