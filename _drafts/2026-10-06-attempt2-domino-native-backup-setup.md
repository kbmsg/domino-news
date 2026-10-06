---
title: "Setting Up Domino's Native Backup and Restore"
description: "A hands-on guide for Domino administrators to configure and utilize the native backup and restore features introduced in Domino 12."
pubDate: "2026-10-06T19:53:16+08:00"
slug: "domino-native-backup-setup"
tags:
  - "Tutorial"
  - "Domino Server"
  - "Backup and Recovery"
sources:
  - title: "Domino Backup Introduction"
    url: "https://opensource.hcltechsw.com/domino-backup/"
  - title: "Backup and restore"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en"
  - title: "HCL Domino Native Backup Concept"
    url: "https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/"
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

With the release of Domino 12, HCL introduced a native backup and restore feature, eliminating the need for third-party solutions to safeguard your databases. Here's a straightforward guide to get you up and running with this built-in functionality.

### Understanding Domino's Native Backup

Domino's native backup system is designed to integrate seamlessly with existing backup solutions or function independently. It focuses on backing up Notes databases and transaction logs, ensuring point-in-time recovery capabilities. The core components include:

- **Backup and Restore Server Tasks**: These tasks handle the actual backup and restoration processes.
- **Domino Backup Database (`dominobackup.nsf`)**: This database provides the interface for configuring and managing backup operations.

For a comprehensive overview, refer to the [Domino Backup Introduction](https://opensource.hcltechsw.com/domino-backup/).

### Initial Configuration Steps

1. **Access the Domino Backup Database**:
   - Navigate to the Domino data directory and open `dominobackup.nsf` using the Domino Administrator client.

2. **Set Up Backup Configuration**:
   - Within `dominobackup.nsf`, go to the 'Configuration' view.
   - Create a new configuration document tailored to your environment. Specify details such as backup paths, schedules, and any integration with external storage solutions.

3. **Define Backup Schedules**:
   - In the 'Schedules' view, establish when and how often backups should occur. This ensures regular data protection without manual intervention.

4. **Specify Backup Selections**:
   - Use the 'Selections' view to determine which databases and files are included in the backup process. This allows for targeted backups, focusing on critical data.

For detailed instructions on each of these steps, consult the [Backup and restore documentation](https://help.hcl-software.com/domino/14.0.0/admin/admn_backupandrestore.html?scLang=en).

### Executing Backup and Restore Operations

Once configured, you can initiate backup and restore tasks:

- **To Start a Backup**:
  - From the Domino server console, execute:
    ```
    load backup
    ```
  - This command triggers the backup process based on your predefined configurations.

- **To Restore a Database**:
  - Open `dominobackup.nsf` and navigate to the 'Restore' view.
  - Select the database you wish to restore and follow the on-screen prompts to complete the restoration.

### Best Practices and Considerations

- **Regular Testing**: Periodically test your backup and restore procedures to ensure data integrity and process reliability.
- **Monitor Logs**: Keep an eye on backup logs for any anomalies or failures. This proactive approach helps in addressing issues before they escalate.
- **Integrate with Existing Solutions**: If you're using third-party backup tools, consider integrating them with Domino's native backup for a comprehensive data protection strategy.

For advanced configurations and integration options, explore the [Domino Native Backup Concept](https://opensource.hcltechsw.com/domino-backup/domino-backup-concept/).

## To Review

Implementing Domino's native backup and restore features provides a robust and integrated solution for data protection. By following the steps outlined above, you can ensure your Domino environment is safeguarded against data loss, all without relying on external tools.
