import React, { useState } from 'react';
import {
  FileCode2,
  FolderTree,
  Download,
  Copy,
  Check,
  Terminal,
  Smartphone,
  ExternalLink,
  Play,
  Layers,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';
import { AndroidProjectFile, Language } from '../types/forensics';
import { getTranslation } from '../utils/i18n';

interface ApkBuilderTabProps {
  lang: Language;
  onDownloadProjectZip: () => void;
  onDownloadDebugApk: () => void;
}

export const ApkBuilderTab: React.FC<ApkBuilderTabProps> = ({
  lang,
  onDownloadProjectZip,
  onDownloadDebugApk,
}) => {
  const t = getTranslation(lang);
  const [selectedFile, setSelectedFile] = useState<AndroidProjectFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const copyFileContent = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleDownloadZip = () => {
    onDownloadProjectZip();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#0284c7', '#38bdf8', '#818cf8'],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Download Actions */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Android Studio Project
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Kotlin 2.0 • Jetpack Compose • Target SDK 35
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            {lang === 'ur'
              ? 'موبائل فرانزکس اے پی کے سورس کوڈ اور پراجیکٹ بلڈر'
              : 'MobileForensics APK Source Code & Android Project'}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            {lang === 'ur'
              ? 'یہ مکمل سورس کوڈ ہے جس سے آپ آفیشل اینڈرائیڈ ایپ (.apk) بنا سکتے ہیں۔ نیچے سے مکمل زپ فائل ڈاؤن لوڈ کریں اور اینڈرائیڈ اسٹوڈیو یا Termux میں چلائیں۔'
              : 'Complete production-grade Android Studio repository. Ready to assemble into an APK via Gradle, Android Studio, or Termux directly on your phone.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleDownloadZip}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{lang === 'ur' ? 'پراجیکٹ زپ ڈاؤن لوڈ کریں (.ZIP)' : 'Download Full Project (.ZIP)'}</span>
          </button>

          <button
            onClick={onDownloadDebugApk}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 transition cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'ur' ? 'ڈیبگ اے پی کے فائل (.APK)' : 'Download Debug APK'}</span>
          </button>
        </div>
      </div>

      {/* Code Browser & File Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* File Tree Navigation */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <span>Project Explorer</span>
          </div>

          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file, idx) => {
              const isSelected = selectedFile.path === file.path;
              const shortName = file.path.split('/').pop() || file.path;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="truncate">{shortName}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-sans">
                    {file.language}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick build snippets */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              1-Click Gradle Command
            </span>
            <div className="p-2 rounded bg-black/50 border border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center justify-between">
              <code>./gradlew assembleDebug</code>
              <button
                onClick={() => copyCommand('./gradlew assembleDebug')}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Source Code Viewer */}
        <div className="lg:col-span-3 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col">
          {/* Header of code viewer */}
          <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-white font-semibold">
                {selectedFile.path}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {selectedFile.description}
              </span>
              <button
                onClick={copyFileContent}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          {/* Code content */}
          <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-300 max-h-[520px] overflow-y-auto bg-[#0a0f1d] selection:bg-cyan-500/30">
            <pre className="whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
