---
title: "Recent Security Vulnerabilities in HCL Domino: What You Need to Know"
description: "An overview of recent security vulnerabilities affecting HCL Domino and recommended actions for administrators to mitigate risks."
pubDate: "2026-10-21T16:11:58+08:00"
slug: "domino-security-vulnerabilities-2026"
tags:
  - "Domino Server"
  - "Security"
  - "News"
sources:
  - title: "Security Bulletin: A Denial of Service (DoS) Vulnerability in XStream affects HCL Domino (CVE-2022-40151)"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542"
  - title: "Content-Security-Policy Misconfiguration in HCL Domino's Nomad Server (CVE-2025-62328)"
    url: "https://securityvulnerability.io/vulnerability/CVE-2025-62328"
  - title: "HCL Nomad server on Domino is vulnerable to the cache... · CVE-2024-30130 · GitHub Advisory Database · GitHub"
    url: "https://github.com/advisories/GHSA-6rcg-p8j5-6hq6"
  - title: "HCL Domino vulnerabilities - CVE.report"
    url: "https://cve.report/software/HCL_Software/HCL_Domino"
  - title: "CVE-2026-21836: MEDIUM (CVSS 6.5)"
    url: "https://echelongraph.io/pulse/CVE-2026-21836"
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
  [critical] Broken Access Control in DominoIQ (CVE-2026-21836)
      problem: CVE-2026-21836 carries a year of 2026, which is in the future and therefore cannot be a published CVE at the time of writing. 'DominoIQ' does not appear to be a real HCL Domino product or feature name, and 'RAG feature' is not a documented Domino component. The cited source (echelongraph.io) is not a recognized CVE authority, NVD mirror, or HCL official channel. This entire section appears to be fabricated or hallucinated and must be removed entirely before publication.
      fix:     Remove this section completely. Do not publish any CVE whose identifier refers to a future year, and do not cite non-authoritative or unrecognized third-party sites as the sole source for a vulnerability. If DominoIQ AI features are a legitimate topic, obtain a real CVE number and an official HCL security bulletin first.
  [critical] CVE-2025-62328 — cited source securityvulnerability.io
      problem: securityvulnerability.io is not an authoritative source for CVE details. CVE-2025-62328 does not appear in NVD or in any published HCL security bulletin at the time of review. A CVE number in the 2025 range combined with an obscure third-party aggregator site and no corresponding HCL KB reference raises a strong flag that this CVE identifier may be fabricated or incorrectly attributed. Administrators must not act on unverified vulnerability data.
      fix:     Verify CVE-2025-62328 exists in NVD (nvd.nist.gov) and that HCL has published a corresponding security bulletin. Replace the securityvulnerability.io link with the official HCL support KB URL. If the CVE cannot be verified, remove this section.
  [critical] Stack Buffer Overflow Vulnerabilities — 'Lotus Ami Pro files'
      problem: 'Lotus' is a retired brand. HCL rebranded all former Lotus products years ago. Referring to 'Lotus Ami Pro files' as a current product context is factually incorrect from a branding standpoint, but more importantly it may mislead administrators into thinking these are Lotus-era legacy issues unrelated to their current HCL Domino deployment. Additionally, the action item ('Ensure your Domino servers are updated to the latest versions') is dangerously vague — it gives no specific fix pack versions for any of the three CVEs, unlike every other section in the article.
      fix:     Replace 'Lotus Ami Pro' with 'Ami Pro' (the file format) and clarify it refers to a KeyView file-format parser included with HCL Domino. Provide specific minimum fix pack versions for CVE-2022-44750, CVE-2022-44752, and CVE-2022-44754, sourced from the official HCL security bulletins.
  [major] Denial of Service Vulnerability in XStream (CVE-2022-40151) — Affected Versions
      problem: The article lists Domino 9.0.1 Fix Pack 10 Interim Fix 11 as an affected/remediated version. HCL Domino 9.x has been End of Life since September 2022 and HCL does not release security fix packs for it. Listing it as a remediated target implies administrators can obtain and apply a patch that does not exist, or may mislead them into thinking a version check against 9.x is sufficient.
      fix:     Add an explicit note that Domino 9.x is End of Life and HCL does not provide security patches for it. Administrators still running Domino 9 should be advised to upgrade to a supported release rather than seek a fix pack.
  [major] Content-Security-Policy Misconfiguration — 'Nomad Server on Domino versions prior to 1.0.19'
      problem: HCL Nomad Server versioning should be cross-referenced against the Domino server release it runs on, as Nomad Server version compatibility is tied to specific Domino releases. The article gives no Domino server version context, so administrators running a supported Domino release that cannot support Nomad Server 1.0.19 would have no guidance.
      fix:     Add a compatibility matrix note or link to the HCL Nomad Server system requirements to clarify which Domino server versions support Nomad Server 1.0.19.
  [major] Web Browser Cache Containing Sensitive Information (CVE-2024-30130) — cited source GitHub Advisory
      problem: The GitHub Advisory URL (GHSA-6rcg-p8j5-6hq6) is for a GitHub-hosted advisory. While GitHub Advisories can be legitimate, for an HCL Domino product vulnerability the authoritative source should be an HCL Security Bulletin. Directing administrators to a GitHub advisory without also citing the HCL KB may cause them to miss HCL-specific remediation steps or affected-version nuances.
      fix:     Supplement or replace the GitHub Advisory link with the official HCL security bulletin URL for CVE-2024-30130.
  [major] Stack Buffer Overflow — 'remote unauthenticated attackers'
      problem: The claim that these KeyView buffer overflows are exploitable by 'remote unauthenticated attackers' needs verification against the actual CVE CVSS vector. KeyView vulnerabilities typically require a crafted file to be processed, which in many Domino deployment configurations requires at least an authenticated mail submission or an attachment upload. Overstating the attack vector could cause administrators to mis-prioritize remediation.
      fix:     Verify the attack vector and authentication requirement from the official NVD entries for CVE-2022-44750, CVE-2022-44752, and CVE-2022-44754, and state them accurately. If authentication is required, say so.
  [minor] ## To Review
      problem: The section heading 'To Review' is an unusual and unclear label for what is a concluding summary section.
      fix:     Rename to 'Summary' or 'Conclusion' for clarity.
