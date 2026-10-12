import React from 'react';
import {
  ShieldCheck,
  Download,
  Smartphone,
  FolderArchive,
  Search,
  FileCode2,
  HardDrive,
  BookOpen,
  Languages,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types/forensics';
import { getTranslation } from '../utils/i18n';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenInstallModal: () => void;
  onDownloadProjectZip: () => void;
  isInstallable: boolean;
  onInstallPwa: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  onOpenInstallModal,
  onDownloadProjectZip,
  isInstallable,
  onInstallPwa,
}) => {
  const t = getTranslation(lang);

  const navItems = [
    { id: 'audit', label: t.tabs.deviceAudit, icon: HardDrive },
    { id: 'analyzer', label: t.tabs.apkAnalyzer, icon: Search },
    { id: 'builder', label: t.tabs.apkBuilder, icon: FileCode2 },
    { id: 'vault', label: t.tabs.evidenceVault, icon: ShieldCheck },
    { id: 'guide', label: t.tabs.guide, icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b1120]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar with brand & main actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#090d16]"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-cyan-100 to-sky-400 bg-clip-text text-transparent">
                  {t.appTitle}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 uppercase tracking-wider">
                  v1.0 APK
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Install PWA / Mobile App button */}
            {isInstallable ? (
              <button
                onClick={onInstallPwa}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/30 transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{lang === 'ur' ? 'ایپ انسٹال کریں' : 'Install App'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenInstallModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ur' ? 'اے پی کے گائیڈ' : 'Mobile APK'}</span>
              </button>
            )}

            {/* Quick Download Zip */}
            <button
              onClick={onDownloadProjectZip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white shadow-md shadow-sky-600/20 border border-sky-400/30 transition-all cursor-pointer"
              title="Download Android Studio Project (.ZIP)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ur' ? 'پراجیکٹ ڈاؤن لوڈ (.ZIP)' : 'Download Project (.ZIP)'}</span>
              <span className="sm:hidden">.ZIP</span>
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
              title="Toggle English / Urdu"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{t.langToggle}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-thin">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
