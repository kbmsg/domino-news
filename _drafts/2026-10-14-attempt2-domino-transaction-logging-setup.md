---
title: "Setting Up Transaction Logging in HCL Domino"
description: "A hands-on guide for Domino administrators to configure transaction logging for improved database performance and recovery."
pubDate: "2026-10-14T18:00:57+08:00"
slug: "domino-transaction-logging-setup"
tags:
  - "Domino Server"
  - "Transaction Logging"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Preparing for transaction logging"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/admn_preparingfortransactionlogging_t.html"
  - title: "Transaction logging with backup and restore"
    url: "https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html"
  - title: "TRANSLOG_Path – Transaction Log Directory (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/translog_path/"
relatedConsoleCommands: []
notesIniSettings:
  - "TRANSLOG_Status"
  - "TRANSLOG_Path"
  - "TRANSLOG_Style"
  - "TRANSLOG_Performance"
draft: true
---
<!--
REJECTED DRAFT - Expected ',' or '}' after property value in JSON at position 8187 (line 61 column 169)
attempt: 2
slug: domino-transaction-logging-setup
-->

## Why Enable Transaction Logging?

If you're managing a Domino server, enabling transaction logging isn't just a nice-to-have—it's essential. It boosts database performance, ensures faster recovery after crashes, and is a prerequisite for features like Domino Attachment and Object Service (DAOS). Plus, it allows for incremental backups and point-in-time recovery, which can be lifesavers when things go south.

## Choosing the Right Logging Style

Domino offers three transaction logging styles:

- **Circular Logging**: Uses up to 4GB of disk space, overwriting the oldest transactions once the limit is reached. It's straightforward but doesn't support point-in-time recovery. Suitable if your log size between full backups is under 4GB.

- **Linear Logging**: Similar to circular but allows more than 4GB. Opt for this if your logs exceed 4GB between full backups and you're not using archive media.

- **Archived Logging**: Creates log files as needed without overwriting them until they're archived. This supports point-in-time recovery but requires a compatible backup utility. Be cautious: without proper backup, the server can fill up the disk and panic. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.1/admin/admn_preparingfortransactionlogging_t.html?utm_source=openai))

## Setting Up Transaction Logging

1. **Plan Your Log Storage**: Allocate a dedicated, mirrored device (like RAID 1) for the transaction logs. This setup enhances performance and data integrity. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.1/admin/admn_preparingfortransactionlogging_t.html?utm_source=openai))

2. **Configure the Server Document**:

   - Open the Domino Administrator and navigate to the Configuration tab.

   - Expand the Server section and select All Server Documents.

   - Choose the server you want to configure and click Edit Server.

   - Go to the Transactional Logging tab and set the following:

     - **Transactional Logging**: Enabled

     - **Log Path**: Enter the path to your dedicated log device.

     - **Logging Style**: Choose Circular, Linear, or Archived based on your needs.

     - **Use all available space on log device**: Yes (if using a dedicated device)

     - **Maximum Log Space**: Set according to your storage capacity and logging style. ([ibm.com](https://www.ibm.com/docs/en/domino/10.0.0?topic=logging-setting-up-domino-server-transaction&utm_source=openai))

3. **Update `notes.ini` Settings**:

   - Ensure the following parameters are set:

     ```
     TRANSLOG_Status=1
     TRANSLOG_Path=Your_Log_Path
     TRANSLOG_Style=0 or 1 (depending on your choice)
     TRANSLOG_Performance=2 (default; adjust based on performance needs)
     ```

     ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

4. **Restart the Server**: For the changes to take effect, restart your Domino server.

## Post-Setup Considerations

- **Backup Strategy**: Plan for daily incremental backups and weekly full backups. This ensures you're prepared for media failures. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.1/admin/admn_preparingfortransactionlogging_t.html?utm_source=openai))

- **Monitor Disk Space**: Especially with archived logging, keep an eye on disk usage to prevent the server from running out of space.

- **Database Instance ID (DBIID)**: Be aware that certain actions, like disabling and re-enabling transaction logging or running Fixup, change the DBIID. When this happens, take a new full backup to maintain backup consistency. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

## To Review

Enabling transaction logging in Domino is a straightforward process that pays off in enhanced performance and recovery capabilities. By carefully selecting your logging style, configuring the server appropriately, and maintaining a solid backup strategy, you'll ensure your Domino environment is robust and resilient.
