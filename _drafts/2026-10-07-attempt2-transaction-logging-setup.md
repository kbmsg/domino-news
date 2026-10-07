---
title: "Setting Up Transaction Logging in HCL Domino"
description: "A hands-on guide for Domino administrators to configure transaction logging for improved database performance and recovery."
pubDate: "2026-10-07T19:38:44+08:00"
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
  - "TRANSLOG_Status"
  - "TRANSLOG_Path"
  - "TRANSLOG_Style"
  - "TRANSLOG_UseAll"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: transaction-logging-setup
topicOverlap: false
issues:
  [critical] use a dedicated, mirrored disk (RAID 0 or 1)
      problem: RAID 0 provides striping with NO redundancy and offers zero fault tolerance — a single disk failure destroys all data on the array. Recommending RAID 0 for a transaction log store (which is critical for recovery) is actively dangerous. The parenthetical '(RAID 0 or 1)' conflates two opposites: RAID 0 is the worst possible choice for a log volume. Only RAID 1 (mirroring) or RAID 1+0 are appropriate here.
      fix:     Remove RAID 0 from the recommendation entirely. Write: 'For optimal performance and data integrity, use a dedicated disk with RAID 1 (mirroring) or RAID 1+0, with its own controller.' If striping is mentioned at all, clarify it is for performance only and must never be used without mirroring for a log volume.
  [critical] If you change the log path, move existing log files to the new location before restarting the server.
      problem: This guidance is incorrect and potentially destructive. Domino does not support manually moving live transaction log files between directories. The correct procedure is to change the log path in the Server document and let Domino initialize a fresh log set in the new location on restart — after taking a full backup first, because changing the log path invalidates the existing log chain. Manually moving log files can corrupt the log set and render recovery impossible.
      fix:     Replace this bullet with: 'If you change the log path, take a full backup of all logged databases first, then change the path in the Server document and restart. Domino will initialize a new log set in the new directory. Do NOT manually move existing log files.' Also remove the IBM Docs link (ibm.com/docs/en/domino/10.0.0) — that is an IBM-era URL, not an HCL source, and should not be cited as authoritative guidance in an HCL-branded article.
  [major] Log Path Changes — cited source ibm.com
      problem: The article cites an IBM Docs URL (ibm.com/docs/en/domino/10.0.0) as a source. HCL took over Domino in 2019; IBM no longer maintains or guarantees accuracy of that documentation. Citing it in a 2024 article directed at HCL Domino administrators is inappropriate and could lead readers to outdated or incorrect IBM-era guidance. The correct source is help.hcl-software.com.
      fix:     Replace the IBM Docs citation with the equivalent page on help.hcl-software.com for a current Domino release (12.x or 14.x). If no HCL equivalent exists for that specific topic, remove the citation rather than pointing to IBM Docs.
  [major] Maximum log space (default is 500MB; maximum is 4096MB)
      problem: The maximum log space figure of 4096 MB (4 GB) is outdated. In more recent Domino releases the maximum configurable log space via TRANSLOG_MAX_SIZE is higher. Stating 4096 MB as an absolute maximum without a version qualifier may cause administrators on newer releases to under-provision their log volume.
      fix:     Add a version caveat: 'As of Domino 10.x, the documented maximum is 4096 MB; verify the current maximum for your specific release in the HCL Domino documentation.' Alternatively, link directly to the relevant HCL help page for the reader's target version.
  [major] Archived: Reuses log files after they're archived. Necessary for point-in-time recovery and incremental backups.
      problem: The article omits the third logging style available in Domino: 'Linear' (also documented as a supported style). Presenting only Circular and Archived as the two choices is incomplete and could mislead administrators who encounter or need to configure Linear logging.
      fix:     Add a third bullet for Linear logging: 'Linear: Fills log extents sequentially without reuse. Useful in specific backup-agent scenarios but requires more disk management. Rarely used in modern deployments.' At minimum, note that a third style exists and link to HCL documentation.
  [major] Enabling transaction logging assigns a new Database Instance ID (DBIID) to each database.
      problem: The article correctly flags that a full backup is required after a DBIID change, but does not mention that databases in the Domino directory that are NOT in the logged path (e.g., databases on alternate data paths, or databases explicitly excluded from logging) will NOT get a DBIID and cannot participate in transactional backup/restore. This is a significant omission for administrators with non-standard data directory layouts.
      fix:     Add a note: 'Only databases residing in the Domino data directory or its subdirectories receive a DBIID and participate in transaction logging. Databases stored outside these paths are not covered and require separate backup strategies.'
  [minor] ensure all databases you want to log are in the Domino data directory or its subdirectories
      problem: The article states this as a prerequisite but does not mention that system databases (e.g., log.nsf, names.nsf) are logged automatically and that some databases such as backup-related or template databases may be explicitly excluded. The blanket statement could confuse readers.
      fix:     Clarify: 'Transaction logging automatically covers databases in the Domino data directory. Certain system databases are included by default; exclusions can be configured per-database via the database properties.'
  [minor] cited source https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html
      problem: The article cites a Domino 10.0.1 help page as a primary setup reference while also citing 12.0.0 pages. Mixing documentation versions without explanation is confusing. Domino 14.x is the current release; a setup guide should use the most current available documentation.
      fix:     Standardize citations to the most current Domino release available on help.hcl-software.com (currently 14.x). If the 10.0.1 URL is the only one available for that specific topic, note that explicitly.
