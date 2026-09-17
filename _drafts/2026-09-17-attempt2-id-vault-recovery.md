---
title: "Recovering and Managing User IDs with HCL Domino's ID Vault"
description: "A hands-on guide for Domino administrators on setting up, recovering, and managing user IDs using the ID Vault to ensure security and compliance."
pubDate: "2026-09-17T23:23:03+08:00"
slug: "id-vault-recovery"
tags:
  - "Tutorial"
  - "ID Vault"
  - "Backup and Recovery"
sources:
  - title: "ID vault backup and recovery"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/conf_idvaultbackupandrecovery_c.html"
  - title: "Creating and configuring an ID vault"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/conf_creatingandconfiguringanidvault_t.html"
  - title: "SECidvResetUserPassword - HCL Domino C API Documentation"
    url: "https://opensource.hcltechsw.com/domino-c-api-docs/reference/Func/SECidvResetUserPassword/"
relatedConsoleCommands:
  - "load ca"
  - "tell adminp process all"
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: id-vault-recovery
topicOverlap: false
issues:
  [critical] Reset the User's Password: using the `SECidvResetUserPassword` function in the Domino C API
      problem: The article presents the C API function SECidvResetUserPassword as the way an administrator resets a password in the ID Vault. This is a developer-facing C API call, not an administrative procedure. The normal administrative password reset is performed through the Domino Administrator client (People & Groups tab > select user > Tools > Reset Password) or via the ID Vault management UI, which triggers a reset token the user picks up on next login. Telling a production administrator to use a C API function as the recovery procedure is misleading and not actionable without custom code; a reader following this literally would be unable to perform the recovery.
      fix:     Replace the C API reference with the actual admin UI procedure: in HCL Domino Administrator, go to the People & Groups tab, select the user, click Tools > Reset Password (or use the ID Vault tab under Security). Optionally note that SECidvResetUserPassword exists for developers building custom tooling, but is not the standard admin recovery path.
  [critical] Restore: delete the corrupted database file and replace it with a recent backup
      problem: The instruction to simply delete the vault NSF and drop in a backup copy is dangerous and incomplete. The ID Vault is replicated and its configuration is recorded in the Domino Directory (AdminP requests, policy documents, and the vault's replica ID are all linked). Replacing the NSF without reconciling the replica ID and re-establishing replication agreements can leave the vault in an inconsistent state, or cause the server to re-create a blank vault. Additionally, no mention is made of stopping the server or the vault task before replacing the file, which risks file-level corruption on Windows where the file may be locked.
      fix:     Reference the HCL documentation restore procedure explicitly: use the ID vault backup and recovery guide steps which include disabling vault access, restoring through proper AdminP or replica reconciliation steps, and verifying vault-to-directory linkage after restore. At minimum, warn that a raw file-copy restore requires the server to be stopped and the replica ID/directory linkage to be verified afterward.
  [major] Assign Users to the Vault: use policies to assign user IDs to the vault
      problem: The article states that policies ensure IDs are 'automatically uploaded to the vault once the policy takes effect,' but omits the important caveat that the ID is only uploaded to the vault when the Notes client next connects and processes the policy. Users who are offline or on older clients (pre-8.5.1, when the ID Vault was introduced) will not upload their ID automatically. Additionally, an administrator can manually push an ID to the vault via the Domino Administrator without waiting for policy propagation, which is an important operational alternative.
      fix:     Add a note that the upload happens on the next client-server connection after policy application, that offline users will not be covered until they reconnect, and that admins can manually upload IDs via the Domino Administrator as an alternative.
  [major] User Retrieves the ID: the client will automatically download the ID from the vault
      problem: The article oversimplifies the retrieval flow. The user does not simply 'log into Notes' and get the ID downloaded transparently. If the user has no local ID file at all (true loss), they must use the 'More Options > Recover your Notes ID from your ID Vault' path on the Notes login screen, supplying their internet password and the reset password. The flow differs depending on whether the user still has a local ID (password reset only) versus a fully lost ID (full recovery). This distinction matters operationally.
      fix:     Split the recovery description into two scenarios: (1) password forgotten but ID file present — user logs in with reset password; (2) ID file lost — user must use the ID Vault recovery option on the Notes login dialog. Describe the steps for both.
  [major] Backup: Use your preferred backup method to regularly back up the vault database
      problem: The article gives no guidance on whether the vault NSF can be backed up online (with the server running) or requires special handling. Because the vault NSF contains encrypted ID files, a crash-consistent backup is important. There is also no mention of replicating the vault to a second server as the recommended HA and backup strategy, which HCL documentation explicitly recommends.
      fix:     Note that HCL recommends replicating the ID Vault to at least one additional server as the primary resilience strategy. If using file-level backup, follow the same considerations as any other Domino NSF (transaction logging, Domino-aware backup agents) and note that the vault replica on another server provides the most reliable recovery path.
  [minor] YouTube link: utm_source=openai
      problem: The video URL contains 'utm_source=openai', indicating it was generated by an AI tool rather than curated by the author. This raises authenticity concerns and should not be published as-is. The video should be independently verified to confirm it is the correct, current HCL-produced content.
      fix:     Verify the video is the intended HCL resource, then remove or replace the utm_source=openai tracking parameter with a clean URL.
  [minor] Article introduction / overall framing
      problem: No version constraint is stated anywhere. The ID Vault was introduced in Domino 8.5.1. Readers on older environments (rare but possible in large enterprises) would find some procedures inapplicable. The cited URLs reference 14.5.1 documentation but the article body does not mention any version requirement.
      fix:     Add a brief note at the top stating that the ID Vault requires HCL Domino 8.5.1 or later and that the documentation links reference version 14.5.1.
-->

## Setting Up the ID Vault

First things first: if you haven't set up the ID Vault, you're missing out on a crucial tool for managing user IDs. Here's how to get it up and running:

1. **Create the Vault Database**: In the Domino Administrator, navigate to the Configuration tab. Under Security, select 'ID Vaults' and click 'Create'.

2. **Configure Vault Settings**: Assign a vault administrator, specify which organizations trust the vault, and set up password reset authorities.

3. **Assign Users to the Vault**: Use policies to assign user IDs to the vault. This ensures that user IDs are automatically uploaded to the vault once the policy takes effect.

For a detailed walkthrough, refer to the official documentation on [Creating and configuring an ID vault](https://help.hcl-software.com/domino/14.5.1/admin/conf_creatingandconfiguringanidvault_t.html).

## Recovering a User ID

When a user loses their ID file or forgets their password, the ID Vault simplifies the recovery process:

1. **Reset the User's Password**: As an administrator, you can reset the user's password directly in the vault. This can be done using the `SECidvResetUserPassword` function in the Domino C API.

2. **User Retrieves the ID**: Once the password is reset, the user can retrieve their ID file by logging into Notes. The client will automatically download the ID from the vault.

For more technical details, see the [SECidvResetUserPassword - HCL Domino C API Documentation](https://opensource.hcltechsw.com/domino-c-api-docs/reference/Func/SECidvResetUserPassword/).

## Backing Up and Restoring the ID Vault

Regular backups of the ID Vault are essential. Here's how to handle them:

1. **Backup**: Use your preferred backup method to regularly back up the vault database.

2. **Restore**: If the vault becomes corrupted, delete the corrupted database file and replace it with a recent backup. Avoid using the 'Manage' or 'Delete' tools in the Domino Administrator for this purpose, as they can remove the vault configuration.

Detailed instructions are available in the [ID vault backup and recovery](https://help.hcl-software.com/domino/14.5.1/admin/conf_idvaultbackupandrecovery_c.html) guide.

## To Review

Setting up and maintaining the ID Vault is a straightforward process that pays dividends in user ID management and security. Regular backups and understanding the recovery process are key to ensuring smooth operations. For a visual guide on resetting a Notes ID password in the ID Vault, check out this video:

[HCL Domino - Reset Notes ID Password in Notes ID Vault](https://www.youtube.com/watch?v=7m-3PYAvzlQ&utm_source=openai)
