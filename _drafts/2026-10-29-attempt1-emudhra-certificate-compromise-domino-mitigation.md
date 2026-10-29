---
title: "Mitigating the eMudhra Certificate Compromise in HCL Domino"
description: "A critical vulnerability due to compromised eMudhra certificates affects HCL Domino servers. This article outlines immediate steps to mitigate the risk and secure your environment."
pubDate: "2026-10-29T19:22:35+08:00"
slug: "emudhra-certificate-compromise-domino-mitigation"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "Security Bulletin: eMudhra Compromised Certificate vulnerability impacts HCL Domino Server (CVE-2026-108014)"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0134742"
  - title: "What steps are required to protect HCL Notes and Domino from the eMudhra Certificate Compromise issue?"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0134844"
  - title: "CVE-2026-108014: Certificate Trust Vulnerability in HCL Domino Server by eMudhra"
    url: "https://securityvulnerability.io/vulnerability/CVE-2026-108014"
relatedConsoleCommands:
  - "..\\..\\bin\\keytool.exe -delete -alias \"cn=emsign_ecc_root_ca_-_g3,o=emudhra_technologies_limited,ou=emsign_pki,c=in\" -keystore cacerts -storepass changeit"
  - "../../bin/keytool -delete -alias \"cn=emsign_ecc_root_ca_-_g3,o=emudhra_technologies_limited,ou=emsign_pki,c=in\" -keystore cacerts -storepass changeit"
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Inline-link diversity check failed: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0134742" appears 2/3 times in inline links (>50%). Likely a copy-paste error, each anchor should point to its own destination.
attempt: 1
slug: emudhra-certificate-compromise-domino-mitigation
-->

## The Issue

If you're running HCL Domino, heads up: there's a critical security vulnerability you need to address immediately. The private keys for eight eMudhra intermediate CA certificates have been compromised. This means attackers can spoof server certificates, potentially executing man-in-the-middle (MITM) attacks on your outbound TLS connections. Not good.

**CVE-2026-108014** has been assigned to this vulnerability, carrying a CVSS Base Score of 9.1—critical. Affected versions include:

- **12.0.2 Fixpack 8 and earlier**
- **14.0 Fixpack 5 and earlier**
- **14.5 versions 14.5.1 Fixpack 1 and earlier**

For more details, check out the [official security bulletin](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0134742).

## Immediate Actions

No official fix is available yet, but you can mitigate the risk by removing the compromised certificates from your Java Virtual Machine (JVM) truststore. Here's how:

1. **Shut down your Domino server.**

2. **Navigate to the security directory:**

   - **Windows:**
     ```
     cd <Domino Program Directory>\jvm\lib\security
     ```
   - **Linux/AIX/Mac:**
     ```
     cd <Domino Program Directory>/jvm/lib/security
     ```

3. **Remove the compromised certificate:**

   - **For Domino 12.0.2 Fixpacks (Java 8):**
     - **Windows:**
       ```
       ..\..\bin\keytool.exe -delete -alias "cn=emsign_ecc_root_ca_-_g3,o=emudhra_technologies_limited,ou=emsign_pki,c=in" -keystore cacerts -storepass changeit
       ```
     - **Linux/AIX/Mac:**
       ```
       ../../bin/keytool -delete -alias "cn=emsign_ecc_root_ca_-_g3,o=emudhra_technologies_limited,ou=emsign_pki,c=in" -keystore cacerts -storepass changeit
       ```

   - **For Domino 14.0/14.5.1 Fixpacks (Java 17 or Java 21):**
     - **Windows:**
       ```
       ..\..\bin\keytool.exe -delete -alias "cn_emsign_ecc_root_ca__g3,o_emudhra_technologies_limited,ou_emsign_pki,c_in [jdk]" -cacerts
       ```
     - **Linux/AIX/Mac:**
       ```
       ../../bin/keytool -delete -alias "cn_emsign_ecc_root_ca__g3,o_emudhra_technologies_limited,ou_emsign_pki,c_in [jdk]" -cacerts
       ```

   **Note:** On older versions of 12.0.2, you might need to use this format:

   - **Windows:**
     ```
     ..\..\bin\keytool.exe -delete -alias "c = in, ou = emsign pki, o = emudhra technologies limited, cn = emsign ecc root ca - g3" -keystore cacerts -storepass changeit
     ```
   - **Linux/AIX/Mac:**
     ```
     ../../bin/keytool -delete -alias "c = in, ou = emsign pki, o = emudhra technologies limited, cn = emsign ecc root ca - g3" -keystore cacerts -storepass changeit
     ```

4. **Restart your Domino server.**

For detailed instructions, refer to [HCL's guidance](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0134844).

## Additional Considerations

- **IBM iSeries Users:** If you're running Domino on IBM iSeries, you're using the IBM JVM. You'll need to contact IBM support for patching instructions specific to your environment.

- **Certificate Store:** Domino doesn't ship the compromised CA/root certificates in `pubnames.ntf`, `pernames.ntf`, or `certstore.ntf` templates. However, if you've manually added these certifiers to your `names.nsf` or `certstore.nsf`, it's recommended to remove or replace them with other trusted certifiers.

## To Review

This vulnerability is serious, but with prompt action, you can mitigate the risk. Remove the compromised certificates from your JVM truststore and stay tuned for official patches from HCL. Regularly monitor your systems and keep your software up to date to maintain a secure environment.

For the latest updates, keep an eye on [HCL's security bulletins](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0134742).
