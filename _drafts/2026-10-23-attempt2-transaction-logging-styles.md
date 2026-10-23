---
title: "Understanding and Configuring Transaction Logging Styles in HCL Domino"
description: "A practical guide to configuring and managing transaction logging styles in HCL Domino for optimal performance and recovery."
pubDate: "2026-10-23T17:49:09+08:00"
slug: "transaction-logging-styles"
tags:
  - "Domino Server"
  - "Transaction Logging"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Transaction logging with backup and restore"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/admn_backupandrestorerequirements.html"
  - title: "TRANSLOG_Style – Transaction Log Style (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/translog_style/"
relatedConsoleCommands: []
notesIniSettings:
  - "TRANSLOG_Style"
  - "TRANSLOG_Path"
  - "TRANSLOG_Status"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Body must have >= 2 inline links, got 1.
attempt: 2
slug: transaction-logging-styles
-->

## Understanding and Configuring Transaction Logging Styles in HCL Domino

Transaction logging in HCL Domino is a critical feature that captures all changes made to databases, ensuring data integrity and facilitating efficient recovery processes. Choosing the appropriate logging style—circular, linear, or archived—is essential for balancing performance, backup strategies, and recovery requirements.

### Circular Logging

**Overview:**

Circular logging reuses a fixed amount of disk space (up to 4GB) for transaction logs. Once the allocated space is filled, Domino overwrites the oldest transactions with new ones. This method is straightforward and requires minimal administrative effort.

**Configuration:**

1. **Enable Transaction Logging:**

   - Navigate to the Domino Administrator.
   - Click on the **Configuration** tab.
   - Expand the **Server** section and select **All Server Documents**.
   - Open the Server document for the desired server.
   - Click the **Transactional Logging** tab.
   - Set **Transactional Logging** to **Enabled**.

2. **Set Logging Style:**

   - In the **Logging style** field, select **Circular**.

3. **Specify Log Path:**

   - Enter the path for the transaction logs in the **Log path** field. It's recommended to use a dedicated, mirrored disk for optimal performance.

4. **Allocate Log Space:**

   - For circular logging, you can allocate up to 4GB. Set the desired size in the **Maximum log space** field.

5. **Save and Restart:**

   - Save the Server document and restart the Domino server for changes to take effect.

**Considerations:**

- **Backup Strategy:** Since circular logging overwrites old transactions, ensure that your backup schedule captures all necessary data before it's overwritten.

- **Performance:** Circular logging offers improved performance and faster recovery from crashes but doesn't support point-in-time recovery.

### Linear Logging

**Overview:**

Linear logging functions similarly to circular logging but allows for more than 4GB of log space. This style is suitable when the log size needed between full database backups exceeds 4GB.

**Configuration:**

Follow the same steps as for circular logging, but in the **Logging style** field, select **Linear**.

**Considerations:**

- **Disk Space:** Ensure sufficient disk space is available, as linear logging can consume more than 4GB.

- **Backup Strategy:** Similar to circular logging, regular backups are essential to prevent data loss.

### Archived Logging

**Overview:**

Archived logging creates log files as needed and doesn't overwrite them until they are archived. This style supports incremental backups and point-in-time recovery but requires more administrative effort and a backup utility that supports Domino's transaction logging.

**Configuration:**

1. **Enable Transaction Logging:**

   - Follow the same steps as for circular logging to enable transaction logging.

2. **Set Logging Style:**

   - In the **Logging style** field, select **Archived**.

3. **Specify Log Path:**

   - Enter the path for the transaction logs in the **Log path** field. A dedicated, mirrored disk is recommended.

4. **Configure Backup Utility:**

   - Implement a backup utility that supports Domino's transaction logging to archive log files appropriately.

5. **Save and Restart:**

   - Save the Server document and restart the Domino server for changes to take effect.

**Considerations:**

- **Backup Utility:** A compatible backup utility is mandatory to manage and archive log files.

- **Administrative Overhead:** Archived logging requires careful management to prevent disk space exhaustion.

- **Recovery:** Supports point-in-time recovery, allowing restoration to a specific moment.

### Notes.ini Parameters

For advanced configurations, you can modify the following `notes.ini` parameters:

- **TRANSLOG_Style:** Determines the logging style.

  - `0` = Circular (default)
  - `1` = Archived

- **TRANSLOG_Path:** Specifies the directory path for transaction log files.

- **TRANSLOG_Status:** Enables (`1`) or disables (`0`) transaction logging.

**Example Configuration:**

```ini
TRANSLOG_Status=1
TRANSLOG_Style=0
TRANSLOG_Path=D:\Domino\txn
```

**Note:** Changes to `notes.ini` require a server restart to take effect.

### Best Practices

- **Dedicated Disk:** Store transaction logs on a dedicated, mirrored disk to enhance performance and data integrity.

- **Regular Backups:** Align your backup strategy with the chosen logging style to ensure data is not lost.

- **Monitor Disk Space:** Regularly monitor disk usage to prevent issues related to insufficient space, especially with archived logging.

- **Test Recovery Procedures:** Periodically test your recovery procedures to ensure they function correctly when needed.

For a visual guide on enabling transaction logging in HCL Domino, you might find this video helpful:

[How to Enable Transaction Logging in HCL Domino v10 v11](https://www.youtube.com/watch?v=ikEghnliYXs)

## To Review

Selecting the appropriate transaction logging style in HCL Domino is crucial for balancing performance, backup strategies, and recovery capabilities. Circular logging is straightforward and suitable for environments where point-in-time recovery isn't necessary. Linear logging extends the log size beyond 4GB, accommodating larger data changes between backups. Archived logging offers comprehensive recovery options but demands more administrative oversight and compatible backup solutions. Carefully assess your organization's needs and resources to choose the most suitable logging style.
