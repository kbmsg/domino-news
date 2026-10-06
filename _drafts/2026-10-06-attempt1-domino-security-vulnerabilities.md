---
title: "Addressing Recent Security Vulnerabilities in HCL Domino"
description: "A rundown of recent security vulnerabilities in HCL Domino and practical steps to mitigate them."
pubDate: "2026-10-06T19:53:03+08:00"
slug: "domino-security-vulnerabilities"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "CVE-2023-28010 HCL Domino Server Configuration Information Disclosure"
    url: "https://vuldb.com/es/vuln/239277"
  - title: "CVE-2024-23562 - HCL Domino is susceptible to an information disclosure vulnerability"
    url: "https://cvefeed.io/vuln/detail/CVE-2024-23562"
  - title: "CVE-2024-30130 - Cache Vulnerability Threatens Sensitive Information in HCL Nomad server on Domino"
    url: "https://securityvulnerability.io/vulnerability/CVE-2024-30130"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - At least one source should come from a trusted Domino-related host. Got: https://vuldb.com/es/vuln/239277, https://cvefeed.io/vuln/detail/CVE-2024-23562, https://securityvulnerability.io/vulnerability/CVE-2024-30130
attempt: 1
slug: domino-security-vulnerabilities
-->

## Addressing Recent Security Vulnerabilities in HCL Domino

As Domino administrators, staying ahead of security vulnerabilities is part of the job. Let's dive into some recent issues and how to tackle them.

### CVE-2023-28010: Server Configuration Information Disclosure

**The Issue:**

In certain configurations, Domino servers might inadvertently expose their hostnames. This could give attackers a foothold for future exploits. ([vuldb.com](https://vuldb.com/es/vuln/239277?utm_source=openai))

**Affected Versions:**

- HCL Domino versions prior to 12.0.2 Fix Pack 2.

**Mitigation Steps:**

1. **Update Your Server:**

   - Apply the latest Fix Pack. HCL has addressed this in 12.0.2 FP2. ([support.hcl-software.com](https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928&utm_source=openai))

2. **Review Server Configurations:**

   - Ensure that server configurations don't inadvertently expose sensitive information.

### CVE-2024-23562: Information Disclosure Vulnerability

**The Issue:**

A vulnerability in HCL Domino could allow unauthorized disclosure of sensitive configuration details. ([cvefeed.io](https://cvefeed.io/vuln/detail/CVE-2024-23562?utm_source=openai))

**Affected Versions:**

- HCL Domino versions 11.0, 12.0, and 14.0.

**Mitigation Steps:**

1. **Apply Patches:**

   - HCL has released patches addressing this vulnerability. Ensure your servers are updated.

2. **Monitor for Unusual Activity:**

   - Keep an eye on server logs for any unauthorized access attempts.

### CVE-2024-30130: Cache Vulnerability in HCL Nomad Server on Domino

**The Issue:**

The Nomad server on Domino has a cache vulnerability that could expose sensitive information. ([securityvulnerability.io](https://securityvulnerability.io/vulnerability/CVE-2024-30130?utm_source=openai))

**Affected Versions:**

- HCL Nomad server on Domino versions prior to 1.0.12.

**Mitigation Steps:**

1. **Update Nomad Server:**

   - Upgrade to version 1.0.12 or later.

2. **Review Cache Settings:**

   - Ensure that cache configurations are set to minimize exposure of sensitive data.

## To Review

Security is a moving target. Regularly updating your HCL Domino servers and associated components is crucial. Always monitor official HCL advisories and community forums for the latest information. Stay vigilant and proactive to keep your systems secure.
