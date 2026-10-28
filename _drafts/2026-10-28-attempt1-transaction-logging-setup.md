---
title: "Setting Up Transaction Logging in HCL Domino"
description: "A practical guide for Domino administrators on configuring transaction logging to enhance database performance and recovery capabilities."
pubDate: "2026-10-28T19:08:56+08:00"
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
  - "TRANSLOG_Status"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: transaction-logging-setup
topicOverlap: false
issues:
  [critical] Dedicated Disk: Allocate a separate, mirrored disk (RAID 0 or 1)
      problem: RAID 0 is a striping configuration with NO redundancy or mirroring. Recommending RAID 0 for a transaction log disk—which is a critical recovery asset—is actively dangerous. A single disk failure on a RAID 0 array destroys all transaction logs. The article pairs it with RAID 1 (mirroring) as if they are equivalent alternatives, which is the opposite of true. A reader who follows 'RAID 0' literally could lose their recovery capability.
      fix:     Replace with 'RAID 1 (mirroring) or RAID 10' and explicitly state that RAID 0 is striping only, offers no fault tolerance, and must not be used for transaction logs.
  [critical] Maximum Log Space: Specify the size (up to 4096MB)
      problem: The 4096 MB ceiling applies only to Circular style logging. For Linear logging the article itself says logs can exceed 4 GB, yet the UI guidance immediately below caps all styles at 4096 MB without qualification. Applying this cap to a Linear deployment would silently constrain a configuration the admin is trying to size beyond 4 GB, potentially causing log-space exhaustion between backups.
      fix:     Clarify that the 4096 MB UI limit applies to Circular style. For Linear style, note that the effective limit is the available disk space, and the 'Use All Available Space' option is the typical control mechanism.
  [major] Linear: Similar to circular but allows log sizes beyond 4GB
      problem: The description of Linear logging is incomplete and partially misleading. Linear logging does NOT overwrite old transactions like Circular does—it writes sequentially and will halt the server if the log fills up (it does not wrap). This is a critical operational distinction: a server using Linear logging that runs out of log space will stop. Calling it 'similar to circular' understates the risk.
      fix:     Clarify that Linear logging writes sequentially and does not overwrite old entries. If the log fills before a backup clears it, the server will halt. It should only be used when a backup agent actively truncates the logs, similar to Archived mode.
  [major] Circular (Default): Uses up to 4GB of disk space
      problem: The default maximum for Circular logging is not a fixed 4 GB; the administrator configures the maximum log space (up to 4096 MB) in the Server Document. The 4096 MB figure is the upper bound of the configurable range, not the automatic default. The actual default allocated size is lower (typically 192 MB on a fresh install). Stating it 'uses up to 4GB' implies that is both the default and the fixed size.
      fix:     State that Circular logging uses a configurable amount of space with a maximum of 4096 MB, and that the default allocation is much lower. Admins should size it based on transaction volume between backups.
  [major] Update notes.ini: Domino will update the notes.ini file with parameters like TRANSLOG_Path, TRANSLOG_Style, and TRANSLOG_MaxSize
      problem: The actual notes.ini parameter for logging style is TRANSLOG_Style and for max size is TRANSLOG_MaxSize—these are plausible—but the article does not mention TRANSLOG_AutoFixup, TRANSLOG_Performance, or TRANSLOG_UseAll, which correspond to UI fields described just above. More importantly, it omits that TRANSLOG_MaxSize is expressed in MB and that TRANSLOG_Style values are numeric (0=Circular, 1=Archived, 2=Linear). An admin manually editing notes.ini without this detail could misconfigure silently.
      fix:     Either provide a complete, accurate table of the relevant notes.ini keys and their valid values/types, or remove the notes.ini section entirely and rely solely on the Server Document UI steps to avoid partial/misleading information.
  [major] Restart the Server: Save your changes and restart the Domino server to apply the new settings.
      problem: The article omits a critical prerequisite: when enabling transaction logging for the first time, Domino must run the Fixup task against all databases to initialize them for transaction logging before they are usable under the new configuration. This can take significant time on servers with many large databases and will delay the server being available. Administrators who are not warned may think the server is hung.
      fix:     Add a note that on first enablement, Domino automatically runs Fixup on all databases during restart to assign DBIIDs. This process can take considerable time proportional to the number and size of databases. Plan for extended downtime.
  [major] Backup Strategy: If using Archived logging, integrate with a backup solution that supports Domino's transaction logs
      problem: The article does not mention that only backup solutions that use the Domino Backup API (or the legacy NSF backup API) can properly manage archived transaction logs and clear them after backup. Generic file-level backup tools will NOT signal Domino to release archived log extents, causing unbounded log growth and eventual server halt. This is a production-impacting omission.
      fix:     Explicitly state that Archived and Linear modes require a Domino-aware backup agent (one that calls the Domino backup API) to mark log extents as backed up. Generic file-copy or OS-level backup tools are insufficient and will cause log space to grow until the server stops.
  [major] Runtime/Restart Performance: Select based on your performance and recovery time preferences.
      problem: The article provides no guidance on what the Runtime/Restart Performance options actually mean or how to choose between them. 'Favor runtime performance' vs 'Favor restart recovery time' is a real trade-off (more frequent checkpointing slows runtime but speeds recovery). Leaving this as 'select based on preferences' without explanation is not actionable for an administrator about to configure a production server.
      fix:     Briefly explain that 'Favor runtime performance' reduces checkpoint frequency (faster normal operation, longer recovery after crash) while 'Favor restart recovery time' increases checkpoint frequency (slight runtime overhead, faster crash recovery). Recommend the latter for most production servers.
  [minor] URL citation: utm_source=openai appended to all HCL help links
      problem: All cited URLs contain '?utm_source=openai' tracking parameters, strongly indicating the content was AI-generated and the links were not manually verified. The base URLs appear structurally plausible, but the tracking suffix is evidence of unverified sourcing.
      fix:     Remove UTM tracking parameters and manually verify each URL resolves to the correct HCL documentation page before publishing.
  [minor] boosts performance
      problem: The performance benefit of transaction logging is not universal. It primarily benefits crash recovery speed and enables incremental backup, but the write-ahead logging itself adds a write step per transaction. Performance improvement depends heavily on hardware (especially whether the log is on a fast dedicated disk). Presenting it as a straightforward performance boost is an oversimplification.
      fix:     Qualify the performance claim: transaction logging can improve overall throughput when logs are on a fast dedicated disk, but the primary benefits are recoverability and backup flexibility, not raw performance.
  [minor] To Review
      problem: The section header 'To Review' is unconventional and ambiguous—it reads like an editorial placeholder rather than a conclusion heading.
      fix:     Rename to 'Summary' or 'Conclusion'.
