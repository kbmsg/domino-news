---
title: "Deploying HCL Domino REST API: A Practical Guide"
description: "A hands-on walkthrough for deploying the HCL Domino REST API, covering installation, configuration, and security considerations for a production environment."
pubDate: "2026-09-19T22:04:02+08:00"
slug: "domino-rest-api-deployment"
tags:
  - "Domino REST API"
  - "HTTP Task"
  - "Security"
  - "Tutorial"
sources:
  - title: "Post installation - HCL Domino REST API Documentation"
    url: "https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/configuration/index.html"
  - title: "HCL Domino REST API Part 1: How to set up the environment"
    url: "https://www.cdata.com/kb/articles/hcl-domino-rest-part1.rst"
cover: "/covers/domino-rest-api-deployment.webp"
coverStyle: "collage"
relatedConsoleCommands:
  - "tell restapi javadump"
  - "tell restapi heapdump"
  - "tell restapi systemdump"
notesIniSettings: []
minDominoVersion: "12.0.2"
---
## Deploying HCL Domino REST API: A Practical Guide

If you're looking to modernize your Domino applications by exposing them via RESTful services, the HCL Domino REST API is your go-to solution. Here's a straightforward guide to get you up and running.

### Prerequisites

Before diving in, ensure your environment meets the following:

- **Domino Version**: 12.0.2 or later.
- **Operating System**: Windows, Linux, or macOS.
- **Java Runtime**: Ensure Java is installed and properly configured.

### Installation Steps

1. **Download the Installer**

   Head over to the [official HCL Domino REST API documentation](https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/install/index.html) and grab the latest installer suitable for your platform.

2. **Run the Installer**

   Execute the installer with the necessary parameters. For instance, on a Windows system:

   ```bash
   java -jar restapiInstaller.jar --dataDir=C:\Domino\data --ini=C:\Domino\data\notes.ini --restapiDir=C:\Program Files\HCL\restapi --programDir=C:\Program Files\HCL\Domino --accept
   ```

   Replace the paths with those relevant to your setup.

3. **Post-Installation Configuration**

   After installation, the REST API runs on port 8880 with HTTP and a transient JWT token for single server use. This setup isn't production-ready. You'll need to:

   - **Configure CORS**: Set up Cross-Origin Resource Sharing to allow approved web applications to securely access the API.
   - **Secure Ports**: Ensure encrypted communication between clients and the REST API server.
   - **Set Up Functional Accounts**: Create accounts for management consoles and metrics endpoints.
   - **Configure JWT**: Set up JSON Web Token for authorization, especially if not deploying an external Identity Provider.

   Detailed steps for these configurations are available in the [post-installation tasks section](https://opensource.hcltechsw.com/Domino-rest-api/tutorial/installconfig/configuration/index.html).

### Security Considerations

- **Access Control**: The REST API honors all Domino access control mechanisms and doesn't allow anonymous access. Ensure your ACLs are appropriately configured.
- **HTTPS**: Always use HTTPS in production to encrypt data in transit.
- **Regular Updates**: Keep the REST API updated to benefit from the latest features and security patches.

### Troubleshooting

If you encounter issues:

- **Logs**: Check the `domino-keep.log` for errors.
- **Console Commands**: Use commands like `tell restapi javadump` to gather diagnostic information.

### To Review

Deploying the HCL Domino REST API involves careful planning and configuration. By following the steps outlined above and referring to the [official documentation](https://opensource.hcltechsw.com/Domino-rest-api/index.html), you can expose your Domino applications via RESTful services securely and efficiently.
