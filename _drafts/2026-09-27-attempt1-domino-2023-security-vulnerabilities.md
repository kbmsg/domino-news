---
title: "Addressing Recent Security Vulnerabilities in HCL Domino"
description: "A rundown of recent security vulnerabilities in HCL Domino, their implications, and steps to mitigate risks in your environment."
pubDate: "2026-09-27T18:25:56+08:00"
slug: "domino-2023-security-vulnerabilities"
tags:
  - "Domino Server"
  - "Security"
  - "News"
sources:
  - title: "HCL Domino Security Vulnerability - vulnerability database | Vulners.com"
    url: "https://vulners.com/cnnvd/CNNVD-202309-672"
  - title: "CVE-2023-37495 - HCL Domino is susceptible to a weak cryptography vulnerability"
    url: "https://cvefeed.io/vuln/detail/CVE-2023-37495"
  - title: "CVE-2023-28015 - HCL Domino AppDev Pack is susceptible to a User Account Enumeration vulnerability"
    url: "https://cvefeed.io/vuln/detail/CVE-2023-28015"
  - title: "CVE-2023-37539 : HCL Domino Catalog template is susceptible to a Stored Cross-Site Scripting (XSS) vulnerability"
    url: "https://securityvulnerability.io/vulnerability/CVE-2023-37539"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - At least one source should come from a trusted Domino-related host. Got: https://vulners.com/cnnvd/CNNVD-202309-672, https://cvefeed.io/vuln/detail/CVE-2023-37495, https://cvefeed.io/vuln/detail/CVE-2023-28015, https://securityvulnerability.io/vulnerability/CVE-2023-37539
attempt: 1
slug: domino-2023-security-vulnerabilities
-->

## Recent Security Vulnerabilities in HCL Domino

As Domino administrators, staying ahead of security threats is part of the job. Over the past year, several vulnerabilities have been identified in HCL Domino that require our attention. Here's a breakdown of the key issues and how to address them.

### 1. Hostname Exposure Vulnerability (CVE-2023-28010)

**Issue:**
In certain configurations, Domino servers can inadvertently expose their hostnames. This information could be leveraged by attackers to plan targeted assaults on your infrastructure.

**Impact:**
While the exposure of a hostname might seem minor, it can provide attackers with valuable information about your network topology, potentially aiding in more sophisticated attacks.

**Mitigation:**
Ensure your server configurations do not disclose sensitive information. Regularly review and audit your server settings to prevent unintended data exposure. For more details, refer to the [Vulners database entry](https://vulners.com/cnnvd/CNNVD-202309-672).

### 2. Weak Cryptography in Internet Passwords (CVE-2023-37495)

**Issue:**
Internet passwords stored in Person documents within the Domino Directory, when created using the "Add Person" action in the Domino Administrator, are secured using a weak hash algorithm. This vulnerability could allow attackers with access to the hashed values to determine user passwords through brute-force attacks.

**Impact:**
Compromised user passwords can lead to unauthorized access, data breaches, and potential compliance violations.

**Mitigation:**
- **Upgrade:** Ensure your Domino servers are updated to the latest version where this vulnerability is addressed.
- **User Registration:** Utilize the user registration process for creating Person documents, as it employs stronger cryptographic methods. More information is available in the [CVE details](https://cvefeed.io/vuln/detail/CVE-2023-37495).

### 3. User Account Enumeration in AppDev Pack (CVE-2023-28015)

**Issue:**
The IAM service in the HCL Domino AppDev Pack is susceptible to user account enumeration. During failed login attempts, differing error messages can allow attackers to determine the validity of usernames, facilitating targeted brute-force attacks.

**Impact:**
Attackers can focus their efforts on valid user accounts, increasing the likelihood of successful unauthorized access.

**Mitigation:**
- **Update:** Apply the latest patches to the AppDev Pack to resolve this issue.
- **Uniform Error Messages:** Configure your authentication mechanisms to provide consistent error messages regardless of the validity of the username. Detailed information can be found in the [CVE report](https://cvefeed.io/vuln/detail/CVE-2023-28015).

### 4. Stored Cross-Site Scripting (XSS) in Catalog Template (CVE-2023-37539)

**Issue:**
The Domino Catalog template contains a stored XSS vulnerability. Attackers with document editing permissions can embed malicious scripts that execute when other users interact with the compromised documents.

**Impact:**
Exploitation can lead to unauthorized actions on behalf of users, data theft, and potential spread of malware within your organization.

**Mitigation:**
- **Patch:** Update to the latest version of the Domino Catalog template where this vulnerability is fixed.
- **Access Controls:** Restrict document editing permissions to trusted users only.
- **Input Validation:** Implement strict input validation to prevent script injection. Further details are available in the [security advisory](https://securityvulnerability.io/vulnerability/CVE-2023-37539).

## To Review

Staying vigilant and proactive is crucial in maintaining the security of your Domino environment. Regularly updating your servers, reviewing configurations, and implementing robust access controls can mitigate these vulnerabilities. Always refer to official HCL advisories and trusted security sources for the latest information and guidance.
