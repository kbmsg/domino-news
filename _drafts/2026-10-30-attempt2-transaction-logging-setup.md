---
title: "Setting Up Transaction Logging in HCL Domino"
description: "A practical guide for Domino administrators on configuring transaction logging to enhance database integrity and streamline backup processes."
pubDate: "2026-10-30T19:15:47+08:00"
slug: "transaction-logging-setup"
tags:
  - "Domino Server"
  - "Transaction Logging"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Setting up a Domino server for transaction logging"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html"
  - title: "Transaction logging with backup and restore"
    url: "https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html"
  - title: "TRANSLOG_Path – Transaction Log Directory (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/translog_path/"
relatedConsoleCommands: []
notesIniSettings:
  - "TRANSLOG_Path"
  - "TRANSLOG_Style"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: transaction-logging-setup
topicOverlap: false
issues:
  [critical] For optimal performance, use a dedicated, mirrored disk (RAID 0 or 1)
      problem: RAID 0 is a striping array with NO redundancy — a single disk failure destroys all data on it. Recommending RAID 0 for a transaction log path (where data integrity is paramount) is actively harmful. A mirrored array is RAID 1. RAID 0 should never be recommended for a transaction log.
      fix:     Remove RAID 0 entirely. Recommend RAID 1 (mirroring) or RAID 10 for the dedicated log disk. If RAID 0 is mentioned at all, it must be explicitly flagged as providing NO fault tolerance.
  [critical] Linear: Similar to circular but allows log sizes greater than 4GB
      problem: This description of Linear logging is incorrect and dangerous. Linear logging does NOT simply allow larger log sizes. It writes sequentially and never wraps — once the allocated space is exhausted, Domino shuts down databases rather than overwriting old transactions. It is not intended for production use as a general alternative to Circular; it is primarily used with third-party backup APIs and has specific operational implications. Presenting it as 'like circular but bigger' could lead an administrator to choose it without understanding the shutdown risk.
      fix:     Accurately describe Linear logging: it writes transactions sequentially without wrapping. When the log space is full, Domino stops logging (and may shut down logged databases). It is intended for use with backup APIs that archive log extents. Warn administrators not to use it without a backup solution that actively drains completed log extents.
  [major] Maximum log space: Define the maximum size (in MB) for the transaction log. The default is 500MB, with a maximum of 4096MB (4GB).
      problem: The 4096 MB cap applied to older Domino releases. In more recent Domino versions the maximum log space ceiling was raised. Stating a hard 4 GB maximum without a version qualifier is misleading for administrators on current releases. Additionally, the 'maximum of 4096MB' constraint applies specifically to Circular logging; Linear logging has different space semantics.
      fix:     Add a version caveat: note that the 4 GB ceiling was a limit in earlier releases and administrators should consult the documentation for their specific Domino version. Clarify that this constraint applies to Circular logging.
  [major] Fixup task with the `-J` parameter on corrupted logged databases
      problem: The correct Fixup flag for transaction-logged databases is `-J` (uppercase), which tells Fixup to skip databases that are transaction logged (because their recovery is handled by the log). When Automatic Fixup is disabled and you need to run Fixup against a corrupt logged database that cannot be recovered from the log, the relevant flags are different. Using -J incorrectly can cause Fixup to skip the very database that needs repair. The article's phrasing conflates two distinct behaviors and could cause an administrator to run the wrong command.
      fix:     Clarify the distinction: `-J` tells Fixup to bypass transaction-logged databases (used in scheduled maintenance). To force Fixup on a corrupt logged database that the log cannot recover, the database may first need to be taken out of logging or the administrator should consult HCL support documentation for the correct procedure. Do not present `-J` as the flag to use when manually fixing a corrupt logged database.
  [major] After such a change, perform a full backup of all databases. (ibm.com citation)
      problem: The cited source is an IBM Docs URL for Domino 10.0.1. The article is about HCL Domino and should reference current HCL documentation. IBM no longer owns or maintains Domino; citing IBM docs as an authoritative source for a step an administrator will act on today is misleading and the documentation may be outdated.
      fix:     Replace the IBM Docs citation with the equivalent page in the HCL Software Help Center (help.hcl-software.com) for a current Domino release (12.x or 14.x).
  [major] With transaction logging enabled, you can perform incremental backups
      problem: Incremental (point-in-time) backup using transaction logs requires Archived logging style, not Circular. Circular logging does NOT support incremental or point-in-time backup — archived log extents are overwritten. This statement, placed under a general 'Backup Strategy' heading without that qualification, could lead an administrator running Circular logging to believe they can do incremental backups when they cannot.
      fix:     Explicitly state that incremental/point-in-time backup via transaction logs is only possible with Archived (or Linear) logging style combined with a compatible backup solution. Circular logging supports faster crash recovery but does NOT enable incremental backups.
  [minor] ensure all databases you want to log are located in the Domino data directory or its subdirectories
      problem: This is correct as a general statement but omits that databases placed on the log path itself, or on paths explicitly excluded via TRANSLOG_AutoLogAfterUpgrade or similar settings, may behave differently. Also worth noting that system databases (e.g., log.nsf, notes.ini-adjacent files) have specific logging behaviors.
      fix:     Add a brief note that databases must reside within the Domino data directory tree, and that the log path directory itself should not overlap with the data directory.
  [minor] Section header: 'To Review'
      problem: 'To Review' is an unusual section label for a summary. It reads ambiguously — it could mean 'items still under review' or 'to recap'. Most Domino admin articles use 'Summary' or 'Conclusion'.
      fix:     Rename to 'Summary' or 'Conclusion' for clarity.
