# 🎬 StreamServer

A full-stack, containerized personal anime and media streaming server built with React, Spring Boot, and Docker.

StreamServer automatically indexes your local media library and provides a sleek, modern web interface to stream your videos directly to your browser or mobile device, locally or globally.

## Prerequisites

You must have [Docker](https://docs.docker.com/get-docker/) installed and running on your system.

---

##  1-Minute Quick Start (Linux & macOS)

If you are running Linux or macOS and have Docker installed, run this install script in your terminal for a quick, automated installation:

```bash
curl -sL https://raw.githubusercontent.com/icyPin/StreamServer/refs/heads/main/install.sh | bash
```
What this script does:

Creates a streamserver directory.

Downloads the docker-compose.yml configuration.

Generates a default .env file.

Pulls the latest frontend and backend images and boots the containers.

## Manual Setup (Windows & Custom Configurations)
If you are running native Windows or prefer to set up the environment manually, follow these steps:

Clone the repository:

```Bash
git clone https://github.com/icyPin/StreamServer.git
cd StreamServer
```
Configure your media path:
Create a .env file in the root directory and point it to the absolute path of the drive or folder containing your media (e.g., your Downloads folder).

# .env
Code snippet
HOST_MEDIA_PATH=/path/to/your/anime/folder

## Start the server:
Run this is the StreanServer folder
```Bash
docker compose up -d
```
Access the Web UI:
Open your browser and navigate to http://localhost:5173

## Global Remote Access (Tailscale)
To access your media from any device, anywhere in the world (or to bypass strict home/campus Wi-Fi restrictions that block local device communication), we recommend using Tailscale.

Tailscale Setup:
Install Tailscale on the Host Machine:

```Bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```
Authenticate using the unique link printed in your terminal.

Get your Secure Host IP:
Run the following command to get your machine's private Tailscale IP (e.g., 100.x.x.x):

```Bash
tailscale ip -4
```
Connect your Phone / Client Device:
Download the Tailscale app on your phone or remote laptop, and log in with the exact same account.

Stream:
Turn on the Tailscale VPN on your phone, open your mobile browser, and navigate to http://100.x.x.x:5173. Your server will load instantly from anywhere!
