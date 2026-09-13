---
title: "Setting Up Domino's Native Backup and Restore"
description: "A step-by-step guide to configuring HCL Domino's built-in backup and restore features for effective data protection."
pubDate: "2026-09-14T05:00:03+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Tutorial"
  - "Domino Server"
  - "Backup and Recovery"
sources:
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/admn_backupandrestore.html?scLang=en"
  - title: "Backup and restore components"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/admn_backupandrestorecomponents.html?scLang=en"
  - title: "HCL Domino Native Backup Concept | Domino Backup"
    url: "https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/"
relatedConsoleCommands:
  - "load backup"
  - "load restore"
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 1
slug: domino-native-backup-setup
topicOverlap: false
issues:
  [critical] Restoring Databases > Start the Restore Task: `load restore`
      problem: The restore task is not invoked as a bare `load restore` command that 'follows prompts' on the console. The HCL Domino native restore process is driven from within dominobackup.nsf (selecting a backup record and clicking Restore) or via a scripted restore command with specific arguments (e.g., `load restore -f <database path> -d <target path> -t <datetime>`). Telling an administrator to type `load restore` and 'follow the prompts' is inaccurate and could leave a reader unable to complete a recovery, or worse, executing an incomplete restore against a production database.
      fix:     Describe the correct restore workflow: select the backup record in dominobackup.nsf, use the Restore action button which queues the operation for the Restore server task, OR document the correct command-line syntax with required flags. Reference the official HCL documentation for the exact parameter set for the Domino version targeted.
  [critical] Prerequisites > Transaction Logging: 'Enabled on the Domino server to support point-in-time recovery'
      problem: The article presents transaction logging as a prerequisite for the entire native backup feature, but this is incorrect. Transaction logging is required only for point-in-time recovery. The native backup framework can perform snapshot/database-level backups without transaction logging enabled. Framing it as a blanket prerequisite may cause administrators to believe backup cannot be configured at all without transaction logging, which is false, and could also lead to enabling transaction logging without understanding its storage and performance implications.
      fix:     Clarify that transaction logging is required only for point-in-time recovery (PITR), not for basic backup and restore. Add a caveat that enabling transaction logging has storage and performance implications and should be planned accordingly, and note the supported transaction log styles (circular vs. archive) and their effect on PITR capability.
  [major] Setting Up the Backup Database > Initialize the Backup Database: 'Create a new database named dominobackup.nsf using the Domino Administrator client'
      problem: The manual creation step is misleading. dominobackup.nsf must be created from the correct template (dominobackup.ntf), which ships with Domino 12+. Simply creating 'a new database' without specifying the template would produce a blank or wrong-template database that lacks the required forms, views, and agents for backup management. An administrator following this literally could end up with a non-functional backup database.
      fix:     Specify that if manual creation is needed, the database must be created using the dominobackup.ntf template. Better yet, emphasize that the recommended approach is to let the Backup task create it automatically on first run, and remove or heavily caveat the manual creation step.
  [major] Scheduling Backup Operations > Create Program Documents
      problem: Using a Program document to schedule the Backup task is one approach, but the native Domino backup framework has its own built-in scheduling mechanism configured directly within dominobackup.nsf (the Configuration document includes schedule settings). Using an external Program document may conflict with or duplicate the internal schedule, and the article omits the primary/recommended scheduling method entirely.
      fix:     Describe the built-in scheduling within dominobackup.nsf as the primary method. Mention Program documents as a secondary or legacy alternative, and note that both should not be configured simultaneously without understanding interaction effects.
  [major] Prerequisites > Operating System: 'Windows or Linux platforms'
      problem: HCL Domino also runs on IBM AIX, and the native backup feature is supported there as well. Limiting the OS list to Windows and Linux without qualification could mislead AIX administrators into thinking the feature is unavailable on their platform.
      fix:     Either expand the OS list to include all supported platforms (Windows, Linux, AIX) or note that the list reflects only the most common deployments and readers should consult the HCL System Requirements for their specific OS.
  [major] Overview > Point-in-Time Recovery: 'Utilizing transaction logs to restore databases to specific points in time'
      problem: Point-in-time recovery with native backup requires transaction logging to be set to 'Archive' style (not 'Circular'). Circular transaction logging does not retain enough log data for PITR. This is a critical distinction omitted entirely from the article; an administrator who enables circular logging believing PITR is available will be wrong at the worst possible moment.
      fix:     Add an explicit note that PITR requires archive-style transaction logging. Circular logging supports crash recovery only and does not enable point-in-time restore.
  [major] Cited source: https://help.hcl-software.com/domino/14.5.0/admin/admn_backupandrestore.html?scLang=en
      problem: The article cites documentation for Domino 14.5.0 while stating the feature was introduced in Domino 12.0.0. The article body contains no version-specific caveats distinguishing what changed between 12.x, 14.0, and 14.5. Readers on earlier supported versions (e.g., 12.0.2, 14.0) may encounter different behavior or missing features if they follow 14.5-era documentation. Additionally, 14.5 does not appear to be a released version as of the knowledge cutoff; if this version number is speculative or fabricated it is a significant credibility problem.
      fix:     Verify that Domino 14.5.0 is an actual released version before publishing. Cite documentation matching the minimum supported version the article targets (12.0.x) or clearly state the documentation is for 14.5 and note where behavior may differ on older supported releases.
  [minor] Best Practices section
      problem: The best practices are generic and omit operationally important items specific to Domino native backup, such as: ensuring the backup storage path is accessible to the Domino server process account, the importance of backing up dominobackup.nsf itself, and considerations for DAOS-enabled servers (DAOS object store must be included in backup scope separately).
      fix:     Add DAOS-aware backup considerations, note that dominobackup.nsf should itself be included in an independent backup, and include a note about file system permissions on the backup target path.
  [minor] Scheduling Backup Operations > Start the Backup Task Manually: `load backup`
      problem: Running `load backup` with no arguments may not behave as a one-time manual backup trigger in all configurations; behavior can depend on how the task and configuration document are set up. The article implies this is straightforwardly a manual run trigger, which may not always be accurate.
      fix:     Clarify whether `load backup` runs all configured backup jobs or requires additional arguments for a targeted manual run, and reference the documentation for supported command-line options.
