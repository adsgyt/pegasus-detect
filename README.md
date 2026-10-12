Pegasus Detect — Android Spyware Indicator Scanner
A defensive Android security and mobile forensics research project.
Pegasus Detect is a cybersecurity research application concept designed to help users examine Android security information, identify suspicious indicators, and document potential spyware-related findings.
> **Important:** This project does not guarantee detection of Pegasus spyware. Reliable identification may require specialist mobile forensic tools, validated forensic artifacts, and expert analysis.
Features
The following items describe the intended feature set. They are planned capabilities unless explicitly marked as implemented and tested in the project documentation or release notes.
Planned Features
Device Security Overview: Display available Android version and security information.
Suspicious App Review: Help users review installed applications and identify potentially unusual permissions.
Permission Analysis: Highlight sensitive permissions that deserve further review.
Network Security Guidance: Provide information about suspicious network activity and secure connections.
Indicator-Based Analysis: Organize user-provided or authorized forensic indicators for review.
Forensic Notes: Allow users to document observations and investigation timestamps.
Security Report: Present findings with evidence, limitations, and recommended next steps.
Privacy-Focused Design: Perform authorized checks without secretly collecting personal data.
Implemented and Tested Functionality
No application features are currently documented as implemented and tested. Do not treat the planned features above as available until corresponding code, tests, and supporting documentation have been added.
Project Goals
Improve awareness of Android spyware risks.
Support defensive mobile security research.
Help users understand suspicious permissions and application behavior.
Provide a structured workflow for recording potential security indicators.
Encourage responsible and authorized forensic investigations.
Technology Stack
The following technologies are potential choices for implementation:
Platform: Android
Language: Kotlin
Development Environment: Android Studio
User Interface: Jetpack Compose
Build System: Gradle
Version Control: Git and GitHub
Testing: Android Emulator and authorized test devices
These are proposed technologies, not evidence that an implementation currently exists. Features should be marked complete only after implementation and testing.
Requirements
Android Studio
A compatible Android SDK
JDK version supported by the selected Android Gradle Plugin
Git
An Android emulator or authorized test device
Installation
The repository does not currently document a verified, runnable Android application build. The steps below describe the intended setup process and should be treated as planned until an Android project, Gradle configuration, and tested build are committed.
1. Clone the Repository
git clone https://github.com/YOUR-USERNAME/pegasus-detect.git

Replace YOUR-USERNAME with your GitHub username.
2. Open the Project
Open the cloned project folder in Android Studio.
3. Configure the Android SDK
Install the SDK version required by the project configuration.
4. Build the Application
Allow Gradle to synchronize dependencies. Then build and run the application using Android Studio.
Current status: These steps are not confirmed to produce a working application until the Android project and its Gradle configuration exist in the repository and the build has been tested on a supported environment.
How It Works
The planned application follows a defensive analysis workflow:
Collect permitted device and application metadata.
Review available security information and sensitive permissions.
Compare supported evidence against documented indicators.
Record findings and their confidence level.
Generate a report explaining observations and limitations.
Recommend additional professional forensic analysis when necessary.
This workflow is not currently presented as implemented or validated.
Understanding Results
Potential results may be classified as:
No Indicator Found: The available checks did not identify a supported indicator. This does not prove the device is free from spyware.
Needs Review: An observation requires additional investigation.
Potential Indicator Detected: Evidence matches a documented indicator but requires validation.
Inconclusive: Available data is insufficient to make a reliable assessment.
These classifications are planned reporting concepts, not confirmed output from a tested release. A suspicious permission or application name alone is not proof of Pegasus infection.
Limitations
Pegasus is sophisticated spyware and may evade ordinary application scans.
Android security restrictions limit access to protected system data.
A clean scan cannot rule out spyware.
Reliable forensic conclusions may require specialist tools and validated evidence.
The project must not claim confirmed Pegasus detection without a tested, reliable detection method.
Planned features and workflows must not be described as operational until they are implemented and tested.
Privacy and Responsible Use
Analyze only devices you own or have explicit permission to examine.
Do not collect another person's messages, credentials, calls, or location without authorization.
Do not implement covert monitoring, unauthorized access, or exploit delivery.
Keep forensic reports and device identifiers private.
Obtain consent before exporting or sharing diagnostic data.
Suggested Project Structure
pegasus-detect/
├── README.md
├── LICENSE
├── .gitignore
├── docs/
│   ├── architecture.md
│   ├── detection-methodology.md
│   └── privacy.md
├── app/
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           └── java/
│               └── ...
└── tests/

This is a suggested structure, not a representation of files already implemented or tested.
Development Roadmap
The roadmap lists planned work. An item should be checked only after the related functionality has been implemented, tested, and documented. Completed items should include links to the relevant code, tests, or release notes where possible.
Create the Android application project and verify a reproducible Gradle build.
Build and test the device security overview screen.
Implement and test permitted application and permission reviews.
Document supported detection indicators, evidence sources, and validation requirements.
Add and test findings classification and evidence notes.
Create and test a privacy-conscious report feature.
Test supported workflows on documented Android versions and authorized devices.
Document actual detection coverage, test results, and known limitations.
Independently review and validate any detection claims before describing them as reliable.
Contributing
Contributions are welcome for defensive Android security research, documentation, usability improvements, and testing.
Fork the repository.
Create a feature branch.
Make and test your changes.
Submit a pull request describing the change and its security impact.
Clearly identify whether the contribution is planned, implemented, or tested, and include supporting evidence where applicable.
Disclaimer
Pegasus Detect is intended for defensive cybersecurity education and authorized mobile security research. The project is not affiliated with NSO Group and does not imply endorsement by any government agency.
No spyware detection capability should be considered reliable until it has been implemented, tested, and independently validated.
License
Choose an appropriate open-source license before distributing the project. For example, the MIT License permits broad reuse subject to its terms. Add the complete license text to a LICENSE file before claiming that the project is MIT-licensed.
