---
title: "Setting Up Domino's Native Backup and Restore"
description: "A hands-on guide to configuring and utilizing Domino's built-in backup and restore features for database protection."
pubDate: "2026-10-28T19:09:11+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Tutorial"
  - "Domino Server"
  - "Backup and Recovery"
sources:
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en"
  - title: "Domino Backup Introduction | Domino Backup"
    url: "https://opensource.hcltechsw.com/domino-backup/"
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

## Setting Up Domino's Native Backup and Restore

If you're running HCL Domino 12 or later, you've got a built-in backup and restore feature that's worth setting up. No more relying solely on third-party solutions or complex scripts. Let's walk through getting this up and running.

### What's Included

Domino's native backup introduces:

- **Dominobackup.nsf**: A database for configuring and managing backups.
- **Backup and Restore Server Tasks**: New tasks to handle the actual backup and restore processes.

This setup allows for file system backups and can integrate with third-party solutions if needed. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en&utm_source=openai))

### Initial Setup

1. **Create the Backup Database**:
   - Open your Domino console and run:
     ```
     load backup
     ```
     This command generates the `dominobackup.nsf` in your data directory.

2. **Configure Backup Settings**:
   - Open `dominobackup.nsf` in the Domino Administrator.
   - Navigate to the **Configuration** view.
   - Select the default configuration for your platform (Windows or Linux) and click **New Config**.

3. **Main Tab**:
   - **Backup Directory**: Specify where backups will be stored. Ensure the Domino server has write access to this location.
   - **Backup Retention**: Define how long backups are kept before pruning.

4. **Backup Tab**:
   - **Backup Type**: Choose between full, incremental, or differential backups.
   - **Schedule**: Set when backups should run. Regular scheduling is crucial to ensure data safety.

5. **Restore Tab**:
   - **Restore Directory**: Define where restored databases will be placed.
   - **Options**: Decide if restored databases should overwrite existing ones or be placed alongside them.

6. **Prune Tab**:
   - Configure settings to automatically delete old backups based on your retention policy.

7. **Notification Tab**:
   - Set up email notifications for backup successes or failures. This keeps you informed without constantly checking logs.

After configuring, click **Save & Close**. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.0.0/admin/admn_configuringbackup.html?utm_source=openai))

### Running Backups

To initiate a backup:

- **Immediate Backup**:
  - From the Domino console:
    ```
    load backup
    ```

- **Scheduled Backup**:
  - Create a Program document in the Domino Directory:
    - **Program Name**: `backup`
    - **Command Line**: Leave blank or specify additional parameters.
    - **Schedule**: Set your desired frequency.

### Restoring Databases

1. **Open `dominobackup.nsf`**:
   - Navigate to the **Database Inventory** view.

2. **Select the Database to Restore**:
   - Highlight the desired database and click **Restore**.

3. **Restore Options**:
   - Choose the point-in-time for restoration.
   - Decide if you want to disable replication temporarily to prevent unintended data changes.

4. **Initiate Restore**:
   - Click **Submit** to start the restore process.

Monitor the Domino console for progress and any potential issues. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.0/admin/ScenarioDisasterRecovery.html?utm_source=openai))

### Integrating with Third-Party Solutions

If you're using third-party backup tools, Domino's native backup can integrate seamlessly:

- **Snapshot Backups**:
  - Configure the **Snapshot** tab in `dominobackup.nsf` to work with your third-party solution.
  - Ensure scripts or commands are correctly set to handle snapshot creation and management.

- **DAOS Integration**:
  - If you're using DAOS, ensure your third-party solution backs up the DAOS repository alongside NSF files.

### Best Practices

- **Regular Testing**: Periodically test both backup and restore processes. A backup is only as good as its ability to restore.
- **Monitor Logs**: Keep an eye on backup logs for any errors or warnings.
- **Offsite Storage**: Store backups in a separate location to protect against physical disasters.

For a visual walkthrough, check out this video:

[![HCL Domino - Use the Backup/Restore Function in Domino V12](https://img.youtube.com/vi/D0e0AmEkNCc/0.jpg)](https://www.youtube.com/watch?v=D0e0AmEkNCc)

## To Review

Setting up Domino's native backup and restore isn't just a good idea—it's essential. With the steps above, you can ensure your data is protected and recoverable when needed. Don't wait for a disaster to realize the importance of a solid backup strategy.