-->

## Why Transaction Logging Matters

If you've ever faced a server crash or needed to restore a database, you know the pain of lengthy recovery times and potential data loss. That's where transaction logging comes in. By capturing all changes made to your databases, transaction logging ensures faster recovery and more efficient backups. Let's walk through setting it up properly.

## Preparing Your Environment

Before diving in, ensure all databases you want to log are located in the Domino data directory or its subdirectories. This setup is crucial for the logging process to function seamlessly.

## Configuring Transaction Logging

1. **Access the Server Document:**
   - Open the Domino Administrator.
   - Navigate to the **Configuration** tab.
   - Expand the **Server** section and select **All Server Documents**.
   - Choose the server you wish to configure and click **Edit Server**.

2. **Enable Transaction Logging:**
   - Click on the **Transactional Logging** tab.
   - Set **Transactional Logging** to **Enabled**.

3. **Specify the Log Path:**
   - In the **Log path** field, enter the directory where the transaction logs will reside. For optimal performance, use a dedicated, mirrored disk (RAID 0 or 1) with its own controller. This setup enhances both performance and data integrity. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

4. **Determine Log Space Usage:**
   - For circular and linear logging:
     - **Use all available space on log device:**
       - **Yes:** Utilize the entire disk space for transaction logs. Ideal if the disk is solely for logging.
       - **No:** Limit the log size based on the **Maximum log space** setting.
     - **Maximum log space:** Define the maximum size (in MB) for the transaction log. The default is 500MB, with a maximum of 4096MB (4GB). Allocating at least 1GB is recommended. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html?utm_source=openai))

5. **Set Automatic Fixup:**
   - **Automatic fixup of corrupt databases:**
     - **Enabled:** Domino will automatically run the Fixup task if a database is corrupted and cannot be recovered using the transaction log.
     - **Disabled:** You'll need to manually run the Fixup task with the `-J` parameter on corrupted logged databases.

6. **Adjust Performance Settings:**
   - **Runtime/Restart performance:**
     - **Standard:** Regularly records checkpoints (recommended).
     - **Favor runtime:** Records fewer checkpoints, improving runtime performance but extending restart recovery time.
     - **Favor restart recovery time:** Records more checkpoints, reducing restart recovery time but potentially impacting runtime performance.

7. **Choose Logging Style:**
   - **Circular (default):** Reuses log files, overwriting old transactions. Suitable for most environments.
   - **Archived:** Reuses log files after they've been archived. Essential for point-in-time recovery and requires a third-party backup solution. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))
   - **Linear:** Similar to circular but allows log sizes greater than 4GB.

   *Note:* Changing the logging style assigns new Database Instance IDs (DBIIDs) to all databases. After such a change, perform a full backup of all databases. ([ibm.com](https://www.ibm.com/docs/en/domino/10.0.1?topic=logging-changing-transaction-settings&utm_source=openai))

8. **Save and Restart:**
   - Click **Save & Close**.
   - Restart the server for the changes to take effect.

## Additional Considerations

- **Log Path Configuration:**
  - The `TRANSLOG_Path` parameter in the `notes.ini` file specifies where Domino stores its transaction log files. Ensure this path points to your dedicated log directory. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

- **Backup Strategy:**
  - With transaction logging enabled, you can perform incremental backups, capturing only the changes since the last full backup. This approach reduces backup time and storage requirements. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

## To Review

Setting up transaction logging in HCL Domino is a straightforward process that pays dividends in database integrity and recovery efficiency. By following the steps outlined above and considering the additional configurations, you'll ensure your Domino environment is robust and resilient against data loss scenarios.
