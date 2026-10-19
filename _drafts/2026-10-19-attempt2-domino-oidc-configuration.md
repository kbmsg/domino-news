---
title: "Configuring OpenID Connect (OIDC) Authentication in HCL Domino"
description: "A hands-on guide for Domino administrators to set up OpenID Connect (OIDC) authentication, enhancing security and user experience."
pubDate: "2026-10-19T18:37:31+08:00"
slug: "domino-oidc-configuration"
tags:
  - "Domino Server"
  - "OIDC"
  - "Security"
  - "Tutorial"
sources:
  - title: "HCL Domino V14 Deep Dive - Security"
    url: "https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928"
  - title: "HCL Software Certification Program Exam Guide"
    url: "https://hclsoftwareu.hcl-software.com/images/Lc4sMQCcN5uxXmL13gSlsxClNTU3Mjc3NTc4MTc2/Certificate/HCLSoftware_U_Certificates/HCL-DOM-PADM-145_Exam-Guide-v2.pdf"
relatedConsoleCommands: []
notesIniSettings: []
draft: true
---
<!--
REJECTED DRAFT - Unterminated string in JSON at position 8309 (line 55 column 140)
attempt: 2
slug: domino-oidc-configuration
-->

## Why OIDC Matters for Domino

OpenID Connect (OIDC) is a modern authentication protocol that simplifies user sign-ins across platforms. Integrating OIDC with HCL Domino enhances security and provides a seamless user experience. Let's walk through setting it up.

## Prerequisites

Before diving in, ensure:

- **Domino Version**: You're running Domino 14.5 or later. OIDC support is baked into these versions.
- **OIDC Provider**: You have access to an OIDC provider like Google, Azure AD, or Okta.

## Step 1: Register Domino with Your OIDC Provider

1. **Create a New Application**: Log into your OIDC provider's admin console and register a new application.
2. **Set Redirect URI**: Configure the redirect URI to point to your Domino server, e.g., `https://yourdominoserver.com/names.nsf?Login`.
3. **Note Credentials**: After registration, you'll get a Client ID and Client Secret. Keep these handy.

## Step 2: Configure Domino for OIDC

1. **Access the Domino Administrator**: Open the Domino Administrator client.
2. **Navigate to Internet Sites**: Go to the 'Internet Sites' view.
3. **Edit or Create an Internet Site Document**: If you have an existing one, edit it; otherwise, create a new one.
4. **Enable OIDC**:
   - **Basics Tab**: Ensure the 'Web Site' field matches your server's domain.
   - **Security Tab**:
     - Set 'Session authentication' to 'Single Sign-On' (SSO).
     - In the 'Single Sign-On Configuration' section, select 'OIDC' as the 'SSO Protocol'.
     - Enter the Client ID and Client Secret from your OIDC provider.
     - Specify the 'Authorization Endpoint', 'Token Endpoint', and 'User Info Endpoint' provided by your OIDC provider.
5. **Save and Close**: After entering the details, save and close the document.

## Step 3: Update the Server Document

1. **Open the Server Document**: In the Domino Directory, locate and open your server's document.
2. **Edit the Document**: Click 'Edit Server'.
3. **Configure Web SSO**:
   - Navigate to the 'Internet Protocols' tab.
   - Under 'HTTP', find the 'Web SSO Configuration' field and select the Internet Site document you configured earlier.
4. **Save and Close**: After making the changes, save and close the document.

## Step 4: Restart HTTP Task

For the changes to take effect:

1. **Open the Domino Console**.
2. **Restart HTTP**: Enter the command:

   ```
   restart task http
   ```

## Step 5: Test the Configuration

1. **Access a Protected Resource**: Try accessing a web application on your Domino server.
2. **Redirect to OIDC Provider**: You should be redirected to your OIDC provider's login page.
3. **Authenticate**: Enter your credentials.
4. **Access Granted**: Upon successful authentication, you should be redirected back to the Domino application.

## To Review

Integrating OIDC with HCL Domino enhances security and streamlines user authentication. By following the steps above, you can set up OIDC authentication, providing a modern and secure login experience for your users.

For a deeper dive into Domino's security features, refer to the [HCL Domino V14 Deep Dive - Security](https://support.hcl-software.com/sys_attachment.do?sys_id=a3040ebcdb200a9ca45ad9fcd3961928) document.

Additionally, the [HCL Software Certification Program Exam Guide](https://hclsoftwareu.hcl-software.com/images/Lc4sMQCcN5uxXmL13gSlsxClNTU3Mjc3NTc4MTc2/Certificate/HCLSoftware_U_Certificates/HCL-DOM-PADM-145_Exam-Guide-v2.pdf) provides insights into Domino's security configurations.