-->

## Why Enable Transaction Logging?

If you're managing a Domino server and haven't enabled transaction logging yet, you're missing out on some serious benefits. Transaction logging captures all changes made to your databases, writing them to a log before committing them to disk. This not only boosts performance but also ensures faster recovery after crashes. Plus, it opens the door to incremental backups and point-in-time restores. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

## Choosing the Right Logging Style

Domino offers three logging styles:

- **Circular (Default):** Uses up to 4GB of disk space, overwriting old transactions as needed. Simple to set up but lacks point-in-time recovery. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai))

- **Archived:** Retains all transaction logs until they're backed up. Essential for point-in-time recovery but requires more storage and a solid backup strategy. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai))

- **Linear:** Similar to circular but allows log sizes beyond 4GB. Useful if your transaction volume is high between full backups. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai))

## Setting Up Transaction Logging

Here's how to get it up and running:

1. **Prepare Your Environment:**

   - **Dedicated Disk:** Allocate a separate, mirrored disk (RAID 0 or 1) for the transaction logs. This setup enhances performance and data integrity. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

   - **Backup:** Before making changes, perform a full backup of all databases. Safety first.

2. **Configure the Server Document:**

   - **Access the Server Document:**

     - Open Domino Administrator.

     - Navigate to the **Configuration** tab.

     - Expand the **Server** section and select **All Server Documents**.

     - Choose the server you want to configure and click **Edit Server**.

   - **Transactional Logging Tab:**

     - **Enable Transactional Logging:** Set to **Enabled**.

     - **Log Path:** Enter the path to your dedicated disk (e.g., `G:\logdir`). ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

     - **Use All Available Space on Log Device:** Set to **Yes** if the disk is solely for transaction logs.

     - **Maximum Log Space:** Specify the size (up to 4096MB). ([help.hcl-software.com](https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html?utm_source=openai))

     - **Logging Style:** Choose **Circular**, **Archived**, or **Linear** based on your needs.

     - **Automatic Fixup of Corrupt Databases:** Enable this to allow Domino to run Fixup automatically if a database is corrupted. ([help.hcl-software.com](https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html?utm_source=openai))

     - **Runtime/Restart Performance:** Select based on your performance and recovery time preferences.

3. **Update `notes.ini`:**

   - Domino will update the `notes.ini` file with parameters like `TRANSLOG_Path`, `TRANSLOG_Style`, and `TRANSLOG_MaxSize` based on your configurations. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

4. **Restart the Server:**

   - Save your changes and restart the Domino server to apply the new settings.

## Post-Setup Considerations

- **Backup Strategy:** If using **Archived** logging, integrate with a backup solution that supports Domino's transaction logs to prevent unbounded growth. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

- **Monitoring:** Regularly check the transaction log directory to ensure it's not filling up unexpectedly.

- **Database Instance IDs (DBIIDs):** Be aware that certain actions, like changing the logging style or compacting databases, can change DBIIDs, necessitating new full backups. ([help.hcl-software.com](https://help.hcl-software.com/domino/12.0.0/admin/admn_backupandrestorerequirements.html?utm_source=openai))

## To Review

Enabling transaction logging is a game-changer for Domino administrators. It enhances performance, ensures faster recovery, and provides more flexible backup options. Just remember to plan your logging style and backup strategy carefully to match your organization's needs.