-->

## Why Transaction Logging Matters

If you've ever faced a server crash and had to deal with database recovery, you know the pain. Transaction logging in HCL Domino is your safety net. It captures all changes made to databases, allowing for faster recovery and better performance. Let's walk through setting it up.

## Preparing for Transaction Logging

Before diving in, ensure all databases you want to log are in the Domino data directory or its subdirectories. This setup ensures that transaction logging covers all necessary databases.

## Configuring Transaction Logging

1. **Access the Server Document:**
   - Open Domino Administrator.
   - Navigate to the **Configuration** tab.
   - Expand the **Server** section and select **All Server Documents**.
   - Choose the server you want to configure and click **Edit Server**.

2. **Enable Transaction Logging:**
   - Go to the **Transactional Logging** tab.
   - Set **Transactional Logging** to **Enabled**.

3. **Specify the Log Path:**
   - In the **Log path** field, enter the directory where transaction logs will be stored. For optimal performance, use a dedicated, mirrored disk (RAID 0 or 1) with its own controller. This setup enhances sequential write speed and data integrity. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

4. **Determine Log Space Usage:**
   - If using a dedicated disk, set **Use all available space on log device** to **Yes**.
   - Otherwise, set it to **No** and specify the **Maximum log space** (default is 500MB; maximum is 4096MB).

5. **Choose the Logging Style:**
   - **Circular (default):** Reuses log files, overwriting old transactions. Suitable for basic crash recovery.
   - **Archived:** Reuses log files after they're archived. Necessary for point-in-time recovery and incremental backups. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

6. **Set Performance Preferences:**
   - **Runtime/Restart performance:**
     - **Standard (default):** Regular checkpoints.
     - **Favor runtime:** Fewer checkpoints, better runtime performance, longer recovery.
     - **Favor restart recovery time:** More checkpoints, faster recovery.

7. **Save and Restart:**
   - Save the Server document.
   - Restart the Domino server for changes to take effect.

## Important Considerations

- **Full Backup After Enabling:**
  - Enabling transaction logging assigns a new Database Instance ID (DBIID) to each database. Perform a full backup immediately after enabling to ensure backup consistency. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

- **Changing Logging Style:**
  - Switching between logging styles (e.g., from Circular to Archived) also changes DBIIDs. Again, a full backup is necessary post-change.

- **Log Path Changes:**
  - If you change the log path, move existing log files to the new location before restarting the server. ([ibm.com](https://www.ibm.com/docs/en/domino/10.0.0?topic=logging-changing-transaction-settings&utm_source=openai))

## To Review

Setting up transaction logging in HCL Domino isn't just a checkbox; it's a critical step for database integrity and recovery. By following these steps and considerations, you'll ensure your Domino environment is robust and resilient against unexpected failures.
