import React, { useState } from 'react';
import {
  Terminal,
  Smartphone,
  Laptop,
  CheckCircle2,
  Copy,
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { Language } from '../types/forensics';
import { getTranslation } from '../utils/i18n';

interface BuildGuideTabProps {
  lang: Language;
  onDownloadProjectZip: () => void;
  onDownloadDebugApk: () => void;
}

export const BuildGuideTab: React.FC<BuildGuideTabProps> = ({
  lang,
  onDownloadProjectZip,
  onDownloadDebugApk,
}) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-cyan-400" />
          <span>
            {lang === 'ur'
              ? 'اے پی کے فائل بنانے اور انسٹال کرنے کی مکمل گائیڈ'
              : 'Complete Guide: How to Build & Install this APK'}
          </span>
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl">
          {lang === 'ur'
            ? 'آپ کے سوال "App bna do apk" کے مطابق ہم نے تین آسان ترین راستے فراہم کیے ہیں: اپنے فون پر بغیر کمپیوٹر کے APK بنانا، اینڈرائیڈ اسٹوڈیو میں بنانا، یا فون پر براہ راست انسٹال کرنا۔'
            : 'Step-by-step instructions for generating and installing the MobileForensics APK on physical Android phones or emulators.'}
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: Termux on Android Phone */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                {lang === 'ur' ? 'طریقہ ۱: موبائل میں Termux سے APK کمپائل کریں' : 'Method 1: Compile APK on Phone (Termux)'}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              No PC Needed
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {lang === 'ur'
              ? 'اگر آپ کے پاس کمپیوٹر نہیں ہے تو آپ اپنے اینڈرائیڈ فون کے اندر Termux ایپلیکیشن کے ذریعے اس پروجیکٹ کو کمپائل کر کے اصل APK بنا سکتے ہیں:'
              : 'You can compile the Gradle project directly on your Android phone using Termux terminal:'}
          </p>

          <div className="space-y-3 text-xs">
            {/* Step 1 */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-300 font-semibold">
                {lang === 'ur' ? '۱. ٹرمکس اور پیکجز انسٹال کریں:' : 'Step 1: Install OpenJDK & Gradle'}
              </div>
              <div className="flex items-center justify-between bg-black/60 p-2 rounded font-mono text-[11px] text-emerald-400">
                <code>pkg update && pkg install -y openjdk-17 gradle git</code>
                <button
                  onClick={() => copyCode('pkg update && pkg install -y openjdk-17 gradle git', 'termux1')}
                  className="text-slate-400 hover:text-white transition ml-2 cursor-pointer"
                >
                  {copiedStep === 'termux1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-300 font-semibold">
                {lang === 'ur' ? '۲. پروجیکٹ ڈاؤن لوڈ کر کے فولڈر میں جائیں:' : 'Step 2: Unzip project & grant permissions'}
              </div>
              <div className="flex items-center justify-between bg-black/60 p-2 rounded font-mono text-[11px] text-cyan-400">
                <code>unzip MobileForensics.zip &amp;&amp; cd MobileForensics &amp;&amp; chmod +x gradlew</code>
                <button
                  onClick={() => copyCode('unzip MobileForensics.zip && cd MobileForensics && chmod +x gradlew', 'termux2')}
                  className="text-slate-400 hover:text-white transition ml-2 cursor-pointer"
                >
                  {copiedStep === 'termux2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="text-slate-300 font-semibold">
                {lang === 'ur' ? '۳. اے پی کے فائل تیار کریں:' : 'Step 3: Run Assemble Command'}
              </div>
              <div className="flex items-center justify-between bg-black/60 p-2 rounded font-mono text-[11px] text-sky-400">
                <code>./gradlew assembleDebug</code>
                <button
                  onClick={() => copyCode('./gradlew assembleDebug', 'termux3')}
                  className="text-slate-400 hover:text-white transition ml-2 cursor-pointer"
                >
                  {copiedStep === 'termux3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Method 2: Android Studio on PC / Mac */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                {lang === 'ur' ? 'طریقہ ۲: اینڈرائیڈ اسٹوڈیو میں اے پی کے بنائیں' : 'Method 2: Android Studio (Official Build)'}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Recommended
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {lang === 'ur'
              ? 'مکمل اینڈرائیڈ اسٹوڈیو پروجیکٹ ڈاؤن لوڈ کریں اور آفیشل طور پر سائن شدہ APK بنائیں:'
              : 'Download the full project ZIP, open in Android Studio and generate release/debug APK:'}
          </p>

          <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
            <li className="p-2 rounded bg-slate-950/60 border border-slate-800">
              {lang === 'ur'
                ? 'اوپر والے بٹن سے "Download Full Project (.ZIP)" ڈاؤن لوڈ کریں اور فائل کو ایکسٹریکٹ کریں۔'
                : 'Click "Download Full Project (.ZIP)" and extract the zip folder.'}
            </li>
            <li className="p-2 rounded bg-slate-950/60 border border-slate-800">
              {lang === 'ur'
                ? 'اینڈرائیڈ اسٹوڈیو کھولیں، File > Open پر کلک کر کے MobileForensics فولڈر منتخب کریں۔'
                : 'Open Android Studio > File > Open > select the MobileForensics directory.'}
            </li>
            <li className="p-2 rounded bg-slate-950/60 border border-slate-800">
              {lang === 'ur'
                ? 'Gradle Sync مکمل ہونے کا انتظار کریں۔'
                : 'Wait for Gradle sync to automatically resolve dependencies.'}
            </li>
            <li className="p-2 rounded bg-slate-950/60 border border-slate-800">
              {lang === 'ur'
                ? 'مینو میں Build > Build Bundle(s) / APK(s) > Build APK(s) پر کلک کریں۔'
                : 'Go to Build > Build Bundle(s) / APK(s) > Build APK(s).'}
            </li>
          </ol>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-[11px] text-indigo-200">
            📌 Output Location: <code className="font-mono text-cyan-300">app/build/outputs/apk/debug/app-debug.apk</code>
          </div>
        </div>
      </div>

      {/* APK Installation instructions on Android */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">
            {lang === 'ur' ? 'اینڈرائیڈ فون پر اے پی کے انسٹال کرنے کا طریقہ' : 'How to Install .APK on Android Device (Sideloading)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-semibold text-white mb-1">
              1. Transfer to Phone
            </div>
            <p className="text-slate-400 text-[11px]">
              Copy the <code className="text-cyan-300 font-mono">app-debug.apk</code> file to your Android device via USB cable, WhatsApp, Google Drive, or Bluetooth.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-semibold text-white mb-1">
              2. Unknown Sources
            </div>
            <p className="text-slate-400 text-[11px]">
              If prompted, enable <strong>"Install Unknown Apps"</strong> in Android Settings &gt; Security for your File Manager or Chrome.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="font-semibold text-white mb-1">
              3. Launch & Audit
            </div>
            <p className="text-slate-400 text-[11px]">
              Tap "Install Anyway" to launch <strong>MobileForensics</strong> and begin automated hardware and package auditing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
