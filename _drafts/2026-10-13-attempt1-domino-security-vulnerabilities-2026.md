---
title: "Recent Security Vulnerabilities in HCL Domino: What You Need to Know"
description: "A rundown of recent security vulnerabilities affecting HCL Domino servers and practical steps for administrators to mitigate risks."
pubDate: "2026-10-13T20:32:37+08:00"
slug: "domino-security-vulnerabilities-2026"
tags:
  - "Domino Server"
  - "Security"
  - "News"
sources:
  - title: "Security Bulletin: A Denial of Service (DoS) Vulnerability in XStream affects HCL Domino (CVE-2022-40151)"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542"
  - title: "CVE-2025-62328: Content-Security-Policy Misconfiguration in HCL Domino's Nomad Server"
    url: "https://securityvulnerability.io/vulnerability/CVE-2025-62328"
  - title: "HCL Domino vulnerabilities - CVE.report"
    url: "https://cve.report/software/HCL_Software/HCL_Domino"
  - title: "CYONE Security Blog about HCL Software"
    url: "https://update.cyone.lv/security.nsf/archive?cat=Domino&openview=&title=Domino&type=cat"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 3 critical fact issue(s)
attempt: 1
slug: domino-security-vulnerabilities-2026
topicOverlap: false
issues:
  [critical] CVE-2025-62328 — Nomad Server versions before 1.0.19
      problem: Nomad Server versioning does not follow a 1.x scheme aligned with that description. HCL Nomad Server for Domino versioning tracks Domino major releases (e.g., 1.0.x tied to Domino 12, 14.x for Domino 14). A version '1.0.19' is not a recognized Nomad Server release milestone, and CVE-2025-62328 with a 2025 CVE ID is either very recent or fabricated — the cited source (securityvulnerability.io) is a third-party aggregator, not an authoritative HCL source. Admins acting on this could apply a wrong or nonexistent patch. The specific fix version must be verified against an official HCL security bulletin before publishing.
      fix:     Verify CVE-2025-62328 exists in the official HCL security advisories (support.hcl-software.com) and confirm the exact affected/fixed Nomad Server version string from that source. Replace the third-party aggregator citation with the official HCL KB article.
  [critical] Stack Buffer Overflow — 'remote unauthenticated attackers … execute arbitrary code'
      problem: The article claims CVE-2022-44750, CVE-2022-44752, and CVE-2022-44754 allow remote unauthenticated code execution. KeyView vulnerabilities in the Domino context are typically triggered during file attachment processing, which generally requires an authenticated session or at minimum delivery of a crafted email — the attack surface and authentication requirement must be accurately stated. Overstating the threat (unauthenticated RCE) could cause unnecessary panic or, conversely, cause admins to dismiss it as exaggerated. The affected version information is also left blank ('Specific versions not detailed; check your environment'), which is not actionable.
      fix:     Look up the official HCL security bulletins for these CVEs to confirm exact authentication requirements, attack vectors, and affected/fixed version numbers, then replace the vague language and missing version data with accurate specifics.
  [critical] fourth cited URL — https://update.cyone.lv/security.nsf/archive?cat=Domino&openview=&title=Domino&type=cat
      problem: This URL (cyone.lv domain) is not referenced in the article body but appears in the cited sources list. The domain is completely unrecognized in the Domino security advisory ecosystem and looks fabricated or at minimum highly suspicious. Any reader who follows it could land on a third-party or potentially malicious site believing it is authoritative.
      fix:     Remove this URL entirely. All security vulnerability sources should point to support.hcl-software.com, HCL's official product security page, or the NIST NVD.
  [major] CVE-2022-40151 — 'No workarounds are available, so patching is essential'
      problem: Stating categorically that no workarounds exist without citing the actual HCL advisory is risky. HCL advisories for XPages-related DoS issues sometimes include interim mitigations (e.g., disabling specific XPages functionality, restricting network access to the HTTP task). Telling admins there are zero options other than patching may cause them to defer action on production servers when a temporary mitigation could reduce risk while a maintenance window is scheduled.
      fix:     Check the linked KB article (KB0106542) for any documented workarounds or mitigations and include them. If the advisory truly states none exist, quote that directly.
  [major] CVE-2022-38654 — 'Specific versions not detailed; check your environment'
      problem: Publishing a vulnerability article aimed at production administrators without specifying affected versions is not actionable and could cause admins either to ignore a real risk or to apply unnecessary patches. This is a 2022 CVE and HCL will have issued a bulletin with specific version information.
      fix:     Research the HCL security bulletin for CVE-2022-38654 and insert the exact affected and fixed version strings before publishing.
  [major] Stack Buffer Overflow — 'Specific versions not detailed; check your environment'
      problem: Same problem as CVE-2022-38654: three separate CVEs (CVE-2022-44750, CVE-2022-44752, CVE-2022-44754) are grouped together with no version information. Admins cannot make a patch-or-not decision without this data.
      fix:     Look up each CVE in the HCL support portal and list the specific affected versions and fix packs for each one individually.
  [major] Article as a whole — mixing 2022 CVEs with a 2025 CVE
      problem: Three of the four vulnerabilities (CVE-2022-38654, CVE-2022-40151, CVE-2022-44750/52/54) are from 2022 — roughly three years old. Presenting them alongside a 2025 CVE under a headline of 'Recent Security Vulnerabilities' without acknowledging their age is misleading. Readers may have already patched these and lose trust in the article, or conversely may think patching them is newly urgent.
      fix:     Either restrict the article to genuinely recent CVEs, or clearly label each entry with its disclosure year and note that the 2022 items are included for completeness for environments that may not have applied those fix packs.
  [minor] Section header 'To Review'
      problem: 'To Review' is an unusual heading for a conclusion section and may confuse readers into thinking it is a checklist to act on during review, rather than a summary.
      fix:     Rename to 'Summary' or 'Conclusion'.
  [minor] cve.report citation used for multiple CVEs
      problem: cve.report is a third-party aggregator. Using it as the sole citation for multiple vulnerabilities (CVE-2022-38654 and the KeyView CVEs) rather than the official HCL security bulletins reduces credibility and may point admins to incomplete or slightly inaccurate data.
      fix:     Replace cve.report links with direct links to the corresponding HCL support KB articles for each CVE.
