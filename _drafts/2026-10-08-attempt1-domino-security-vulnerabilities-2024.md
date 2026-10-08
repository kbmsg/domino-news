---
title: "Recent Security Vulnerabilities in HCL Domino: What You Need to Know"
description: "A rundown of recent security vulnerabilities affecting HCL Domino servers, their implications, and recommended actions for administrators."
pubDate: "2026-10-08T19:52:11+08:00"
slug: "domino-security-vulnerabilities-2024"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "HCL Domino Security Vulnerabilities in 2026"
    url: "https://stack.watch/product/hcltech/domino/"
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
  - At least one source should come from a trusted Domino-related host. Got: https://stack.watch/product/hcltech/domino/, https://cvefeed.io/vuln/detail/CVE-2024-23562, https://securityvulnerability.io/vulnerability/CVE-2024-30130
attempt: 1
slug: domino-security-vulnerabilities-2024
-->

## Recent Security Vulnerabilities in HCL Domino: What You Need to Know

As Domino administrators, staying ahead of security vulnerabilities is part of the job. Here's a rundown of some recent issues that have surfaced, their potential impacts, and what you can do about them.

### CVE-2024-23562: Information Disclosure Vulnerability

**What it is:**

This vulnerability allows remote, unauthenticated attackers to access sensitive configuration information on your Domino server. Essentially, someone could gather details that might help them plan further attacks.

**Affected versions:**

- Domino 11.0
- Domino 12.0
- Domino 14.0

**What to do:**

HCL has acknowledged the issue and is reassessing it. Keep an eye on their [support page](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0116923) for updates. In the meantime, review your server configurations and ensure that only necessary information is exposed.

### CVE-2024-30130: Cache Vulnerability in HCL Nomad Server on Domino

**What it is:**

The Nomad server on Domino has a cache issue that could let attackers access sensitive information. If exploited, this could lead to unauthorized data exposure.

**Affected versions:**

- Nomad server on Domino versions prior to 1.0.12

**What to do:**

Upgrade your Nomad server to version 1.0.12 or later. Details are available in HCL's [support article](https://support.hcltechsw.com/csm?id=kb_article&sysparm_article=KB0115504). Also, consider reviewing your cache settings and implementing stricter controls if necessary.

### CVE-2024-30128: Open Proxy Vulnerability in HCL Nomad Server on Domino

**What it is:**

An open proxy vulnerability in the Nomad server allows unauthenticated attackers to mask their original IP addresses. This can be used to trick users into exposing sensitive information.

**Affected versions:**

- Nomad server on Domino versions up to 1.0.12

**What to do:**

Update to Nomad server version 1.0.13 or later. More information can be found in HCL's [support documentation](https://support.hcltechsw.com/csm?id=kb_article&sysparm_article=KB0115504). Additionally, monitor your server logs for unusual proxy activity and consider implementing IP filtering.

### CVE-2023-28010: Server Configuration Information Disclosure

**What it is:**

In certain configurations, Domino servers may inadvertently expose their hostnames. This information could be used by attackers to target your server more effectively.

**Affected versions:**

- Versions prior to 12.0.2 Fix Pack 2

**What to do:**

Ensure your server is updated to at least version 12.0.2 Fix Pack 2. Review your server's configuration settings to minimize exposed information. More details are available [here](https://vulners.com/cnnvd/CNNVD-202309-672).

## To Review

Security is an ongoing process. Regularly updating your Domino servers and associated components is crucial. Stay informed by subscribing to HCL's security advisories and reviewing your server configurations periodically. Remember, the best defense is a proactive approach.
