---
title: "Optimizing SMTP Router Performance in HCL Domino"
description: "A hands-on guide to tuning the SMTP Router in HCL Domino for improved mail delivery performance."
pubDate: "2026-10-20T17:54:56+08:00"
slug: "smtp-router-tuning"
tags:
  - "Domino Server"
  - "Router"
  - "Performance"
  - "Tutorial"
sources:
  - title: "Tips for tuning mail performance"
    url: "https://help.hcl-software.com/domino/11.0.1/admin/tune_tipsfortuningmailperformance_c.html"
  - title: "RouterAllowConcurrentXFERToALL – Multi‑Threaded Transfer (HCL Domino)"
    url: "https://www.madicon.de/notes-ini-parameters/en/routerallowconcurrentxfertoall/"
relatedConsoleCommands:
  - "show stat mail"
  - "tell router quit"
  - "load router"
notesIniSettings:
  - "RouterAllowConcurrentXFERToALL"
  - "MailMaxThreads"
  - "SMTPClientDebug"
  - "SMTPDebug"
draft: true
---
<!--
REJECTED DRAFT - Expected double-quoted property name in JSON at position 8165 (line 57 column 5)
attempt: 2
slug: smtp-router-tuning
-->

## Understanding the SMTP Router in HCL Domino

The SMTP Router in HCL Domino is pivotal for mail delivery, handling both internal and external email traffic. Proper tuning of this component is essential to ensure efficient mail flow and optimal server performance.

## Key Areas for SMTP Router Optimization

### 1. Adjusting Delivery and Transfer Threads

**Delivery Threads:**

The number of threads dedicated to local mail delivery can significantly impact performance. To modify this:

1. Navigate to the **Configuration Settings** document.
2. Go to **Router/SMTP** > **Restrictions and Controls** > **Delivery Controls**.
3. Locate the **Maximum delivery threads** setting.

The ideal range is between 3 and 25 threads. Monitor the `Mail.Waiting` statistic over time; if there's a consistent backlog, consider increasing the thread count. Additionally, observe `Mail.Delivery.Threads.Total`. If this value is less than `Mail.Delivery.Threads.Max`, adjust accordingly. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.0/admin/tune_tipsfortuningmailperformance_c.html?utm_source=openai))

**Transfer Threads:**

For mail transfers, especially to external domains:

1. In the **Configuration Settings** document, navigate to **Router/SMTP** > **Restrictions and Controls** > **Transfer Controls**.
2. Adjust the **Maximum transfer threads** to increase the number of concurrent mail transfers.

Be cautious, as increasing threads can elevate server resource consumption. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.0/admin/tune_tipsfortuningmailperformance_c.html?utm_source=openai))

### 2. Enabling Concurrent Transfers to All Destinations

By default, Domino restricts concurrent Notes-routing transfer threads to destinations outside the local Notes Named Network (NNN). To enable multithreading for all destinations:

1. Add the following line to your `notes.ini` file:

   ```
   RouterAllowConcurrentXFERToALL=1
   ```

2. Restart the Router task:

   ```
   tell router quit
   load router
   ```

This setting allows multiple concurrent transfer threads to all destinations, enhancing throughput. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/routerallowconcurrentxfertoall/?utm_source=openai))

### 3. Configuring Multiple MAIL.BOX Databases

For servers with a high volume of mail traffic, multiple `MAIL.BOX` databases can prevent bottlenecks:

1. In the **Configuration Settings** document, go to **Router/SMTP** > **Basics**.
2. Set the **Number of mailboxes** to 2 or more.

Monitor `Mail.WaitingRecipients` using the `show stat mail` command. If this value is high or increasing, adding mailboxes may improve performance. ([help.hcl-software.com](https://help.hcl-software.com/domino/11.0.0/admin/tune_tipsfortuningmailperformance_c.html?utm_source=openai))

### 4. Implementing Debugging for SMTP Transactions

For diagnosing issues or monitoring SMTP transactions:

- **Outbound SMTP Debugging:**

  Add to `notes.ini`:

  ```
  SMTPClientDebug=1
  ```

  This logs outbound SMTP conversations in the "Miscellaneous" section of `log.nsf`. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/smtpclientdebug/?utm_source=openai))

- **Inbound SMTP Debugging:**

  Add to `notes.ini`:

  ```
  SMTPDebug=3
  debug_outfile=path\to\debug.log
  ```

  This captures inbound SMTP conversations at a verbose level, storing them in the specified file. ([madicon.de](https://www.madicon.de/notes-ini-parameters/en/smtpdebug/?utm_source=openai))

## To Review

Optimizing the SMTP Router in HCL Domino involves:

- Adjusting delivery and transfer threads based on server load.
- Enabling concurrent transfers to all destinations via `RouterAllowConcurrentXFERToALL`.
- Configuring multiple `MAIL.BOX` databases for high-traffic servers.
- Implementing debugging settings for detailed SMTP transaction logs.

Regular monitoring and adjustment of these settings will ensure efficient mail routing and overall server performance.
