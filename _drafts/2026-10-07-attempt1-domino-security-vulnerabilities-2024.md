---
title: "Addressing Recent Security Vulnerabilities in HCL Domino"
description: "A rundown of recent security vulnerabilities in HCL Domino and Nomad servers, with actionable steps for administrators to mitigate risks."
pubDate: "2026-10-07T19:38:02+08:00"
slug: "domino-security-vulnerabilities-2024"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "CVE-2024-23562: HCL Domino is susceptible to an information disclosure vulnerability"
    url: "https://secalerts.co/vulnerability/CVE-2024-23562"
  - title: "CVE-2024-30130: Cache Vulnerability Threatens Sensitive Information in HCL Nomad server on Domino"
    url: "https://securityvulnerability.io/vulnerability/CVE-2024-30130"
  - title: "CVE-2024-30128: HCL Nomad Server on Domino Source IP Address escalada de privilegios"
    url: "https://vuldb.com/es/vuln/278473"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - At least one source should come from a trusted Domino-related host. Got: https://secalerts.co/vulnerability/CVE-2024-23562, https://securityvulnerability.io/vulnerability/CVE-2024-30130, https://vuldb.com/es/vuln/278473
attempt: 1
slug: domino-security-vulnerabilities-2024
-->

## Recent Security Vulnerabilities in HCL Domino and Nomad Servers

As Domino administrators, staying ahead of security vulnerabilities is part of the job. Recently, several issues have come to light that require our immediate attention. Here's a breakdown of the most pressing vulnerabilities and what you can do about them.

### CVE-2024-23562: Information Disclosure in HCL Domino

**What's the issue?**

A security flaw in HCL Domino could allow unauthorized disclosure of sensitive configuration information. An unauthenticated remote attacker might exploit this to gather intel for further attacks. This affects versions 11.0, 12.0, and 14.0. ([secalerts.co](https://secalerts.co/vulnerability/CVE-2024-23562?utm_source=openai))

**What should you do?**

HCL hasn't released a fix yet. In the meantime:

- **Review your configurations**: Ensure that sensitive information isn't unnecessarily exposed.
- **Monitor access logs**: Keep an eye out for unusual access patterns that might indicate exploitation attempts.

### CVE-2024-30130: Cache Vulnerability in HCL Nomad Server on Domino

**What's the issue?**

The Nomad server on Domino has a cache vulnerability that could expose sensitive information. This affects versions prior to 1.0.12. ([securityvulnerability.io](https://securityvulnerability.io/vulnerability/CVE-2024-30130?utm_source=openai))

**What should you do?**

- **Update immediately**: Upgrade to Nomad server version 1.0.12 or later.
- **Clear existing caches**: After updating, clear any existing caches to remove potentially exposed data.

### CVE-2024-30128: Source IP Address Privilege Escalation in HCL Nomad Server on Domino

**What's the issue?**

An open proxy vulnerability in the Nomad server allows unauthenticated attackers to mask their original IP addresses. This can lead to privilege escalation and potential exposure of sensitive information. Versions up to 1.0.12 are affected. ([vuldb.com](https://vuldb.com/es/vuln/278473?utm_source=openai))

**What should you do?**

- **Update immediately**: Upgrade to Nomad server version 1.0.12 or later.
- **Restrict proxy usage**: Implement strict controls on proxy configurations to prevent unauthorized use.

## To Review

Security is a moving target, and these vulnerabilities highlight the importance of staying vigilant. Regularly updating your systems, reviewing configurations, and monitoring logs are essential practices. While waiting for official patches, proactive measures can significantly reduce risk. Stay informed and keep your systems secure.