-->

Ensuring the integrity and availability of your HCL Domino data is paramount. With the introduction of native backup and restore functionalities in Domino 12, administrators can now implement robust data protection strategies without relying on third-party solutions. This guide provides a comprehensive walkthrough for setting up and managing Domino's built-in backup and restore features.

## Overview of Domino's Native Backup and Restore

Domino's native backup and restore capabilities offer:

- **Integrated Backup Database**: The `dominobackup.nsf` database serves as the central interface for configuring and managing backup and restore operations.

- **Dedicated Server Tasks**: The `Backup` and `Restore` server tasks handle the execution of backup and restore processes, respectively.

- **Flexible Storage Options**: Support for backups to local disks, network drives, and integration with third-party backup solutions.

- **Point-in-Time Recovery**: Utilizing transaction logs to restore databases to specific points in time.

For a detailed overview, refer to the [official documentation](https://help.hcl-software.com/domino/14.5.0/admin/admn_backupandrestore.html?scLang=en).

## Prerequisites

Before configuring the backup and restore features, ensure the following:

- **Domino Version**: Your server is running Domino 12.0.0 or later.

- **Operating System**: The server operates on Windows or Linux platforms.

- **Transaction Logging**: Enabled on the Domino server to support point-in-time recovery. Detailed instructions are available in the [Domino Backup Concept Guide](https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/).

## Setting Up the Backup Database

1. **Initialize the Backup Database**:

   - The `dominobackup.nsf` database is automatically created the first time the `Backup` server task runs. To manually create it:

     - Navigate to the Domino data directory.

     - Create a new database named `dominobackup.nsf` using the Domino Administrator client.

2. **Configure Backup Settings**:

   - Open `dominobackup.nsf`.

   - Navigate to the **Configuration** section.

   - Define backup paths, schedules, and retention policies according to your organization's requirements.

   - Specify the databases and templates to include or exclude from backups.

## Scheduling Backup Operations

1. **Create Program Documents**:

   - In the Domino Administrator client, go to the **Server** tab.

   - Select **Programs** and create a new Program document.

   - Configure the document to run the `Backup` task at desired intervals (e.g., daily at 2 AM).

2. **Start the Backup Task Manually** (if needed):

   - Access the Domino server console.

   - Enter the command:

     ```
     load backup
     ```

   - Monitor the console for any errors or warnings.

## Restoring Databases

1. **Initiate a Restore Operation**:

   - Open `dominobackup.nsf`.

   - Navigate to the **Restore** section.

   - Select the database(s) to restore and specify the desired point in time.

2. **Start the Restore Task**:

   - Access the Domino server console.

   - Enter the command:

     ```
     load restore
     ```

   - Follow the prompts to complete the restoration process.

## Best Practices

- **Regular Testing**: Periodically test backup and restore procedures to ensure data can be recovered as expected.

- **Monitor Logs**: Review backup and restore logs in `dominobackup.nsf` for any anomalies or errors.

- **Retention Policies**: Define and enforce retention policies to manage storage effectively and comply with organizational requirements.

By leveraging Domino's native backup and restore features, administrators can enhance data protection strategies, ensuring business continuity and data integrity. For further details, consult the [official documentation](https://help.hcl-software.com/domino/14.5.0/admin/admn_backupandrestore.html?scLang=en) and the [Domino Backup Concept Guide](https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/).
