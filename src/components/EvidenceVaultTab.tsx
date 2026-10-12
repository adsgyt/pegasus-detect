import React, { useState } from 'react';
import {
  ShieldCheck,
  Printer,
  FileDown,
  Hash,
  Plus,
  Trash2,
  Calendar,
  User,
  Building,
  Smartphone,
  Copy,
  Check,
  Sparkles,
  FileText
} from 'lucide-react';
import { ForensicCase, Language, DeviceForensicData, ApkSecurityReport } from '../types/forensics';
import { printForensicReport } from '../utils/pdfExport';
import { computeSha256, computeSimpleMd5 } from '../utils/apkAnalyzer';
import { getTranslation } from '../utils/i18n';

interface EvidenceVaultTabProps {
  caseData: ForensicCase;
  onUpdateCase: (updated: ForensicCase) => void;
  lang: Language;
  deviceData: DeviceForensicData | null;
  apkReport: ApkSecurityReport;
}

export const EvidenceVaultTab: React.FC<EvidenceVaultTabProps> = ({
  caseData,
  onUpdateCase,
  lang,
  deviceData,
  apkReport,
}) => {
  const t = getTranslation(lang);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [hashInput, setHashInput] = useState('');
  const [liveCalculatedHash, setLiveCalculatedHash] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleComputeLiveHash = async () => {
    if (!hashInput) return;
    const encoder = new TextEncoder();
    const buffer = encoder.encode(hashInput).buffer;
    const sha = await computeSha256(buffer);
    setLiveCalculatedHash(sha);
  };

  const handlePrint = () => {
    printForensicReport(caseData, deviceData, apkReport);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(caseData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${caseData.caseId}_evidence_manifest.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const removeEvidenceItem = (id: string) => {
    onUpdateCase({
      ...caseData,
      evidenceItems: caseData.evidenceItems.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase tracking-wider">
            Chain of Custody Standard (ISO/IEC 27037)
          </span>
          <h2 className="text-lg font-bold text-white mt-1">
            {lang === 'ur' ? 'ڈیجیٹل فرانزک کیس والٹ اور ثبوت کا ریکارڈ' : 'Forensic Evidence Vault & Chain of Custody'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'ur'
              ? 'کیس کے تمام شواہد، ہارڈویئر اسنیپ شاٹس، اور اے پی کے ہیشز کا مصدقہ ریکارڈ محفوظ کریں۔'
              : 'Tamper-evident record of all forensic artifacts, device snapshots, and cryptographic signatures.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.officialReport}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export JSON Manifest</span>
          </button>
        </div>
      </div>

      {/* Case Details Form */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {lang === 'ur' ? 'کیس کی معلومات' : 'Investigation Case Details'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Case Number</label>
            <input
              type="text"
              value={caseData.caseId}
              onChange={(e) => onUpdateCase({ ...caseData, caseId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-white font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Lead Examiner</label>
            <input
              type="text"
              value={caseData.examinerName}
              onChange={(e) => onUpdateCase({ ...caseData, examinerName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Agency / Department</label>
            <input
              type="text"
              value={caseData.agency}
              onChange={(e) => onUpdateCase({ ...caseData, agency: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Target Device / Serial</label>
            <input
              type="text"
              value={caseData.targetDevice}
              onChange={(e) => onUpdateCase({ ...caseData, targetDevice: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Live Hash Calculator Tool */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Hash className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ur' ? 'آن لائن کرپٹو گرافک ہیش کیلکولیٹر' : 'Instant Evidence SHA-256 Hashing Tool'}</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type text, file string, or IMEI to compute SHA-256 hash..."
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-slate-800 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
          />
          <button
            onClick={handleComputeLiveHash}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer"
          >
            Compute
          </button>
        </div>

        {liveCalculatedHash && (
          <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
            <span className="break-all">{liveCalculatedHash}</span>
            <button
              onClick={() => copyText(liveCalculatedHash, 'calc')}
              className="ml-2 text-slate-400 hover:text-white transition cursor-pointer"
            >
              {copiedHash === 'calc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Logged Evidence Artifacts List */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ur' ? 'محفوظ شدہ ڈیجیٹل شواہد' : 'Recorded Evidence Artifacts'}</span>
          </h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {caseData.evidenceItems.length} records
          </span>
        </div>

        {caseData.evidenceItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No evidence records added yet. Run a Device Audit or inspect an APK to log evidence snapshots.
          </div>
        ) : (
          <div className="space-y-3">
            {caseData.evidenceItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono font-bold text-[10px] border border-cyan-500/20">
                      {item.type}
                    </span>
                    <span className="font-semibold text-white">{item.title}</span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-400 break-all flex items-center gap-2">
                    <span className="text-slate-400">SHA-256:</span>
                    <span className="text-cyan-300">{item.hashSha256}</span>
                    <button
                      onClick={() => copyText(item.hashSha256, item.id)}
                      className="text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      {copiedHash === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  {item.notes && <p className="text-slate-400 text-[11px]">{item.notes}</p>}
                </div>

                <button
                  onClick={() => removeEvidenceItem(item.id)}
                  className="text-slate-400 hover:text-red-400 transition p-1 cursor-pointer"
                  title="Remove artifact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
