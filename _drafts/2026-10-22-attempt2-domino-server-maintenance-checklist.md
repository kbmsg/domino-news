---
title: "Domino Server Maintenance: Daily, Weekly, and Monthly Tasks"
description: "A practical guide outlining essential daily, weekly, and monthly maintenance tasks to ensure optimal performance and reliability of your HCL Domino servers."
pubDate: "2026-10-22T17:55:27+08:00"
slug: "domino-server-maintenance-checklist"
tags:
  - "Domino Server"
  - "Monitoring"
  - "Tutorial"
sources:
  - title: "Server maintenance checklist"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html"
  - title: "Overview of server maintenance"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_overviewofservermaintenance_c.html"
  - title: "HCL Domino Server (Lotus Domino) Explained, 2026 | RockTeam"
    url: "https://www.rockteam.com/domino-server/"
relatedConsoleCommands:
  - "load fixup"
  - "load compact"
  - "load updall"
  - "show stat"
  - "show tasks"
notesIniSettings:
  - "ServerTasksAt1=fixup"
  - "ServerTasksAt2=compact"
  - "ServerTasksAt3=updall"
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Inline-link diversity check failed: "https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html" appears 12/12 times in inline links (>50%). Likely a copy-paste error, each anchor should point to its own destination.
attempt: 2
slug: domino-server-maintenance-checklist
-->

## Daily Maintenance Tasks

### 1. Backup the Server

Regular backups are your safety net. Ensure all Domino server data files, including databases, templates, the `NOTES.INI` file, and ID files, are backed up daily. This practice safeguards against data loss and facilitates recovery in case of failures. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### 2. Monitor Mail Routing

Keep an eye on mail routing to confirm that messages are being delivered promptly. Delays or failures can indicate underlying issues that need immediate attention. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### 3. Monitor Replication

Ensure that database replication between servers is functioning correctly. Inconsistent replication can lead to data discrepancies and user complaints. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### 4. Monitor Disk Space

Check disk space usage to prevent servers from running out of storage, which can cause crashes or data corruption. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

## Weekly Maintenance Tasks

### 1. Run Fixup to Repair Databases

Use the `Fixup` task to repair corrupted databases. If you're not using transaction logging, this becomes even more critical. Run the following command:

```bash
load fixup
```

[Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### 2. Monitor the Administration Requests Database

Review the `ADMIN4.NSF` database to ensure that administrative requests are being processed correctly. Unprocessed requests can indicate issues with the Administration Process. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### 3. Monitor Databases That Need Maintenance

Identify databases requiring maintenance and address any issues to maintain optimal performance. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

## Monthly Maintenance Tasks

### 1. Monitor Memory Usage

Analyze memory consumption to detect potential leaks or inefficiencies that could degrade server performance. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### 2. Monitor Server Load

Assess server load to ensure it's within acceptable limits. Overloaded servers can lead to slow response times and outages. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### 3. Monitor Server Performance

Evaluate overall server performance metrics to identify and resolve bottlenecks or other issues affecting efficiency. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

### 4. Monitor Web Server Requests

Review web server logs to ensure that HTTP requests are being handled properly and to identify any potential security threats. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

## Automating Maintenance Tasks

To streamline these maintenance tasks, consider scheduling them using the `ServerTasksAt` settings in the `NOTES.INI` file. For example:

```ini
ServerTasksAt1=fixup
ServerTasksAt2=compact
ServerTasksAt3=updall
```

This configuration schedules the `Fixup`, `Compact`, and `Updall` tasks to run at specified times, reducing manual intervention. [Source](https://help.hcl-software.com/domino/11.0.1/admin/admn_servermaintenancechecklist_r.html)

## To Review

Regular maintenance is crucial for the health and performance of your HCL Domino servers. By adhering to this daily, weekly, and monthly checklist, you can proactively address potential issues, ensure data integrity, and provide a reliable environment for your users. Remember, automation can significantly reduce the manual workload, but always monitor the outcomes to confirm that tasks are executing as intended.
