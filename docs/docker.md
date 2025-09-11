# Docker Setup

Docker setup guide for the project.

---

## Install Docker

Visit the official Docker website for installation instructions:

🌐 **[Docker Installation Guide](https://docs.docker.com/get-docker/)**

Choose your operating system and follow the installation steps.

---

## Start Project Containers

Once Docker is installed, start the required containers:

```bash
docker compose up -d postgres adminer maildev
```

This command starts:

- **PostgreSQL** database server
- **Adminer** database management tool
- **Maildev** email testing tool

---

## Verify Containers

Check if containers are running:

```bash
docker compose ps
```

All services should show "Up" status.

---

Previous: [Setup Script](setup-script.md)

Next: [Architecture](architecture.md)
