---
title: "Recent Security Vulnerabilities in HCL Domino: What You Need to Know"
description: "An overview of recent security vulnerabilities affecting HCL Domino and recommended actions for administrators."
pubDate: "2026-10-21T17:55:19+08:00"
slug: "domino-security-vulnerabilities-2026"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "Security Bulletin: A Denial of Service (DoS) Vulnerability in XStream affects HCL Domino (CVE-2022-40151)"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542"
  - title: "Content-Security-Policy Misconfiguration in HCL Domino's Nomad Server (CVE-2025-62328)"
    url: "https://securityvulnerability.io/vulnerability/CVE-2025-62328"
  - title: "HCL Nomad server on Domino is vulnerable to the cache... · CVE-2024-30130 · GitHub Advisory Database · GitHub"
    url: "https://github.com/advisories/GHSA-6rcg-p8j5-6hq6"
  - title: "HCL Domino vulnerabilities - CVE.report"
    url: "https://cve.report/software/HCL_Software/HCL_Domino"
cover: "/covers/domino-security-vulnerabilities-2026.webp"
coverStyle: "ukiyo-e"
relatedConsoleCommands: []
notesIniSettings: []
---
## Recent Security Vulnerabilities in HCL Domino: What You Need to Know

As Domino administrators, staying ahead of security vulnerabilities is part of the job. Here's a rundown of some recent issues that have surfaced and what you can do about them.

### Denial of Service Vulnerability in XStream (CVE-2022-40151)

**What's the issue?**

A Denial of Service (DoS) vulnerability was identified in XStream, affecting HCL Domino's XPages. If exploited, an attacker could crash the application by causing a stack overflow through malicious XML data.

**Affected Versions:**

- Domino 12: Versions prior to 12.0.2 FixPack 1
- Domino 11: Versions prior to 11.0.1 FixPack 7
- Domino 10: Versions prior to 10.0.1 FixPack 8 Interim Fix 2
- Domino 9: Versions prior to 9.0.1 FixPack 10 Interim Fix 11

**What to do:**

Upgrade to the latest fix packs as specified above. Detailed information is available in the [HCL Security Bulletin](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542).

### Content-Security-Policy Misconfiguration in Nomad Server (CVE-2025-62328)

**What's the issue?**

The Nomad Server on Domino had a misconfigured Content-Security-Policy header, missing the `frame-ancestors` directive. This oversight could potentially expose sensitive information through unspecified vectors.

**Affected Versions:**

- Nomad Server on Domino versions prior to 1.0.19

**What to do:**

Ensure your Nomad Server is updated to version 1.0.19 or later. More details can be found [here](https://securityvulnerability.io/vulnerability/CVE-2025-62328).

### Sensitive Information in Web Browser Cache (CVE-2024-30130)

**What's the issue?**

The Nomad Server on Domino was found to store sensitive information in the web browser cache. This could allow an attacker to retrieve sensitive data under certain conditions.

**Affected Versions:**

- Nomad Server on Domino versions prior to 1.0.12

**What to do:**

Upgrade to Nomad Server version 1.0.12 or later. Refer to the [GitHub Advisory](https://github.com/advisories/GHSA-6rcg-p8j5-6hq6) for more information.

### Buffer Overflow Vulnerabilities in KeyView Components

**What's the issue?**

Multiple stack-based buffer overflow vulnerabilities were identified in KeyView components used by HCL Domino. These could allow remote unauthenticated attackers to crash the application or execute arbitrary code via crafted files.

**Specific CVEs:**

- CVE-2022-44750: Vulnerability in `lasr.dll` affecting Lotus Ami Pro files.
- CVE-2022-44752: Vulnerability in `wp6sr.dll` affecting WordPerfect files.
- CVE-2022-44754: Another vulnerability in `lasr.dll` affecting Lotus Ami Pro files.

**What to do:**

Ensure your Domino servers are updated to the latest versions where these vulnerabilities have been addressed. Detailed information is available on [CVE.report](https://cve.report/software/HCL_Software/HCL_Domino).

## To Review

Security is a moving target, and staying informed is crucial. Regularly check for updates and apply patches promptly. For detailed information on these vulnerabilities and others, refer to the official HCL Security Bulletins and trusted advisory databases.

Remember, keeping your Domino environment secure isn't just about applying patches—it's about staying vigilant and proactive.
