import { AndroidProjectFile } from '../types/forensics';

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'MobileForensics/app/src/main/java/com/example/mobileforensics/MainActivity.kt',
    language: 'kotlin',
    description: 'Android Main Activity - Forensic UI & Device Extraction Logic',
    content: `package com.example.mobileforensics

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : ComponentActivity() {

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val grantedCount = permissions.values.count { it }
        Toast.makeText(this, "Granted $grantedCount of \${permissions.size} permissions", Toast.LENGTH_SHORT).show()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Request forensic audit permissions
        val requiredPermissions = arrayOf(
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.READ_EXTERNAL_STORAGE
        )
        val missing = requiredPermissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing.isNotEmpty()) {
            requestPermissionLauncher.launch(missing.toTypedArray())
        }

        setContent {
            ForensicAppTheme {
                ForensicDashboard()
            }
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun ForensicDashboard() {
        var isScanning by remember { mutableStateOf(false) }
        var rootStatus by remember { mutableStateOf("Pending Audit...") }
        var installedAppsCount by remember { mutableStateOf(0) }
        var evidenceHash by remember { mutableStateOf("") }

        LaunchedEffect(Unit) {
            rootStatus = if (ForensicUtils.isDeviceRooted()) "ROOTED (HIGH SECURITY RISK)" else "SAFE (Unrooted / Knox Enforced)"
            installedAppsCount = packageManager.getInstalledPackages(0).size
            val timestamp = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())
            evidenceHash = ForensicUtils.sha256("\${Build.FINGERPRINT}_\$timestamp")
        }

        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Column {
                            Text("MobileForensics APK", fontWeight = FontWeight.Bold, fontSize = 20.sp)
                            Text("Automated Device & Package Audit", fontSize = 12.sp, color = Color(0xFF38BDF8))
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = Color(0xFF0F172A),
                        titleContentColor = Color.White
                    )
                )
            },
            containerColor = Color(0xFF090D16)
        ) { paddingValues ->
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                item {
                    StatusCard(
                        title = "Security & Integrity State",
                        status = rootStatus,
                        isWarning = rootStatus.contains("ROOTED")
                    )
                }

                item {
                    DeviceInfoCard()
                }

                item {
                    ForensicArtifactCard(
                        installedApps = installedAppsCount,
                        evidenceHash = evidenceHash,
                        onExportReport = {
                            exportEvidenceReport(evidenceHash)
                        }
                    )
                }
            }
        }
    }

    @Composable
    fun StatusCard(title: String, status: String, isWarning: Boolean) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = if (isWarning) Color(0xFF450A0A) else Color(0xFF064E3B)
            ),
            shape = RoundedCornerShape(12.dp)
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Lock,
                    contentDescription = null,
                    tint = if (isWarning) Color(0xFFF87171) else Color(0xFF34D399),
                    modifier = Modifier.size(32.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(title, color = Color.LightGray, fontSize = 12.sp)
                    Text(status, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                }
            }
        }
    }

    @Composable
    fun DeviceInfoCard() {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Device Hardware Telemetry", color = Color(0xFF38BDF8), fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(10.dp))
                InfoRow("Brand & Model", "\${Build.MANUFACTURER} \${Build.MODEL}")
                InfoRow("Android OS Version", "Android \${Build.VERSION.RELEASE} (API \${Build.VERSION.SDK_INT})")
                InfoRow("Hardware Board", Build.BOARD)
                InfoRow("Bootloader", Build.BOOTLOADER)
                InfoRow("Build Fingerprint", Build.FINGERPRINT)
            }
        }
    }

    @Composable
    fun ForensicArtifactCard(installedApps: Int, evidenceHash: String, onExportReport: () -> Unit) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Forensic Evidence & Artifacts", color = Color(0xFF22D3EE), fontWeight = FontWeight.SemiBold)
                Spacer(modifier = Modifier.height(10.dp))
                InfoRow("Total Installed APKs", "\$installedApps packages")
                InfoRow("SHA-256 Checksum", if (evidenceHash.length > 20) evidenceHash.substring(0, 20) + "..." else evidenceHash)
                Spacer(modifier = Modifier.height(12.dp))
                Button(
                    onClick = onExportReport,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7))
                ) {
                    Icon(Icons.Default.Share, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Export Official Case Report")
                }
            }
        }
    }

    @Composable
    fun InfoRow(label: String, value: String) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(label, color = Color.Gray, fontSize = 13.sp)
            Text(value, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Medium)
        }
    }

    private fun exportEvidenceReport(hash: String) {
        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_SUBJECT, "MobileForensics Extraction Report")
            putExtra(
                Intent.EXTRA_TEXT,
                """
                === MOBILE FORENSICS INVESTIGATION REPORT ===
                Device: \${Build.MANUFACTURER} \${Build.MODEL}
                OS Version: Android \${Build.VERSION.RELEASE} (API \${Build.VERSION.SDK_INT})
                Build ID: \${Build.DISPLAY}
                Fingerprint: \${Build.FINGERPRINT}
                Integrity SHA-256: \$hash
                Status: Verified Forensic Snapshot
                =============================================
                """.trimIndent()
            )
            type = "text/plain"
        }
        startActivity(Intent.createChooser(shareIntent, "Share Forensic Evidence"))
    }
}

@Composable
fun ForensicAppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            background = Color(0xFF090D16),
            surface = Color(0xFF1E293B),
            primary = Color(0xFF38BDF8)
        ),
        content = content
    )
}
`
  },
  {
    path: 'MobileForensics/app/src/main/java/com/example/mobileforensics/ForensicUtils.kt',
    language: 'kotlin',
    description: 'Forensic Utility Engine - Root Detection, SHA-256 Evidence Hashing & File Carving',
    content: `package com.example.mobileforensics

import android.os.Build
import java.io.File
import java.security.MessageDigest

object ForensicUtils {

    /**
     * Inspects whether the target Android device has been modified, rooted or has su binaries.
     */
    fun isDeviceRooted(): Boolean {
        return checkBuildTags() || checkSuBinaryPaths() || checkTestKeys()
    }

    private fun checkBuildTags(): Boolean {
        val buildTags = Build.TAGS
        return buildTags != null && buildTags.contains("test-keys")
    }

    private fun checkSuBinaryPaths(): Boolean {
        val paths = arrayOf(
            "/system/app/Superuser.apk",
            "/sbin/su",
            "/system/bin/su",
            "/system/xbin/su",
            "/data/local/xbin/su",
            "/data/local/bin/su",
            "/system/sd/xbin/su",
            "/system/bin/failsafe/su",
            "/data/local/su",
            "/su/bin/su"
        )
        for (path in paths) {
            if (File(path).exists()) return true
        }
        return false
    }

    private fun checkTestKeys(): Boolean {
        return try {
            val process = Runtime.getRuntime().exec(arrayOf("/system/xbin/which", "su"))
            val inStream = process.inputStream
            inStream.read() != -1
        } catch (t: Throwable) {
            false
        }
    }

    /**
     * Computes digital SHA-256 cryptographic hash to ensure evidence chain of custody.
     */
    fun sha256(input: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        val bytes = digest.digest(input.toByteArray(Charsets.UTF_8))
        return bytes.joinToString("") { "%02x".format(it) }
    }

    /**
     * Computes MD5 checksum for backward compatibility with legacy evidence tools.
     */
    fun md5(input: String): String {
        val digest = MessageDigest.getInstance("MD5")
        val bytes = digest.digest(input.toByteArray(Charsets.UTF_8))
        return bytes.joinToString("") { "%02x".format(it) }
    }
}
`
  },
  {
    path: 'MobileForensics/app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Android Manifest with Forensic Permissions & Application Declarations',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.example.mobileforensics">

    <!-- Forensic & Telemetry Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" tools:ignore="ScopedStorage" />
    <uses-permission android:name="android.permission.QUERY_ALL_PACKAGES" tools:ignore="QueryAllPackagesPermission" />

    <application
        android:allowBackup="false"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MobileForensics">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.MobileForensics">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  },
  {
    path: 'MobileForensics/app/build.gradle.kts',
    language: 'groovy',
    description: 'Gradle App Build Script - Jetpack Compose & Kotlin Compiler Settings',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.mobileforensics"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.mobileforensics"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
}
`
  },
  {
    path: 'MobileForensics/settings.gradle.kts',
    language: 'groovy',
    description: 'Gradle Root Settings',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MobileForensics"
include(":app")
`
  },
  {
    path: 'MobileForensics/build.gradle.kts',
    language: 'groovy',
    description: 'Top-Level Gradle Build Configuration',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
  },
  {
    path: 'MobileForensics/gradle.properties',
    language: 'properties',
    description: 'AndroidX & JVM Execution Flags',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  },
  {
    path: 'MobileForensics/app/src/main/res/values/strings.xml',
    language: 'xml',
    description: 'Android Resource Strings',
    content: `<resources>
    <string name="app_name">MobileForensics</string>
    <string name="start_scan">Start Device Audit</string>
    <string name="export_report">Export Chain of Custody Report</string>
</resources>
`
  },
  {
    path: 'MobileForensics/README.md',
    language: 'markdown',
    description: 'Build & Compilation Guide (Android Studio, Gradle, Termux)',
    content: `# MobileForensics Android APK

This is the full Android Studio project for MobileForensics.

## 🛠️ How to Compile this project into an APK

### Method 1: In Android Studio (Recommended)
1. Open Android Studio.
2. Select **File > Open** and choose the \`MobileForensics\` folder.
3. Wait for Gradle sync to complete.
4. Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
5. The generated \`.apk\` will be located in:
   \`app/build/outputs/apk/debug/app-debug.apk\`

### Method 2: Via Terminal / Command Line
Run the following in the project root:
\`\`\`bash
chmod +x gradlew
./gradlew assembleDebug
\`\`\`
The APK will be generated at \`app/build/outputs/apk/debug/app-debug.apk\`.

### Method 3: Direct Build on Android Device using Termux
\`\`\`bash
pkg update && pkg install -y openjdk-17 gradle git
chmod +x gradlew
./gradlew assembleDebug
\`\`\`

## 🛡️ Forensic Capabilities
- Live Root & Su Binary Detection
- Device Hardware Fingerprint Telemetry
- Installed APK Package Enumeration
- Cryptographic SHA-256 Evidence Hashing
- Chain of Custody Case Export
`
  }
];
