---
title: "Deprecation of Domino Web Administrator: Security Implications and Migration Steps"
description: "HCL has deprecated the Domino Web Administrator due to security vulnerabilities. Administrators should transition to the Domino Administrator client to maintain secure server management."
pubDate: "2026-10-23T17:48:58+08:00"
slug: "domino-web-admin-deprecation"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "Security Bulletin: For safer administration of Domino server, use Domino Administrator client instead of Domino Web Administrator"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031"
  - title: "CYONE Security Blog about HCL Software"
    url: "https://update.cyone.lv/security.nsf/archive?cat=Domino&openview=&title=Domino&type=cat"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - topic overlap with **domino-security-vulnerabilities-2026** + 2 critical fact issue(s)
attempt: 1
slug: domino-web-admin-deprecation
topicOverlap: true (overlapWith=domino-security-vulnerabilities-2026)
issues:
  [critical] Cited source: https://update.cyone.lv/security.nsf/archive?cat=Domino&openview=&title=Domino&type=cat
      problem: This URL points to a third-party Latvian domain (cyone.lv) that is not an HCL or IBM/Lotus official source. It is not cited inline in the article text but appears in the cited-sources list, implying it was used as a reference. Its path structure mimics a Domino database URL (security.nsf), which could mean it is a privately operated archive of unknown accuracy and currency. Readers acting on guidance sourced from an unverified third party against a production server is a serious concern.
      fix:     Remove this citation entirely. All security guidance should be sourced exclusively from HCL official channels: the HCL Support knowledge base, HCL Security Advisories (https://support.hcl-software.com/csm?id=security_bulletins), or the HCL Domino release notes.
  [critical] utm_source=openai appended to both HCL KB URLs
      problem: Both links to support.hcl-software.com contain the query parameter utm_source=openai, which is a clear indicator that these URLs were machine-generated (likely by a large language model) rather than retrieved from the actual HCL Support portal. This raises serious doubt about whether KB0036031 exists and contains the content described. If the KB article does not exist or does not say what the article claims, administrators following the guidance could be misled.
      fix:     Manually verify that KB0036031 exists on the HCL Support portal and actually documents the deprecation of webadmin.nsf and the stated XSS/CSRF vulnerabilities. Strip the utm_source=openai parameter before publishing. If the KB article cannot be confirmed, the article must not publish until a real, verified citation is found.
  [major] Why the Domino Administrator Client is Safer
      problem: The article presents the Domino Administrator (Notes-based fat client) as the only alternative to webadmin.nsf. It omits HCL Domino's browser-based AdminUI (the modern web-based admin interface introduced in Domino 12.x), which is HCL's strategic replacement for the web administration use case and does not require a Windows workstation. Administrators who manage Domino from Linux or macOS desktops, or who need lightweight remote access, are poorly served by guidance that ignores this option.
      fix:     Add a section or at least a paragraph covering the HCL Domino AdminUI as the primary web-based successor. Clarify that the fat Domino Administrator client is a valid alternative for full-featured management but requires a supported Windows client environment, while AdminUI covers browser-based remote management scenarios.
  [major] these vulnerabilities, while rated low on the CVSS scale
      problem: The article asserts the CVSS ratings are 'low' without citing a specific score or CVE identifier. Without a verifiable CVE or HCL Security Bulletin number, readers cannot confirm the severity rating or check whether it applies to their specific Domino version. Additionally, XSS and CSRF vulnerabilities in an administrative interface can be medium or higher depending on scope and authentication requirements; calling them categorically 'low' without a source could cause administrators to de-prioritize the migration.
      fix:     Provide the specific CVE identifier(s) and/or the HCL Security Bulletin number, along with the exact CVSS base score and vector string. If the score is confirmed low, briefly explain the attack conditions (e.g., requires authenticated session, same-origin constraints) so readers can make an informed risk decision.
  [major] Steps to Migrate — Install the Domino Administrator Client
      problem: The article gives no version guidance. The Domino Administrator client version must match or be compatible with the server version being managed. Using a mismatched client version (especially an older client against a newer server) can result in missing features, errors, or inability to manage certain server functions. This is a well-known operational caveat that is absent here.
      fix:     Add a note that the Administrator client version should match the Domino server version being managed, and direct readers to the HCL Domino system requirements page for supported client/server version combinations.
  [major] Mitigation Measures — Restrict Access: Limit access to the webadmin.nsf to trusted IP addresses
      problem: The article does not explain *how* to restrict IP access to webadmin.nsf on Domino. The mechanism (e.g., editing the server's internet site documents, using the HTTP task's allowed hosts settings, or OS-level firewall rules) varies by topology and Domino version. Leaving this as a vague bullet point provides no actionable guidance and risks administrators assuming a simple ACL change on the NSF is sufficient, which it is not for network-layer restriction.
      fix:     Either expand this point with concrete Domino-specific steps (e.g., configuring the Domino HTTP server's server document or internet site document to restrict access, or setting up OS/network firewall rules), or remove it to avoid giving false assurance through vague advice.
  [minor] Article title and throughout: 'Domino Web Administrator'
      problem: HCL's official product name for this tool is 'Domino Web Administrator' which is acceptable, but the database filename webadmin.nsf should be used consistently when referencing it technically. The article mixes 'web interface', 'web administrator', and 'deprecated web interface' interchangeably, which could cause minor confusion for newer administrators trying to locate the component.
      fix:     Standardize terminology: use 'Domino Web Administrator (webadmin.nsf)' on first reference and either 'Web Administrator' or 'webadmin.nsf' consistently thereafter.
  [minor] Train Your Team
      problem: The migration step 'Train Your Team' is generic and provides no Domino-specific resources (e.g., HCL documentation, HCL Domino Administrator help, or HCL's learning portal). This reduces the practical value of the article for administrators who are new to the fat client.
      fix:     Link to the HCL Domino Administrator documentation or HCL's official training resources so readers have a concrete starting point.
-->

## The Issue with Domino Web Administrator

If you're still using the Domino Web Administrator (webadmin.nsf) for server management, it's time to reconsider. HCL has officially deprecated this tool due to multiple cross-site scripting (XSS) vulnerabilities and a cross-site request forgery (CSRF) issue. These vulnerabilities, while rated low on the CVSS scale, pose unnecessary risks to your server's security. ([support.hcl-software.com](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031&utm_source=openai))

## Why the Domino Administrator Client is Safer

The Domino Administrator client doesn't suffer from these vulnerabilities. It's a more secure and robust tool for managing your Domino servers. Transitioning to this client will help you avoid potential security breaches associated with the deprecated web interface.

## Steps to Migrate

1. **Install the Domino Administrator Client**: Ensure you have the latest version installed on your workstation.

2. **Configure Access**: Set up the necessary access controls and permissions to manage your servers effectively.

3. **Train Your Team**: If your team has been relying on the web interface, provide training on the Administrator client to ensure a smooth transition.

## Mitigation Measures if Migration Isn't Immediate

If you can't switch immediately, consider the following temporary measures:

- **Restrict Access**: Limit access to the webadmin.nsf to trusted IP addresses.

- **Monitor Usage**: Keep an eye on the usage of the web interface and look for any suspicious activity.

- **Apply Patches**: Ensure your Domino server is up-to-date with the latest patches and updates.

## The Outcome

Continuing to use the deprecated Domino Web Administrator exposes your servers to unnecessary security risks. Transitioning to the Domino Administrator client is the recommended course of action to maintain a secure and compliant environment. ([support.hcl-software.com](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031&utm_source=openai))
