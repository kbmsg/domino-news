---
title: "Setting Up Domino's Native Backup and Restore"
description: "A hands-on guide to configuring Domino's built-in backup and restore features for database protection."
pubDate: "2026-10-21T16:12:08+08:00"
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

If you've been relying on third-party tools or manual scripts to back up your Domino databases, it's time to take a closer look at the native backup and restore functionality introduced in Domino 12. This built-in feature simplifies the process and integrates seamlessly with your existing environment.

### Why Use Domino's Native Backup?

Starting with Domino 12, HCL introduced a native backup and restore feature designed to work out of the box. It offers:

- **Integrated Management**: A dedicated database (`dominobackup.nsf`) provides an interface to configure and monitor backups.
- **Flexibility**: Supports file system backups and can integrate with third-party solutions.
- **Point-in-Time Recovery**: Utilizes transaction logs for precise restores.

For a comprehensive overview, refer to the [official documentation](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en).

### Prerequisites

Before diving in, ensure:

- **Domino Version**: You're running Domino 12 or later.
- **Operating System**: Backup and restore are supported on Windows and Linux.
- **Transaction Logging**: Enabled on your Domino server. This is crucial for point-in-time recovery.

### Step-by-Step Configuration

1. **Access the Backup Database**:
   - Open `dominobackup.nsf` on your Domino server. If it doesn't exist, create it by running:
     ```
     load backup
     ```
     This initializes the backup database.

2. **Create a New Configuration**:
   - In `dominobackup.nsf`, navigate to the Configuration view.
   - Click on "New Config" to create a new configuration document.

3. **Main Tab Settings**:
   - **Backup Root Directory**: Specify where backups will be stored. Ensure the Domino server has write access to this directory.
   - **Backup Retention**: Define how long backups should be retained before pruning.

4. **Backup Tab Settings**:
   - **Backup Type**: Choose between full, incremental, or differential backups.
   - **Schedule**: Set up when backups should run. It's advisable to schedule backups during off-peak hours.

5. **Restore Tab Settings**:
   - **Restore Root Directory**: Define where restored databases will be placed.
   - **Options**: Configure settings like disabling replication on restored databases to prevent unintended replication.

6. **Prune Tab Settings**:
   - Set up rules for deleting old backups based on age or number of backups retained.

7. **Notification Tab Settings**:
   - Configure email notifications for backup successes or failures. This ensures you're promptly informed of any issues.

8. **Save and Close**:
   - Once all settings are configured, save and close the configuration document.

### Running the Backup Task

To initiate a backup based on your configuration:

```shell
load backup
```

For scheduled backups, create a Program document in the Domino Directory:

- **Program Name**: `backup`
- **Command Line**: Leave blank or specify additional parameters as needed.
- **Schedule**: Define the frequency and time for the backup task.

### Restoring a Database

1. **Access the Backup Database**:
   - Open `dominobackup.nsf` and navigate to the Database Inventory view.

2. **Select the Database to Restore**:
   - Find and select the database you wish to restore.

3. **Initiate Restore**:
   - Click on the "Restore" action.
   - Choose the restore point (based on available backups and transaction logs).
   - Confirm and start the restore process.

For detailed instructions, refer to the [official guide](https://help.hcl-software.com/domino/14.0.0/admin/admn_configuringbackup.html).

### Best Practices

- **Regular Testing**: Periodically test your backup and restore procedures to ensure data integrity.
- **Monitor Logs**: Regularly check backup logs for any errors or warnings.
- **Offsite Storage**: Consider storing backups offsite or in a secure cloud location for added redundancy.

### To Review

Implementing Domino's native backup and restore functionality provides a streamlined and integrated approach to safeguarding your databases. By following the steps outlined above, you can ensure that your data is backed up efficiently and can be restored promptly when needed.

For a visual walkthrough, check out this [video tutorial](https://www.youtube.com/watch?v=D0e0AmEkNCc).
