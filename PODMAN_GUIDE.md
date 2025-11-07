# 🐳 Podman Quick Reference Guide

## Quick Start

```bash
# One-command setup (recommended)
./podman-setup.sh

# Then open: http://localhost:5000
```

## Common Operations

### Starting & Stopping

```bash
# Start all services
podman-compose up -d

# Stop all services
podman-compose down

# Restart all services
podman-compose restart

# Or use helper scripts
./podman-setup.sh      # Complete setup
./podman-stop.sh       # Stop containers
./podman-restart.sh    # Restart containers
```

### Viewing Logs

```bash
# All logs
podman-compose logs -f

# App logs only
podman logs -f gamified-learning-app

# MongoDB logs only
podman logs -f gamified-learning-mongodb

# Or use helper script
./podman-logs.sh       # All logs
./podman-logs.sh app   # App only
./podman-logs.sh db    # MongoDB only
```

### Container Status

```bash
# List running containers
podman ps

# List all containers (including stopped)
podman ps -a

# Service status with compose
podman-compose ps
```

### Accessing Containers

```bash
# Enter app container
podman exec -it gamified-learning-app sh

# Enter MongoDB container
podman exec -it gamified-learning-mongodb sh

# MongoDB shell
podman exec -it gamified-learning-mongodb mongosh gamified-learning

# Run commands in app container
podman exec gamified-learning-app node scripts/seed.js
```

## Database Management

### Seeding Database

```bash
# Seed from host machine
podman exec gamified-learning-app node scripts/seed.js

# Or enter container and run
podman exec -it gamified-learning-app sh
node scripts/seed.js
```

### MongoDB Operations

```bash
# Access MongoDB shell
podman exec -it gamified-learning-mongodb mongosh gamified-learning

# Backup database
podman exec gamified-learning-mongodb mongodump \
  --db=gamified-learning \
  --out=/tmp/backup

# Restore database
podman exec gamified-learning-mongodb mongorestore \
  --db=gamified-learning \
  /tmp/backup/gamified-learning

# Export backup from container
podman cp gamified-learning-mongodb:/tmp/backup ./backup
```

### Reset Database

```bash
# Stop containers
podman-compose down

# Remove volumes (WARNING: Deletes all data!)
podman volume rm 25870_mongodb_data 25870_mongodb_config

# Or use compose
podman-compose down -v

# Start fresh
./podman-setup.sh
```

## Development Workflow

### Live Development with Hot Reload

Edit `podman-compose.yml` to mount source code:

```yaml
services:
  app:
    volumes:
      - ./:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
    command: npm run dev  # If you add nodemon
```

Then restart:
```bash
podman-compose down
podman-compose up -d
```

### Rebuild After Code Changes

```bash
# Rebuild app image
podman-compose build app

# Restart with new image
podman-compose up -d app

# Or rebuild everything
podman-compose up -d --build
```

### Running Commands in Container

```bash
# Install new npm package
podman exec gamified-learning-app npm install express-rate-limit

# Run tests (if you add them)
podman exec gamified-learning-app npm test

# Check Node version
podman exec gamified-learning-app node --version
```

## Troubleshooting

### View Recent Logs

```bash
# Last 100 lines
podman logs --tail 100 gamified-learning-app

# Follow from now
podman logs -f gamified-learning-app

# Since specific time
podman logs --since 10m gamified-learning-app
```

### Container Won't Start

```bash
# Check container status
podman ps -a

# View startup logs
podman logs gamified-learning-app

# Inspect container
podman inspect gamified-learning-app

# Check health
podman healthcheck run gamified-learning-mongodb
```

### Port Already in Use

```bash
# Find what's using port 5000
lsof -ti:5000

# Kill process (macOS/Linux)
lsof -ti:5000 | xargs kill

# Or change port in podman-compose.yml
ports:
  - "5001:5000"  # Host:Container
```

### MongoDB Connection Issues

```bash
# Check MongoDB is running
podman ps | grep mongodb

# Check MongoDB logs
podman logs gamified-learning-mongodb

# Test connection from app
podman exec gamified-learning-app node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://mongodb:27017/gamified-learning')
  .then(() => console.log('Connected!'))
  .catch(err => console.error(err));
"
```

### Reset Everything

