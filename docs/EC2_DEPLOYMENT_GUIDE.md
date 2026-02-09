# AltShift EC2 Deployment Guide

> **Complete step-by-step guide to deploy AltShift backend on AWS EC2**

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: AWS Console - Launch EC2](#phase-1-aws-console---launch-ec2)
3. [Phase 2: DNS Configuration](#phase-2-dns-configuration)
4. [Phase 3: SSH Setup (Windows)](#phase-3-ssh-setup-windows)
5. [Phase 4: Server Initial Setup](#phase-4-server-initial-setup)
6. [Phase 5: Docker Installation](#phase-5-docker-installation)
7. [Phase 6: GitHub Container Registry Login](#phase-6-github-container-registry-login)
8. [Phase 7: Deploy Application Container](#phase-7-deploy-application-container)
9. [Phase 8: Nginx Reverse Proxy](#phase-8-nginx-reverse-proxy)
10. [Phase 9: SSL Certificate (HTTPS)](#phase-9-ssl-certificate-https)
11. [Phase 10: Nightly Auto-Update Cron](#phase-10-nightly-auto-update-cron)
12. [Phase 11: Verification](#phase-11-verification)
13. [Troubleshooting](#troubleshooting)
14. [Maintenance Commands](#maintenance-commands)

---

## Prerequisites

Before starting, ensure you have:

- [ ] AWS Account with EC2 access
- [ ] GitHub account with access to `ghcr.io/hector-ha/altshift-server`
- [ ] GitHub Personal Access Token (PAT) with `read:packages` scope
- [ ] Domain `api.altshift.hectorha.dev` access (Vercel DNS)
- [ ] Your environment variables ready:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `SENDGRID_API_KEY`
  - `CLIENT_URL` (https://altshift.vercel.app)

---

## Phase 1: AWS Console - Launch EC2

### Step 1.1: Open EC2 Dashboard

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Search for **EC2** in the search bar
3. Click **EC2** to open the dashboard

### Step 1.2: Launch Instance

1. Click the orange **Launch instance** button

### Step 1.3: Configure Instance

#### Name and Tags

```
Name: altshift-server
```

#### Application and OS Images (AMI)

1. Select **Amazon Linux** (default/first option)
2. Select **Amazon Linux 2023 AMI**
3. Architecture: **64-bit (x86)**

#### Instance Type

```
Instance type: t3.micro
```

> Note: t3.micro is free tier eligible (750 hours/month for 12 months)

#### Key Pair (Login)

⚠️ **CRITICAL: Save this file securely!**

1. Click **Create new key pair**
2. Configure:
   ```
   Key pair name: altshift-key-2026
   Key pair type: RSA
   Private key file format: .pem
   ```
3. Click **Create key pair**
4. **IMMEDIATELY** save the downloaded `.pem` file to a secure location
5. Recommended path: `C:\Users\Admin\Desktop\Code Directory\PEM\altshift-key-2026.pem`

#### Network Settings

1. Click **Edit** on Network settings
2. Configure:

   ```
   VPC: (leave default)
   Subnet: (leave default - No preference)
   Auto-assign public IP: Enable
   ```

3. **Firewall (Security Group)**:
   - Select **Create security group**
   - Security group name: `altshift-sg`
   - Description: `Security group for AltShift server`

4. **Inbound Security Group Rules**:

   | Type  | Protocol | Port Range | Source    | Description   |
   | ----- | -------- | ---------- | --------- | ------------- |
   | SSH   | TCP      | 22         | 0.0.0.0/0 | SSH access    |
   | HTTP  | TCP      | 80         | 0.0.0.0/0 | HTTP traffic  |
   | HTTPS | TCP      | 443        | 0.0.0.0/0 | HTTPS traffic |

   To add rules:
   - Click **Add security group rule** for each row above
   - For HTTP: Type = HTTP (auto-fills port 80)
   - For HTTPS: Type = HTTPS (auto-fills port 443)

#### Configure Storage

```
Size: 8 GiB (default is fine)
Volume type: gp3
```

### Step 1.4: Launch

1. Review your configuration in the **Summary** panel on the right
2. Click **Launch instance**
3. Wait for "Success" message
4. Click **View all instances**

### Step 1.5: Get Public IP

1. Wait for **Instance state** to show **Running** (may take 1-2 minutes)
2. Click on your instance ID
3. Copy the **Public IPv4 address** (e.g., `54.123.45.67`)
4. **Save this IP** - you'll need it for DNS and SSH

---

## Phase 2: DNS Configuration

### Step 2.1: Add A Record

Go to your Vercel Dashboard (where `hectorha.dev` is managed):

1. Navigate to the **Domains** tab in your Account or Team settings (or within the project where the domain was managed).
2. Find `hectorha.dev` and click **View DNS Records & More** (or **Edit**).
3. Add a new record:
   ```
   Type: A
   Name: api.altshift
   Value: <YOUR_EC2_PUBLIC_IP>
   TTL: 60 (or default)
   ```
4. Click **Add**.

### Step 2.2: Verify DNS Propagation

Wait 2-5 minutes, then verify:

```powershell
# In PowerShell on your Windows machine
nslookup api.altshift.hectorha.dev
```

Expected output:

```
Name:    api.altshift.hectorha.dev
Address: <YOUR_EC2_PUBLIC_IP>
```

---

## Phase 3: SSH Setup (Windows)

### Step 3.1: Fix PEM File Permissions

Open **PowerShell as Administrator** and run:

```powershell
# Navigate to PEM location
cd "C:\Users\Admin\Desktop\Code Directory\PEM"

# Remove inheritance and all existing permissions
icacls "altshift-key-2026.pem" /inheritance:r

# Grant only your user read access
icacls "altshift-key-2026.pem" /grant:r "Admin:R"

# Verify permissions
icacls "altshift-key-2026.pem"
```

Expected output should show only your user with Read permission.

### Step 3.2: Test SSH Connection

```powershell
ssh -i "C:\Users\Admin\Desktop\Code Directory\PEM\altshift-key-2026.pem" ec2-user@<YOUR_EC2_PUBLIC_IP>
```

First connection will ask:

```
The authenticity of host '...' can't be established.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Type `yes` and press Enter.

You should see:

```
   ,     #_
   ~\_  ####_        Amazon Linux 2023
  ~~  \_#####\
...
[ec2-user@ip-xxx-xxx-xxx-xxx ~]$
```

**You're now connected to your EC2 instance!**

---

## Phase 4: Server Initial Setup

Run these commands on your EC2 instance (after SSH):

### Step 4.1: Update System

```bash
sudo dnf update -y
```

This may take 2-3 minutes. If prompted about services to restart, press Enter to accept defaults.

### Step 4.2: Set Timezone (Optional)

```bash
sudo timedatectl set-timezone America/New_York
```

Verify:

```bash
date
```

---

## Phase 5: Docker Installation

### Step 5.1: Install Docker

```bash
# Install Docker
sudo dnf install -y docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Start Docker now
sudo systemctl start docker

# Add ec2-user to docker group (no sudo needed for docker commands)
sudo usermod -aG docker ec2-user
```

### Step 5.2: Apply Group Changes

**Important**: You must log out and back in for the group change to take effect.

```bash
exit
```

### Step 5.3: Reconnect via SSH

On your Windows machine:

```powershell
ssh -i "C:\Users\Admin\Desktop\Code Directory\PEM\altshift-key-2026.pem" ec2-user@<YOUR_EC2_PUBLIC_IP>
```

### Step 5.4: Verify Docker

```bash
docker --version
```

Expected output:

```
Docker version 24.x.x, build ...
```

Test without sudo:

```bash
docker ps
```

Should return empty table (no error).

---

## Phase 6: GitHub Container Registry Login

### Step 6.1: Create GitHub PAT (if you don't have one)

1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Configure:
   ```
   Note: GHCR Read Access
   Expiration: 90 days (or your preference)
   Scopes: ✓ read:packages
   ```
4. Click **Generate token**
5. **Copy the token immediately** (you won't see it again)

### Step 6.2: Login to GHCR

On your EC2 instance:

```bash
# Replace YOUR_GITHUB_PAT with your actual token
echo "YOUR_GITHUB_PAT" | docker login ghcr.io -u Hector-Ha --password-stdin
```

Expected output:

```
Login Succeeded
```

---

## Phase 7: Deploy Application Container

### Step 7.1: Pull the Docker Image

```bash
docker pull ghcr.io/hector-ha/altshift-server:latest
```

Wait for the download to complete (may take 1-2 minutes).

### Step 7.2: Create Environment File

```bash
vi ~/altshift.env
```

> **Note**: Amazon Linux uses `vi` by default. To use nano, install it first: `sudo dnf install -y nano`
>
> **vi quick guide**: Press `i` to enter insert mode, paste content, press `Esc`, then type `:wq` and Enter to save.

Paste the following (replace with your actual values):

```env
APP_PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/altshift?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
CLIENT_URL=https://altshift.vercel.app
```

Save and exit:

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 7.3: Secure the Environment File

```bash
chmod 600 ~/altshift.env
```

### Step 7.4: Run the Container

```bash
docker run -d \
  --name altshift-server \
  --restart unless-stopped \
  -p 4000:4000 \
  --env-file ~/altshift.env \
  ghcr.io/hector-ha/altshift-server:latest
```

### Step 7.5: Verify Container is Running

```bash
docker ps
```

Expected output:

```
CONTAINER ID   IMAGE                                       STATUS         PORTS
abc123...      ghcr.io/hector-ha/altshift-server:latest   Up X seconds   0.0.0.0:4000->4000/tcp
```

### Step 7.6: Test the Application

```bash
curl http://localhost:4000/graphql
```

Expected: Should return a GraphQL response (even if it's an error about missing query, that's OK - it means the server is running).

### Step 7.7: Check Logs (if issues)

```bash
docker logs altshift-server
```

---

## Phase 8: Nginx Reverse Proxy

### Step 8.1: Install Nginx

```bash
sudo dnf install -y nginx
```

### Step 8.2: Create Nginx Configuration

Amazon Linux uses `/etc/nginx/conf.d/` instead of `sites-available`:

```bash
sudo vi /etc/nginx/conf.d/altshift.conf
```

> **Tip**: To use nano: `sudo dnf install -y nano` then `sudo nano /etc/nginx/conf.d/altshift.conf`

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name api.altshift.hectorha.dev;

    # Proxy all requests to the Docker container
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;

        # WebSocket support (required for Socket.IO)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Forward client information
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Don't cache WebSocket connections
        proxy_cache_bypass $http_upgrade;

        # Timeouts for long-running connections
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
```

Save and exit (`Ctrl + X`, `Y`, `Enter`).

### Step 8.3: Test and Enable Nginx

```bash
# Test Nginx configuration
sudo nginx -t
```

Expected output:

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 8.4: Restart Nginx

```bash
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 8.5: Test HTTP Access

From your Windows machine, open a browser and go to:

```
http://api.altshift.hectorha.dev/graphql
```

You should see the GraphQL response (or playground if enabled).

---

## Phase 9: SSL Certificate (HTTPS)

### Step 9.1: Install Certbot

Amazon Linux 2023 requires installing Certbot via pip:

```bash
# Install pip and dependencies
sudo dnf install -y python3-pip augeas-libs

# Install Certbot and Nginx plugin
sudo pip3 install certbot certbot-nginx

# Create symlink for easy access
sudo ln -s /usr/local/bin/certbot /usr/bin/certbot
```

### Step 9.2: Obtain SSL Certificate

```bash
sudo certbot --nginx -d api.altshift.hectorha.dev
```

When prompted:

1. **Email**: Enter your email (for renewal notifications)
2. **Terms of Service**: `Y` to agree
3. **Share email with EFF**: `N` (optional)
4. **Redirect HTTP to HTTPS**: `2` (recommended - redirects all HTTP to HTTPS)

Expected output:

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/api.altshift.hectorha.dev/fullchain.pem
...
Congratulations! You have successfully enabled HTTPS
```

### Step 9.3: Verify HTTPS

Open in browser:

```
https://api.altshift.hectorha.dev/graphql
```

You should see:

- 🔒 Lock icon in browser
- Valid SSL certificate

### Step 9.4: Verify Auto-Renewal

Certbot automatically sets up a cron job for renewal. Verify:

```bash
sudo certbot renew --dry-run
```

Expected:

```
Congratulations, all simulated renewals succeeded
```

---

## Phase 10: Nightly Auto-Update Cron

### Step 10.1: Create Update Script

```bash
nano ~/update-altshift.sh
```

Paste the following:

```bash
#!/bin/bash

# AltShift Auto-Update Script
# Runs nightly to check for new Docker images

LOG_FILE=~/update.log
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] Starting update check..." >> $LOG_FILE

# Pull latest image
PULL_OUTPUT=$(docker pull ghcr.io/hector-ha/altshift-server:latest 2>&1)

# Check if a new image was downloaded
if echo "$PULL_OUTPUT" | grep -q "Downloaded newer image"; then
    echo "[$TIMESTAMP] New image found. Updating container..." >> $LOG_FILE

    # Stop and remove old container
    docker stop altshift-server >> $LOG_FILE 2>&1
    docker rm altshift-server >> $LOG_FILE 2>&1

    # Start new container
    docker run -d \
      --name altshift-server \
      --restart unless-stopped \
      -p 4000:4000 \
      --env-file ~/altshift.env \
      ghcr.io/hector-ha/altshift-server:latest >> $LOG_FILE 2>&1

    echo "[$TIMESTAMP] Update complete!" >> $LOG_FILE

    # Clean up old images
    docker image prune -f >> $LOG_FILE 2>&1
else
    echo "[$TIMESTAMP] No new image available." >> $LOG_FILE
fi
```

Save and exit (`Ctrl + X`, `Y`, `Enter`).

### Step 10.2: Make Script Executable

```bash
chmod +x ~/update-altshift.sh
```

### Step 10.3: Test the Script

```bash
~/update-altshift.sh
cat ~/update.log
```

### Step 10.4: Add Cron Job

```bash
# Open crontab editor
crontab -e
```

If prompted to choose an editor, select `1` for nano.

Add this line at the bottom:

```cron
# Run AltShift update check at 2:00 AM daily
0 2 * * * /home/ec2-user/update-altshift.sh
```

Save and exit (`Ctrl + X`, `Y`, `Enter`).

### Step 10.5: Verify Cron Job

```bash
crontab -l
```

Expected output should include your update script entry.

---

## Phase 11: Verification

### Final Checklist

Run these commands on EC2:

```bash
# 1. Check Docker container is running
docker ps

# 2. Check Nginx is running
sudo systemctl status nginx

# 3. Check container logs
docker logs --tail 20 altshift-server

# 4. Test local connection
curl -s http://localhost:4000/graphql | head -c 200

# 5. Check SSL certificate expiry
sudo certbot certificates
```

### Test from External

From your Windows machine or browser:

1. **HTTPS Access**: `https://api.altshift.hectorha.dev/graphql`
2. **HTTP Redirect**: `http://api.altshift.hectorha.dev` → should redirect to HTTPS

### Update Frontend Environment

Make sure your Vercel frontend has the correct API URL:

```env
VITE_SERVER_URL=https://api.altshift.hectorha.dev
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs altshift-server

# Common issues:
# - Port already in use: sudo lsof -i :4000
# - Env file issues: cat ~/altshift.env
```

### Nginx errors

```bash
# Test config
sudo nginx -t

# Check error logs
sudo tail -50 /var/log/nginx/error.log
```

### SSL certificate issues

```bash
# Check certificates
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal

# Delete and re-obtain
sudo certbot delete --cert-name api.altshift.hectorha.dev
sudo certbot --nginx -d api.altshift.hectorha.dev
```

### Connection refused

```bash
# Check if container is running
docker ps -a

# Check if ports are listening
sudo netstat -tlnp | grep -E '(80|443|4000)'

# Check security group in AWS Console
```

### CORS errors from frontend

Check `CLIENT_URL` in `~/altshift.env` matches your Vercel domain exactly.

---

## Maintenance Commands

### Container Management

```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# Stop container
docker stop altshift-server

# Start container
docker start altshift-server

# Restart container
docker restart altshift-server

# View logs
docker logs altshift-server
docker logs -f altshift-server  # Follow/stream logs
docker logs --tail 100 altshift-server  # Last 100 lines
```

### Manual Update

```bash
# Pull latest image
docker pull ghcr.io/hector-ha/altshift-server:latest

# Stop and remove old container
docker stop altshift-server
docker rm altshift-server

# Start new container
docker run -d \
  --name altshift-server \
  --restart unless-stopped \
  -p 4000:4000 \
  --env-file ~/altshift.env \
  ghcr.io/hector-ha/altshift-server:latest

# Clean up old images
docker image prune -f
```

### Nginx Management

```bash
# Check status
sudo systemctl status nginx

# Restart
sudo systemctl restart nginx

# Reload config (no downtime)
sudo systemctl reload nginx

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### System Updates

```bash
# Update system packages (run periodically)
sudo dnf update -y

# Check disk space
df -h

# Check memory usage
free -h
```

### View Update Logs

```bash
# View auto-update history
cat ~/update.log

# View last 20 entries
tail -20 ~/update.log
```

---

## Summary

| Component        | Details                                  |
| ---------------- | ---------------------------------------- |
| **EC2 Instance** | t3.micro, Amazon Linux 2023              |
| **Public IP**    | (Your EC2 IP)                            |
| **Domain**       | api.altshift.hectorha.dev                |
| **Container**    | ghcr.io/hector-ha/altshift-server:latest |
| **App Port**     | 4000 (internal)                          |
| **Public Ports** | 80 (HTTP→HTTPS), 443 (HTTPS)             |
| **SSL**          | Let's Encrypt (auto-renews)              |
| **Auto-Update**  | 2:00 AM daily via cron                   |
| **Env File**     | ~/altshift.env                           |
| **Update Log**   | ~/update.log                             |

---

**Deployment Complete! 🎉**
