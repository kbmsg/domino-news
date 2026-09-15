---
title: "Securing Your HCL Domino REST API Deployment"
description: "A comprehensive guide to securely deploying the HCL Domino REST API, covering installation, configuration, and best practices to ensure a robust and secure environment."
pubDate: "2026-09-15T23:42:55+08:00"
slug: "domino-rest-api-secure-deployment"
tags:
  - "Tutorial"
  - "Domino REST API"
  - "Security"
sources:
  - title: "Security overview - HCL Domino REST API Documentation"
    url: "https://opensource.hcltechsw.com/Domino-rest-api/references/security/index.html"
  - title: "Post installation - HCL Domino REST API Documentation"
    url: "https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/configuration/index.html"
  - title: "Secure ports - HCL Domino REST API Documentation"
    url: "https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/configuration/secureport.html"
relatedConsoleCommands:
  - "load restapi"
  - "tell restapi quit"
  - "tell restapi refresh cache"
  - "tell restapi reload"
notesIniSettings:
  - "ServerTasks=restapi"
  - "KeepManagementURL=https://localhost:8889"
draft: true
---
<!--
REJECTED DRAFT - 2 critical fact issue(s)
attempt: 2
slug: domino-rest-api-secure-deployment
topicOverlap: false
issues:
  [critical] ServerTasks=restapi
      problem: The example shows 'ServerTasks=restapi' as if that is the complete notes.ini line. If an administrator copies this literally it will overwrite or replace all existing ServerTasks entries (e.g., Replica, Router, Update, AMgr, etc.), potentially crippling the server. The article must make clear that 'restapi' should be appended to the existing ServerTasks value, not used as a replacement.
      fix:     Show the line as 'ServerTasks=<existing tasks>,restapi' and explicitly warn that the reader must preserve all currently listed tasks. Alternatively, instruct the reader to use the 'set config' console command or edit notes.ini carefully while the server is down.
  [critical] Download the Installer … https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/install/index.html
      problem: The article directs readers to download the installer from the HCL Open Source documentation site, which is a documentation portal, not the actual download location. The correct download location is the HCL Software License & Download Portal (https://hclsoftware.flexnetoperations.com) or My HCL Software portal. Sending administrators to the wrong URL to obtain production software is a critical misdirection.
      fix:     Replace the download link with the correct HCL Software portal URL (https://my.hcltechsw.com or the FlexNet portal) and clarify that the documentation site only contains installation instructions, not the installer binary itself.
  [major] Data Port (8880) … Healthcheck Port (8886) … Management Port (8889) … Prometheus Metrics Port (8890)
      problem: These port numbers are presented as fixed/authoritative defaults. In practice the Domino REST API default ports are: Data/API port 8880, Metrics port 8890, and Management port 8889 — these match current docs. However, the Healthcheck port default in current KEEP/Domino REST API documentation is 8886 for the health endpoint served on the same data port or via a dedicated config, and numbering has shifted across versions. More importantly, the article presents these as immutable facts without noting they are configurable defaults and may differ based on the version deployed or how config.json has been edited. A reader who has a different version or custom config could be misled.
      fix:     Label these clearly as 'default port numbers' and note that they are configurable in config.json / keepconfig.d. Recommend readers verify against their own configuration and the version-specific documentation.
  [major] Modify the `config.json` file located in the `keepconfig.d` directory
      problem: The article conflates two distinct configuration locations. The primary configuration file is 'config.json' (or 'keepconfig.json' in older releases) typically located in the Domino data directory or the restapiDir. The 'keepconfig.d' directory is used for configuration fragments/overrides that are merged at startup. Instructing readers to edit 'config.json' inside 'keepconfig.d' as if they are the same file is inaccurate and could cause confusion or a misconfiguration where TLS settings are never applied.
      fix:     Clarify the distinction: the main configuration is 'config.json' in the designated config location; 'keepconfig.d' holds JSON fragment files that override or extend the main config. For TLS, either edit the main config.json directly or create a dedicated fragment file (e.g., 'keepconfig.d/tls.json') with only the TLS stanza, and explain the merge behavior.
  [major] Configure JWT Authentication … use Domino credentials for token generation
      problem: The article implies JWT with Domino credentials is a straightforward alternative to an external IdP, but omits a critical caveat: using Domino's built-in JWT issuer (the /auth/domino endpoint) requires the Domino REST API management endpoints and the JWT secret to be properly secured, and the tokens are short-lived by default (15 minutes). Administrators who configure this without understanding the token lifetime and refresh flow may leave clients unable to maintain sessions. Additionally, there is no mention of the requirement to configure the 'jwt' section with a proper secret or RSA key, which if left at defaults can be a security vulnerability.
      fix:     Add a note on default JWT token lifetime, the need to configure a strong secret or RSA key pair in the JWT configuration block, and the difference between using an external OIDC/IdP versus the built-in Domino credential flow. Reference the security documentation for the JWT secret configuration.
  [major] Set Up Functional Accounts … management console and health check
      problem: The article says to 'define these accounts' but gives no concrete guidance on where or how: functional accounts for the management console are configured in the 'managementKey' or similar stanza in config.json and are distinct from Notes/Domino user accounts. A reader acting on 'define these accounts' without further detail could leave the management port completely open (which defaults to no authentication in some versions) or misconfigure access.
      fix:     At minimum, describe that functional account credentials are set in the configuration file (not in the Domino Directory), provide an example JSON stanza or reference the exact documentation section, and explicitly warn that the Management Port (8889) should never be exposed to the public internet regardless of authentication configuration.
  [minor] load restapi
      problem: The command is shown in a 'bash' code fence, implying it is a shell command. It is actually a Domino server console command, not a bash/OS-level command. This could confuse administrators who try to run it in a terminal rather than the Domino server console.
      fix:     Change the code fence language hint to something neutral (e.g., 'text' or 'console') and add a sentence clarifying this is entered at the Domino server console (or via 'server -c' on the OS command line).
  [minor] java -jar restapiInstaller.jar
      problem: The installer command example does not mention that a specific JVM version compatible with Domino (typically the one bundled with Domino) should be used. Using a system JVM of the wrong version is a common installation failure point.
      fix:     Add a note to use the JVM bundled with HCL Domino (e.g., referencing the Domino JVM path) or verify that the system Java meets the version requirement documented for the specific Domino REST API release.
-->

## Introduction

Deploying the HCL Domino REST API enables modern, standards-compliant access to your Domino applications. However, ensuring a secure deployment is paramount to protect your data and maintain system integrity. This guide provides a step-by-step approach to securely install and configure the Domino REST API.

## Installation

Begin by downloading the latest Domino REST API installer from the [HCL Software Portal](https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/install/index.html). Ensure your system meets the necessary requirements before proceeding with the installation.

### Installation Steps

1. **Download the Installer**: Obtain the appropriate installer for your operating system.
2. **Run the Installer**: Execute the installer with administrative privileges.
3. **Configure Installation Parameters**: During installation, specify the following parameters:
   - `--dataDir`: Path to your Domino data directory.
   - `--ini`: Path to your `notes.ini` file.
   - `--restapiDir`: Directory where the REST API files will be installed.
   - `--programDir`: Directory where Domino is installed.

For example:

```bash
java -jar restapiInstaller.jar --dataDir=/local/notesdata --ini=/local/notesdata/notes.ini --restapiDir=/opt/hcl/restapi --programDir=/opt/hcl/domino
```

For a detailed list of installation parameters, refer to the [official documentation](https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/install/index.html).

## Post-Installation Configuration

After installation, several configuration steps are necessary to secure your deployment.

### 1. Configure CORS

Cross-Origin Resource Sharing (CORS) settings allow approved web applications to securely access the Domino REST API from different domains. Properly configuring CORS is essential to prevent unauthorized access.

### 2. Secure Ports

The Domino REST API utilizes multiple ports, each serving different purposes:

- **Data Port (8880)**: Main port for API interactions.
- **Healthcheck Port (8886)**: Used to verify the API's operational status.
- **Management Port (8889)**: Provides access to runtime behavior and configurations.
- **Prometheus Metrics Port (8890)**: Exposes metrics in Prometheus format.

To secure these ports:

1. **Obtain a Valid SSL/TLS Certificate**: Acquire a certificate from a trusted Certificate Authority (CA) or use Let's Encrypt.
2. **Configure TLS**: Modify the `config.json` file located in the `keepconfig.d` directory to include the certificate details.

For comprehensive instructions, consult the [Secure Ports Guide](https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/configuration/secureport.html).

### 3. Set Up Functional Accounts

Certain endpoints, such as the management console and health check, require functional accounts for access. Define these accounts to restrict access appropriately.

### 4. Configure JWT Authentication

The Domino REST API uses JSON Web Tokens (JWT) for authentication. Configure JWT settings to integrate with your Identity Provider (IdP) or use Domino credentials for token generation.

### 5. Manage Database Access

Explicitly define which Domino databases are accessible via the REST API. Create schemas and link them to publicly visible scopes to control access.

## Starting and Managing the REST API Task

To start the Domino REST API, execute the following command in the Domino server console:

```bash
load restapi
```

To ensure the REST API starts automatically with the server, add `restapi` to the `ServerTasks` entry in the `notes.ini` file:

```ini
ServerTasks=restapi
```

For additional management commands, refer to the [Domino REST API Task Documentation](https://opensource.hcltechsw.com/Domino-rest-api/references/usingdominorestapi/restapitask.html).

## Conclusion

Securing your HCL Domino REST API deployment involves careful installation and meticulous configuration. By following the steps outlined above, you can establish a robust and secure environment for your Domino applications. Always stay updated with the latest security practices and consult the [official documentation](https://opensource.hcltechsw.com/Domino-rest-api/references/security/index.html) for ongoing guidance.
