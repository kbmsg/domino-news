---
title: "Streamlining User Management with AdminCentral in HCL Domino"
description: "A hands-on guide to using AdminCentral for efficient user and group management in HCL Domino environments."
pubDate: "2026-09-14T21:23:59+08:00"
slug: "admincentral-user-management"
tags:
  - "Domino Server"
  - "Tutorial"
sources:
  - title: "Administering with AdminCentral"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/admincentral_app.html"
  - title: "Setting up the Domino Administrator"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/admn_settingupthedominoadministrator_t.html"
  - title: "Administering with AdminCentral"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admincentral_app.html"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - 1 critical fact issue(s)
attempt: 2
slug: admincentral-user-management
topicOverlap: false
issues:
  [critical] It is automatically created by the Administration Process (AdminP) on the Domino administration server.
      problem: AdminCentral (admincentral.nsf) is not automatically created by AdminP. It must be manually created by the administrator, typically by copying or deploying the template (admincentral.ntf) on the Domino server. Telling administrators it appears automatically could cause them to wait for something that will never happen, or miss a required setup step entirely.
      fix:     Correct the statement to explain that admincentral.nsf must be created by the administrator from the admincentral.ntf template on the Domino administration server, and reference the correct setup procedure from HCL documentation.
  [major] Registration Authority Assignment — 'listed as a Registration Authority (RAA)'
      problem: The correct term in Domino CA infrastructure is 'Registration Authority' (RA), and the server role is configured through the CA process, not merely 'listed.' The abbreviation 'RAA' is not standard Domino terminology and may confuse administrators looking for this setting. The actual requirement is that the administration server is configured as a Registration Authority within the Domino CA process for the certifier.
      fix:     Use the standard terminology: the administration server must be configured as a Registration Authority (RA) in the Domino CA process. Remove the non-standard abbreviation 'RAA' and clarify how this is configured (via the CA process in the Domino Administrator client or server console).
  [major] Prerequisites — no version introduction context
      problem: The article does not state which version of HCL Domino first introduced AdminCentral. AdminCentral was introduced in Domino 12.0. Administrators running Domino 11.x or earlier will not have this feature at all, and the article gives no version caveat, which could cause confusion or wasted troubleshooting time.
      fix:     Add a clear statement near the top that AdminCentral was introduced in HCL Domino 12.0 and that a minimum version of Domino 12.0 (or later) is required.
  [major] Open Your Client: Launch your Notes Standard or Nomad web client.
      problem: AdminCentral is accessible via HCL Notes (v12+) and HCL Nomad Web; it is not exclusive to 'Notes Standard' (a deprecated branding term from the Notes 9/10 era split between 'Standard' and 'Basic'). Additionally, the article omits that AdminCentral can also be accessed via a standard web browser depending on configuration, which is a significant alternative access method administrators should know about.
      fix:     Replace 'Notes Standard' with 'HCL Notes' (current product name). Clarify that access is also possible via a standard web browser and HCL Nomad Web, and note any configuration steps needed to enable browser access.
  [major] Active Directory Integration: Register Active Directory contacts or Person documents that have been synchronized into Domino as Notes users.
      problem: This feature description is misleading in scope. AdminCentral can facilitate registration of users sourced from Active Directory, but the synchronization mechanism itself (via HCL Domino Active Directory Synchronization or similar tooling) is a separate prerequisite not mentioned. Presenting this as a simple AdminCentral feature without noting the dependency on a functioning directory synchronization setup could mislead administrators into thinking AdminCentral handles the AD sync itself.
      fix:     Clarify that AdminCentral can register users who have already been synchronized from Active Directory into the Domino Directory via a separate synchronization mechanism, and briefly note that the AD sync configuration is a separate prerequisite.
  [major] Summary citation — https://help.hcl-software.com/domino/14.0.0/admin/admincentral_app.html
      problem: The article's body references Domino 14.5.1 documentation throughout, but the Summary section links to the Domino 14.0.0 version of the same AdminCentral page. Mixing version-specific documentation URLs is inconsistent and risks pointing readers to outdated information, especially if feature details differ between 14.0.0 and 14.5.1.
      fix:     Replace the 14.0.0 URL in the Summary with the 14.5.1 equivalent (https://help.hcl-software.com/domino/14.5.1/admin/admincentral_app.html) to maintain consistency, or explicitly note why an older version is being referenced.
  [minor] ID Vault Setup link text — 'Setting up the Domino Administrator'
      problem: The link text 'Setting up the Domino Administrator' is misleading in context. The URL points to a page about setting up the Domino Administrator client, but the surrounding text is about configuring an ID Vault. The link text does not accurately describe the linked content or its relevance to ID Vault setup.
      fix:     Use more precise link text such as 'Setting up an ID Vault' or point to the specific ID Vault configuration documentation page rather than the general Domino Administrator setup page.
-->

Managing users and groups in HCL Domino has traditionally required the Domino Administrator client. However, with the introduction of AdminCentral, administrators can now perform these tasks directly from a web interface, simplifying the process and reducing the need for additional software installations.

## What is AdminCentral?

AdminCentral is a web-based application that allows administrators to manage users and groups within a Domino environment. It is automatically created by the Administration Process (AdminP) on the Domino administration server. This application provides a streamlined interface accessible via the Notes Standard or Nomad web client, eliminating the need to launch the full Domino Administrator client. [Learn more about AdminCentral](https://help.hcl-software.com/domino/14.5.1/admin/admincentral_app.html)

## Prerequisites for Using AdminCentral

Before utilizing AdminCentral, ensure the following prerequisites are met:

1. **ID Vault Setup**: An ID vault must be configured to manage users' Notes ID files. If an ID vault does not exist in your current Domino deployment, set one up. [Setting up the Domino Administrator](https://help.hcl-software.com/domino/14.5.1/admin/admn_settingupthedominoadministrator_t.html)

2. **Certifier ID Migration**: Migrate the Notes Organization or Organizational Unit (OU) certifier ID to the Domino certification authority (CA) process. This step is crucial for certificate management within AdminCentral.

3. **Registration Authority Assignment**: Ensure that the Domino administration server (which is also the administration server of the Domino Directory) is listed as a Registration Authority (RAA). This designation allows the server to process registration requests initiated through AdminCentral.

## Accessing AdminCentral

To access AdminCentral:

1. **Open Your Client**: Launch your Notes Standard or Nomad web client.

2. **Navigate to AdminCentral**: Open the AdminCentral application (admincentral.nsf). This application is automatically created on the Domino administration server and should be accessible from your client interface.

## Key Features of AdminCentral

AdminCentral offers several functionalities to streamline user and group management:

- **User Registration**: Register new Notes users individually using a form or in bulk by importing a CSV file formatted similarly to the Domino Administrator client.

- **Active Directory Integration**: Register Active Directory contacts or Person documents that have been synchronized into Domino as Notes users.

- **Certificate Management**: Recertify a Notes user's certificate directly through the web interface.

- **Group Management**: Create and manage groups within the Domino Directory without needing to access the full Domino Administrator client.

## Summary

AdminCentral provides a web-based solution for managing users and groups in HCL Domino, offering a simplified and efficient alternative to the traditional Domino Administrator client. By meeting the necessary prerequisites and understanding its key features, administrators can effectively utilize AdminCentral to streamline their administrative tasks. [Administering with AdminCentral](https://help.hcl-software.com/domino/14.0.0/admin/admincentral_app.html)
