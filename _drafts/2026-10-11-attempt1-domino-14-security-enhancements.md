---
title: "Enhancing Security in HCL Domino 14: Key Updates and Best Practices"
description: "A practical guide for Domino administrators on implementing the latest security features in HCL Domino 14 to safeguard your environment."
pubDate: "2026-10-11T19:19:34+08:00"
slug: "domino-14-security-enhancements"
tags:
  - "Domino Server"
  - "Security"
  - "Tutorial"
sources:
  - title: "HCL Domino V14 Deep Dive - Security"
    url: "https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928"
  - title: "Security Bulletin: A Denial of Service (DoS) Vulnerability in XStream affects HCL Domino (CVE-2022-40151)"
    url: "https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542"
  - title: "CVE-2023-37495 - HCL Domino is susceptible to a weak cryptography vulnerability"
    url: "https://secalerts.co/vulnerability/CVE-2023-37495"
  - title: "CVE-2024-23562 - HCL Domino is susceptible to an information disclosure vulnerability"
    url: "https://secalerts.co/vulnerability/CVE-2024-23562"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: domino-14-security-enhancements
topicOverlap: false
issues:
  [critical] CVE-2022-40151 … linked to KB0106542
      problem: CVE-2022-40151 is an XStream XML external-entity / stack-overflow vulnerability affecting Java applications that use XStream. Attributing it specifically to 'Domino XPages' as the affected surface area is not substantiated by HCL's public security bulletins. More importantly, the article links KB0106542 as the source for this CVE, but that KB article does not correspond to this CVE — it covers a different security topic. Mismatching a CVE to the wrong KB article could cause an administrator to believe they have applied the correct remediation when they have not.
      fix:     Verify the exact HCL security bulletin that addresses CVE-2022-40151 in Domino, use its correct URL, and describe the affected component accurately. If no HCL-specific bulletin is available for this CVE as it relates to Domino, do not cite it as a resolved Domino vulnerability.
  [critical] CVE-2023-37495 … 'Ensure that all Person documents are created through user registration to avoid this vulnerability'
      problem: This remediation guidance is technically incorrect and dangerously incomplete. CVE-2023-37495 is about weak (MD5-based) Internet password hashing in Domino Person documents. The fix is to upgrade Domino to a version that supports stronger hashing AND to force users to reset their Internet passwords so the hash is re-computed with the new algorithm. Telling administrators to only 'ensure Person documents are created through user registration' does nothing to re-hash the passwords of the thousands of existing Person documents already in a production directory. An administrator following this advice would believe their existing users are protected when they are not.
      fix:     Replace with accurate remediation: upgrade to Domino 14 (or the relevant fix pack), enable SHA-256 Internet password hashing in the server/security policy, and require all existing users to change their Internet passwords so legacy weak hashes are replaced.
  [major] SHA-256 Support for Internet Passwords — 'Open the Server Configuration document … set the Password Hash Algorithm to SHA-256'
      problem: The article describes enabling SHA-256 Internet password hashing as a single Server Configuration document setting, but the actual mechanism in Domino 14 involves a combination of: (a) the updated names.nsf template design, (b) a Security Settings policy document (not just the Server Configuration document), and optionally (c) a notes.ini parameter. The UI path 'Server Configuration document → Security tab → Internet Passwords → Password Hash Algorithm' does not accurately reflect where this setting lives in Domino 14. Administrators following these steps verbatim will not find the field described and may incorrectly conclude the feature is absent or already configured.
      fix:     Verify the exact location of the hashing control in Domino 14 (Security Settings policy document vs. server config) and provide the correct navigation path. Reference the relevant HCL documentation or release notes.
  [major] Upgrading ID File Encryption — 'AES-128 with SHA-256 or AES-256 with SHA-512'
      problem: The pairing of AES key length with SHA variant should be verified against HCL's actual documentation. In Domino 14 release materials, the encryption upgrade options for ID files use specific algorithm descriptors; conflating the symmetric cipher strength with the hash function in the way written here ('AES-128/SHA-256') may not match the exact options presented in the Security policy UI, which could confuse administrators comparing the article to what they see on screen. Additionally, the article does not mention that this upgrade only takes effect when the user next changes their password — existing ID files are not retroactively re-encrypted — which is a significant operational caveat administrators need to plan around.
      fix:     Confirm exact algorithm names as displayed in the Domino 14 Security policy UI. Explicitly state that re-encryption of existing ID files is deferred until the user's next password change, and discuss how administrators can track or prompt completion.
  [major] Enable Two-Factor Authentication (2FA) — 'Domino's support for TOTP … for web authentication'
      problem: TOTP in HCL Domino applies to Notes client authentication (ID vault-based one-time password), not exclusively or primarily 'web authentication.' Framing it solely as a web authentication feature is misleading. Furthermore, TOTP was introduced in Domino 12, not Domino 14, so presenting it under a 'Domino 14 security enhancements' article without clarifying the version origin may mislead readers into thinking it is new in v14.
      fix:     Clarify that TOTP covers both Notes client and web scenarios, specify that the feature was introduced in Domino 12, and note any Domino 14-specific improvements to TOTP if they exist.
  [major] CVE-2024-23562 … 'patched in the latest updates'
      problem: CVE-2024-23562 is listed with a 2024 identifier. The article does not specify which exact Domino fix pack or version resolves it, leaving administrators unable to confirm whether their current installed version includes the patch. 'Latest updates' is not actionable guidance for a production environment.
      fix:     State the specific Domino version, fix pack, or interim fix that resolves CVE-2024-23562, as HCL publishes in its security bulletin for this CVE.
  [minor] Section header 'To Review'
      problem: 'To Review' is an unusual and unclear section header for what is a conclusion/summary section. It may confuse readers into thinking the section contains open items requiring editorial review rather than being the article's closing summary.
      fix:     Rename to 'Summary' or 'Conclusion'.
