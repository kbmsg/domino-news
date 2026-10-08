---
title: "Setting Up Domino's Native Backup and Restore"
description: "A hands-on guide for Domino administrators to configure and utilize the native backup and restore features introduced in Domino 12."
pubDate: "2026-10-08T19:52:20+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Domino Server"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html"
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

With the release of Domino 12, HCL introduced a native backup and restore feature, eliminating the need for third-party solutions to safeguard your databases. Here's how to get it up and running.

### Understanding Domino's Native Backup

Domino's built-in backup and restore functionality is designed to integrate seamlessly with your existing environment. It provides:

- **File system backups**: Directly to disk or network drives.
- **Integration with third-party solutions**: Through customizable scripts.
- **Point-in-time restores**: Utilizing transaction logs for precise recovery.

For a comprehensive overview, refer to the [official documentation](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html).

### Configuring the Backup Feature

1. **Access the Domino Backup Database**:
   - Open `dominobackup.nsf` on your Domino server. This database serves as the control center for backup configurations.

2. **Set Up Backup Configuration**:
   - Within `dominobackup.nsf`, navigate to the 'Configuration' section.
   - Define backup paths, schedules, and retention policies according to your organization's requirements.

3. **Schedule the Backup Task**:
   - Create a Program document in the Domino Directory to run the `backup` task at specified intervals.
   - Alternatively, initiate a manual backup via the server console:
     ```
     load backup
     ```

For detailed steps, consult the [Domino Backup Introduction](https://opensource.hcltechsw.com/domino-backup/).

### Restoring Databases

1. **Initiate the Restore Process**:
   - Open `dominobackup.nsf` and navigate to the 'Restore' section.

2. **Select the Database to Restore**:
   - Choose the desired database from the inventory.
   - Specify the restore point, leveraging transaction logs if necessary.

3. **Execute the Restore**:
   - Confirm the restore operation. Domino will handle the process, ensuring data integrity.

Alternatively, use the server console:
```
load restore
```

### Best Practices

- **Regularly Test Backups**: Periodically restore databases to verify backup integrity.
- **Monitor Backup Logs**: Review logs in `dominobackup.nsf` for any anomalies.
- **Secure Backup Locations**: Ensure backup destinations are protected against unauthorized access.

By leveraging Domino's native backup and restore features, you can enhance your server's resilience and ensure data availability without relying on external tools.

## To Review

- **Backup Configuration**: Ensure `dominobackup.nsf` is properly set up.
- **Scheduled Tasks**: Verify that backup tasks are running as intended.
- **Restore Procedures**: Familiarize yourself with the restore process to act swiftly during data loss incidents.

For further reading, explore the [official backup and restore documentation](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html) and the [Domino Backup Introduction](https://opensource.hcltechsw.com/domino-backup/).
