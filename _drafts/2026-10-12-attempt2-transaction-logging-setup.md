---
title: "Setting Up Transaction Logging in HCL Domino"
description: "A hands-on guide for Domino administrators to configure transaction logging for improved data integrity and recovery."
pubDate: "2026-10-12T20:54:53+08:00"
slug: "transaction-logging-setup"
tags:
  - "Domino Server"
  - "Transaction Logging"
  - "Backup and Recovery"
  - "Tutorial"
sources:
  - title: "Setting up a Domino server for transaction logging"
    url: "https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html"
  - title: "TRANSLOG_Path – Transaction Log Directory (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/translog_path/"
relatedConsoleCommands: []
notesIniSettings:
  - "TRANSLOG_Status"
  - "TRANSLOG_Path"
  - "TRANSLOG_Style"
  - "TRANSLOG_Performance"
draft: true
---
<!--
REJECTED DRAFT - Unterminated string in JSON at position 8334 (line 61 column 93)
attempt: 2
slug: transaction-logging-setup
-->

## Why Transaction Logging Matters

If you've ever faced a server crash or data corruption, you know the sinking feeling that comes with potential data loss. Transaction logging in HCL Domino is your safety net, capturing all database changes and ensuring you can recover swiftly without losing data. Let's walk through setting it up properly.

## Preparing for Transaction Logging

Before diving in, a bit of prep work:

- **Dedicated Storage**: Allocate a separate, mirrored disk (think RAID 1) for your transaction logs. This setup boosts performance and safeguards your data. ([help.hcl-software.com](https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html?utm_source=openai))

- **Backup Strategy**: Plan for daily incremental backups of your transaction logs and weekly full database backups. This routine ensures you're covered in case of hardware failures. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.0/admin/admn_preparingfortransactionlogging_t.html?utm_source=openai))

## Enabling Transaction Logging

1. **Access the Server Document**:
   - Open Domino Administrator.
   - Navigate to the **Configuration** tab.
   - Expand **Server** and select **All Server Documents**.
   - Choose the server you want to configure and click **Edit Server**.

2. **Configure Transaction Logging**:
   - Go to the **Transactional Logging** tab.
   - Set **Transactional Logging** to **Enabled**.
   - In the **Log path** field, specify the path to your dedicated disk (e.g., `G:\TransLogs`).
   - Decide on the **Logging Style**:
     - **Circular**: Overwrites old transactions once the log reaches its size limit (up to 4GB). Suitable if your log size between full backups is under 4GB.
     - **Linear**: Similar to circular but allows logs larger than 4GB.
     - **Archived**: Creates new log files as needed and doesn't overwrite until archived. Ideal for point-in-time recovery but requires a compatible backup utility. ([help.hcl-software.com](https://help.hcl-software.com/domino/14.5.0/admin/admn_preparingfortransactionlogging_t.html?utm_source=openai))

3. **Set Performance Preferences**:
   - Under **Runtime/Restart Performance**, choose:
     - **Standard**: Balanced performance and recovery time.
     - **Favor runtime**: Better runtime performance but longer recovery.
     - **Favor restart recovery time**: Quicker recovery at the cost of runtime performance. ([help.hcl-software.com](https://help.hcl-software.com/domino/10.0.1/admin/admn_settingupadominoserverfortransactionlogging_t.html?utm_source=openai))

4. **Save and Restart**:
   - Click **Save & Close**.
   - Restart the server for changes to take effect.

## Notes.ini Parameters

While the Server Document is the primary configuration point, certain settings are reflected in the `notes.ini` file:

- **TRANSLOG_Status**: Indicates if transaction logging is enabled (`1`) or disabled (`0`).
- **TRANSLOG_Path**: Specifies the directory for transaction logs.
- **TRANSLOG_Style**: Defines the logging style (`0` for Circular, `1` for Archived).
- **TRANSLOG_Performance**: Sets the performance preference (`1` for Favor runtime, `2` for Standard, `3` for Favor restart recovery time).

Remember, changes in the Server Document will update these parameters in `notes.ini`. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/translog_path/?utm_source=openai))

## The Outcome

With transaction logging enabled, your Domino server is better equipped to handle unexpected crashes or data issues. You'll have a reliable mechanism to recover databases to their most recent state, minimizing downtime and data loss. Regular backups combined with transaction logs ensure your data's integrity and availability.

For a visual walkthrough, check out this [video tutorial](https://www.youtube.com/watch?v=ikEghnliYXs).
