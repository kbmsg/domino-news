---
title: "Domino Web Administrator Deprecation: What You Need to Know"
description: "HCL has deprecated the Domino Web Administrator due to security vulnerabilities. Here's what administrators need to know and how to transition to safer alternatives."
pubDate: "2026-10-26T18:51:00+08:00"
slug: "domino-web-admin-deprecation"
tags:
  - "Domino Server"
  - "Security"
  - "Incident Report"
sources:
  - title: "Security Bulletin: For safer administration of Domino server, use Domino Administrator client instead of Domino Web Administrator"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031"
  - title: "HCL Domino/Notes/Sametime Security bulletins are published. The real question is: will you see them in time?"
    url: "https://www.vlaad.lv/lotus.nsf/dx/hcl-dominonotessametime-security-bulletins-are-published.-the-real-question-is-will-you-see-them-in-time"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Inline-link diversity check failed: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031&utm_source=openai" appears 4/5 times in inline links (>50%). Likely a copy-paste error, each anchor should point to its own destination.
attempt: 1
slug: domino-web-admin-deprecation
-->

## Domino Web Administrator Deprecation: What You Need to Know

If you've been relying on the Domino Web Administrator (webadmin.nsf) for server management, it's time to reconsider. HCL has officially deprecated this tool due to multiple security vulnerabilities, including cross-site scripting (XSS) and cross-site request forgery (CSRF) issues. ([support.hcl-software.com](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031&utm_source=openai))

### The Vulnerabilities

The Web Administrator has been found susceptible to several security flaws:

- **Cross-Site Scripting (XSS):** Authenticated attackers can exploit these vulnerabilities to execute malicious scripts in the context of the user's browser session. ([support.hcl-software.com](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031&utm_source=openai))

- **Cross-Site Request Forgery (CSRF):** Attackers can trick users into performing unintended actions on the server, potentially leading to unauthorized changes. ([support.hcl-software.com](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031&utm_source=openai))

### HCL's Recommendation

Given these security concerns, HCL advises administrators to transition away from the Web Administrator and adopt the Domino Administrator client. This client offers a more secure and robust environment for server management. ([support.hcl-software.com](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0036031&utm_source=openai))

### Steps to Transition

1. **Install the Domino Administrator Client:** Ensure you have the latest version installed to benefit from current security patches and features.

2. **Review Access Controls:** Audit and adjust user permissions to align with best practices, minimizing potential security risks.

3. **Educate Your Team:** Provide training on the Domino Administrator client to ensure a smooth transition and effective use.

### Staying Informed

Security bulletins and updates are regularly published by HCL. However, many administrators may not be aware of these in a timely manner. It's crucial to stay updated to protect your environment. ([vlaad.lv](https://www.vlaad.lv/lotus.nsf/dx/hcl-dominonotessametime-security-bulletins-are-published.-the-real-question-is-will-you-see-them-in-time?utm_source=openai))

## To Review

- The Domino Web Administrator is deprecated due to security vulnerabilities.

- Transition to the Domino Administrator client for safer server management.

- Regularly monitor HCL's security bulletins to stay informed about potential risks and updates.

By proactively addressing these changes, you can maintain a secure and efficient Domino environment.
