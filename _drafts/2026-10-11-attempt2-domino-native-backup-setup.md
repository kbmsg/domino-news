---
title: "Setting Up Domino's Native Backup and Restore"
description: "A hands-on guide for Domino administrators to configure and utilize the native backup and restore features introduced in Domino V12."
pubDate: "2026-10-11T19:19:45+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Domino Server"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Domino Backup Introduction | Domino Backup"
    url: "https://opensource.hcltechsw.com/domino-backup/"
  - title: "Backing up the Domino server"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/admn_backingupthedominoserver_t.html"
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en"
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

With Domino V12, HCL introduced a native backup and restore feature, finally giving us an integrated solution without relying solely on third-party tools. Let's walk through setting this up and ensuring your data is protected.

### Understanding Domino's Native Backup

Domino's native backup isn't just a simple file copier. It's designed to work seamlessly with Domino databases, ensuring consistent backups even while the server is running. This means you can back up NSF databases, transaction logs, and DAOS repositories without shutting down your server.

### Prerequisites

Before diving in, ensure:

- You're running Domino V12 or later.
- You have administrative access to the Domino server.
- Sufficient storage space is available for backups.

### Configuring the Backup

1. **Access the Domino Backup Database:**
   - Open the Domino Administrator client.
   - Navigate to the `dominobackup.nsf` database. If it doesn't exist, create it using the `dominobackup.ntf` template.

2. **Set Up Backup Configuration:**
   - Within `dominobackup.nsf`, go to the 'Configuration' view.
   - Create a new configuration document.
   - Define backup paths, schedules, and retention policies. For instance, specify where backups will be stored and how long they'll be retained.

3. **Specify Backup Targets:**
   - In the configuration document, list the databases and files you want to back up. This can include NSF files, NTF templates, and transaction logs.

4. **Configure Backup Methods:**
   - Domino supports various backup methods:
     - **Full Backup:** Captures the entire database.
     - **Incremental Backup:** Captures changes since the last backup.
     - **Differential Backup:** Captures changes since the last full backup.
   - Choose the method that aligns with your recovery objectives and storage capabilities.

5. **Set Up Schedules:**
   - Define when backups should run. For example, schedule full backups weekly and incremental backups daily.

6. **Enable Notifications:**
   - Configure email notifications to alert you of backup successes or failures. This ensures you're always informed about the status of your backups.

### Running the Backup

Once configured, you can initiate backups:

- **Manually:**
  - Open the Domino console.
  - Run the command:
    ```
    load backup
    ```
  - This starts the backup process based on your configuration.

- **Automatically:**
  - Backups will run according to the schedules you've set in the configuration.

### Restoring Data

Restoring is just as straightforward:

1. **Access the Restore Interface:**
   - In `dominobackup.nsf`, navigate to the 'Restore' view.

2. **Select the Backup to Restore:**
   - Choose the backup set containing the data you need.

3. **Define Restore Options:**
   - Specify where to restore the data. You can overwrite the existing database or restore it to a different location.
   - Decide whether to apply transaction logs to bring the database to a specific point in time.

4. **Initiate the Restore:**
   - Click 'Restore' to start the process.
   - Alternatively, from the Domino console, run:
     ```
     load restore
     ```

### Best Practices

- **Regularly Test Restores:**
  - Don't wait for a disaster to find out your backups are faulty. Periodically restore data to ensure everything works as expected.

- **Monitor Backup Logs:**
  - Regularly check backup logs for errors or warnings. Address issues promptly to ensure data integrity.

- **Secure Backup Storage:**
  - Store backups in a secure location, preferably offsite or in a different data center, to protect against physical disasters.

- **Keep Backup Configurations Updated:**
  - As your environment changes (new databases, servers, etc.), update your backup configurations accordingly.

### The Outcome

By leveraging Domino's native backup and restore features, you gain a robust, integrated solution tailored for Domino environments. Proper configuration and regular testing ensure that when the unexpected happens, you're prepared to restore operations swiftly and efficiently.

For more detailed information, refer to the [Domino Backup Introduction](https://opensource.hcltechsw.com/domino-backup/) and the official documentation on [Backing up the Domino server](https://help.hcl-software.com/domino/14.5.0/admin/admn_backingupthedominoserver_t.html).
