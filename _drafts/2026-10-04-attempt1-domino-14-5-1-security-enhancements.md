---
title: "Enhancing Security in HCL Domino 14.5.1"
description: "A practical guide to implementing the latest security features in HCL Domino 14.5.1, including ID file encryption policies and SHA-256 support for internet passwords."
pubDate: "2026-10-04T19:02:16+08:00"
slug: "domino-14-5-1-security-enhancements"
tags:
  - "Domino Server"
  - "Security"
  - "Tutorial"
sources:
  - title: "HCL Domino V14 Deep Dive - Security"
    url: "https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928"
  - title: "HCLSoftware Launches Sovereign AI for Secure Governance"
    url: "https://www.hcl-software.com/news/30-6-25-hclsoftware-launches-sovereign-ai-aimed-at-governments-and-regulated-organizations-concerned-with-their-data-privacy"
  - title: "HCL Domino 14.5 Overview Brochure"
    url: "https://www.hcl-software.com/wps/wcm/connect/06191ae4-724e-43da-b6ab-7198ff6b5137/Domino-14.5-Overview-Brochure.pdf?MOD=AJPERES"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: domino-14-5-1-security-enhancements
topicOverlap: false
issues:
  [critical] Upgrading ID File Encryption — 'AES-128 with SHA-256 or AES-256 with SHA-512'
      problem: The article conflates two independent cryptographic roles: a symmetric cipher (AES-128 / AES-256) used for encrypting the ID file and a hash/MAC algorithm (SHA-256 / SHA-512) used for key derivation or integrity. Presenting these as coupled pairs ('AES-128 with SHA-256' and 'AES-256 with SHA-512') is not how Domino policy settings are labeled or how the underlying cryptography works. If a reader goes looking for a policy field called 'AES-128 with SHA-256' they will not find it; worse, the implied equivalence ('AES-128 = SHA-256, AES-256 = SHA-512') is technically meaningless and could lead an admin to believe a weaker key-length pairing is acceptable when it is not. The actual Domino 14.x security policy document exposes key-strength options separately from hash/MAC options. The article must accurately describe what the policy fields actually say and mean.
      fix:     Consult the cited HCL deep-dive document and the Domino 14.5.1 release notes to reproduce the exact field names and value labels as they appear in the Administrator client. Describe the cipher and hash choices separately and accurately, and quote the actual policy UI labels rather than inventing shorthand pairings.
  [critical] Article title / throughout — 'HCL Domino 14.5.1'
      problem: As of the knowledge cut-off, HCL Domino 14 shipped as 14.0 and 14.5; there is no publicly announced '14.5.1' release. The article treats 14.5.1 as an existing, shippable product version. Publishing version-specific security guidance that references a non-existent (or unannounced) version number would cause admins to search for a release they cannot find and may lead them to apply incorrect guidance to their actual installed version. One of the cited URLs points to a brochure for 'Domino 14.5', not 14.5.1, which further undermines the claim.
      fix:     Verify the exact GA version number against HCL's official release page before publishing. If the correct version is 14.5 (not 14.5.1), update the title and all references accordingly. If 14.5.1 is a genuine maintenance release, add a note confirming the GA date and build number so readers can confirm they are on the correct fixpack.
  [major] Enabling SHA-256 for Internet Passwords — 'Set the Password Hashing Algorithm to SHA-256'
      problem: SHA-256 used as a bare, unsalted or lightly-salted password hash is significantly weaker than modern password-hashing schemes (bcrypt, Argon2, PBKDF2). The article presents 'SHA-256 for internet passwords' as a straightforward security improvement without noting (a) whether Domino's implementation includes salting and iteration counts, (b) whether there is a stronger option (e.g. bcrypt) also available in 14.x, and (c) the performance and backward-compatibility implications of changing the algorithm on a live directory. Admins reading this may believe SHA-256 is the strongest available option when it may not be.
      fix:     Clarify exactly how Domino implements SHA-256 for internet passwords (salted? iterated?). If a stronger option such as bcrypt exists in this or a nearby release, mention it. Add a caveat about backward compatibility with older clients or LDAP consumers that may not handle the new hash format.
  [major] Enabling SHA-256 for Internet Passwords — 'users will need to change their internet passwords'
      problem: The article states users must change passwords for the new algorithm to take effect but does not mention the Notes.ini parameter or server console command (if any) that can force a bulk re-hash on next successful authentication, nor does it note that until a user changes their password the old hash remains in the directory — potentially for an indefinite period. In large enterprises this is a significant operational gap. There is also no mention of what happens to service accounts or IDs that use internet passwords programmatically.
      fix:     Add guidance on how to identify accounts still using the old hash (e.g., a view or agent), mention any available tooling or Notes.ini knobs to accelerate migration, and advise admins to have a plan for service accounts and batch processes before enabling the new algorithm.
  [major] Upgrading ID File Encryption — 'any subsequent password change will trigger the ID file to be re-encrypted'
      problem: This statement is incomplete. The re-encryption is triggered only if the policy is pushed successfully to the client AND the client is running a Notes version that supports the new algorithm. Older Notes client versions that do not support the new cipher/hash combination may silently ignore the policy or fail. The article gives no minimum Notes client version requirement, which is critical information for mixed-version environments.
      fix:     Add a statement specifying the minimum HCL Notes client version required to support AES-256/SHA-512 ID file encryption (verify from the release notes), and advise admins to audit client versions before rolling out the policy.
  [major] Modify the Server Document — 'Navigate to Configuration tab … select the server document'
      problem: The navigation path described is inaccurate for how the Domino Administrator client is laid out. The Server document is found under the Configuration tab → Server → All Server Documents (or Current Server Document), not under a generic 'Server section'. While this may seem minor, an admin who cannot find the field because the navigation is wrong may abandon the task or edit the wrong document.
      fix:     Verify the exact navigation path in the Domino Administrator client for the relevant version and reproduce it step by step (e.g., Configuration tab → expand 'Server' in the left panel → All Server Documents → open the target server → Security tab).
  [minor] Cited source — 'https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928'
      problem: The URL is a raw ServiceNow attachment link (sys_attachment.do with a sys_id GUID). These links are typically internal or session-authenticated HCL support portal assets and may not be publicly accessible to all readers. Publishing an inaccessible citation undermines credibility and leaves readers unable to verify claims.
      fix:     Replace with a publicly accessible HCL documentation link (e.g., HCL Help / Domino documentation portal) or at minimum note that the source requires an HCL support portal login and provide the document title so readers can locate it themselves.
  [minor] To Review section — summary bullets
      problem: The summary repeats the same uncorrected claims from the body (the invented pairing names, the incomplete migration caveat) without adding new information. Once the body is corrected, the summary will also need updating to stay consistent.
      fix:     Update the summary bullets after correcting the body to ensure consistency.
