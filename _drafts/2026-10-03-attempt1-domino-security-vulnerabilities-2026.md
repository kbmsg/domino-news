---
title: "Recent Security Vulnerabilities in HCL Domino: What You Need to Know"
description: "An overview of recent security vulnerabilities in HCL Domino, their implications, and recommended actions for administrators to secure their environments."
pubDate: "2026-10-03T18:17:24+08:00"
slug: "domino-security-vulnerabilities-2026"
tags:
  - "Domino Server"
  - "Security"
  - "News"
sources:
  - title: "HCLSoftware Launches Sovereign AI Aimed at Governments and Regulated Organizations Concerned With Their Data Privacy"
    url: "https://www.hcl-software.com/news/30-6-25-hclsoftware-launches-sovereign-ai-aimed-at-governments-and-regulated-organizations-concerned-with-their-data-privacy"
  - title: "HCL Domino Security Vulnerability - vulnerability database | Vulners.com"
    url: "https://vulners.com/cnnvd/CNNVD-202309-672"
  - title: "CVE-2023-37495 - HCL Domino is susceptible to a weak cryptography vulnerability - SecAlerts"
    url: "https://secalerts.co/vulnerability/CVE-2023-37495"
  - title: "CVE-2024-30128 : Open Proxy Vulnerability in HCL Nomad Server on Domino"
    url: "https://securityvulnerability.io/vulnerability/CVE-2024-30128"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - URL gate FAILED, 1 source URL(s) are not reachable:
  - 403 https://vulners.com/cnnvd/CNNVD-202309-672
attempt: 1
slug: domino-security-vulnerabilities-2026
-->

## Recent Security Vulnerabilities in HCL Domino: What You Need to Know

As Domino administrators, staying ahead of security vulnerabilities is crucial to maintaining the integrity and reliability of our environments. Over the past few years, several significant vulnerabilities have been identified in HCL Domino. Here's a rundown of the most notable ones and what you can do about them.

### CVE-2023-37495: Weak Cryptography in Internet Passwords

**Issue:**

Internet passwords stored in Person documents within the Domino Directory, when created using the "Add Person" action in the Domino Administrator, were secured using a cryptographically weak hash algorithm. This flaw could allow attackers with access to the hashed values to determine user passwords through brute-force attacks. Notably, this issue does not impact Person documents created through user registration. ([secalerts.co](https://secalerts.co/vulnerability/CVE-2023-37495?utm_source=openai))

**Affected Versions:**

- HCL Domino versions 9.0 through 14.0

**Recommended Action:**

- **Upgrade:** Ensure your Domino servers are updated to the latest version where this vulnerability is addressed.
- **Review Password Policies:** Regularly audit and enforce strong password policies to mitigate potential risks.

### CVE-2024-30128: Open Proxy Vulnerability in HCL Nomad Server on Domino

**Issue:**

The HCL Nomad server on Domino was found to have an open proxy vulnerability. An unauthenticated attacker could exploit this to hide their original IP address, potentially leading to the disclosure of sensitive information. ([securityvulnerability.io](https://securityvulnerability.io/vulnerability/CVE-2024-30128?utm_source=openai))

**Affected Versions:**

- HCL Nomad Server on Domino up to version 1.0.12

**Recommended Action:**

- **Patch:** Apply the latest patches provided by HCL to address this vulnerability.
- **Monitor Traffic:** Implement monitoring to detect unusual proxy usage patterns.

### CVE-2023-28010: Exposure of Sensitive Information

**Issue:**

A vulnerability in HCL Domino before version 12.0.2 Fix Pack 2 exposed server hostnames in certain configurations, potentially aiding attackers in reconnaissance efforts. ([vulners.com](https://vulners.com/cnnvd/CNNVD-202309-672?utm_source=openai))

**Affected Versions:**

- HCL Domino versions prior to 12.0.2 Fix Pack 2

**Recommended Action:**

- **Update:** Upgrade to Domino 12.0.2 Fix Pack 2 or later.
- **Configuration Review:** Regularly review server configurations to ensure sensitive information isn't inadvertently exposed.

### CVE-2023-37539: Stored Cross-Site Scripting (XSS) in Domino Catalog

**Issue:**

The Domino Catalog template was susceptible to a stored XSS vulnerability, allowing attackers to embed malicious scripts that could be triggered with a single user click. ([vulners.com](https://vulners.com/cnnvd/CNNVD-202406-570?utm_source=openai))

**Affected Versions:**

- Specific versions prior to the patch release (details in HCL advisories)

**Recommended Action:**

- **Apply Patches:** Ensure all templates are updated to the latest versions.
- **User Training:** Educate users about the risks of clicking on unknown links or attachments.

## To Review

Security is an ongoing process. Regularly updating your HCL Domino servers, reviewing configurations, and staying informed about recent vulnerabilities are essential steps in safeguarding your environment. Always refer to official HCL advisories and trusted security sources for the most current information and recommended actions.
