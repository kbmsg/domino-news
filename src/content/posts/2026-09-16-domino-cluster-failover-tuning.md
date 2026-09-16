---
title: "Optimizing Domino Cluster Failover for Seamless High Availability"
description: "A focused guide on configuring and tuning HCL Domino cluster failover settings to ensure uninterrupted user access and optimal server performance."
pubDate: "2026-09-16T23:31:57+08:00"
slug: "domino-cluster-failover-tuning"
tags:
  - "Domino Server"
  - "Clustering"
  - "High Availability"
  - "Tutorial"
sources:
  - title: "How failover works"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/plan_howfailoverworks_c.html"
  - title: "Tuning the repair service"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/sym_cluster_tune.html"
  - title: "FailoverSilent – Lautloses Cluster-Failover am Notes-Client"
    url: "https://www.madicon.de/notes-ini-parameter/de/failoversilent/"
cover: "/covers/domino-cluster-failover-tuning.webp"
coverStyle: "photoreal-3d"
relatedConsoleCommands:
  - "set config Server_Restricted=1"
  - "set config Server_Availability_Threshold=75"
notesIniSettings:
  - "FailoverSilent=1"
  - "MailClusterFailover=1"
  - "Server_Restricted=1"
  - "Server_Availability_Threshold=75"
minDominoVersion: "9.0.1"
---
Ensuring high availability in an HCL Domino environment requires meticulous configuration of cluster failover mechanisms. Proper tuning not only guarantees seamless user access during server outages but also optimizes overall server performance. This guide delves into key settings and parameters essential for effective cluster failover management.

## Understanding Domino Cluster Failover

In a Domino cluster, failover is the process by which the system redirects user requests from an unavailable server to a replica on another server within the cluster. This mechanism ensures continuous access to databases, even during server downtimes. The Cluster Manager on each server monitors the availability of other cluster members and manages the redirection process accordingly. [Learn more about how failover works](https://help.hcl-software.com/domino/14.5.1/admin/plan_howfailoverworks_c.html).

## Configuring Silent Failover on Notes Clients

By default, when a Notes client encounters a server failure, it prompts the user with a dialog box before switching to a replica on another server. To enhance user experience by making this process transparent, you can enable silent failover:

1. **Set the `FailoverSilent` Parameter:**
   - Add the following line to the client's `notes.ini` file:
     ```
     FailoverSilent=1
     ```
   - This setting suppresses failover prompts, allowing the client to switch servers without user intervention. [Detailed information on this parameter](https://www.madicon.de/notes-ini-parameter/de/failoversilent/).

2. **Deploy via Desktop Policy:**
   - Navigate to **Desktop Settings** in the Domino Directory.
   - Under the **Mail** tab, select **Client Settings**.
   - Enable the option **"Enable silent failover when a server goes down"**.
   - This policy distributes the `FailoverSilent=1` setting to all clients, ensuring consistency across the organization.

## Enabling Mail Router Cluster Failover

To ensure that the Domino Mail Router can reroute emails to available servers during a mail server outage, configure the following:

1. **Set the `MailClusterFailover` Parameter:**
   - Add the following line to the server's `notes.ini` file:
     ```
     MailClusterFailover=1
     ```
   - This setting allows the Router task to forward incoming messages to a cluster replica of the recipient's mail file on another available server. [More details on this parameter](https://www.madicon.de/notes-ini-parameters/en/mailclusterfailover/).

2. **Configure via Server Configuration Document:**
   - Open the Domino Administrator.
   - Navigate to **Configuration** > **Server** > **Configurations**.
   - Edit the relevant Server Configuration document.
   - Under the **Router/SMTP** tab, go to **Advanced** > **Controls**.
   - Enable the **Cluster failover** option.

## Managing Server Availability and Load Balancing

To prevent servers from becoming overloaded and to manage failover effectively, adjust the following settings:

1. **Set the `Server_Availability_Threshold` Parameter:**
   - Add the following line to the server's `notes.ini` file:
     ```
     Server_Availability_Threshold=75
     ```
   - This value (ranging from 0 to 100) defines the minimum acceptable level of available system resources. When a server's availability index falls below this threshold, it declines new database open requests, prompting clients to failover to less loaded servers. [Further information on this parameter](https://www.madicon.de/notes-ini-parameters/en/server_availability_threshold/).

2. **Configure via Server Configuration Document:**
   - Open the Domino Administrator.
   - Navigate to **Configuration** > **Server** > **Configurations**.
   - Edit the relevant Server Configuration document.
   - Under the **Notes.ini Settings** tab, add or modify the `Server_Availability_Threshold` setting.

## Restricting Server Access During Maintenance

During maintenance windows, it's crucial to prevent new user connections while allowing existing sessions to conclude gracefully:

1. **Set the `Server_Restricted` Parameter:**
   - To restrict new database open requests:
     ```
     set config Server_Restricted=1
     ```
   - This command can be issued directly on the server console. The value `1` restricts access until the next server restart, while `2` makes the restriction persistent across restarts. [Detailed explanation of this parameter](https://www.madicon.de/notes-ini-parameter/de/server_restricted/).

2. **Monitor and Manage Active Sessions:**
   - Use the Domino Administrator to monitor active user sessions.
   - Notify users of impending maintenance to minimize disruption.

## Tuning the Cluster Repair Service

For environments utilizing symmetrical clusters, the Cluster Repair service ensures database replicas remain consistent across servers. To optimize its performance:

1. **Access the Cluster Configuration Document:**
   - Open the Domino Administrator.
   - Navigate to **Configuration** > **Clusters** > **Configuration**.
   - Edit the Cluster Configuration document.

2. **Adjust Repair Service Settings:**
   - Under the **Tuning** tab, configure the following:
     - **Number of repair threads:** Set between 1 and 20 (default is 4).
     - **Check donor availability:** Frequency (in minutes) to check donor server availability (default is 5 minutes).
     - **Retry failed repairs after:** Interval (in minutes) before retrying a failed repair (default is 5 minutes).
     - **Maximum number of retries:** Number of retry attempts before marking a repair as unrepairable (default is 3).
     - **Repair performance:** Level of CPU and disk I/O dedicated to the repair service, from 1 (slowest) to 5 (fastest) (default is 3).
     - **Repair logging level:** Level of logging detail, from 0 (none) to 4 (diagnostic) (default is 2).

   - These settings help balance repair efficiency with system resource utilization. [More on tuning the repair service](https://help.hcl-software.com/domino/14.5.1/admin/sym_cluster_tune.html).

## Conclusion

By carefully configuring these parameters and settings, you can enhance the resilience and performance of your HCL Domino cluster. Regular monitoring and adjustment ensure that failover processes remain seamless, providing users with uninterrupted access to critical services.