-->

## Enhancing Security in HCL Domino 14.5.1

If you're managing a Domino environment, staying ahead of security vulnerabilities is non-negotiable. With the release of HCL Domino 14.5.1, there are several security enhancements worth your attention. Let's dive into two key features: upgrading ID file encryption and enabling SHA-256 for internet passwords.

### Upgrading ID File Encryption

Domino 14.5.1 introduces the ability to enforce stronger encryption algorithms for user ID files. Specifically, you can now set policies to upgrade ID file encryption to AES-128 with SHA-256 or AES-256 with SHA-512. This enhancement ensures that user credentials are protected with modern, robust encryption standards.

**Steps to Implement:**

1. **Access the Domino Administrator:**
   - Open the Domino Administrator client and navigate to the **People & Groups** tab.

2. **Create or Modify a Security Policy:**
   - Under the **Policies** section, create a new security policy or edit an existing one.

3. **Configure ID File Encryption Settings:**
   - Within the security policy settings, locate the **ID File Encryption** section.
   - Choose the desired encryption level: either **AES-128 with SHA-256** or **AES-256 with SHA-512**.

4. **Apply the Policy:**
   - Assign the security policy to the relevant user groups or organizational units.

5. **Enforce Policy on Clients:**
   - Ensure that users' Notes clients are configured to receive and apply policies from the server.

By implementing this policy, any subsequent password change will trigger the ID file to be re-encrypted using the specified algorithm. This proactive measure significantly enhances the security posture of your Domino environment.

*Source: [HCL Domino V14 Deep Dive - Security](https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928)*

### Enabling SHA-256 for Internet Passwords

Another critical update in Domino 14.5.1 is the support for SHA-256 hashing of internet passwords stored in the Domino Directory. Previously, weaker hashing algorithms posed potential security risks. With this update, you can ensure that all internet passwords are hashed using SHA-256, providing a more secure authentication mechanism.

**Steps to Implement:**

1. **Access the Domino Administrator:**
   - Open the Domino Administrator client and navigate to the **Configuration** tab.

2. **Modify the Server Document:**
   - Under the **Server** section, select the server document for the server you wish to configure.

3. **Navigate to Security Settings:**
   - Click on the **Security** tab within the server document.

4. **Set Internet Password Hashing Algorithm:**
   - Locate the **Internet Passwords** section.
   - Set the **Password Hashing Algorithm** to **SHA-256**.

5. **Save and Replicate Changes:**
   - Save the server document and ensure that the changes replicate across all servers in your domain.

6. **Inform Users to Change Passwords:**
   - For the new hashing algorithm to take effect, users will need to change their internet passwords. Communicate this requirement to all users.

Implementing SHA-256 hashing fortifies your authentication processes against potential attacks that exploit weaker hashing methods.

*Source: [HCL Domino V14 Deep Dive - Security](https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928)*

## To Review

- **Upgrade ID File Encryption:**
  - Set policies to enforce AES-128 with SHA-256 or AES-256 with SHA-512 encryption for user ID files.

- **Enable SHA-256 for Internet Passwords:**
  - Configure server settings to hash internet passwords using SHA-256.
  - Ensure users change their passwords to apply the new hashing algorithm.

By proactively implementing these security enhancements in Domino 14.5.1, you can significantly bolster the security framework of your Domino environment, safeguarding sensitive information and maintaining compliance with modern security standards.
