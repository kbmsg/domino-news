---
title: "Implementing Mandated NRPC Port Encryption in Domino 14.5"
description: "A practical guide to enabling and enforcing NRPC port encryption in Domino 14.5, ensuring secure server communications."
pubDate: "2026-09-29T19:13:05+08:00"
slug: "domino-14-5-mandated-port-encryption"
tags:
  - "Domino Server"
  - "Security"
  - "Tutorial"
sources:
  - title: "Domino 14.5 Mandated Port Encryption Hands-On — CheckPortEncryption Agent, portenc Commands, and Recovery Paths"
    url: "https://bryanhsiao.github.io/domino-news/en/posts/mandated-port-encryption-enabling/"
  - title: "Enabling mandated NRPC port encryption"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/enabling_mandated_nrpc_port_encryption.html"
relatedConsoleCommands:
  - "load portenc -log"
  - "load portenc -enforce"
notesIniSettings:
  - "PORT_ENC_POLICY=1"
  - "PORT_ENC_POLICY=2"
draft: true
---
<!--
REJECTED DRAFT - URL gate FAILED, 1 source URL(s) are not reachable:
  - 200 https://help.hcl-software.com/domino/14.5.1/admin/enabling_mandated_nrpc_port_encryption.html
attempt: 1
slug: domino-14-5-mandated-port-encryption
-->

## Why Mandated NRPC Port Encryption Matters

With the release of Domino 14.5, HCL introduced a feature that many of us have been waiting for: mandated NRPC (Notes Remote Procedure Call) port encryption. This isn't just a nice-to-have; it's a critical step in securing server-to-server communications. If you've ever worried about unencrypted traffic between your Domino servers, this is your solution.

## Prerequisites

Before diving in, ensure you have:

- **Primary Administration Server**: Running Domino 14.5 or later. Other servers in your domain can be on earlier versions; the `CheckPortEncryption` agent will handle them.

- **Server Address Book Design**: Upgraded to the 14.5 template.

- **Adoption Plan**: A two-stage approach—start with logging, then move to enforcement. Skipping straight to enforcement is a recipe for headaches.

## Step-by-Step Implementation

### 1. Upgrade the Server Address Book Design

First things first, update your server's address book to the 14.5 design. This ensures all necessary fields and agents are in place.

### 2. Enable Logging Mode

Start by setting the `PORT_ENC_POLICY` in your server's `notes.ini` to `1`:

```ini
PORT_ENC_POLICY=1
```

This mode logs unencrypted connections without enforcing encryption, allowing you to identify and address issues before full enforcement.

### 3. Run the Port Encryption Logging Task

At the server console, execute:

```bash
load portenc -log
```

This command logs all unencrypted NRPC connections. Review the logs to identify servers or clients not using encryption.

### 4. Address Unencrypted Connections

Use the `CheckPortEncryption` agent to scan and report on unencrypted connections. This agent helps pinpoint where encryption isn't being used, so you can take corrective action.

### 5. Enable Enforcement Mode

Once all unencrypted connections are addressed, change the `PORT_ENC_POLICY` to `2`:

```ini
PORT_ENC_POLICY=2
```

This setting enforces encryption, blocking any unencrypted NRPC connections.

### 6. Run the Port Encryption Enforcement Task

At the server console, execute:

```bash
load portenc -enforce
```

This command enforces encryption across all NRPC connections.

## Gotchas to Watch For

- **Skipping Logging Mode**: Don't. Jumping straight to enforcement can disrupt server communications if unencrypted connections exist.

- **Outdated Server Versions**: Ensure all servers are compatible. The `CheckPortEncryption` agent helps identify servers that need updates.

- **Client Compatibility**: Verify that all clients support NRPC encryption to prevent access issues.

## To Review

Implementing mandated NRPC port encryption in Domino 14.5 is a straightforward process that significantly enhances your server's security. By following the steps above—starting with logging, addressing unencrypted connections, and then enforcing encryption—you'll ensure secure server-to-server communications without unnecessary disruptions.

For a detailed walkthrough, refer to the [Domino 14.5 Mandated Port Encryption Hands-On](https://bryanhsiao.github.io/domino-news/en/posts/mandated-port-encryption-enabling/) guide. Additionally, the official HCL documentation on [Enabling mandated NRPC port encryption](https://help.hcl-software.com/domino/14.5.1/admin/enabling_mandated_nrpc_port_encryption.html) provides comprehensive instructions.

Remember, security isn't a one-time setup. Regularly review your configurations and stay updated with the latest Domino releases to keep your environment secure.
