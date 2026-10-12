import { Language } from '../types/forensics';

export const TRANSLATIONS = {
  en: {
    appTitle: 'MobileForensics APK Studio',
    appSubtitle: 'Mobile Security, Device Audit & Android APK Studio',
    tabs: {
      deviceAudit: 'Device Audit',
      apkAnalyzer: 'APK Inspector',
      apkBuilder: 'APK Project & Code',
      evidenceVault: 'Evidence Vault',
      guide: 'Build APK Guide'
    },
    installApp: 'Install App / APK',
    installPwaPrompt: 'Install to Android as Standalone App',
    downloadZip: 'Download Full Android Project (.ZIP)',
    downloadSampleApk: 'Download Debug APK Package',
    quickScan: 'Run Live Forensic Scan',
    scanning: 'Extracting Forensics...',
    deviceTelemetry: 'Hardware & OS Telemetry',
    networkTelemetry: 'Network & Connectivity',
    securityIntegrity: 'Security & Integrity Assessment',
    batteryState: 'Battery Diagnostics',
    riskScore: 'Security Risk Score',
    permissionsCount: 'Permissions Audited',
    totalFindings: 'Security Findings',
    officialReport: 'Generate Official Report',
    buildInstructions: 'How to build APK on Android / PC',
    termuxBuild: 'Build on Phone (Termux)',
    androidStudioBuild: 'Build in Android Studio',
    statusSafe: 'Integrity Verified (Clean)',
    statusWarning: 'Security Alert / Root Risk',
    caseManager: 'Digital Evidence Chain of Custody',
    langToggle: 'اردو'
  },
  ur: {
    appTitle: 'موبائل فرانزکس اے پی کے اسٹوڈیو',
    appSubtitle: 'موبائل سیکیورٹی آڈٹ، اے پی کے اینالائزر اور اینڈرائیڈ پراجیکٹ بلڈر',
    tabs: {
      deviceAudit: 'ڈیوائس آڈٹ',
      apkAnalyzer: 'اے پی کے معائنہ',
      apkBuilder: 'اے پی کے سورس کوڈ',
      evidenceVault: 'ڈیجیٹل والٹ',
      guide: 'اے پی کے بنانے کا طریقہ'
    },
    installApp: 'ایپ / اے پی کے انسٹال کریں',
    installPwaPrompt: 'موبائل میں براہ راست ایپ کے طور پر انسٹال کریں',
    downloadZip: 'اینڈرائیڈ اسٹوڈیو پراجیکٹ ڈاؤن لوڈ کریں (.ZIP)',
    downloadSampleApk: 'ڈیبگ اے پی کے فائل ڈاؤن لوڈ کریں',
    quickScan: 'ڈیوائس کا مکمل معائنہ شروع کریں',
    scanning: 'ڈیٹا حاصل کیا جا رہا ہے...',
    deviceTelemetry: 'ہارڈویئر اور سسٹم کی تفصیلات',
    networkTelemetry: 'نیٹ ورک اور انٹرنیٹ کنکشن',
    securityIntegrity: 'سیکیورٹی اور روٹ کی جانچ',
    batteryState: 'بیٹری کی کارکردگی اور صحت',
    riskScore: 'خطرے کا اسکور',
    permissionsCount: 'اجازتیں (Permissions)',
    totalFindings: 'سیکیورٹی تجزیہ',
    officialReport: 'سرکاری فرانزک رپورٹ بنائیں',
    buildInstructions: 'موبائل یا کمپیوٹر پر اے پی کے بنانے کا طریقہ',
    termuxBuild: 'موبائل پر بنائیں (Termux)',
    androidStudioBuild: 'اینڈرائیڈ اسٹوڈیو کے ذریعے',
    statusSafe: 'محفوظ حالت (کوئی روٹ یا خطرہ نہیں)',
    statusWarning: 'سیکیورٹی کا انتباہ',
    caseManager: 'ڈیجیٹل ثبوت اور کیس ریکارڈ',
    langToggle: 'English'
  }
};

export function getTranslation(lang: Language) {
  return TRANSLATIONS[lang];
}
