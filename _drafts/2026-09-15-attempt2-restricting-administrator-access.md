---
title: "Restricting Administrator Access in HCL Domino"
description: "A focused guide on configuring and managing administrator access levels in HCL Domino to enhance server security and compliance."
pubDate: "2026-09-15T00:41:34+08:00"
slug: "restricting-administrator-access"
tags:
  - "Domino Server"
  - "Security"
  - "Tutorial"
sources:
  - title: "Restricting administrator access"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/conf_restrictingadministratoraccess_t.html"
  - title: "The Domino security model"
    url: "https://help.hcl-software.com/domino/14.5.0/admin/othr_thedominosecuritymodel_c.html"
  - title: "Server security"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/othr_serversecurity_c.html"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Article validation failed:
  - Saturated source URL: "https://help.hcl-software.com/domino/14.5.0/admin/othr_thedominosecuritymodel_c.html" was already cited by [server-restricted-access-control] on 2026-09-14. Re-citing it within 14 days means writing about a covered topic. Pick a different topic or a different angle that doesn't lean on this URL.
  - Body must have >= 3 inline links, got 2.
attempt: 2
slug: restricting-administrator-access
-->

## Introduction

Managing administrator access in HCL Domino is crucial for maintaining server security and ensuring compliance with organizational policies. By carefully configuring administrator roles and privileges, you can minimize the risk of unauthorized changes and potential security breaches.

## Understanding Administrator Access Levels

HCL Domino allows you to define various levels of administrative access, each granting specific rights and privileges. These levels include:

- **Full Access Administrators**: Have unrestricted access to all server functions.
- **Administrators**: Can perform standard administrative tasks but lack full access rights.
- **Database Administrators**: Focus on database-specific administration tasks.
- **Full Remote Console Administrators**: Can issue any remote console command.
- **View-Only Administrators**: Limited to viewing server status without making changes.
- **System Administrators**: Authorized to execute a full range of operating system commands on the server.
- **Restricted System Administrators**: Limited to executing specific operating system commands defined by the organization.

For a detailed description of each access level, refer to the [HCL Domino documentation](https://help.hcl-software.com/domino/11.0.1/admin/conf_restrictingadministratoraccess_t.html).

## Configuring Administrator Access

To restrict administrator access:

1. **Access the Server Document**:
   - Open the Domino Administrator client.
   - Navigate to the **Configuration** tab.
   - Open the relevant **Server** document.

2. **Modify the Security Settings**:
   - Click on the **Security** tab.
   - In the **Administrators** section, specify the names of users or groups for each administrative role. You can enter individual hierarchical names, groups, or use wildcards (e.g., `*/Sales/Renovations`). Separate multiple entries with commas.

3. **Save the Changes**:
   - After configuring the desired access levels, save the Server document to apply the changes.

**Note**: By default, all fields except the **Administrators** field are blank, meaning no one has those specific access rights unless explicitly assigned.

## Best Practices for Administrator Access Management

- **Principle of Least Privilege**: Assign the minimum level of access necessary for users to perform their job functions. This reduces the risk of accidental or malicious changes.

- **Regular Reviews**: Periodically review and update administrator access lists to ensure they align with current organizational roles and responsibilities.

- **Separation of Duties**: Divide administrative tasks among different individuals to prevent any single person from having excessive control over critical systems.

- **Audit and Monitoring**: Implement logging and monitoring to track administrative activities. This helps in identifying unauthorized actions and maintaining accountability.

For more information on securing your Domino environment, consult the [Domino security model](https://help.hcl-software.com/domino/14.5.0/admin/othr_thedominosecuritymodel_c.html).

## Conclusion

Properly configuring and managing administrator access in HCL Domino is essential for maintaining a secure and compliant server environment. By understanding the different access levels and implementing best practices, you can effectively control administrative privileges and protect your organization's resources.
