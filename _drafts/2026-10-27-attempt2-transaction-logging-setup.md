---
title: "Setting Up Transaction Logging in HCL Domino"
description: "A practical guide for Domino administrators on configuring transaction logging to enhance database integrity and streamline backup processes."
pubDate: "2026-10-27T18:17:48+08:00"
slug: "transaction-logging-setup"
tags:
  - "Domino Server"
  - "Transaction Logging"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Setting up a Domino server for transaction logging"
    url: "https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html"
  - title: "Transaction logging with backup and restore"
    url: "https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html"
  - title: "TRANSLOG_Path – Transaction Log Directory (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/translog_path/"
relatedConsoleCommands: []
notesIniSettings:
  - "TRANSLOG_Path"
  - "TRANSLOG_Style"
  - "TRANSLOG_MaxSize"
  - "TRANSLOG_Performance"
  - "TRANSLOG_AutoFixup"
  - "TRANSLOG_UseAll"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: transaction-logging-setup
topicOverlap: false
issues:
  [critical] For optimal performance, use a dedicated, mirrored disk (RAID 0 or 1)
      problem: RAID 0 is a striping array with NO redundancy and NO fault tolerance. Recommending RAID 0 for transaction logs is dangerous: a single disk failure in a RAID 0 set destroys all log data and will likely cause an unrecoverable database situation. The article appears to conflate RAID 0 with RAID 1 (mirroring). HCL and IBM documentation has always recommended a dedicated RAID 1 (or RAID 1+0) volume for transaction logs precisely because of the write-intensive, sequential nature of the workload and the need for resilience.
      fix:     Remove RAID 0 entirely. Recommend a dedicated RAID 1 (mirrored) or RAID 1+0 volume. Example: 'For optimal performance and data safety, use a dedicated mirrored disk (RAID 1) with its own controller.'
  [critical] Linear: Similar to circular but allows log sizes greater than 4GB
      problem: This description of the Linear logging style is incorrect and misleading. Linear logging fills log files sequentially and does NOT reuse them until explicitly backed up or purged; it is not simply 'circular with larger size'. Linear logging can fill the log partition and halt the server if the logs are not archived or purged. It is rarely recommended for production use and is functionally distinct from circular in an important operational way. A reader who deploys Linear expecting 'circular but bigger' may find their server halted due to a full log partition.
      fix:     Accurately describe Linear: logs are written sequentially and NOT automatically reused. The partition will fill unless an external process archives and removes log extents. Note that this style is uncommon in practice and carries the risk of halting the server if the log device fills. Recommend Archived style for incremental backup scenarios instead.
  [major] Maximum log space (default is 500MB; maximum is 4096MB)
      problem: The stated maximum of 4096 MB (4 GB) for the TRANSLOG_MaxSize setting is outdated. In more recent Domino releases this ceiling was raised. Quoting a hard 4096 MB maximum as universal may cause administrators on newer releases to under-provision their log space needlessly. Additionally, 500 MB is a very small default for any production workload and no caveat is given about sizing for busy servers.
      fix:     Note that the 4096 MB figure applied to older releases and administrators should consult the HCL documentation for their specific Domino version. Add a practical caveat that 500 MB is likely insufficient for busy production servers and log space should be sized according to workload and backup frequency.
  [major] ensure all databases you want to log are in the Domino data directory or its subdirectories
      problem: Transaction logging in Domino logs ALL databases that have the 'logged' property set (or that are eligible by default). Databases outside the data directory path simply cannot be logged, but the article omits the important point that the logging attribute is set per-database (the DBIID must be recorded at full-backup time) and that databases created before transaction logging was enabled must have a full backup taken before their transaction logs are useful for recovery. The article does mention a full backup post-configuration but does not connect it to the per-database DBIID requirement.
      fix:     Add a note that each database receives a Database Instance ID (DBIID) when transaction logging is enabled or when the database is first opened after enablement, and that a full backup must be taken immediately after enabling transaction logging before incremental/log-based recovery is valid for any database.
  [major] Archived: Reuses log files after they're archived. Necessary for incremental backups and point-in-time recovery. Requires a third-party backup solution.
      problem: The article states Archived logging 'requires a third-party backup solution' without clarifying that HCL Domino itself does not ship a built-in log archiving agent — this is accurate — but it omits that the backup API (XBSA / Domino Backup introduced in Domino 12) can be used, and that without a properly integrated solution actively archiving the log extents, the server will stall when the log partition fills. The consequence of not having the archiving agent running is not mentioned.
      fix:     Explicitly warn that in Archived mode, if no backup/archiving agent is actively processing and removing filled log extents, the Domino server will halt all database writes when the log partition is full. Mention Domino 12's built-in Domino Backup feature as a potential option alongside third-party solutions.
  [major] Cited source: https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html
      problem: The article cites the Domino 10.0.1 documentation for a core configuration step while also citing 12.0.0 documentation elsewhere. Using 10.0.1 docs as the primary procedural reference for an article presumably targeting current deployments is inappropriate; behavior and UI may differ in Domino 12 and 14. Readers may follow outdated guidance.
      fix:     Update the primary citation to the latest available HCL Domino documentation (currently Domino 14.x series) and note any version-specific differences where applicable.
  [minor] ## To Review
      problem: The section header 'To Review' is an unusual and potentially confusing label for what is a summary/conclusion section. Standard technical article conventions use 'Summary' or 'Conclusion'.
      fix:     Rename the section to 'Summary' or 'Conclusion' for clarity.
  [minor] Navigate to the Configuration tab... Expand the Server section and select All Server Documents
      problem: The UI navigation path described is for the legacy HCL Domino Administrator fat client. There is no mention that this configuration can also be done via the Domino web-based Admin UI (Domino Administrator web client available since Domino 12), which some administrators may be using exclusively.
      fix:     Add a brief note that equivalent configuration is available through the Domino web-based Admin interface in Domino 12 and later.
