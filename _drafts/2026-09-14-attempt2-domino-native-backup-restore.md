---
title: "Implementing Native Backup and Restore in HCL Domino"
description: "A comprehensive guide on configuring and utilizing the native backup and restore features introduced in HCL Domino 12, ensuring data integrity and streamlined recovery processes."
pubDate: "2026-09-14T05:00:54+08:00"
slug: "domino-native-backup-restore"
tags:
  - "Tutorial"
  - "Domino Server"
  - "Backup and Recovery"
sources:
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en"
  - title: "Disaster recovery"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/Domino_Database_Disaster_Recovery.html"
  - title: "HCL Domino - Use the Backup/Restore Function in Domino V12 - YouTube"
    url: "https://www.youtube.com/watch?v=D0e0AmEkNCc"
relatedConsoleCommands:
  - "load backup"
  - "load restore"
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: domino-native-backup-restore
topicOverlap: false
issues:
  [critical] Point-in-Time Recovery / Restoring Databases — 'Select the desired point in time for the restore operation, utilizing available transaction logs'
      problem: Point-in-time recovery via transaction logs is only possible when circular transaction logging is NOT in use. The native backup feature requires archive-style transaction logging to be enabled for point-in-time restore. If a reader has circular logging configured (the default on many installations) and follows this guide expecting point-in-time recovery, they will be unable to perform that type of restore and may be caught unprepared during an actual incident. This is a critical operational caveat with no mention anywhere in the article.
      fix:     Add an explicit prerequisite section stating that archive transaction logging must be enabled (notes.ini TRANSLOG_Style=1 or set via the Server document) for point-in-time recovery to work. Explain that circular logging supports only crash recovery, not point-in-time restore. Reference the relevant HCL documentation on transaction logging modes.
  [critical] Initiating the Backup Task — 'load backup'
      problem: The 'load backup' command only triggers a one-time, on-demand backup run. The article presents it immediately after describing scheduled backups, which could mislead a reader into thinking this command alone starts scheduled/ongoing backup protection. More importantly, the article never mentions that the Backup task must also be added to the ServerTasks or ServerTasksAt notes.ini entries (or started via the Domino server's program documents) to run automatically on schedule. An administrator who only runs 'load backup' once and assumes the schedule is now active will have no ongoing backups.
      fix:     Clarify that 'load backup' is for on-demand execution. Separately document how to enable the Backup task to run automatically: either add 'Backup' to the ServerTasks notes.ini parameter or create a Program document in the Domino Directory. Distinguish between one-time invocation and scheduled operation.
  [major] Overview of Native Backup and Restore — 'With the release of Domino 12, HCL introduced native backup and restore functionalities'
      problem: While Domino 12 introduced the native backup framework with dominobackup.nsf, the article does not mention that the feature has evolved significantly across subsequent releases (12.0.1, 12.0.2, 14.0, 14.5). Readers on different versions may encounter different capabilities or limitations. For example, certain storage targets and restore workflows differ by release. Treating this as a single static feature set is misleading.
      fix:     Add a version note near the top indicating which version introduced the feature and that capabilities have expanded in subsequent releases (through 14.x). Encourage readers to consult the release-specific documentation.
  [major] Flexible Storage Options — 'Support for backups to disk or network drives, with the potential for integration with third-party backup solutions'
      problem: The article omits the Domino Backup API (DBAPI), which is the formal mechanism by which third-party backup applications integrate with the native backup framework. Calling it merely 'potential for integration' understates and misrepresents how it works. Administrators evaluating third-party tools need to know they must use a solution that implements the Backup API, not simply any backup tool pointed at the data directory.
      fix:     Replace the vague phrasing with a specific mention of the HCL Domino Backup API and note that third-party solutions must be designed to use this API to properly quiesce databases and coordinate with transaction logs. Point readers to the HCL documentation on the Backup API.
  [major] Best Practices — entire section
      problem: The best practices section omits several operationally important items specific to Domino native backup: (1) the need to back up dominobackup.nsf itself (it contains the backup catalog; losing it complicates restore); (2) the requirement that the Domino data directory and transaction log directory paths be accessible and correctly configured before restore; (3) that DAOS-enabled databases require the DAOS repository to also be backed up and restored consistently with the NSF files, or restores will fail with missing attachments.
      fix:     Add best practice bullets covering: backup of dominobackup.nsf itself, consistency requirements for DAOS environments (back up DAOS repository alongside NSFs), and verifying that transaction log archive paths are included in the backup scope.
  [major] Initiating the Restore Task — 'load restore'
      problem: The article implies that restore is configured entirely within dominobackup.nsf and then 'load restore' is run. In practice, restore operations in the native framework are typically initiated through a restore request document created in dominobackup.nsf, which the Restore task then processes. Simply running 'load restore' without a pending restore request document will not restore anything. The workflow is more nuanced than presented and could mislead an administrator during a real recovery event.
      fix:     Clarify the full restore workflow: an administrator creates a Restore Request document in dominobackup.nsf (specifying the database, backup version, and destination), and then the Restore task processes that request. Show or describe the document-creation step before the 'load restore' command.
  [minor] Additional Resources — 'visual walkthrough of the backup and restore functionalities in Domino 12'
      problem: The linked YouTube video is attributed to Domino 12. If the article is intended to apply to current versions (up to 14.5 as suggested by one of the cited URLs), an unverified older video may show a UI or workflow that has changed, potentially confusing readers.
      fix:     Add a note that the video demonstrates the feature as introduced in Domino 12 and that some UI details may differ in later releases. If a more current recording is available, prefer that.
  [minor] Cited source — https://help.hcl-software.com/domino/14.5.0/admin/Domino_Database_Disaster_Recovery.html
      problem: The URL path segment 'Domino_Database_Disaster_Recovery.html' does not match the standard HCL Help page naming conventions for the native backup feature in the 14.5 documentation tree. The primary backup/restore content lives under paths like 'admn_backupandrestore.html'. This path may be fabricated or incorrectly transcribed and should be verified before publication.
      fix:     Verify this URL resolves to the intended page. If it is a legitimate disaster recovery overview page, confirm it is the most appropriate link for the context in which it is cited. If it does not resolve, replace with the correct verified URL.
-->

Ensuring the integrity and availability of your HCL Domino data is paramount. With the release of Domino 12, HCL introduced native backup and restore functionalities, allowing administrators to manage backups directly within the Domino environment without relying on third-party solutions. This guide provides a step-by-step approach to configuring and utilizing these features effectively.

## Overview of Native Backup and Restore

Domino 12's native backup and restore capabilities are designed to simplify the process of safeguarding your Notes databases and associated transaction logs. Key features include:

- **Integrated Backup Database**: The `dominobackup.nsf` database offers a user-friendly interface for configuring backup and restore operations.
- **Dedicated Server Tasks**: New server tasks, `Backup` and `Restore`, utilize configurations from `dominobackup.nsf` to perform backup and restore operations.
- **Flexible Storage Options**: Support for backups to disk or network drives, with the potential for integration with third-party backup solutions.
- **Point-in-Time Recovery**: Leveraging transaction logs to restore databases to specific points in time.

For a detailed overview, refer to the official documentation on [Backup and restore](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en).

## Configuring the Backup Process

1. **Accessing the Backup Configuration**:
   - Open the `dominobackup.nsf` database on your Domino server.
   - Navigate to the 'Configuration' section to set up backup parameters.

2. **Defining Backup Settings**:
   - **Backup Destination**: Specify the directory or network path where backups will be stored.
   - **Backup Schedule**: Set the frequency and timing of backups to align with your organization's requirements.
   - **Database Selection**: Choose which databases to include in the backup process.

3. **Initiating the Backup Task**:
   - Execute the following command on the Domino server console:
     ```
     load backup
     ```
   - This command starts the backup process based on the configurations set in `dominobackup.nsf`.

## Restoring Databases

In the event of data loss or corruption, the native restore functionality allows for efficient recovery:

1. **Accessing Restore Configuration**:
   - Within `dominobackup.nsf`, navigate to the 'Restore' section.

2. **Selecting Restore Parameters**:
   - **Database to Restore**: Choose the specific database requiring restoration.
   - **Restore Point**: Select the desired point in time for the restore operation, utilizing available transaction logs.
   - **Restore Destination**: Decide whether to overwrite the existing database or restore to an alternate location.

3. **Initiating the Restore Task**:
   - Run the following command on the Domino server console:
     ```
     load restore
     ```
   - This command initiates the restore process as per the configurations in `dominobackup.nsf`.

For comprehensive scenarios and detailed steps, consult the [Disaster recovery](https://help.hcl-software.com/domino/14.5.0/admin/Domino_Database_Disaster_Recovery.html) documentation.

## Best Practices

- **Regular Testing**: Periodically test backup and restore procedures to ensure data can be recovered successfully.
- **Monitor Backup Logs**: Regularly review backup logs for any errors or warnings that may indicate issues.
- **Secure Backup Storage**: Ensure backup destinations are secure and have adequate storage capacity.
- **Document Procedures**: Maintain clear documentation of backup and restore configurations and processes for reference during emergencies.

## Additional Resources

For a visual walkthrough of the backup and restore functionalities in Domino 12, consider watching the following tutorial:

[![HCL Domino - Use the Backup/Restore Function in Domino V12](https://img.youtube.com/vi/D0e0AmEkNCc/0.jpg)](https://www.youtube.com/watch?v=D0e0AmEkNCc)

By implementing and adhering to these native backup and restore procedures, Domino administrators can enhance data resilience and ensure business continuity in the face of potential data disruptions.
