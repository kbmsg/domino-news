---
title: "Domino Disaster Recovery Strategies: A Practical Guide"
description: "A hands-on guide for Domino administrators on implementing effective disaster recovery strategies to ensure server resilience and data integrity."
pubDate: "2026-10-22T17:55:18+08:00"
slug: "domino-disaster-recovery-strategies"
tags:
  - "Domino Server"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Disaster recovery"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/Domino_Database_Disaster_Recovery.html"
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en"
  - title: "HCL Domino Native Backup Concept | Domino Backup"
    url: "https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/"
relatedConsoleCommands:
  - "load backup"
  - "load restore"
  - "load restore -v"
  - "load restore -Z \"c:\\restore\\mail\\hdomino.nsf\""
  - "load restore -Z -all \"c:\\restore\""
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: domino-disaster-recovery-strategies
topicOverlap: false
issues:
  [critical] Starting with Domino 12, HCL introduced built-in backup and restore capabilities, eliminating the need for third-party solutions.
      problem: The claim that native backup 'eliminates the need for third-party solutions' is dangerously misleading and factually overstated. The native Domino Backup framework (introduced in Domino 12) is a backup API and toolchain that still requires a backup target and, in many enterprise configurations, a third-party or custom backup script/agent. It does not provide a fully self-contained enterprise backup solution out of the box for all environments. Telling an administrator this eliminates third-party solutions could lead them to decommission existing backup infrastructure without an adequate replacement.
      fix:     Rewrite to: 'Starting with Domino 12, HCL introduced a native backup and restore framework that provides built-in capabilities and reduces dependence on some third-party tools. However, many organizations will still integrate third-party backup solutions or storage-level snapshots for full coverage.'
  [critical] system files like `notes.ini` and DAOS files require separate backup procedures
      problem: While noting that notes.ini and DAOS files need separate backup is correct, the article omits other critical components that are NOT covered by NSF/transaction log backup: the Domino binary/program directory, the keyfile (server.id), certifier ID files, the names.nsf (though it is an NSF, it deserves explicit callout), directory assistance databases, and OS-level configuration. An administrator reading only this article could restore NSFs and believe they have a complete DR plan, while missing key identity and configuration artifacts needed to bring the server back online.
      fix:     Expand the list of items requiring separate backup to include: server.id and certifier ID files, the Domino program/binary directory (or document the version/patch level for reinstall), the data directory structure (subdirectory layout, non-NSF files), directory assistance config, and any SSL/TLS certificates. This is a DR guide; completeness here is critical.
  [major] run the `backup` task to start backing up databases
      problem: The article says to 'run the backup task' without providing the actual console command syntax. The correct server console command to load the backup task is 'load backup' or it can be added to the ServerTasks notes.ini line. Omitting the syntax in a practical guide is a significant gap; an administrator unfamiliar with the feature may not know how to invoke it.
      fix:     Provide the explicit console command: 'load backup' at the Domino server console, and mention it can be added to ServerTasks in notes.ini for automatic startup.
  [major] Access the Domino Backup Database: Open `dominobackup.nsf` on your server. Create a New Configuration: Select the default configuration for your platform (Linux or Windows) and click 'New Config'.
      problem: The setup procedure described skips a required prerequisite step: the dominobackup.nsf database is created when the backup task is first loaded ('load backup'), not pre-existing. An administrator following these steps in order would try to open a database that does not yet exist. Additionally, the Domino Backup framework requires configuration of a backup target (local path, S3, or script) before a backup can actually run; this is absent from the procedure.
      fix:     Add a prerequisite step: run 'load backup' on the server console first to create dominobackup.nsf, then open it to configure. Also add a step covering backup target/destination configuration.
  [major] This native functionality focuses on backing up Notes databases and transaction logs, providing point-in-time recovery options.
      problem: Point-in-time recovery via transaction log replay is only possible when Domino Transaction Logging is enabled AND the backup solution is configured to capture and retain transaction logs. The article does not mention this prerequisite. If transaction logging is not enabled, only full database backup/restore is possible, with no point-in-time granularity. Many administrators run without transaction logging enabled.
      fix:     Add a caveat: 'Point-in-time recovery requires that Domino Transaction Logging is enabled and that the backup configuration is set to capture transaction logs. Without transaction logging, only full-database restore to the backup snapshot point is available.'
  [major] combining Domino's backup with ZFS storage offers benefits like checksums, compression, and deduplication
      problem: This is presented as a general integration pattern, but ZFS is only available on specific platforms (Linux, FreeBSD, Solaris-derived OSes). The majority of production HCL Domino deployments on Windows cannot use ZFS natively. This platform constraint is not mentioned, and a Windows administrator could be confused or misled.
      fix:     Add a platform qualifier: 'On Linux-based Domino servers, combining Domino Backup with ZFS storage...' and note this option is not available on Windows.
  [major] be cautious with frequent database compaction, as it can reduce deduplication effectiveness
      problem: While true that compaction rewrites NSF pages and reduces block-level deduplication ratios, the article presents this as a simple caution without explaining the operational trade-off. Reducing compaction frequency to preserve deduplication savings has real consequences: databases may grow larger over time, whitespace accumulates, and in-place compaction (-b flag) behaves differently from copy-style compaction (-c/-C) with respect to deduplication. The nuance is missing.
      fix:     Clarify which compaction style affects deduplication (copy-style compaction creates a new file, invalidating deduplicated blocks, while in-place compaction has less impact). Advise administrators to weigh storage savings against database maintenance needs rather than simply reducing compaction frequency.
  [minor] ## To Review
      problem: The section header 'To Review' is unconventional and ambiguous. Standard practice for a summary section would be 'Summary' or 'Conclusion'.
      fix:     Rename to 'Summary' or 'Conclusion'.
  [minor] https://help.hcl-software.com/domino/14.5.0/admin/Domino_Database_Disaster_Recovery.html
      problem: This URL is cited in the article metadata but does not appear as an inline link in the article body. It is unclear what section it is meant to support.
      fix:     Either embed this link in the appropriate section of the article body or remove it from the cited sources list.
  [minor] https://help.hcl-software.com/domino/14.0.0/admin/admn_configuringbackup.html
      problem: This URL appears in the article body as a 'Detailed steps' link but is not listed in the cited sources in the metadata. Consistency check: all inline links should be reflected in cited sources.
      fix:     Add this URL to the article's cited sources list.
