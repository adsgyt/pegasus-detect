export type Language = 'en' | 'ur';

export interface DeviceForensicData {
  deviceModel: string;
  platform: string;
  userAgent: string;
  screenResolution: string;
  colorDepth: number;
  pixelRatio: number;
  cpuCores: number | string;
  memoryEstimateGb: number | string;
  storageEstimateMb?: { quota: number; usage: number };
  gpuRenderer: string;
  gpuVendor: string;
  canvasFingerprint: string;
  battery?: {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
  };
  network?: {
    type: string;
    downlink: number;
    rtt: number;
    effectiveType: string;
    online: boolean;
  };
  timezone: string;
  locale: string;
  touchSupport: boolean;
  maxTouchPoints: number;
  securityChecks: {
    tamperDetected: boolean;
    webRtcAvailable: boolean;
    storagePersistence: boolean;
    secureContext: boolean;
    cookieEnabled: boolean;
  };
  timestamp: string;
}

export interface ApkSecurityReport {
  fileName: string;
  fileSizeBytes: number;
  sha256: string;
  md5: string;
  packageName: string;
  versionName: string;
  versionCode: number | string;
  minSdkVersion: number;
  targetSdkVersion: number;
  riskScore: number; // 0 - 100
  permissions: {
    name: string;
    level: 'DANGEROUS' | 'NORMAL' | 'SIGNATURE' | 'CUSTOM';
    description: string;
    risk: 'high' | 'medium' | 'low';
  }[];
  activities: string[];
  services: string[];
  receivers: string[];
  findings: {
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    description: string;
    recommendation: string;
  }[];
  filesCount: number;
  hasNativeLibs: boolean;
  nativeArchitectures: string[];
  isDebuggable: boolean;
  allowsBackup: boolean;
}

export interface ForensicCase {
  caseId: string;
  caseName: string;
  examinerName: string;
  agency: string;
  targetDevice: string;
  serialNumber: string;
  dateCreated: string;
  notes: string;
  artifactsCount: number;
  evidenceItems: {
    id: string;
    type: 'APK' | 'LOG' | 'HARDWARE_SNAPSHOT' | 'MEDIA' | 'NETWORK';
    title: string;
    hashSha256: string;
    timestamp: string;
    notes: string;
  }[];
}

export interface AndroidProjectFile {
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'properties' | 'markdown';
  content: string;
  description: string;
}