```bash
# Stop and remove containers
podman-compose down

# Remove images
podman rmi gamified-learning-app
podman rmi mongo:7.0

# Remove volumes
podman volume prune

# Start fresh
./podman-setup.sh
```

## Podman Machine (macOS)

### Machine Management

```bash
# List machines
podman machine list

# Start machine
podman machine start

# Stop machine
podman machine stop

# Remove machine
podman machine rm podman-machine-default

# Create new machine with custom specs
podman machine init --cpus 4 --memory 8192 --disk-size 50

# SSH into machine
podman machine ssh
```

### Machine Info

```bash
# Check machine status
podman machine inspect

# View machine resources
podman machine info

# Check disk usage
podman system df
```

## Image Management

### Building Images

```bash
# Build from Dockerfile
podman build -t gamified-learning:v1 .

# Build with no cache
podman build --no-cache -t gamified-learning:v1 .

# Build specific platform
podman build --platform linux/amd64 -t gamified-learning:v1 .
```

### Managing Images

```bash
# List images
podman images

# Remove image
podman rmi gamified-learning-app

# Remove unused images
podman image prune

# Remove all unused data
podman system prune -a
```

### Pushing to Registry

```bash
# Tag for registry
podman tag gamified-learning:latest myregistry.com/gamified-learning:latest

# Login to registry
podman login myregistry.com

# Push
podman push myregistry.com/gamified-learning:latest
```

## Volume Management

```bash
# List volumes
podman volume ls

# Inspect volume
podman volume inspect 25870_mongodb_data

# Remove volume
podman volume rm 25870_mongodb_data

# Backup volume
podman run --rm -v 25870_mongodb_data:/data \
  -v $(pwd):/backup alpine \
  tar czf /backup/mongodb-backup.tar.gz -C /data .

# Restore volume
podman run --rm -v 25870_mongodb_data:/data \
  -v $(pwd):/backup alpine \
  tar xzf /backup/mongodb-backup.tar.gz -C /data
```

## Network Management

```bash
# List networks
podman network ls

# Inspect network
podman network inspect 25870_gamified-learning-network

# Test connectivity between containers
podman exec gamified-learning-app ping mongodb
```

## Performance & Monitoring

```bash
# Resource usage
podman stats

# Container resource usage
podman stats gamified-learning-app

# Disk usage
podman system df

# Container processes
podman top gamified-learning-app
```

## Environment Variables

### Set via .env.podman

```bash
# Edit .env.podman
JWT_SECRET=my-secret-key

# Load and start
export $(cat .env.podman | xargs)
podman-compose up -d
```

### Override on Command Line

```bash
# Set env var for single run
JWT_SECRET=new-secret podman-compose up -d

# Set in compose file
podman-compose -f podman-compose.yml \
  -f podman-compose.prod.yml \
  up -d
```

## Useful Aliases (Add to ~/.zshrc)

```bash
alias pdc='podman-compose'
alias pdu='podman-compose up -d'
alias pdd='podman-compose down'
alias pdl='podman-compose logs -f'
alias pdr='podman-compose restart'
alias pdps='podman-compose ps'
```

## Production Tips

1. **Use specific image tags** (not `latest`)
2. **Set resource limits** in compose file
3. **Use health checks** for critical services
4. **Enable restart policies** (`restart: unless-stopped`)
5. **Use secrets** instead of environment variables
6. **Run as non-root** user in containers
7. **Scan images** for vulnerabilities: `podman scan`
8. **Use multi-stage builds** to reduce image size

## Quick Debugging Commands

```bash
# Check if services are responding
curl http://localhost:5000/api/courses

# Test MongoDB connection
podman exec gamified-learning-mongodb mongosh \
  --eval "db.adminCommand('ping')"

# Check environment variables
podman exec gamified-learning-app env

# View container config
podman inspect gamified-learning-app | less

# Export container as image
podman commit gamified-learning-app gamified-learning-snapshot

# Run interactive shell
podman run -it --rm alpine sh
```

## Getting Help

```bash
# Podman help
podman --help
podman run --help

# Compose help
podman-compose --help
podman-compose up --help

# Container logs
podman logs --help
```

---

**Need more help?** Check the [Podman documentation](https://docs.podman.io/)
