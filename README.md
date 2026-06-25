# 🎬 StreamServer

![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailscale](https://img.shields.io/badge/Tailscale-242424?style=for-the-badge&logo=tailscale&logoColor=white)

A full-stack, containerized personal anime and media streaming server built with React, Spring Boot, and Docker.

StreamServer automatically indexes your local media library and provides a sleek, modern web interface to stream your videos directly to your browser or mobile device, locally or globally.

---

## Prerequisites

You must have [Docker](https://docs.docker.com/get-docker/) installed and running on your system.

---

## ⚡ 1-Minute Quick Start (Linux & macOS)

If you are running Linux or macOS and have Docker installed, run this install script in your terminal for a quick, automated installation:

```bash
curl -sL https://raw.githubusercontent.com/icyPin/StreamServer/refs/heads/main/install.sh | bash
```

What this script does:
- Creates a `streamserver` directory.
- Downloads the `docker-compose.yml` configuration.
- Generates a default `.env` file.
- Pulls the latest frontend and backend images and boots the containers.

---

## 🪟 Manual Setup (Windows & Custom Configurations)

If you are running native Windows or prefer to set up the environment manually, follow these steps:

Clone the repository:
```bash
git clone https://github.com/icyPin/StreamServer.git
cd StreamServer
```

Configure your media path:
Create a `.env` file in the root directory and point it to the absolute path of the drive or folder containing your media (e.g., your Downloads folder).

```env
HOST_MEDIA_PATH=/path/to/your/anime/folder
```

Start the server — run this in the StreamServer folder:
```bash
docker compose up -d
```

Access the Web UI:
Open your browser and navigate to `http://localhost:5173`

---

## 🌐 Global Remote Access (Tailscale)

To access your media from any device, anywhere in the world (or to bypass strict home/campus Wi-Fi restrictions that block local device communication), we recommend using Tailscale.

> **Why Tailscale?** Standard approaches like port forwarding are blocked by most ISPs and home routers. Many routers also enforce AP Isolation, which physically drops packets between devices on the same network. Tailscale creates a WireGuard-based encrypted mesh tunnel that bypasses the physical router entirely — no port forwarding, no firewall rules, no paid services required.

**Install Tailscale on the Host Machine:**
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```
Authenticate using the unique link printed in your terminal.

**Get your Secure Host IP:**
```bash
tailscale ip -4
```
This gives you your machine's private Tailscale IP (e.g., `100.x.x.x`).

**Connect your Phone / Client Device:**
Download the Tailscale app on your phone or remote laptop and log in with the **exact same account**.

**Stream:**
Turn on the Tailscale VPN on your phone, open your mobile browser, and navigate to `http://100.x.x.x:5173`. Your server will load instantly from anywhere!