-->

## Understanding Domino's Native Backup and Restore

Starting with Domino 12, HCL introduced built-in backup and restore capabilities, eliminating the need for third-party solutions. This native functionality focuses on backing up Notes databases and transaction logs, providing point-in-time recovery options. However, it's crucial to note that system files like `notes.ini` and DAOS files require separate backup procedures. [Learn more](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en).

## Setting Up Domino Backup

To configure the native backup:

1. **Access the Domino Backup Database**: Open `dominobackup.nsf` on your server.
2. **Create a New Configuration**: Select the default configuration for your platform (Linux or Windows) and click 'New Config'.
3. **Configure Backup Settings**: Fill out the necessary tabs—Main, Backup, Restore, Prune, and Notification—to tailor the backup process to your environment.
4. **Save and Initiate Backup**: After saving the configuration, run the `backup` task to start backing up databases as per your setup. [Detailed steps](https://help.hcl-software.com/domino/14.0.0/admin/admn_configuringbackup.html).

## Restoring Databases

In the event of data loss:

1. **Access the Backup Inventory**: Within `dominobackup.nsf`, navigate to the Database Inventory.
2. **Select the Database to Restore**: Choose the affected database and click 'Restore'.
3. **Specify Restore Options**: Define the restore point and any additional settings.
4. **Execute the Restore**: Submit the restore job and monitor its progress. For a more detailed walkthrough, refer to [this guide](https://help.hcl-software.com/domino/14.5.0/admin/ScenarioDisasterRecovery.html).

## Integrating with Third-Party Solutions

While Domino's native backup is robust, integrating with third-party solutions can enhance your disaster recovery strategy. For instance, combining Domino's backup with ZFS storage offers benefits like checksums, compression, and deduplication. This setup allows for efficient backups without duplicating NSF storage nightly. However, be cautious with frequent database compaction, as it can reduce deduplication effectiveness. [Explore this concept further](https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/).

## Best Practices for Disaster Recovery

- **Regular Backups**: Schedule consistent backups of all critical Domino data, including databases, templates, and ID files.
- **Separate System File Backups**: Ensure system files like `notes.ini` and DAOS files are backed up separately.
- **Test Restores**: Periodically test your restore procedures to confirm data integrity and recovery processes.
- **Document Procedures**: Maintain clear documentation of your backup and restore configurations and processes.

## To Review

Implementing a comprehensive disaster recovery plan is vital for maintaining Domino server resilience. By leveraging Domino's native backup features and integrating with external solutions, you can ensure data integrity and minimize downtime during unexpected events. Regular testing and documentation further strengthen your disaster recovery strategy.
