---
title: "Implementing Domino's Native Backup and Restore"
description: "A practical guide to setting up and using HCL Domino's native backup and restore features for database protection."
pubDate: "2026-10-24T17:21:39+08:00"
slug: "domino-native-backup-restore"
tags:
  - "Domino Server"
  - "Backup and Recovery"
  - "Tutorial"
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
  - Body must have >= 2 inline links, got 1.
attempt: 1
slug: domino-native-backup-restore
-->

## Implementing Domino's Native Backup and Restore

If you've been managing Domino servers for a while, you know the drill: backups are essential, but integrating third-party solutions can be a hassle. With Domino 12, HCL introduced native backup and restore capabilities, streamlining the process and reducing reliance on external tools. Here's how to get it up and running.

### Setting Up Domino's Native Backup

1. **Access the Domino Backup Database**: After upgrading to Domino 12 or later, you'll find a new database named `dominobackup.nsf` in your data directory. This is your control center for backup configurations.

2. **Configure Backup Settings**:
   - **Open `dominobackup.nsf`**: Launch it using your Domino Administrator client.
   - **Define Backup Paths**: Specify where you want your backups stored. This can be a local directory or a network share.
   - **Set Backup Schedules**: Determine when backups should run—daily, weekly, etc.
   - **Select Databases to Back Up**: Choose which databases are critical and need regular backups.

3. **Integrate with External Storage (Optional)**: While Domino's native backup writes to disk or network drives by default, you can integrate with third-party storage solutions if needed. This involves configuring scripts or commands within `dominobackup.nsf` to interface with your storage system. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en&utm_source=openai))

### Running the Backup

Once configured, you can initiate backups:

- **Manual Backup**: From the server console, run:
  
  ```
  load backup
  ```

  This starts the backup process based on your configurations.

- **Scheduled Backup**: If you've set schedules in `dominobackup.nsf`, backups will run automatically at the specified times.

### Restoring Databases

Restoring is just as straightforward:

1. **Initiate Restore**:
   - **From the Console**: Use the command:
     
     ```
     load restore
     ```

     This launches the restore process.

2. **Select Database and Restore Point**:
   - Within the restore interface, choose the database you need to restore.
   - Pick the appropriate backup version based on the timestamp.

3. **Restore Options**:
   - **Point-in-Time Recovery**: If transaction logging is enabled, you can restore the database to a specific point in time.
   - **Restore Deleted Documents**: Optionally, restore documents that were deleted after the backup was taken.

### Best Practices

- **Regularly Test Restores**: Don't wait for a disaster to find out your backups are faulty. Periodically test restoring databases to ensure everything works as expected.

- **Monitor Backup Logs**: After each backup, review the logs in `dominobackup.nsf` for any errors or warnings.

- **Keep Offsite Copies**: Even with native backups, ensure you have copies stored offsite or in the cloud for added redundancy.

### To Review

Domino's native backup and restore features simplify the backup process, reducing the need for third-party tools. By configuring `dominobackup.nsf` and understanding the associated commands, you can ensure your databases are protected and recoverable. Always stay proactive: test your backups, monitor logs, and maintain offsite copies to safeguard against unexpected data loss.
