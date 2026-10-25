---
title: "Setting Up Domino's Native Backup: A Hands-On Guide"
description: "A practical walkthrough for Domino administrators on configuring and utilizing Domino's native backup and restore features introduced in version 12."
pubDate: "2026-10-25T17:39:38+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Tutorial"
  - "Domino Server"
  - "Backup and Recovery"
sources:
  - title: "Domino Backup Introduction | Domino Backup"
    url: "https://opensource.hcltechsw.com/domino-backup/"
  - title: "Backing up the Domino server"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/admn_backingupthedominoserver_t.html"
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en"
  - title: "HCL Domino - Use the Backup/Restore Function in Domino V12 - YouTube"
    url: "https://www.youtube.com/watch?v=D0e0AmEkNCc"
relatedConsoleCommands:
  - "load backup"
  - "load restore"
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Slug collision: "domino-native-backup-setup" already exists. The model ignored the FORBIDDEN SLUGS list, refusing to overwrite an existing post.
attempt: 2
slug: domino-native-backup-setup
-->

## Introduction

With the release of Domino 12, HCL introduced a native backup and restore feature, eliminating the need for third-party solutions for many environments. This guide walks you through setting up and using this functionality to safeguard your Domino data effectively.

## Prerequisites

Before diving in, ensure your environment meets the following criteria:

- **Domino Version**: Your server should be running Domino 12 or later.
- **Operating System**: The native backup feature is available on both Windows and Linux platforms.
- **File System Access**: Ensure the Domino server has appropriate permissions to read from and write to the designated backup directories.

## Configuring the Backup Feature

1. **Access the Domino Backup Database**:

   Domino 12 introduces a new database named `dominobackup.nsf`. This database serves as the central hub for configuring and managing backup operations.

   - Navigate to the Domino Data directory and open `dominobackup.nsf` using the Domino Administrator client.

2. **Set Up Backup Configuration**:

   Within `dominobackup.nsf`, you'll need to define how and where your backups will be stored.

   - **Backup Destinations**: Specify the directories or network locations where backups will be saved. Ensure these locations have sufficient storage and are accessible by the Domino server.

   - **Backup Schedules**: Determine the frequency of backups. You can set up daily, weekly, or custom schedules based on your organization's needs.

   - **Retention Policies**: Define how long backups should be retained before being purged. This helps in managing storage efficiently.

   For detailed steps on configuring these settings, refer to the [Domino Backup Introduction](https://opensource.hcltechsw.com/domino-backup/).

## Initiating a Backup

Once configured, you can initiate backups manually or rely on the schedules you've set.

- **Manual Backup**:

  To start a backup immediately:

  1. Open the Domino Administrator client.
  2. Navigate to the Server Console.
  3. Enter the command:

     ```shell
     load backup
     ```

  This command initiates the backup process based on the configurations defined in `dominobackup.nsf`.

- **Scheduled Backup**:

  If you've set up schedules in `dominobackup.nsf`, backups will run automatically at the specified times. Ensure that the Domino server is running during these periods to execute the backups.

## Restoring Data

Restoration is just as straightforward:

1. **Access the Restore Interface**:

   Within `dominobackup.nsf`, navigate to the 'Restore' section.

2. **Select the Database to Restore**:

   You'll see a list of available backups. Choose the database you wish to restore.

3. **Initiate the Restore**:

   Click on the 'Restore' button. You can choose to restore the database to its original location or specify a new one.

   Alternatively, from the Server Console, you can use the command:

   ```shell
   load restore
   ```

   This command will prompt you for further details about the restoration process.

## Best Practices

- **Regular Testing**: Periodically test your backup and restore processes to ensure data integrity and verify that backups are functioning correctly.

- **Monitor Storage**: Keep an eye on the storage used by backups. Adjust retention policies as needed to prevent storage issues.

- **Document Procedures**: Maintain clear documentation of your backup configurations and restoration procedures. This is invaluable during emergencies.

## Additional Resources

For a visual walkthrough of the backup and restore functions in Domino V12, consider watching the following video:

[HCL Domino - Use the Backup/Restore Function in Domino V12](https://www.youtube.com/watch?v=D0e0AmEkNCc&utm_source=openai)


## To Review

Setting up Domino's native backup feature is a straightforward process that provides robust data protection without the need for external tools. By following the steps outlined above and adhering to best practices, you can ensure your Domino environment remains resilient against data loss scenarios.