-->

## Recent Security Vulnerabilities in HCL Domino: What You Need to Know

As Domino administrators, staying ahead of security vulnerabilities is part of the job. Here's a rundown of some recent issues that have surfaced and what you can do about them.

### Denial of Service (DoS) Vulnerability in XStream (CVE-2022-40151)

**What's the issue?**

A DoS vulnerability in XStream affects HCL Domino's XPages. Attackers can exploit this to crash the application by causing a stack overflow.

**Affected Versions:**

- **Version 12:** Before 12.0.2 FixPack 1
- **Version 11:** Before 11.0.1 FixPack 7
- **Version 10:** Before 10.0.1 FixPack 8 Interim Fix 2
- **Version 9:** Before 9.0.1 FixPack 10 Interim Fix 11

**What to do:**

Upgrade to the latest fix packs as listed above. No workarounds are available, so patching is essential. [Source](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542)

### Content-Security-Policy Misconfiguration in Nomad Server (CVE-2025-62328)

**What's the issue?**

The Nomad Server on Domino has a default misconfiguration in its Content-Security-Policy header, missing the `frame-ancestors` directive. This oversight can expose sensitive information through various vectors.

**Affected Versions:**

- Nomad Server on Domino versions before 1.0.19

**What to do:**

Update to Nomad Server version 1.0.19 or later to address this vulnerability. [Source](https://securityvulnerability.io/vulnerability/CVE-2025-62328)

### Information Disclosure via xACL Directory Search Bypass (CVE-2022-38654)

**What's the issue?**

In certain scenarios, local calls made on the server to search the Domino directory ignore xACL read restrictions. This could allow authenticated attackers to access attributes from a user's person record.

**Affected Versions:**

- Specific versions not detailed; check your environment.

**What to do:**

Review and apply the latest patches provided by HCL to mitigate this issue. [Source](https://cve.report/software/HCL_Software/HCL_Domino)

### Stack Buffer Overflow Vulnerabilities in KeyView Components (CVE-2022-44750, CVE-2022-44752, CVE-2022-44754)

**What's the issue?**

HCL Domino is susceptible to stack-based buffer overflow vulnerabilities in KeyView components (`lasr.dll` and `wp6sr.dll`). These could allow remote unauthenticated attackers to crash the application or execute arbitrary code via crafted files.

**Affected Versions:**

- Specific versions not detailed; check your environment.

**What to do:**

Apply the latest security updates from HCL to address these vulnerabilities. [Source](https://cve.report/software/HCL_Software/HCL_Domino)

## To Review

Staying on top of these vulnerabilities is crucial. Regularly check for updates and apply patches promptly. If you're running affected versions, prioritize upgrading to the latest fix packs. Always monitor official HCL communications for the most current information.

Remember, keeping your Domino environment secure isn't just about applying patches—it's about staying informed and proactive.
