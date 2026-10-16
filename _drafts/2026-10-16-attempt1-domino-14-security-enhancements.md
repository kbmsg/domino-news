---
title: "Enhancing Security in Domino 14: A Practical Guide"
description: "A hands-on guide for Domino administrators to implement new security features in Domino 14, including ID file encryption policies and SHA-256 support for internet passwords."
pubDate: "2026-10-16T17:35:00+08:00"
slug: "domino-14-security-enhancements"
tags:
  - "Domino Server"
  - "Security"
  - "Tutorial"
sources:
  - title: "HCL Domino V14 Deep Dive - Security"
    url: "https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928"
  - title: "HCL Domino 14.5 Overview Brochure"
    url: "https://www.hcl-software.com/wps/wcm/connect/06191ae4-724e-43da-b6ab-7198ff6b5137/Domino-14.5-Overview-Brochure.pdf?MOD=AJPERES"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Body must have >= 2 inline links, got 1.
attempt: 1
slug: domino-14-security-enhancements
-->

## Enhancing Security in Domino 14: A Practical Guide

If you're managing a Domino environment, security is always top of mind. With the release of Domino 14, HCL has introduced several enhancements that can help fortify your system. Let's dive into two key features: upgrading ID file encryption and enabling SHA-256 for internet passwords.

### Upgrading ID File Encryption

Domino 14 allows administrators to set policies that upgrade the encryption algorithm used for ID files. This means you can move from older encryption methods to more secure ones like AES-128 with SHA-256 or AES-256 with SHA-512.

**Why it matters:**

Older encryption algorithms are more susceptible to attacks. By upgrading to AES-256 with SHA-512, you're significantly enhancing the security of user ID files.

**How to implement:**

1. **Access the Domino Administrator client:**
   - Navigate to the **People & Groups** tab.

2. **Create or modify a Security Settings document:**
   - Go to **Policies** > **Settings**.
   - Open an existing Security Settings document or create a new one.

3. **Configure the ID file encryption policy:**
   - Within the Security Settings document, select the **Keys and Certificates** tab.
   - Under **ID File Encryption**, choose the desired encryption algorithm (e.g., AES-256 with SHA-512).

4. **Apply the policy to users:**
   - Link the Security Settings document to a Policy document.
   - Assign the Policy to the relevant users or groups.

5. **Prompt users to change their passwords:**
   - For the new encryption to take effect, users will need to change their passwords. Communicate this requirement clearly to ensure compliance.

**Note:**

Ensure that all clients are updated to a version compatible with the new encryption algorithms to avoid any access issues.

### Enabling SHA-256 for Internet Passwords

Another significant enhancement in Domino 14 is the support for SHA-256 hashing of internet passwords stored in the Domino Directory.

**Why it matters:**

SHA-256 is a more secure hashing algorithm compared to older methods. Implementing this ensures that stored passwords are better protected against brute-force attacks.

**How to implement:**

1. **Access the Domino Administrator client:**
   - Navigate to the **People & Groups** tab.

2. **Modify the Person document:**
   - Open the Person document for the user whose password needs updating.

3. **Update the internet password:**
   - In the **Basics** tab, locate the **Internet password** field.
   - Enter a new password and save the document.

4. **Inform users to change their passwords:**
   - Users will need to change their internet passwords to trigger the update to SHA-256 hashing.

**Note:**

This change applies to users who update their internet passwords after the Domino 14 upgrade. Existing passwords will retain their previous hashing method until changed.

## To Review

Implementing these security enhancements in Domino 14 is straightforward but requires coordination with your user base. Upgrading ID file encryption and enabling SHA-256 for internet passwords are proactive steps toward a more secure Domino environment. Ensure you communicate changes effectively and provide support during the transition to maintain system integrity and user trust.

For more detailed information, refer to the [HCL Domino V14 Deep Dive - Security](https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928) document.
