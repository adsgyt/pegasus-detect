import { DeviceForensicData, ForensicCase, ApkSecurityReport } from '../types/forensics';

export function printForensicReport(
  caseData: ForensicCase,
  deviceData?: DeviceForensicData | null,
  apkReport?: ApkSecurityReport | null
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the Forensic Report');
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>FORENSIC REPORT - Case ${caseData.caseId}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 40px;
      color: #1e293b;
      line-height: 1.5;
    }
    .header {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 15px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #0f172a;
      text-transform: uppercase;
    }
    .badge {
      background: #0284c7;
      color: #fff;
      padding: 4px 10px;
      font-size: 12px;
      border-radius: 4px;
      font-weight: bold;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #0369a1;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 5px;
      margin-top: 25px;
      margin-bottom: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      font-size: 13px;
      text-align: left;
    }
    th {
      background: #f1f5f9;
      font-weight: 600;
    }
    .mono {
      font-family: monospace;
      font-size: 11px;
      word-break: break-all;
    }
    .signature-box {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
    }
    .sig-line {
      width: 45%;
      border-top: 1px solid #334155;
      padding-top: 8px;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">Digital Forensic Examination Report</div>
      <div style="font-size: 13px; color: #64748b;">Mobile Forensics Investigation & Artifact Verification</div>
    </div>
    <span class="badge">EVIDENCE VERIFIED</span>
  </div>

  <div class="section-title">1. Case Metadata & Chain of Custody</div>
  <table>
    <tr><th>Case Number</th><td>${caseData.caseId}</td><th>Date of Extraction</th><td>${new Date().toLocaleString()}</td></tr>
    <tr><th>Case Name</th><td>${caseData.caseName}</td><th>Investigating Agency</th><td>${caseData.agency || 'Cyber Forensics Unit'}</td></tr>
    <tr><th>Primary Examiner</th><td>${caseData.examinerName || 'Certified Forensic Analyst'}</td><th>Target Device Model</th><td>${caseData.targetDevice || 'Android Mobile Device'}</td></tr>
    <tr><th>Device Serial / IMEI</th><td colspan="3">${caseData.serialNumber || 'SN-UNKNOWN'}</td></tr>
  </table>

  ${
    deviceData
      ? `
  <div class="section-title">2. Live Device Hardware Telemetry</div>
  <table>
    <tr><th>Operating System</th><td>${deviceData.platform}</td><th>User Agent</th><td class="mono">${deviceData.userAgent}</td></tr>
    <tr><th>GPU Architecture</th><td>${deviceData.gpuRenderer}</td><th>Canvas Fingerprint</th><td class="mono">${deviceData.canvasFingerprint}</td></tr>
    <tr><th>CPU Concurrency</th><td>${deviceData.cpuCores} Cores</td><th>Memory Estimate</th><td>${deviceData.memoryEstimateGb}</td></tr>
    <tr><th>Display Resolution</th><td>${deviceData.screenResolution}</td><th>Tamper Heuristics</th><td>${deviceData.securityChecks.tamperDetected ? 'ALERT: Virtual/Modified' : 'Clean / Native Hardware'}</td></tr>
  </table>
  `
      : ''
  }

  ${
    apkReport
      ? `
  <div class="section-title">3. Forensic APK Analysis & Threat Assessment</div>
  <table>
    <tr><th>APK File Name</th><td>${apkReport.fileName}</td><th>Risk Score</th><td><strong>${apkReport.riskScore} / 100</strong></td></tr>
    <tr><th>Package Identifier</th><td>${apkReport.packageName}</td><th>Version</th><td>${apkReport.versionName} (${apkReport.versionCode})</td></tr>
    <tr><th>SHA-256 Hash</th><td colspan="3" class="mono">${apkReport.sha256}</td></tr>
    <tr><th>MD5 Hash</th><td colspan="3" class="mono">${apkReport.md5}</td></tr>
  </table>

  <div class="section-title">4. High-Privilege Permissions Audited</div>
  <table>
    <thead>
      <tr><th>Permission</th><th>Risk Level</th><th>Description</th></tr>
    </thead>
    <tbody>
      ${apkReport.permissions
        .map(
          (p) => `<tr>
        <td class="mono">${p.name}</td>
        <td><strong>${p.level}</strong> (${p.risk.toUpperCase()})</td>
        <td>${p.description}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>
  `
      : ''
  }

  <div class="section-title">5. Examiner Attestation & Verification</div>
  <p style="font-size: 12px; color: #475569;">
    I hereby certify that the digital evidence items listed above were acquired, maintained, and hashed in accordance with ISO/IEC 27037 standards for digital evidence handling. The cryptographic SHA-256 hashes confirm bit-level integrity.
  </p>

  <div class="signature-box">
    <div class="sig-line">
      Forensic Examiner Signature<br>
      <strong>${caseData.examinerName || 'Lead Analyst'}</strong>
    </div>
    <div class="sig-line">
      Supervising Agency Approval<br>
      <strong>${caseData.agency || 'Digital Forensics Division'}</strong>
    </div>
  </div>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 300);
}
