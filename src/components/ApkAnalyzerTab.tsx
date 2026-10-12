import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Upload,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  Copy,
  Check,
  Search,
  Sparkles,
  Zap,
  Info,
  Bug,
  FolderArchive,
  Download,
  CheckCircle2,
  XCircle,
  ClipboardPaste,
  RotateCcw,
  KeyRound,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApkSecurityReport, Language } from '../types/forensics';
import { analyzeApkFile, SAMPLE_APKS } from '../utils/apkAnalyzer';
import { getTranslation } from '../utils/i18n';

interface ApkAnalyzerTabProps {
  currentReport: ApkSecurityReport;
  onSetReport: (report: ApkSecurityReport) => void;
  lang: Language;
  onSaveToVault: (report: ApkSecurityReport) => void;
}

export const ApkAnalyzerTab: React.FC<ApkAnalyzerTabProps> = ({
  currentReport,
  onSetReport,
  lang,
  onSaveToVault,
}) => {
  const t = getTranslation(lang);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time SHA-256 Integrity Verification State
  const [expectedChecksum, setExpectedChecksum] = useState<string>('');
  const [hasCelebratedMatch, setHasCelebratedMatch] = useState<boolean>(false);

  // Normalize checksums (trim, lower, strip common prefix formats like sha256:, spaces, colons)
  const normalizedActualHash = useMemo(() => {
    return (currentReport.sha256 || '').toLowerCase().trim();
  }, [currentReport.sha256]);

  const normalizedExpectedHash = useMemo(() => {
    return expectedChecksum
      .trim()
      .toLowerCase()
      .replace(/^sha-?256\s*[:=]\s*/i, '')
      .replace(/[\s\-_:]/g, '');
  }, [expectedChecksum]);

  // Verification status
  const verificationResult = useMemo(() => {
    if (!normalizedExpectedHash) {
      return { status: 'idle' as const };
    }
    if (normalizedExpectedHash.length !== 64) {
      return {
        status: 'incomplete' as const,
        currentLength: normalizedExpectedHash.length,
        requiredLength: 64,
      };
    }
    if (normalizedExpectedHash === normalizedActualHash) {
      return { status: 'match' as const };
    }
    // Calculate mismatched character count
    let mismatches = 0;
    for (let i = 0; i < 64; i++) {
      if (normalizedExpectedHash[i] !== normalizedActualHash[i]) {
        mismatches++;
      }
    }
    return {
      status: 'mismatch' as const,
      mismatchCount: mismatches,
    };
  }, [normalizedExpectedHash, normalizedActualHash]);

  // Trigger confetti when a valid match is entered
  useEffect(() => {
    if (verificationResult.status === 'match' && !hasCelebratedMatch) {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#06b6d4'],
      });
      setHasCelebratedMatch(true);
    } else if (verificationResult.status !== 'match') {
      setHasCelebratedMatch(false);
    }
  }, [verificationResult.status, hasCelebratedMatch]);

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setExpectedChecksum(text);
      }
    } catch {
      // Browser permissions denied or not supported, ignore silently
    }
  };

  const handleTestMatch = () => {
    setExpectedChecksum(currentReport.sha256);
  };

  const handleTestTampered = () => {
    // Generate a slightly altered version to demonstrate tamper detection
    const altered = currentReport.sha256.substring(0, 56) + 'deadbeef';
    setExpectedChecksum(altered);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const report = await analyzeApkFile(file);
      onSetReport(report);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#0284c7', '#34d399'],
      });
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to analyze APK. Please ensure it is a valid APK/ZIP file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const report = await analyzeApkFile(file);
      onSetReport(report);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to inspect APK file.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (key: 'clean' | 'malicious') => {
    onSetReport(SAMPLE_APKS[key]);
  };

  const handleSaveVault = () => {
    onSaveToVault(currentReport);
    setIsSaved(true);
    confetti({
      particleCount: 45,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#10b981'],
    });
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-400 bg-red-950/40 border-red-500/40';
    if (score >= 40) return 'text-amber-400 bg-amber-950/40 border-amber-500/40';
    return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone & Quick Sample selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="lg:col-span-2 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 bg-slate-900/60 hover:bg-slate-900/90 transition text-center cursor-pointer flex flex-col items-center justify-center min-h-[160px]"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".apk,.zip"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">
            {lang === 'ur'
              ? 'اپنا اے پی کے فائل یہاں اپلوڈ کریں (.apk یا .zip)'
              : 'Upload or Drag & Drop APK File (.apk or .zip)'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            {lang === 'ur'
              ? 'فائل پر کلک کریں یا براہ راست گھسیٹ کر لائیں۔ ہمارا ٹول پرمیشنز، میٹا ڈیٹا اور خطرات کا فوری تجزیہ کرے گا۔'
              : 'Client-side deep inspection: extracts AndroidManifest.xml, classes.dex, permissions, and cryptographic hashes without leaving your device.'}
          </p>
          {isAnalyzing && (
            <div className="mt-3 flex items-center gap-2 text-xs text-cyan-300 font-mono">
              <Zap className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Analyzing binary structure...</span>
            </div>
          )}
          {errorMsg && (
            <div className="mt-2 text-xs text-red-400 font-medium">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              {lang === 'ur' ? 'نمونہ اے پی کے ٹیسٹ کریں' : 'Quick Test APK Samples'}
            </span>
            <p className="text-xs text-slate-400">
              {lang === 'ur'
                ? 'فوری جانچ کے لیے نیچے دیے گئے محفوظ یا مشکوک نمونے منتخب کریں:'
                : 'Instantly evaluate forensic reports using clean vs malicious presets:'}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => loadSample('clean')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                currentReport.packageName === SAMPLE_APKS.clean.packageName
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold truncate">MobileForensics (Clean)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Risk: 18%
              </span>
            </button>

            <button
              onClick={() => loadSample('malicious')}
              className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                currentReport.packageName === SAMPLE_APKS.malicious.packageName
                  ? 'bg-red-950/40 border-red-500/40 text-red-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-semibold truncate">TrojanSpy (Malware)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">
                Risk: 92%
              </span>
            </button>
          </div>

          <button
            onClick={handleSaveVault}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow transition cursor-pointer"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <FileCheck2 className="w-3.5 h-3.5" />}
            <span>{isSaved ? (lang === 'ur' ? 'محفوظ ہوگیا' : 'Saved to Evidence') : (lang === 'ur' ? 'کیس والٹ میں محفوظ کریں' : 'Log to Evidence Vault')}</span>
          </button>
        </div>
      </div>

      {/* Main Inspection Dashboard for Selected APK */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Risk Score Meter */}
        <div className={`p-5 rounded-2xl border flex flex-col justify-between ${getRiskColor(currentReport.riskScore)}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider">
              {t.riskScore}
            </span>
            {currentReport.riskScore >= 70 ? (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          <div className="my-4">
            <div className="text-4xl font-extrabold tracking-tight font-mono">
              {currentReport.riskScore}<span className="text-xl">/100</span>
            </div>
            <p className="text-xs mt-1 font-medium">
              {currentReport.riskScore >= 70
                ? (lang === 'ur' ? 'خطرناک مشکوک ایپلیکیشن' : 'HIGH RISK MALWARE PATTERN')
                : currentReport.riskScore >= 40
                ? (lang === 'ur' ? 'درمیانہ خطرہ' : 'MEDIUM SUSPICION')
                : (lang === 'ur' ? 'محفوظ و تصدیق شدہ' : 'VERIFIED LOW RISK')}
            </p>
          </div>
          <div className="text-[11px] opacity-80">
            {currentReport.findings.length} security indicators detected
          </div>
        </div>

        {/* Package & Version Info */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            {lang === 'ur' ? 'پیکیج آئی ڈی' : 'Package Identifier'}
          </span>
          <div>
            <div className="font-mono text-xs text-white font-semibold break-all">
              {currentReport.packageName}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Version {currentReport.versionName} (Build {currentReport.versionCode})
            </div>
          </div>
          <div className="pt-1 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Min SDK: {currentReport.minSdkVersion}</span>
            <span>•</span>
            <span>Target: {currentReport.targetSdkVersion}</span>
          </div>
        </div>

        {/* Cryptographic SHA-256 Hash */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cryptographic Hashes (Evidence Grade)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {(currentReport.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
          <div className="space-y-1.5 text-xs font-mono">
            <div>
              <span className="text-slate-400 text-[11px] block">SHA-256:</span>
              <div className="flex items-center justify-between p-2 rounded bg-black/40 border border-slate-800 text-cyan-300 break-all">
                <span>{currentReport.sha256}</span>
                <button
                  onClick={() => copyText(currentReport.sha256, 'sha')}
                  className="text-slate-400 hover:text-white transition ml-2 cursor-pointer"
                >
                  {copiedKey === 'sha' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">MD5:</span>
              <div className="flex items-center justify-between p-1.5 rounded bg-black/40 border border-slate-800 text-slate-300 break-all text-[11px]">
                <span>{currentReport.md5}</span>
                <button
                  onClick={() => copyText(currentReport.md5, 'md5')}
                  className="text-slate-400 hover:text-white transition ml-2 cursor-pointer"
                >
                  {copiedKey === 'md5' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time SHA-256 Integrity Verification Tool */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  {lang === 'ur'
                    ? 'ریئل ٹائم SHA-256 ہیش سالمیت اور مماثلت کی جانچ'
                    : 'Real-Time SHA-256 Integrity Hash Verifier'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase tracking-wider">
                  Live Matcher
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {lang === 'ur'
                  ? 'ڈویلپر یا سرکاری ریلیز سے حاصل شدہ SHA-256 ہیش یہاں پیسٹ کریں تاکہ تصدیق ہو سکے کہ فائل اصلی ہے یا اس میں تبدیلی کی گئی ہے۔'
                  : 'Paste an expected vendor checksum, GitHub release hash, or threat intel signature to verify APK authenticity bit-for-bit.'}
              </p>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <button
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              title="Paste from system clipboard"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ur' ? 'کلپ بورڈ سے پیسٹ' : 'Paste'}</span>
            </button>

            <button
              onClick={handleTestMatch}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 transition cursor-pointer font-medium"
              title="Auto-fill matching hash to test clean validation"
            >
              {lang === 'ur' ? 'ٹیسٹ: درست ہیش' : 'Test Match'}
            </button>

            <button
              onClick={handleTestTampered}
              className="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 transition cursor-pointer font-medium"
              title="Auto-fill altered hash to test tamper detection"
            >
              {lang === 'ur' ? 'ٹیسٹ: تبدیل شدہ ہیش' : 'Test Tampered'}
            </button>

            {expectedChecksum && (
              <button
                onClick={() => setExpectedChecksum('')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                title="Clear input"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Input box */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {lang === 'ur' ? 'مطلوبہ ہیش (Expected SHA-256 Checksum)' : 'Expected Checksum to Verify Against:'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={expectedChecksum}
              onChange={(e) => setExpectedChecksum(e.target.value)}
              placeholder="e.g. 9a8d7c6b5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
              className={`w-full pl-3.5 pr-24 py-2.5 rounded-xl bg-black/60 border font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none transition ${
                verificationResult.status === 'match'
                  ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/10 focus:border-emerald-400'
                  : verificationResult.status === 'mismatch'
                  ? 'border-red-500/80 shadow-lg shadow-red-500/10 focus:border-red-400'
                  : verificationResult.status === 'incomplete'
                  ? 'border-amber-500/70 focus:border-amber-400'
                  : 'border-slate-800 focus:border-cyan-500'
              }`}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[11px] font-mono">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                normalizedExpectedHash.length === 64
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-slate-900 text-slate-500'
              }`}>
                {normalizedExpectedHash.length}/64
              </span>
            </div>
          </div>
        </div>

        {/* Verification Result Display */}
        {verificationResult.status === 'match' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-slate-950 border border-emerald-500/60 shadow-lg space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-xs text-emerald-400 tracking-wide uppercase">
                    {lang === 'ur' ? 'سالمیت کی تصدیق: ۱۰۰٪ درست میچ' : 'INTEGRITY VERIFIED • 100% EXACT MATCH'}
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'ur'
                      ? 'دی گئی ہیش فائل کے SHA-256 ہیش سے مکمل مطابقت رکھتی ہے۔ فائل میں کوئی رد و بدل نہیں ہوا۔'
                      : 'Calculated SHA-256 hash matches the expected checksum bit-for-bit. The binary is genuine and unaltered.'}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                MATCH: 64/64 HEX BYTES
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-black/50 border border-emerald-900/50 text-[11px] font-mono text-emerald-300 break-all space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>Verified Hash:</span>
                <span className="text-emerald-400">No Tampering Detected</span>
              </div>
              <div>{normalizedActualHash}</div>
            </div>
          </div>
        )}

        {verificationResult.status === 'mismatch' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/60 via-slate-950 to-slate-950 border border-red-500/60 shadow-lg space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                  <XCircle className="w-5 h-5 text-red-400 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold text-xs text-red-400 tracking-wide uppercase">
                    {lang === 'ur' ? 'سیکیورٹی الرٹ: ہیش میں فرق پایا گیا' : 'INTEGRITY VIOLATION • HASH MISMATCH'}
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'ur'
                      ? `دی گئی ہیش اور موجودہ فائل کی ہیش آپس میں نہیں ملتیں (${verificationResult.mismatchCount} حروف مختلف ہیں)۔ فائل تبدیل شدہ یا خراب ہو سکتی ہے۔`
                      : `The expected checksum does NOT match this APK (${verificationResult.mismatchCount} differing hex chars). File may be trojanized or re-signed.`}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold border border-red-500/30">
                DELTA: {verificationResult.mismatchCount} MISMATCHES
              </span>
            </div>

            {/* Side-by-side comparison */}
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="p-2 rounded bg-black/60 border border-red-950 text-slate-300 break-all">
                <span className="text-slate-500 block text-[10px]">Actual APK Calculated SHA-256:</span>
                <span className="text-cyan-300">{normalizedActualHash}</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-red-900/60 text-slate-300 break-all">
                <span className="text-slate-500 block text-[10px]">Pasted Expected Checksum:</span>
                <span className="text-red-400">{normalizedExpectedHash}</span>
              </div>
            </div>
          </div>
        )}

        {verificationResult.status === 'incomplete' && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'ur'
                  ? `ہیش نامکمل ہے (${verificationResult.currentLength} / 64 حروف)۔ برائے مہربانی مکمل ۶۴ ہندسوں کا SHA-256 ہیش درج کریں۔`
                  : `Incomplete checksum: ${verificationResult.currentLength} / 64 characters entered. SHA-256 requires 64 hexadecimal characters.`}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0">
              {64 - verificationResult.currentLength} more chars
            </span>
          </div>
        )}

        {verificationResult.status === 'idle' && (
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-slate-500" />
              <span>
                {lang === 'ur'
                  ? 'اوپر باکس میں کوئی بھی SHA-256 ہیش پیسٹ کریں یا فوراً ٹیسٹ کرنے کے لیے "ٹیسٹ: درست ہیش" پر کلک کریں۔'
                  : 'Paste an expected SHA-256 hash above or click "Test Match" / "Test Tampered" to preview real-time cryptographic verification.'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 shrink-0">
              SHA-256 Ready
            </span>
          </div>
        )}
      </div>

      {/* Permissions Breakdown & Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Permissions Table */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ur' ? 'اجازتیں (Manifest Permissions)' : 'Requested Permissions'}</span>
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {currentReport.permissions.length} total
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {currentReport.permissions.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-white font-medium break-all">
                    {p.name.replace('android.permission.', '')}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${
                      p.risk === 'high'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                        : p.risk === 'medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {p.level}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Findings & Heuristics */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bug className="w-4 h-4 text-red-400" />
              <span>{lang === 'ur' ? 'سیکیورٹی نتائج اور خطرات' : 'Forensic Heuristic Findings'}</span>
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {currentReport.findings.length} findings
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {currentReport.findings.map((f, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-white">
                    {f.title}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                      f.severity === 'critical'
                        ? 'bg-red-600/30 text-red-300 border border-red-500/40'
                        : f.severity === 'high'
                        ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {f.severity}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {f.description}
                </p>
                <p className="text-[10px] text-slate-400 font-mono bg-black/40 p-1.5 rounded">
                  💡 {f.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
