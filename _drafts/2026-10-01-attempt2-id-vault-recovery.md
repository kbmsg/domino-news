---
title: "Recovering from ID Vault Corruption: A Hands-On Guide"
description: "A practical walkthrough for restoring a corrupted HCL Domino ID Vault, ensuring secure and efficient recovery of user IDs."
pubDate: "2026-10-01T19:28:18+08:00"
slug: "id-vault-recovery"
tags:
  - "Tutorial"
  - "ID Vault"
  - "Backup and Recovery"
sources:
  - title: "ID vault backup and recovery"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/conf_idvaultbackupandrecovery_c.html"
  - title: "ID recovery"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/conf_idrecovery_t.html"
  - title: "ID vault interoperability FAQ"
    url: "https://ds-infolib.hcltechsw.com/ldd/dominowiki.nsf/dx/ID_vault_interoperability_FAQ"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Inline-link diversity check failed: "https://help.hcl-software.com/domino/12.0.0/admin/conf_idvaultbackupandrecovery_c.html?utm_source=openai" appears 4/5 times in inline links (>50%). Likely a copy-paste error, each anchor should point to its own destination.
attempt: 2
slug: id-vault-recovery
-->

## Understanding the ID Vault

The ID Vault in HCL Domino is a server-based database that securely stores copies of Notes user IDs. It simplifies ID management by allowing administrators to recover lost or damaged IDs and reset passwords without direct user intervention. Users are assigned to a vault through policy configuration, and their IDs are uploaded automatically once the policy takes effect. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/conf_idvaultbackupandrecovery_c.html?utm_source=openai))

## Importance of Regular Backups

Regular backups of the ID Vault are crucial. If the vault database becomes corrupted, having a recent backup ensures that you can restore it without significant data loss. Use your preferred backup method and media to back up the vault database regularly. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/conf_idvaultbackupandrecovery_c.html?utm_source=openai))

## Restoring a Corrupted ID Vault

If you encounter a corrupted ID Vault, follow these steps to restore it:

1. **Delete the Corrupted Vault Database:**
   - Navigate to the server's file system.
   - Locate the corrupted vault database file.
   - Delete the corrupted file.

   **Important:** Do not use the Domino Administrator's "ID Vaults > Manage" or "ID Vaults > Delete" tools to remove the database file, as doing so will remove the vault configuration. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/conf_idvaultbackupandrecovery_c.html?utm_source=openai))

2. **Restore from Backup:**
   - Retrieve the most recent backup of the vault database.
   - Place the backup file in the original location of the vault database.

3. **Restart the Domino Server:**
   - Restart the server to ensure the restored vault database is recognized and operational.

## Alternative Recovery Method

If a recent backup is unavailable or if there are multiple vault servers, you can remove the ID Vault databases and configuration and then re-create the vault:

1. **Remove the Existing Vault:**
   - In the Domino Administrator, navigate to "ID Vaults > Delete" to remove the existing vault.

2. **Recreate the Vault:**
   - Use the "ID Vaults > Manage" tool to create a new vault.

   **Note:** When re-creating the vault, user IDs will be automatically uploaded again from clients to the vault. However, any changes previously made to copies of IDs in the vault that were not pushed to clients may be lost. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/conf_idvaultbackupandrecovery_c.html?utm_source=openai))

## Preventive Measures

To minimize the risk of ID Vault corruption and ensure smooth recovery:

- **Regular Backups:** Schedule regular backups of the ID Vault database.
- **Monitor Vault Health:** Regularly check the health and integrity of the vault database.
- **Document Recovery Procedures:** Maintain clear documentation of recovery procedures and ensure that administrative staff are trained to execute them.

By following these steps and best practices, you can ensure the integrity and availability of your HCL Domino ID Vault, thereby maintaining secure and efficient user ID management within your organization.

For a visual demonstration of resetting a Notes ID password in the ID Vault, you can refer to the following video:

[HCL Domino - Reset Notes ID Password in Notes ID Vault](https://www.youtube.com/watch?v=7m-3PYAvzlQ&utm_source=openai)
