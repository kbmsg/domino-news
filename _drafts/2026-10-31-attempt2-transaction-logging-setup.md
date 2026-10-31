---
title: "Setting Up Transaction Logging in HCL Domino"
description: "A practical guide for Domino administrators on configuring transaction logging to enhance database performance and enable efficient backup and recovery."
pubDate: "2026-10-31T18:48:42+08:00"
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
relatedConsoleCommands:
  - "tell translog status"
  - "tell translog enable"
  - "tell translog disable"
notesIniSettings:
  - "TRANSLOG_Status"
  - "TRANSLOG_Path"
  - "TRANSLOG_Style"
  - "TRANSLOG_Performance"
draft: true
---
<!--
REJECTED DRAFT - 3 critical fact issue(s)
attempt: 2
slug: transaction-logging-setup
topicOverlap: false
issues:
  [critical] Circular Logging: Uses up to 4 GB of disk space
      problem: The 4 GB cap applies to the default maximum, but Circular logging's actual maximum size is controlled by TRANSLOG_MaxSize (range 64–4096 MB, default 1024 MB). Stating 4 GB as a fixed ceiling is inaccurate; it is the configurable upper bound, not a hard architectural limit baked into Circular mode specifically. More importantly, the article later says Linear logging is 'configurable via TRANSLOG_MaxSize' as if Circular is not — both styles use TRANSLOG_MaxSize to set their size limit. Describing them as distinct in this way is misleading and could cause an administrator to misconfigure disk allocation.
      fix:     Clarify that TRANSLOG_MaxSize (64–4096 MB) governs the log extent size for both Circular and Linear styles. State the default (typically 1024 MB) and the maximum (4096 MB / ~4 GB). Remove the implication that only Linear logging is configurable via that parameter.
  [critical] Linear Logging: Similar to circular but allows for a larger log size … Still overwrites old logs
      problem: This description of Linear logging is factually incorrect in a dangerous way. Linear logging does NOT overwrite old log files the way Circular does. In Linear mode, Domino writes sequentially and does not wrap around or overwrite; old extents are only removed when they are no longer needed for crash recovery AND a backup has marked them safe (similar in that respect to Archive). The key practical difference between Linear and Archive is that in Linear mode Domino can automatically delete extents no longer needed for crash recovery even without a backup application marking them, whereas Archive mode requires a backup application to explicitly mark extents before Domino will delete them. Telling administrators that Linear 'still overwrites old logs' could lead them to choose Linear thinking it is self-managing like Circular, then be surprised when logs accumulate or when they discover their recovery model differs from expectations.
      fix:     Correct the description: Linear logging writes log extents sequentially without overwriting. Extents are automatically removed by Domino once they are no longer needed for crash recovery, without requiring backup-application intervention. Contrast this accurately with Archive mode, where extents are retained until a backup application marks them as backed up, enabling point-in-time recovery.
  [critical] tell translog status
      problem: The documented Domino server console command for checking transaction logging status is 'show translog', not 'tell translog status'. 'tell' is used to communicate with running server tasks (e.g., 'tell replica quit'). There is no 'translog' server task to 'tell'; issuing this command on a production server will produce an error or be silently ignored. An administrator relying on this to verify logging is active could be misled into thinking logging is fine when it is not.
      fix:     Replace with the correct console command: 'show translog' — this displays transaction logging status, style, path, and current extent information.
  [major] TRANSLOG_Style=1
      problem: The article does not document the mapping between numeric TRANSLOG_Style values and logging styles. Value 1 is shown without stating what it maps to (1 = Circular, 2 = Archive, 0 = disabled in most documented references, though exact mappings should be verified against current HCL documentation). Administrators editing notes.ini directly could set the wrong style. Additionally, the article omits TRANSLOG_AutoFixup and TRANSLOG_UseAll, which are commonly relevant parameters administrators encounter.
      fix:     Provide the full value-to-style mapping for TRANSLOG_Style, or recommend administrators use the Server document UI rather than editing notes.ini directly to avoid errors. Note other relevant parameters such as TRANSLOG_MaxSize.
  [major] A server restart is necessary for the changes to take effect
      problem: This is correct, but the article omits the critically important caveat that transaction logging can only be enabled on databases that support it — specifically, databases must be in ODS (On-Disk Structure) format 41 or higher. Databases in older ODS formats will not participate in transaction logging and will not be protected. This is a significant operational gap for environments with legacy databases.
      fix:     Add a caveat that all databases intended to be covered by transaction logging must be at ODS 41 or higher (run 'updall -R' or compact with -r flag to upgrade ODS if needed), and explain how to check ODS version.
  [major] rendering previous incremental backups invalid. A full backup post-restart is essential.
      problem: The article correctly notes that a full backup is required after enabling or changing transaction logging style. However, it does not warn that this applies even when simply ENABLING transaction logging for the first time (not just when switching styles), and it does not mention that in a clustered environment, the change must be coordinated across cluster members carefully, as replica databases on other cluster members will also receive new DBIIDs via replication of the server document change, which has its own operational implications for the backup strategy across the cluster.
      fix:     Expand the warning to explicitly cover the first-time enablement case and add a note about cluster topology considerations — specifically that administrators in a cluster should review how DBIID changes propagate and coordinate full backups across all cluster members.
  [major] Cited source: https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html
      problem: This citation points to Domino 10.0.1 documentation. At time of writing, HCL Domino 12.x and 14.x are current releases. Linking to a 10.0.1 admin doc as an authoritative reference is misleading; readers may follow outdated guidance. Some transaction logging behavior and parameters have been documented with updates in later releases.
      fix:     Update the citation to the most current available HCL Domino documentation (14.x or at minimum 12.x). The second citation already uses 12.0.0, creating an inconsistency.
  [minor] utm_source=openai in multiple madicon.de URLs
      problem: All madicon.de citations include a '?utm_source=openai' query parameter, which is a strong indicator that these URLs were generated by an AI tool rather than sourced by a human author. This undermines editorial credibility and suggests the article may have been written with AI assistance without proper source verification.
      fix:     Remove the UTM tracking parameters and manually verify each madicon.de page is accurate and current before publication. Prefer linking directly to official HCL documentation where possible.
  [minor] Domino offers three transaction logging styles
      problem: The article presents exactly three styles without noting that the 'disabled' state is also an explicit configuration option (TRANSLOG_Status=0), and does not mention the 'Logged' vs 'Not Logged' per-database property that controls whether individual databases participate in transaction logging even when server-level logging is enabled. This per-database opt-out is operationally important.
      fix:     Add a brief note that individual databases have a 'Logging' property and that by default new databases created after enabling transaction logging will be logged, but administrators can verify or override this per database.
