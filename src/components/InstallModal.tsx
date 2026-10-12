import React from 'react';
import {
  X,
  Smartphone,
  Download,
  Terminal,
  Layers,
  CheckCircle2,
  ExternalLink,
  Shield,
  FileCode
} from 'lucide-react';
import { Language } from '../types/forensics';
import { getTranslation } from '../utils/i18n';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onDownloadProjectZip: () => void;
  onDownloadDebugApk: () => void;
  isInstallable: boolean;
  onInstallPwa: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  lang,
  onDownloadProjectZip,
  onDownloadDebugApk,
  isInstallable,
  onInstallPwa,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#1e293b]/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {lang === 'ur' ? 'اینڈرائیڈ پر ایپ اور اے پی کے حاصل کریں' : 'Install App & Build Android APK'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ur'
                  ? 'اپنے موبائل میں براہ راست انسٹال کریں یا اے پی کے سورس کوڈ حاصل کریں'
                  : 'Install standalone WebAPK to your phone or build the native APK from source'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Method 1: Instant Standalone PWA / WebAPK (Recommended for immediate phone use) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {lang === 'ur' ? 'طریقہ ۱: فوری موبائل ایپ (فوری انسٹال)' : 'METHOD 1: INSTANT STANDALONE MOBILE APP'}
                </span>
                <h3 className="text-base font-semibold text-white">
                  {lang === 'ur' ? 'موبائل فون میں براہ راست انسٹال کریں (WebAPK)' : 'Install as Standalone Mobile App (WebAPK)'}
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === 'ur'
                    ? 'کروم براؤزر کے ذریعے اپنے فون کی ہوم اسکرین پر براہ راست محفوظ اور تیز رفتار ایپ انسٹال کریں۔ یہ بغیر انٹرنیٹ کے بھی کام کرتی ہے۔'
                    : 'Installs as a native standalone application on your Android home screen with app icon, full-screen display, and offline support.'}
                </p>
              </div>
              {isInstallable ? (
                <button
                  onClick={() => {
                    onInstallPwa();
                    onClose();
                  }}
                  className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  {lang === 'ur' ? 'ابھی انسٹال کریں' : 'Install Now'}
                </button>
              ) : (
                <div className="shrink-0 text-right">
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {lang === 'ur' ? 'کروم مینو سے ایڈ کریں' : 'Add via Browser Menu'}
                  </span>
                </div>
              )}
            </div>

            {/* Browser instructions */}
            <div className="mt-3 p-2.5 rounded-lg bg-black/40 border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-medium text-slate-300">
                {lang === 'ur' ? 'اگر بٹن نظر نہ آئے:' : 'If direct prompt does not appear:'}
              </p>
              <p>
                {lang === 'ur'
                  ? 'کروم میں اوپر دائیں جانب تین نقطوں (⋮) پر کلک کریں اور "Add to Home screen" یا "Install app" کو منتخب کریں۔'
                  : 'Tap Chrome menu (⋮) > tap "Install app" or "Add to Home screen" to generate your phone\'s native WebAPK.'}
              </p>
            </div>
          </div>

          {/* Method 2: Download Full Android Studio Kotlin Project */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {lang === 'ur' ? 'طریقہ ۲: مکمل اینڈرائیڈ اسٹوڈیو پراجیکٹ' : 'METHOD 2: ANDROID STUDIO PROJECT (.ZIP)'}
                </span>
                <h3 className="text-base font-semibold text-white">
                  {lang === 'ur' ? 'اینڈرائیڈ سورس کوڈ زپ ڈاؤن لوڈ کریں' : 'Download Complete Android Source Code'}
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === 'ur'
                    ? 'اس میں MainActivity.kt، ForensicUtils.kt، AndroidManifest.xml، اور Gradle سکرپٹس شامل ہیں جن سے آپ اینڈرائیڈ اسٹوڈیو میں آفیشل APK بنا سکتے ہیں۔'
                    : 'Includes full Kotlin source code (MainActivity.kt, ForensicUtils.kt, AndroidManifest.xml, Gradle build scripts). Ready to open in Android Studio.'}
                </p>
              </div>
              <button
                onClick={() => {
                  onDownloadProjectZip();
                }}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'زپ فائل (.ZIP)' : 'Download .ZIP'}</span>
              </button>
            </div>
          </div>

          {/* Method 3: Download Sample Debug APK Container */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  {lang === 'ur' ? 'طریقہ ۳: ڈیبگ اے پی کے فائل' : 'METHOD 3: DEBUG APK ARTIFACT'}
                </span>
                <h3 className="text-base font-semibold text-white">
                  {lang === 'ur' ? 'موبائل فرانزکس ڈیبگ اے پی کے (.APK)' : 'Download Debug APK Package (.APK)'}
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === 'ur'
                    ? 'یہ ایک تیار شدہ پیکیج ہے جو آپ کے موبائل کے فائل مینیجر اور اینالائزر میں چیک کیا جا سکتا ہے۔'
                    : 'Directly download the generated APK package container for manual installation and signature inspection.'}
                </p>
              </div>
              <button
                onClick={() => {
                  onDownloadDebugApk();
                }}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'اے پی کے فائل (.APK)' : 'Get .APK'}</span>
              </button>
            </div>
          </div>

          {/* Quick Terminal Guide for Termux */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-sans font-semibold">
              <Terminal className="w-4 h-4" />
              <span>{lang === 'ur' ? 'موبائل پر Termux سے APK کمپائل کرنے کا طریقہ' : 'Build APK directly on Android via Termux'}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-emerald-400 select-all overflow-x-auto">
              <code>pkg update && pkg install -y openjdk-17 gradle git &amp;&amp; ./gradlew assembleDebug</code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#1e293b]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
          >
            {lang === 'ur' ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
