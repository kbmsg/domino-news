---
title: "Recent Security Vulnerabilities in HCL Domino: What You Need to Know"
description: "A rundown of recent security vulnerabilities affecting HCL Domino and Nomad Server, with actionable steps for administrators to mitigate risks."
pubDate: "2026-10-14T18:00:06+08:00"
slug: "domino-security-vulnerabilities-2026"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "Security Bulletin: A Denial of Service (DoS) Vulnerability in XStream affects HCL Domino (CVE-2022-40151)"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542"
  - title: "CVE-2025-62328: Content-Security-Policy Misconfiguration in HCL Domino's Nomad Server"
    url: "https://securityvulnerability.io/vulnerability/CVE-2025-62328"
  - title: "CVE-2024-30130: Cache Vulnerability Threatens Sensitive Information in HCL Nomad server on Domino"
    url: "https://securityvulnerability.io/vulnerability/CVE-2024-30130"
  - title: "CVE-2024-23562: HCL Domino is susceptible to an information disclosure vulnerability"
    url: "https://cvefeed.io/vuln/detail/CVE-2024-23562"
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
  [critical] CVE-2025-62328 — affected versions: 'Nomad Server on Domino versions prior to 1.0.19'
      problem: CVE-2025-62328 carries a 2025 year prefix, meaning it was assigned in 2025. Nomad Server 1.0.19 was released in 2023. It is highly implausible that a CVE assigned in 2025 would be remediated by a 2023 release. The version numbers and CVE ID are almost certainly mismatched, suggesting the article has paired a CVE identifier with the wrong vulnerability details, or the CVE ID itself is fabricated/misquoted. Publishing this could cause admins to believe they are protected when they are not.
      fix:     Verify the correct CVE ID against the official HCL security bulletin for the Nomad Server CSP/frame-ancestors issue. Cross-check the remediation version against the HCL support portal before publishing.
  [critical] CVE-2024-23562 — 'Specific versions are not detailed in the available sources'
      problem: Publishing a vulnerability advisory without specifying affected versions gives administrators no actionable way to assess their exposure. Worse, it may create false confidence in admins running an unaffected version, or cause unnecessary alarm in admins who are actually safe. A production-facing advisory must include affected version ranges.
      fix:     Look up CVE-2024-23562 in the official HCL Security Bulletin (support.hcl-software.com) and populate the exact affected versions before publishing. If this information genuinely cannot be confirmed, remove the CVE entry entirely rather than publish it with a blank version field.
  [critical] CVE-2024-23562 remediation: 'Review and apply the necessary patches as outlined in the CVE details'
      problem: The cited source (cvefeed.io) is a third-party aggregator, not an authoritative HCL source. Directing administrators to apply patches based on a third-party aggregator page — especially one that may lag or misrepresent HCL's own bulletins — is dangerous for production environments. There is no HCL KB or bulletin URL provided.
      fix:     Replace the cvefeed.io link with the direct HCL Security Bulletin URL from support.hcl-software.com for CVE-2024-23562. If no official bulletin can be located, do not publish this entry.
  [major] CVE-2022-40151 — affected versions include 'Domino 9: Versions prior to 9.0.1 Fix Pack 10 Interim Fix 11'
      problem: HCL Domino 9.0.1 reached End of Life in September 2019. Listing it as a remediation target without any EoL caveat implies that admins should apply a fix pack to an unsupported, EoL version rather than upgrading. This is misleading and potentially harmful guidance; HCL does not provide standard support or security patches for Domino 9 anymore.
      fix:     Add a clear note that Domino 9.0.1 is End of Life and that the correct remediation is to upgrade to a supported Domino release (12.x or later). Remove or clearly caveat the 9.0.1 fix pack entry.
  [major] CVE-2022-40151 — affected versions include 'Domino 10'
      problem: HCL Domino 10.x is also End of Life. The same issue applies: listing a remediation fix pack for an EoL version without saying so is misleading.
      fix:     Add an EoL note for Domino 10 alongside Domino 9, and recommend upgrading to a supported release rather than applying a fix pack to an unsupported version.
  [major] CVE-2022-40151 — article published in 2024/2025 context about 'recent' vulnerabilities
      problem: CVE-2022-40151 was assigned in 2022. Presenting it in an article titled 'Recent Security Vulnerabilities' without noting its age is misleading. Admins who patched this years ago may be confused, and the framing implies this is newly disclosed.
      fix:     Either remove CVE-2022-40151 from an article framed as covering recent vulnerabilities, or explicitly note the original disclosure date and explain why it is being re-highlighted now (e.g., newly published HCL bulletin, newly widened affected version range).
  [major] securityvulnerability.io citations for CVE-2025-62328 and CVE-2024-30130
      problem: Both remediation links point to securityvulnerability.io, a third-party aggregator with no editorial authority over HCL advisories. These sources may be incomplete, delayed, or inaccurate compared to official HCL Security Bulletins. Administrators acting on third-party aggregator data rather than official HCL bulletins risk missing critical details or applying the wrong fix pack.
      fix:     Replace both securityvulnerability.io links with the corresponding official HCL Security Bulletin URLs from support.hcl-software.com.
  [major] CVE-2024-30130 — 'Upgrade to Nomad Server version 1.0.12 or later'
      problem: If CVE-2024-30130 was disclosed in 2024 and the fix was version 1.0.12, but later Nomad Server versions (e.g., 1.0.19 referenced elsewhere in the article) now exist, telling admins to upgrade to '1.0.12 or later' without specifying the current recommended version may leave them on an intermediate version that has other known vulnerabilities (including CVE-2025-62328 mentioned above).
      fix:     Recommend upgrading to the current latest supported Nomad Server release rather than only citing the minimum fix version, and cross-reference the other Nomad CVEs in the article.
  [minor] Article title and framing: 'Recent Security Vulnerabilities in HCL Domino'
      problem: The article mixes vulnerabilities from 2022, 2024, and 2025 without any publication date or 'as of' date anchor. Readers discovering this article later will have no way to know whether the information is current.
      fix:     Add an explicit 'Last reviewed' or 'Published' date and note that readers should always check the HCL support portal for the latest bulletin status.
  [minor] Section header: 'To Review'
      problem: 'To Review' is an ambiguous section header that reads as if the content is pending review rather than being a summary/recommendations section.
      fix:     Rename to 'Summary and Recommendations' or 'Key Takeaways' for clarity.
