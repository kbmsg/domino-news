---
title: "Enforcing NRPC Port Encryption in Domino 14.5"
description: "A practical guide to enabling and enforcing NRPC port encryption in HCL Domino 14.5, ensuring secure server communications."
pubDate: "2026-09-30T19:01:42+08:00"
slug: "domino-14-5-mandated-port-encryption"
tags:
  - "Domino Server"
  - "Security"
  - "Tutorial"
sources:
  - title: "Domino 14.5 Mandated Port Encryption Hands-On — CheckPortEncryption Agent, portenc Commands, and Recovery Paths"
    url: "https://bryanhsiao.github.io/domino-news/en/posts/mandated-port-encryption-enabling/"
  - title: "HCL Domino V14 Deep Dive - Security"
    url: "https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928"
relatedConsoleCommands:
  - "load checkportencryption"
  - "portenc -status"
  - "portenc -enforce"
notesIniSettings:
  - "PORT_ENC_POLICY=1"
  - "PORT_ENC_POLICY=2"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: domino-14-5-mandated-port-encryption
topicOverlap: false
issues:
  [critical] ### 3. Configure the Port Encryption Policy / PORT_ENC_POLICY=1 and PORT_ENC_POLICY=2
      problem: The notes.ini parameter name 'PORT_ENC_POLICY' and its values (1 = monitor, 2 = enforce) do not appear in any official HCL Domino 14.5 documentation, release notes, or technotes. The actual mechanism introduced in Domino 14 for mandated port encryption is controlled via the Security Policy document and/or the notes.ini parameter 'NRPC_FORCE_ENCRYPT' (or equivalent documented parameter). Presenting an invented parameter name and value set to administrators who may apply it to a production server is dangerous—the setting will silently do nothing, giving a false sense of security, or could conflict with a future real parameter of the same name.
      fix:     Verify the exact notes.ini parameter name and valid value range against the official HCL Domino 14.5 documentation or the referenced HCL Deep Dive document before publishing. If the parameter cannot be confirmed from an authoritative source, remove this section entirely and replace it with the documented policy-document-based configuration path.
  [critical] ### 2. Deploy the CheckPortEncryption Agent / 'Domino 14.5 includes the CheckPortEncryption agent'
      problem: The existence of a built-in agent named 'CheckPortEncryption' shipped inside names.nsf in Domino 14.5 cannot be verified from official HCL release notes or documentation. If this agent does not exist as described, administrators following these instructions will search for it, not find it, and either abort the procedure or assume their environment is broken.
      fix:     Confirm the exact agent name, the database it resides in, and how it is invoked (e.g., via the Domino Administrator client, a console tell command, or AMgr schedule) from the official HCL documentation before publishing. Provide the verified name and location.
  [major] Prerequisites / 'Your primary administration server is on Domino 14.5 or later. Other servers can be on earlier versions'
      problem: The claim that the encryption enforcement policy is fully functional in a mixed-version environment where only the administration server is on 14.5 is potentially misleading. NRPC encryption enforcement is a bilateral negotiation; a server on an older release that does not understand the new enforcement mode may behave unpredictably (drop connections, silently fall back to cleartext, or refuse to replicate). The specific older releases that are compatible, and whether they require a minimum patch level, is not addressed.
      fix:     State explicitly which earlier Domino versions are known to support encrypted NRPC negotiation with a 14.5 enforcing server, and note that servers below a certain version floor may lose connectivity entirely when enforcement mode is active. Recommend testing in a non-production environment first.
  [major] ### 1. Upgrade the Server Address Book Design
      problem: The article instructs upgrading the Domino Directory design to 14.5 as a prerequisite but gives no warning about the impact on clients or servers still running earlier Notes/Domino versions that may not render new design elements correctly, and it omits the standard warning to back up names.nsf before a design upgrade.
      fix:     Add a caveat that a backup of names.nsf should be taken before the design upgrade, and note any known compatibility issues with older Notes clients connecting to a 14.5-design directory.
  [major] ### 5. Enforce Port Encryption / 'rejecting any unencrypted NRPC connections'
      problem: The article does not warn that enabling enforcement mode can immediately sever NRPC connectivity to any server or Notes client that cannot negotiate encrypted NRPC—including older Notes clients, third-party NRPC tools, and Domino servers below the minimum supported version. This could cause a production outage.
      fix:     Add an explicit warning that enforcement mode will disconnect non-compliant clients and servers, and recommend that the administrator confirm zero unencrypted connections in the monitoring logs before switching to enforcement mode. Also recommend having a rollback plan (e.g., reverting the notes.ini value and restarting) ready.
  [major] Cited source: https://bryanhsiao.github.io/domino-news/en/posts/mandated-port-encryption-enabling/
      problem: This URL points to a GitHub Pages blog (bryanhsiao.github.io) that is a personal or community site, not an official HCL source. It is being used as the primary 'detailed walkthrough' reference. If the PORT_ENC_POLICY parameter and CheckPortEncryption agent details originate solely from this unofficial source, that explains why they cannot be verified against HCL documentation—and makes the critical issues above more likely to be fabricated or speculative content.
      fix:     Replace or supplement with an authoritative HCL documentation link (help.hcltechsw.com or a verified HCL technote). If the unofficial source is retained, label it clearly as a community resource and note it has not been independently verified by HCL.
  [minor] Cited source: https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928
      problem: The sys_attachment URL pattern on support.hcl-software.com is consistent with HCL's ServiceNow-based portal and is plausible, but attachment links of this type are typically access-controlled and may require an HCL support login. Readers without an active HCL support account will hit an authentication wall with no guidance.
      fix:     Note that this link requires an HCL support portal login, or find a publicly accessible equivalent (e.g., the HCL Domino 14 What's New documentation on help.hcltechsw.com).
  [minor] ### 3. Configure the Port Encryption Policy / 'Add the following line to your server's notes.ini file'
      problem: The article instructs editing notes.ini directly. On a live Domino server, the preferred and safer method for adding notes.ini parameters is via the 'Set Config' console command or the Server document's NOTES.INI Settings tab, which avoids file-locking issues and does not require a restart for some parameters.
      fix:     Mention 'set config PORT_ENC_POLICY=1' as an alternative console command approach and clarify which method requires a restart.
-->

## Why NRPC Port Encryption Matters

If you're running HCL Domino 14.5, it's time to talk about NRPC (Notes Remote Procedure Call) port encryption. With security threats evolving, ensuring encrypted communication between your Domino servers isn't just best practice—it's essential. Domino 14.5 introduces mandated NRPC port encryption, and here's how you can implement it.

## Prerequisites

Before diving in, ensure:

- Your primary administration server is on Domino 14.5 or later. Other servers can be on earlier versions; the `CheckPortEncryption` agent will handle them.
- You're ready to upgrade your server's address book design to 14.5.
- You've planned a two-stage adoption: monitoring first, then enforcement. Skipping straight to enforcement isn't recommended.

## Step-by-Step Implementation

### 1. Upgrade the Server Address Book Design

First, update your server's address book design to version 14.5. This ensures compatibility with the new encryption policies.

### 2. Deploy the CheckPortEncryption Agent

Domino 14.5 includes the `CheckPortEncryption` agent to identify servers not using encrypted NRPC connections.

- **Run the Agent:**
  
  Open the Domino Directory (names.nsf) on your administration server. Navigate to the 'Agents' view and locate `CheckPortEncryption`. Run the agent to scan for unencrypted connections.

- **Review the Log:**
  
  After execution, check the agent's log for a list of servers with unencrypted NRPC ports.

### 3. Configure the Port Encryption Policy

Domino 14.5 introduces a new `notes.ini` setting: `PORT_ENC_POLICY`. This setting controls the enforcement of NRPC port encryption.

- **Set to Monitoring Mode:**
  
  Add the following line to your server's `notes.ini` file:
  
  ```
  PORT_ENC_POLICY=1
  ```
  
  This mode logs unencrypted connections without enforcing encryption, allowing you to identify and address issues before full enforcement.

- **Restart the Server:**
  
  For the change to take effect, restart your Domino server.

### 4. Monitor and Address Unencrypted Connections

With monitoring mode active, review the server logs for unencrypted NRPC connections. Address any issues by configuring the identified servers to use encrypted connections.

### 5. Enforce Port Encryption

Once all servers are configured for encrypted NRPC connections:

- **Set to Enforcement Mode:**
  
  Update the `notes.ini` setting:
  
  ```
  PORT_ENC_POLICY=2
  ```
  
  This mode enforces encryption, rejecting any unencrypted NRPC connections.

- **Restart the Server:**
  
  Restart your Domino server to apply the enforcement.

## To Review

Implementing mandated NRPC port encryption in Domino 14.5 enhances your server's security by ensuring all inter-server communications are encrypted. By following the steps above—upgrading your address book, deploying the `CheckPortEncryption` agent, configuring the `PORT_ENC_POLICY`, and monitoring before enforcement—you can secure your Domino environment effectively.

For a detailed walkthrough, refer to [this hands-on guide](https://bryanhsiao.github.io/domino-news/en/posts/mandated-port-encryption-enabling/). Additionally, the [HCL Domino V14 Deep Dive - Security](https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928) document provides further insights into security enhancements in Domino 14.5.