-->

## Why Transaction Logging Matters

If you've ever faced the nightmare of a server crash and the subsequent scramble to recover databases, you'll appreciate the value of transaction logging. In HCL Domino, enabling transaction logging not only boosts database performance but also ensures faster recovery times. Let's walk through setting it up properly.

## Choosing the Right Logging Style

Domino offers three transaction logging styles:

- **Circular Logging**: Uses up to 4 GB of disk space, overwriting the oldest transactions once the limit is reached. Simple to manage but lacks point-in-time recovery capabilities.

- **Linear Logging**: Similar to circular but allows for a larger log size, configurable via `TRANSLOG_MaxSize`. Still overwrites old logs but provides more space before doing so.

- **Archive Logging**: Retains all transaction logs until they're backed up, enabling point-in-time recovery. Requires a robust backup strategy to prevent the log volume from filling up.

For most production environments, **Archive Logging** is recommended due to its comprehensive recovery options. However, it demands diligent backup management to avoid storage issues. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai))

## Configuring Transaction Logging

1. **Prepare the Log Directory**:

   - **Dedicated Disk**: It's crucial to place your transaction logs on a dedicated physical disk, not just a separate partition. This setup prevents performance degradation caused by disk contention. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

   - **Path Configuration**: In the Domino Administrator, navigate to the server document's "Transactional Logging" tab. Set the "Log path" to your dedicated disk location.

2. **Enable Transaction Logging**:

   - In the same "Transactional Logging" tab, set "Transactional Logging" to **Enabled**.

   - Choose your desired "Logging style" (e.g., Archive).

   - Save and replicate the server document changes.

3. **Update `notes.ini` Settings**:

   - Domino will update the `notes.ini` with parameters like:

     ```
     TRANSLOG_Status=1
     TRANSLOG_Path=D:\Domino\txn
     TRANSLOG_Style=1
     ```

   - Ensure these settings reflect your configuration. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

4. **Restart the Domino Server**:

   - A server restart is necessary for the changes to take effect. Be aware that switching logging styles will assign new Database Instance IDs (DBIIDs) to all databases, rendering previous incremental backups invalid. A full backup post-restart is essential. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_style/?utm_source=openai))

## Post-Configuration Steps

- **Verify Logging Status**:

  - Use the server console command:

    ```
    tell translog status
    ```

    This command displays the current transaction logging status and configuration.

- **Implement a Backup Strategy**:

  - With Archive Logging, ensure you have a backup solution that marks transaction logs as backed up. Without this, logs will accumulate indefinitely, potentially filling up your disk.

  - Regularly monitor the log directory to confirm that logs are being archived and purged appropriately.

## The Outcome

By properly configuring transaction logging in HCL Domino, you enhance database performance and establish a solid foundation for efficient backup and recovery processes. Remember, while Archive Logging offers the most comprehensive recovery options, it requires a disciplined backup regimen to prevent storage issues. Always test your backup and recovery procedures to ensure they function as expected when needed.