-->

## Recent Security Vulnerabilities in HCL Domino: What You Need to Know

As Domino administrators, staying ahead of security vulnerabilities is crucial to maintaining the integrity and reliability of our environments. Here's a rundown of some recent vulnerabilities affecting HCL Domino and Nomad Server, along with actionable steps to mitigate these risks.

### Denial of Service Vulnerability in XStream (CVE-2022-40151)

**Issue:**

A Denial of Service (DoS) vulnerability has been identified in XStream, impacting HCL Domino's XPages. This flaw allows attackers to craft malicious XML data that can cause the parser to crash, leading to service disruption.

**Affected Versions:**

- Domino 12: Versions prior to 12.0.2 Fix Pack 1
- Domino 11: Versions prior to 11.0.1 Fix Pack 7
- Domino 10: Versions prior to 10.0.1 Fix Pack 8 Interim Fix 2
- Domino 9: Versions prior to 9.0.1 Fix Pack 10 Interim Fix 11

**Remediation:**

Apply the latest fix packs corresponding to your Domino version. Detailed information is available in the [HCL support article](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542).

### Content-Security-Policy Misconfiguration in Nomad Server (CVE-2025-62328)

**Issue:**

The Nomad Server on Domino has a default misconfiguration in the Content-Security-Policy header, specifically the absence of the `frame-ancestors` directive. This oversight can potentially expose sensitive information to attackers through various unspecified vectors.

**Affected Versions:**

- Nomad Server on Domino versions prior to 1.0.19

**Remediation:**

Upgrade to Nomad Server version 1.0.19 or later. More details can be found in the [security advisory](https://securityvulnerability.io/vulnerability/CVE-2025-62328).

### Cache Vulnerability in Nomad Server (CVE-2024-30130)

**Issue:**

HCL Nomad Server on Domino is vulnerable due to improper handling of web browser cache, which could potentially allow attackers to access sensitive information.

**Affected Versions:**

- Nomad Server on Domino versions up to 1.0.11

**Remediation:**

Upgrade to Nomad Server version 1.0.12 or later. Refer to the [security bulletin](https://securityvulnerability.io/vulnerability/CVE-2024-30130) for more information.

### Information Disclosure Vulnerability in HCL Domino (CVE-2024-23562)

**Issue:**

A security vulnerability in HCL Domino could allow disclosure of sensitive configuration information. A remote unauthenticated attacker could exploit this vulnerability to obtain information to launch further attacks against the affected system.

**Affected Versions:**

- Specific versions are not detailed in the available sources.

**Remediation:**

Review and apply the necessary patches as outlined in the [CVE details](https://cvefeed.io/vuln/detail/CVE-2024-23562).

## To Review

- **Stay Updated:** Regularly monitor official HCL security bulletins and apply patches promptly.
- **Review Configurations:** Ensure that your server configurations, especially security headers and caching policies, are set correctly to prevent potential exploits.
- **Test Before Deployment:** Always test updates and configuration changes in a controlled environment before deploying them to production.

By proactively addressing these vulnerabilities, we can maintain the security and reliability of our Domino environments.
