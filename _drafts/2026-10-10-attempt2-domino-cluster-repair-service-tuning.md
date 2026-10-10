---
title: "Fine-Tuning the Domino Cluster Repair Service"
description: "A hands-on guide for Domino administrators to optimize the Cluster Repair Service for enhanced performance and reliability in symmetrical clusters."
pubDate: "2026-10-10T19:02:17+08:00"
slug: "domino-cluster-repair-service-tuning"
tags:
  - "Domino Server"
  - "Clustering"
  - "Performance"
  - "Tutorial"
sources:
  - title: "Tuning the repair service"
    url: "https://help.hcl-software.com/domino/14.5.1/admin/sym_cluster_tune.html"
  - title: "Using symmetrical clusters"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/conf_usingsymmetricalclusters_c.html"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - URL gate FAILED, 1 source URL(s) are not reachable:
  - 200 https://help.hcl-software.com/domino/11.0.1/admin/conf_usingsymmetricalclusters_c.html
attempt: 2
slug: domino-cluster-repair-service-tuning
-->

## Understanding the Cluster Repair Service

In a symmetrical HCL Domino cluster, ensuring that databases remain consistent across all servers is crucial. The Cluster Repair Service plays a pivotal role by automatically repairing missing or corrupted databases using healthy copies from other cluster members. However, out-of-the-box settings might not align perfectly with your environment's needs, leading to potential performance bottlenecks or inefficiencies.

## Accessing the Repair Service Settings

To tailor the Cluster Repair Service to your infrastructure:

1. **Navigate to the Domino Directory**: Open the Domino Administrator and select the server hosting the Domino Directory.

2. **Access Cluster Configuration**: Go to `Configuration` > `Clusters` > `Configuration`.

3. **Edit Cluster Configuration**: Click on `Edit Cluster Configuration` to modify settings.

4. **Adjust Tuning Parameters**: Within the `Tuning` tab, you'll find several parameters to configure:

   - **Number of Repair Threads**: Determines how many server threads are dedicated to the repair process. Default is 4; adjust based on server capacity.

   - **Check Donor Availability**: Sets the interval (in minutes) for checking the availability of donor servers. Default is 5 minutes.

   - **Retry Failed Repairs After**: Specifies the wait time (in minutes) before retrying a failed repair attempt. Default is 5 minutes.

   - **Maximum Number of Retries**: Limits the number of retry attempts for a failed repair before marking it as unrepairable. Default is 3.

   - **Repair Performance**: Controls the CPU and disk I/O resources allocated to the repair service, on a scale from 1 (slowest) to 5 (fastest). Default is 3.

   - **Repair Logging Level**: Sets the verbosity of repair logs, ranging from 0 (none) to 4 (diagnostic). Default is 2.

   [Source: Tuning the repair service](https://help.hcl-software.com/domino/14.5.1/admin/sym_cluster_tune.html)

## Practical Considerations

- **Resource Allocation**: Increasing the number of repair threads can expedite the repair process but may strain server resources. Balance is key.

- **Monitoring**: Regularly review repair logs to identify patterns or recurring issues, adjusting settings as necessary.

- **Testing**: Before applying changes in a production environment, test configurations in a controlled setting to gauge impact.

## To Review

Fine-tuning the Cluster Repair Service is essential for maintaining database integrity and optimal performance in a Domino cluster. By thoughtfully adjusting the available parameters, you can ensure that the repair process aligns with your organization's specific requirements, enhancing both reliability and efficiency.

[Source: Using symmetrical clusters](https://help.hcl-software.com/domino/11.0.1/admin/conf_usingsymmetricalclusters_c.html)
