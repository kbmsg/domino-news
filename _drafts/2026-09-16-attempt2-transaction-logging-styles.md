---
title: "Understanding and Configuring Transaction Logging Styles in HCL Domino"
description: "A comprehensive guide to configuring and managing transaction logging styles in HCL Domino to enhance database performance and recovery capabilities."
pubDate: "2026-09-16T23:13:04+08:00"
slug: "transaction-logging-styles"
tags:
  - "Domino Server"
  - "Transaction Logging"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Changing transaction logging settings"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_changingtransactionloggingsettings_t.html?scLang=en"
  - title: "Transaction logging with backup and restore"
    url: "https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html"
  - title: "TRANSLOG_Style – Transaction Log Style (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/translog_style/"
relatedConsoleCommands: []
notesIniSettings:
  - "TRANSLOG_Style"
  - "TRANSLOG_Status"
  - "TRANSLOG_Path"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Inline-link diversity check failed: "https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai" appears 3/4 times in inline links (>50%). Likely a copy-paste error, each anchor should point to its own destination.
attempt: 2
slug: transaction-logging-styles
-->

Transaction logging in HCL Domino is a critical feature that captures all changes made to databases, ensuring data integrity and facilitating efficient recovery processes. By understanding and configuring the appropriate transaction logging style, administrators can optimize server performance and enhance backup and recovery operations.

## Overview of Transaction Logging Styles

HCL Domino offers three transaction logging styles: Circular, Linear, and Archive. Each style serves different operational needs and has distinct implications for backup and recovery strategies.

### Circular Logging

In Circular logging, Domino utilizes a fixed amount of disk space (up to 4 GB) for transaction logs. Once this space is filled, the oldest log data is overwritten by new transactions. This method is straightforward and requires minimal administrative effort but does not support point-in-time recovery or incremental backups. It's suitable for environments where the volume of changes between full backups is low. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai))

### Linear Logging

Linear logging functions similarly to Circular logging but allows for a larger log file size, configurable via the `TRANSLOG_MaxSize` parameter. This style is beneficial when the volume of changes between full backups exceeds 4 GB, yet the organization does not require the complexities of Archive logging. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai))

### Archive Logging

Archive logging retains all transaction logs until they are backed up and marked as archived. This style supports point-in-time recovery and incremental backups, making it ideal for environments with high data criticality. However, it necessitates a compatible backup solution to manage the growing log files effectively. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai))

## Configuring Transaction Logging

To configure transaction logging on your Domino server:

1. **Backup Databases**: Before making changes, perform a full backup of all databases to prevent data loss.

2. **Access Server Document**:
   - Open the Domino Administrator.
   - Navigate to the **Configuration** tab.
   - Open the **Server** document for the server you wish to configure.

3. **Edit Transaction Logging Settings**:
   - Click **Edit Server**.
   - Go to the **Transactional Logging** tab.
   - Set **Transactional Logging** to **Enabled**.
   - Specify the **Log path** where transaction logs will be stored. It's recommended to use a dedicated, mirrored disk for optimal performance.
   - Choose the appropriate **Logging style** (Circular, Linear, or Archive) based on your operational requirements.

4. **Save and Restart**:
   - Click **Save & Close**.
   - Restart the Domino server to apply the changes.

After enabling transaction logging, it's crucial to perform a full backup of all databases, as Domino assigns new Database Instance IDs (DBIIDs) to each database. This step ensures that your backup system recognizes the databases correctly. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.0.0/admin/admn_changingtransactionloggingsettings_t.html?scLang=en&utm_source=openai))

## Best Practices

- **Dedicated Storage**: Store transaction logs on a separate, mirrored disk to enhance performance and reliability.

- **Regular Backups**: Implement a consistent backup schedule, especially when using Archive logging, to prevent the transaction log volume from consuming excessive disk space.

- **Monitor Log Size**: Regularly monitor the size of transaction logs to ensure they do not exceed the allocated disk space, which could impact server performance.

By carefully selecting and configuring the appropriate transaction logging style, Domino administrators can significantly improve database performance, ensure data integrity, and streamline recovery processes.