-->

## Why Transaction Logging Matters

If you've ever faced the headache of restoring a Domino server after a crash, you know the pain of inconsistent databases and lengthy recovery times. That's where transaction logging comes in. By capturing all changes made to databases, transaction logging ensures data integrity and significantly speeds up recovery processes. Plus, it enables incremental backups, saving both time and storage.

## Preparing for Transaction Logging

Before diving in, ensure all databases you want to log are in the Domino data directory or its subdirectories. This setup is crucial for the logging process to function correctly.

## Configuring Transaction Logging

1. **Access the Server Document:**
   - Open the Domino Administrator.
   - Navigate to the **Configuration** tab.
   - Expand the **Server** section and select **All Server Documents**.
   - Choose the server you want to configure and click **Edit Server**.

2. **Enable Transaction Logging:**
   - Go to the **Transactional Logging** tab.
   - Set **Transactional Logging** to **Enabled**.

3. **Specify the Log Path:**
   - In the **Log path** field, enter the directory where transaction logs will be stored. For optimal performance, use a dedicated, mirrored disk (RAID 0 or 1) with its own controller. This setup prevents the logs from competing with database operations for disk access, enhancing both performance and data integrity. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

4. **Determine Log Space Usage:**
   - If you're dedicating an entire device to transaction logs, set **Use all available space on log device** to **Yes**.
   - Otherwise, specify the **Maximum log space** (default is 500MB; maximum is 4096MB). Domino will create log files up to this size.

5. **Configure Automatic Fixup:**
   - Set **Automatic fixup of corrupt databases** to **Enabled**. This ensures that if a database becomes corrupted and can't be recovered using the transaction log, Domino will automatically run the Fixup task. ([help.hcl-software.com](https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html?utm_source=openai))

6. **Adjust Performance Settings:**
   - Choose a **Runtime/Restart performance** option:
     - **Standard** (default): Regular checkpoints.
     - **Favor runtime**: Fewer checkpoints, improving runtime performance but extending restart recovery time.
     - **Favor restart recovery time**: More checkpoints, reducing restart recovery time but potentially impacting runtime performance.

7. **Select Logging Style:**
   - **Circular** (default): Reuses log files, overwriting old transactions. Suitable for crash recovery but doesn't support point-in-time recovery.
   - **Archived**: Reuses log files after they're archived. Necessary for incremental backups and point-in-time recovery. Requires a third-party backup solution.
   - **Linear**: Similar to circular but allows log sizes greater than 4GB. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

8. **Save and Restart:**
   - Save the Server document.
   - Restart the Domino server for the changes to take effect.

## Post-Configuration Steps

After enabling transaction logging:

- **Perform a Full Backup:**
  - It's essential to perform a full backup of all databases. This ensures that the transaction logs can be used effectively for recovery. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

- **Monitor Log Space:**
  - Regularly check the transaction log directory to ensure it doesn't run out of space, especially if you're using archived logging.

- **Integrate with Backup Solutions:**
  - If you're using archived logging, integrate Domino with a third-party backup solution that supports transaction logs. This setup enables point-in-time recovery and incremental backups.

## To Review

Setting up transaction logging in HCL Domino isn't just a checkbox—it's a strategic move to enhance your server's resilience and streamline backup processes. By following the steps outlined above, you'll ensure your databases are consistent, recoverable, and ready for whatever comes their way.