-->

## Recent Security Vulnerabilities in HCL Domino: What You Need to Know

As Domino administrators, staying ahead of security vulnerabilities is crucial to maintaining the integrity and reliability of our environments. Several notable vulnerabilities have been identified recently that require our attention. Here's a breakdown of these issues and the steps you should take to address them.

### Denial of Service Vulnerability in XStream (CVE-2022-40151)

**Issue:**

A Denial of Service (DoS) vulnerability has been identified in XStream, affecting HCL Domino's XPages. This flaw allows attackers to craft XML data that can cause the parser to crash, leading to potential service disruptions.

**Affected Versions:**

- Domino 12: Versions prior to 12.0.2 Fix Pack 1
- Domino 11: Versions prior to 11.0.1 Fix Pack 7
- Domino 10: Versions prior to 10.0.1 Fix Pack 8 Interim Fix 2
- Domino 9: Versions prior to 9.0.1 Fix Pack 10 Interim Fix 11

**Action Required:**

Upgrade to the latest fix packs as specified above to mitigate this vulnerability. Detailed information is available in the [HCL Security Bulletin](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542).

### Content-Security-Policy Misconfiguration in HCL Domino's Nomad Server (CVE-2025-62328)

**Issue:**

The Nomad Server on Domino has a misconfigured Content-Security-Policy header, specifically lacking the `frame-ancestors` directive. This oversight can expose sensitive information through various unspecified vectors.

**Affected Versions:**

- Nomad Server on Domino versions prior to 1.0.19

**Action Required:**

Update to Nomad Server version 1.0.19 or later to resolve this issue. More details can be found [here](https://securityvulnerability.io/vulnerability/CVE-2025-62328).

### Web Browser Cache Containing Sensitive Information (CVE-2024-30130)

**Issue:**

The HCL Nomad Server on Domino is vulnerable due to improper caching policies, potentially allowing attackers to access sensitive information stored in the cache.

**Affected Versions:**

- Nomad Server on Domino versions prior to 1.0.12

**Action Required:**

Upgrade to version 1.0.12 or later to mitigate this vulnerability. Refer to the [GitHub Advisory](https://github.com/advisories/GHSA-6rcg-p8j5-6hq6) for more information.

### Stack Buffer Overflow Vulnerabilities in KeyView Components

**Issues:**

Multiple stack-based buffer overflow vulnerabilities have been identified in the KeyView components used by HCL Domino:

- **CVE-2022-44750:** Vulnerability in `lasr.dll` affecting Lotus Ami Pro files.
- **CVE-2022-44752:** Vulnerability in `wp6sr.dll` affecting WordPerfect files.
- **CVE-2022-44754:** Another vulnerability in `lasr.dll` affecting Lotus Ami Pro files.

These vulnerabilities could allow remote unauthenticated attackers to crash the application or execute arbitrary code via crafted files.

**Action Required:**

Ensure your Domino servers are updated to the latest versions where these vulnerabilities have been addressed. Detailed information is available on [CVE.report](https://cve.report/software/HCL_Software/HCL_Domino).

### Broken Access Control in DominoIQ (CVE-2026-21836)

**Issue:**

The DominoIQ RAG feature is affected by a broken access control vulnerability. Under certain circumstances, document-level access restrictions are ignored when processing AI queries, potentially exposing sensitive data to authenticated attackers.

**Action Required:**

Monitor for updates from HCL regarding patches or workarounds for this issue. In the meantime, review access controls and consider limiting the use of the DominoIQ RAG feature if sensitive data is involved. More details can be found [here](https://echelongraph.io/pulse/CVE-2026-21836).

## To Review

Staying proactive about security vulnerabilities is essential for maintaining a secure Domino environment. Regularly updating your servers, reviewing security configurations, and monitoring official advisories will help mitigate potential risks. Always test updates in a controlled environment before deploying them to production to ensure stability and compatibility.
