---
title: "Addressing Weak Password Hashing in HCL Domino"
description: "A critical look at the weak password hashing vulnerability in HCL Domino and steps to mitigate the risk."
pubDate: "2026-10-10T19:02:02+08:00"
slug: "domino-weak-password-hashing"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "CVE-2023-37495: HCL Domino is susceptible to a weak cryptography vulnerability"
    url: "https://secalerts.co/vulnerability/CVE-2023-37495"
  - title: "CVE-2023-37495 · Medium · VYPR"
    url: "https://portal.vyprsec.ai/cves/CVE-2023-37495"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - At least one source should come from a trusted Domino-related host. Got: https://secalerts.co/vulnerability/CVE-2023-37495, https://portal.vyprsec.ai/cves/CVE-2023-37495
attempt: 1
slug: domino-weak-password-hashing
-->

## The Issue at Hand

If you're managing an HCL Domino environment, there's a security concern you need to address. A vulnerability, identified as CVE-2023-37495, exposes a weakness in how internet passwords are hashed in Person documents within the Domino Directory. Specifically, when you add a person using the "Add Person" action in the Domino Administrator, the system employs a cryptographically weak hash algorithm. This flaw could allow attackers with access to the hashed values to determine user passwords through brute-force attacks. Notably, this issue doesn't affect Person documents created via user registration. ([secalerts.co](https://secalerts.co/vulnerability/CVE-2023-37495?utm_source=openai))

## Affected Versions

This vulnerability impacts HCL Domino versions from 9.0 up to, but not including, 14.0. ([secalerts.co](https://secalerts.co/vulnerability/CVE-2023-37495?utm_source=openai))

## Mitigation Steps

To safeguard your environment:

1. **Avoid Using the "Add Person" Action**: Until HCL releases a patch, refrain from adding users through the "Add Person" action in the Domino Administrator. Instead, utilize the user registration process, which doesn't have this hashing issue.

2. **Monitor for Patches**: Keep an eye on HCL's official channels for updates or patches addressing this vulnerability. Applying the latest fixes promptly is crucial.

3. **Educate Your Team**: Ensure that all administrators are aware of this vulnerability and the recommended workaround to prevent inadvertent use of the compromised method.

## The Outcome

By proactively adjusting your user addition processes and staying vigilant for updates, you can mitigate the risks associated with this vulnerability. Always prioritize security best practices to maintain the integrity of your Domino environment.
