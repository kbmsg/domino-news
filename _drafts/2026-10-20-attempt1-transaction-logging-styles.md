---
title: "Understanding and Configuring Transaction Logging Styles in HCL Domino"
description: "A practical guide to the three transaction logging styles in HCL Domino—circular, linear, and archived—including their configurations, benefits, and considerations for backup and recovery."
pubDate: "2026-10-20T17:54:04+08:00"
slug: "transaction-logging-styles"
tags:
  - "Domino Server"
  - "Transaction Logging"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Server document - Transactional Logging tab"
    url: "https://help.hcl-software.com/domino/9.0.1/admin/admin/othr_serverdocumenttransactionalloggingtab_t.html"
  - title: "Transaction logging with backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestorerequirements.html?scLang=zh-Hant"
  - title: "Setting up a Domino server for transaction logging"
    url: "https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html"
  - title: "TRANSLOG_Path – Transaction Log Directory (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/translog_path/"
relatedConsoleCommands: []
notesIniSettings:
  - "TRANSLOG_Path"
  - "TRANSLOG_Status"
  - "TRANSLOG_Style"
  - "TRANSLOG_MaxSize"
  - "TRANSLOG_Performance"
  - "TRANSLOG_AutoFixup"
  - "TRANSLOG_UseAll"
draft: true
---
<!--
REJECTED DRAFT - Expected ',' or '}' after property value in JSON at position 8663 (line 64 column 24)
attempt: 1
slug: transaction-logging-styles
-->

## Understanding and Configuring Transaction Logging Styles in HCL Domino

Transaction logging in HCL Domino is a critical feature that captures changes made to databases, enhancing data integrity, improving performance, and facilitating rapid recovery from crashes. However, choosing the appropriate logging style—circular, linear, or archived—is essential to align with your server's operational requirements and backup strategies.

### Circular Logging

**Overview:**

Circular logging reuses a fixed amount of disk space (up to 4GB) for transaction logs. Once the allocated space is filled, Domino overwrites the oldest transactions with new ones. This method is straightforward and suitable for environments where the log size needed between full database backups is less than 4GB.

**Configuration Steps:**

1. **Enable Transaction Logging:**
   - Navigate to the Domino Administrator.
   - Click on the **Configuration** tab.
   - Expand the **Server** section and select **All Server Documents**.
   - Choose the server document you wish to modify and click **Edit Server**.

2. **Configure Transaction Logging:**
   - Go to the **Transactional Logging** tab.
   - Set **Transactional Logging** to **Enabled**.
   - Choose **Circular** as the **Logging Style**.
   - Specify the **Log Path**—ideally, a dedicated, mirrored device for optimal performance.
   - Set **Use all available space on log device** to **Yes** if the log device is solely for transaction logs.
   - Define the **Maximum log space** (up to 4096MB).

3. **Restart the Server:**
   - Save the server document.
   - Restart the Domino server for changes to take effect.

**Considerations:**

- **Backup Strategy:** Regular backups are crucial since older transactions are overwritten as the log fills up. Ensure backups are scheduled to capture database changes before they are lost.

- **Performance:** Circular logging offers improved performance and quick recovery from crashes but lacks point-in-time recovery capabilities.

*Source: [Server document - Transactional Logging tab](https://help.hcl-software.com/domino/9.0.1/admin/admin/othr_serverdocumenttransactionalloggingtab_t.html)*

### Linear Logging

**Overview:**

Linear logging functions similarly to circular logging but allows for more than 4GB of log space. This style is beneficial when the log size needed between full database backups exceeds 4GB, and archived media is not utilized.

**Configuration Steps:**

Follow the same steps as for circular logging, but select **Linear** as the **Logging Style** in the **Transactional Logging** tab.

**Considerations:**

- **Disk Space:** Ensure sufficient disk space is available, as linear logging does not overwrite old transactions until the allocated space is exhausted.

- **Backup Strategy:** Similar to circular logging, regular backups are necessary to prevent data loss.

*Source: [Setting up a Domino server for transaction logging](https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html)*

### Archived Logging

**Overview:**

Archived logging creates log files as needed and does not overwrite them until they are archived. This style supports incremental backups and point-in-time recovery, making it suitable for environments requiring detailed recovery options.

**Configuration Steps:**

1. **Enable Transaction Logging:**
   - Follow the initial steps outlined for circular logging.

2. **Configure Transaction Logging:**
   - In the **Transactional Logging** tab, set **Transactional Logging** to **Enabled**.
   - Choose **Archived** as the **Logging Style**.
   - Specify the **Log Path**—preferably a dedicated, mirrored device.
   - Set **Use all available space on log device** to **Yes**.
   - Define the **Maximum log space** based on your storage capacity and backup strategy.

3. **Restart the Server:**
   - Save the server document.
   - Restart the Domino server for changes to take effect.

**Considerations:**

- **Backup Strategy:** Implement a backup utility capable of archiving transaction logs to prevent disk space exhaustion. Without proper archiving, the server may continue creating log extents until the disk is full, potentially causing server issues.

- **Complexity:** Archived logging requires more administrative effort to manage backups and ensure logs are archived appropriately.

*Source: [Transaction logging with backup and restore](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestorerequirements.html?scLang=zh-Hant)*

### Additional Configuration via `notes.ini`

For more granular control over transaction logging, you can configure the following `notes.ini` parameters:

- **TRANSLOG_Path:** Specifies the directory where transaction logs are stored. It's recommended to use a dedicated, mirrored disk for optimal performance.

- **TRANSLOG_Status:** Enables (`1`) or disables (`0`) transaction logging.

- **TRANSLOG_Style:** Sets the logging style: `0` for Circular, `1` for Linear, and `2` for Archived.

- **TRANSLOG_MaxSize:** Defines the maximum size of the transaction log in MB.

- **TRANSLOG_Performance:** Balances runtime performance and restart recovery time. Options include:
  - `1` (Favor runtime)
  - `2` (Standard)
  - `3` (Favor restart recovery time)

- **TRANSLOG_AutoFixup:** Enables (`1`) or disables (`0`) automatic fixup of corrupt databases.

- **TRANSLOG_UseAll:** Determines whether to use all available space on the log device (`1` for Yes, `0` for No).

*Source: [TRANSLOG_Path – Transaction Log Directory (HCL Domino)](https://www.madicon.de/notes-ini-parameters/en/translog_path/)*

## To Review

Selecting the appropriate transaction logging style in HCL Domino is vital for balancing performance, recovery capabilities, and administrative overhead. Circular and linear logging are simpler to manage but offer limited recovery options, while archived logging provides comprehensive recovery features at the cost of increased complexity. Assess your organization's needs and backup strategies to determine the most suitable logging style for your environment.
