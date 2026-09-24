---
title: "Setting Up and Managing the Domino Server Controller"
description: "A practical guide to configuring and utilizing the Domino Server Controller for enhanced server management and monitoring."
pubDate: "2026-09-24T17:46:54+08:00"
slug: "domino-server-controller-setup"
tags:
  - "Domino Server"
  - "Tutorial"
sources:
  - title: "The Server Controller and the Domino Console"
    url: "https://help.hcl-software.com/domino/14.0.0/admin/admn_servercontrolleranddominoconsole_c.html"
  - title: "Administration tools"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html"
relatedConsoleCommands:
  - "load controller"
  - "tell controller quit"
notesIniSettings:
  - "ServerController=1"
  - "ServerControllerLogLevel=2"
draft: true
---
<!--
REJECTED DRAFT - URL gate FAILED, 1 source URL(s) are not reachable:
  - 200 https://help.hcl-software.com/domino/14.0.0/admin/admn_servercontrolleranddominoconsole_c.html
attempt: 2
slug: domino-server-controller-setup
-->

## Why Use the Domino Server Controller?

Managing a Domino server can be straightforward until you need to perform tasks remotely or require advanced monitoring capabilities. That's where the Domino Server Controller comes into play. It provides a Java-based interface, allowing administrators to manage servers more effectively, especially in remote scenarios.

## Setting Up the Server Controller

1. **Enable the Server Controller**: 
   - Open your `notes.ini` file.
   - Add the following line:
     ```
     ServerController=1
     ```
   - This setting activates the Server Controller upon server startup.

2. **Configure Logging (Optional but Recommended)**:
   - To set the logging level, add:
     ```
     ServerControllerLogLevel=2
     ```
   - Adjust the log level as needed; higher numbers provide more detailed logs.

3. **Start the Server with the Controller**:
   - Open your command prompt or terminal.
   - Navigate to your Domino server directory.
   - Execute:
     ```
     load controller
     ```
   - This command initiates the Server Controller, which in turn starts the Domino server.

## Connecting to the Server Controller

1. **Launch the Domino Console**:
   - On your administrative workstation, open the Domino Console application.

2. **Connect to the Server**:
   - In the console, select 'File' > 'Open Server'.
   - Enter the server's name or IP address.
   - If prompted, provide the necessary credentials.

3. **Manage the Server**:
   - Once connected, you can issue commands, monitor server status, and manage tasks as if you were directly on the server.

## Shutting Down the Server Controller

When maintenance is required, or if you need to stop the Server Controller:

1. **From the Domino Console**:
   - Issue the command:
     ```
     tell controller quit
     ```
   - This stops the Server Controller and the Domino server it manages.

2. **Directly from the Server**:
   - If you have direct access, you can stop the server and controller using standard shutdown procedures.

## To Review

Implementing the Domino Server Controller enhances your ability to manage and monitor your Domino servers, especially in remote scenarios. By following the steps outlined above, you can set up, connect to, and manage your servers more effectively. Always ensure that your `notes.ini` configurations are accurate and that you have the necessary permissions to perform these tasks.

For more detailed information, refer to the official HCL documentation on [The Server Controller and the Domino Console](https://help.hcl-software.com/domino/14.0.0/admin/admn_servercontrolleranddominoconsole_c.html) and [Administration tools](https://help.hcl-software.com/domino/11.0.1/admin/admn_administrationtools_c.html).