-->

## Enhancing Security in HCL Domino 14: Key Updates and Best Practices

If you're managing a Domino environment, security is always at the forefront. With the release of HCL Domino 14, there are several critical updates you should be aware of to keep your servers secure and compliant.

### Upgrading ID File Encryption

One of the notable enhancements in Domino 14 is the ability to upgrade the encryption algorithm used for ID files. You can now set a policy to upgrade the ID file encryption to AES-128 with SHA-256 or AES-256 with SHA-512 when users change their passwords. This ensures stronger protection for user credentials.

**How to Implement:**

1. **Create or Modify a Security Policy:**
   - Open the Domino Administrator client.
   - Navigate to the **People & Groups** tab.
   - Select **Policies** and then **Security**.
   - Create a new policy or edit an existing one.

2. **Set Encryption Settings:**
   - In the policy settings, go to the **ID File Encryption** section.
   - Choose the desired encryption strength (AES-128/SHA-256 or AES-256/SHA-512).

3. **Apply the Policy:**
   - Assign the policy to the relevant users or groups.

By enforcing this policy, you ensure that all ID files are encrypted with robust algorithms, enhancing overall security.

### SHA-256 Support for Internet Passwords

Domino 14 introduces support for SHA-256 hashing of Internet passwords stored in the Domino Directory. This upgrade replaces older, weaker hash algorithms, making it significantly harder for attackers to crack passwords.

**Steps to Enable SHA-256 Hashing:**

1. **Update the Domino Directory Design:**
   - Ensure that your Domino Directory (names.nsf) design is up to date with the latest template provided in Domino 14.

2. **Modify the Server Configuration:**
   - Open the **Server Configuration** document.
   - Navigate to the **Security** tab.
   - Under **Internet Passwords**, set the **Password Hash Algorithm** to **SHA-256**.

3. **Inform Users to Change Passwords:**
   - For the new hashing algorithm to take effect, users will need to change their Internet passwords. Communicate this requirement to all users.

Implementing SHA-256 hashing enhances password security, aligning with modern security standards.

### Addressing Recent Vulnerabilities

Staying updated with security patches is crucial. Recent vulnerabilities have been identified and addressed in Domino 14:

- **CVE-2022-40151:** A Denial of Service (DoS) vulnerability in XStream affecting Domino XPages. This issue has been resolved in the latest release. [Read more](https://support.hcl-software.com/csm?id=kb_article&sysparm_article=KB0106542)

- **CVE-2023-37495:** Weak cryptography in Internet passwords stored in Person documents. Ensure that all Person documents are created through user registration to avoid this vulnerability. [Details here](https://secalerts.co/vulnerability/CVE-2023-37495)

- **CVE-2024-23562:** An information disclosure vulnerability that could allow unauthorized access to sensitive configuration information. This has been patched in the latest updates. [More information](https://secalerts.co/vulnerability/CVE-2024-23562)

**Action Items:**

- **Apply the Latest Fix Packs:**
  - Regularly check for and apply the latest fix packs and interim fixes provided by HCL to address known vulnerabilities.

- **Review Security Bulletins:**
  - Stay informed by reviewing HCL's security bulletins and advisories.

- **Conduct Regular Security Audits:**
  - Periodically audit your Domino environment to identify and mitigate potential security risks.

### Best Practices for Maintaining Security

Beyond implementing the new features and patches, consider the following best practices:

- **Enforce Strong Password Policies:**
  - Require complex passwords and regular changes to minimize the risk of unauthorized access.

- **Enable Two-Factor Authentication (2FA):**
  - Utilize Domino's support for TOTP (Time-Based One-Time Password) to add an extra layer of security for web authentication.

- **Monitor Server Logs:**
  - Regularly review server logs for unusual activity that could indicate a security breach.

- **Limit Administrative Access:**
  - Restrict administrative privileges to essential personnel and use role-based access controls.

## To Review

Security is an ongoing process. By leveraging the new features in Domino 14, addressing recent vulnerabilities, and adhering to best practices, you can significantly enhance the security posture of your Domino environment. Stay vigilant, keep your systems updated, and always be proactive in your security measures.
