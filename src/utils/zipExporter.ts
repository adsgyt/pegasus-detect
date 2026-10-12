import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../data/androidProjectFiles';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Add all files
  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  // Add a gradlew helper script
  zip.file(
    'MobileForensics/gradlew',
    `#!/usr/bin/env sh
# Gradle wrapper script for MobileForensics Android APK
echo "== Building MobileForensics Android APK =="
echo "Executing: gradle assembleDebug"
if command -v gradle >/dev/null 2>&1; then
    gradle assembleDebug
else
    echo "Gradle not found in PATH. Please install Gradle or OpenJDK 17."
    exit 1
fi
`
  );

  // Add gradlew.bat for Windows users
  zip.file(
    'MobileForensics/gradlew.bat',
    `@echo off
echo == Building MobileForensics Android APK ==
gradle assembleDebug
pause
`
  );

  // Generate blob
  return await zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function generateDebugApkStub(): Promise<Blob> {
  // Generates a mock debug APK package (ZIP archive structure conforming to APK standard)
  const zip = new JSZip();
  zip.file(
    'AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.mobileforensics"
    android:versionCode="1"
    android:versionName="1.0.0">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <application android:label="MobileForensics" android:icon="@drawable/icon">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  );
  zip.file('resources.arsc', 'MOBILE_FORENSICS_COMPILED_RESOURCES_BINARY_STREAM');
  zip.file('classes.dex', 'DEX_BYTECODE_035_MOBILE_FORENSICS_CORE_RUNTIME');
  zip.file('META-INF/MANIFEST.MF', 'Manifest-Version: 1.0\r\nCreated-By: MobileForensics Studio\r\n');
  zip.file('META-INF/CERT.SF', 'Signature-Version: 1.0\r\nSHA-256-Digest-Manifest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\r\n');
  zip.file('META-INF/CERT.RSA', 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy');
  zip.file('README_INSTALL.txt', 'MobileForensics Android Package. Built for automated digital forensic auditing.');

  return await zip.generateAsync({ type: 'blob' });
}
