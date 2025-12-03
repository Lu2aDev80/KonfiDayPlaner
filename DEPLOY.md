# Quick Production Deployment Guide

This is a streamlined guide to get your KonfiDayPlaner application running on a production server.

## Prerequisites

- Server with Docker and Docker Compose installed
- Git installed
- Ports 8080, 3000, and 5432 available

## 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/Lu2aDev80/KonfiDayPlaner.git
cd KonfiDayPlaner

# Create production environment file
cp .env.production.template .env.production
```

## 2. Configure Environment

Edit `.env.production` and update these critical values:

```bash
# Change to a secure random password!
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# Email settings (required for user registration)
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
MAIL_FROM_EMAIL=noreply@yourdomain.com

# Application URLs
FRONTEND_HOST=https://yourdomain.com  # or http://your-server-ip:8080
APP_BASE_PATH=/minihackathon

# Admin password for initial setup
ADMIN_PASSWORD=change-this-secure-password
```

## 3. Deploy

```bash
# Build and start all services
docker-compose up -d

# Wait for services to start (about 30 seconds)
sleep 30

# Check status
docker-compose ps
```

## 4. Verify Deployment

```bash
# Check API health
curl http://localhost:3000/api/health

# Check frontend
curl http://localhost:8080/minihackathon/

# View logs
docker-compose logs --tail=50
```

## 5. Access Your Application

- **Frontend**: http://your-server:8080/minihackathon/
- **API**: http://your-server:3000/api/health
- **Admin Login**: http://your-server:8080/minihackathon/login

### Default Admin Credentials
- Username: `admin`
- Password: Value of `ADMIN_PASSWORD` in `.env.production`

**⚠️ IMPORTANT: Change the admin password immediately after first login!**

## 6. Post-Deployment

### Seed Database (Optional)
```bash
docker-compose exec api npm run db:seed
```

### Monitor Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

### Restart Services
```bash
docker-compose restart
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs api
docker-compose logs postgres

# Rebuild
docker-compose down
docker-compose up -d --build
```

### Database connection issues
```bash
# Check database is ready
docker-compose exec postgres pg_isready -U konfiadmin

# Check environment variables
docker-compose exec api printenv | grep DATABASE
```

### Frontend shows 404
- Verify base path matches in `vite.config.ts` and `.env.production`
- Check nginx logs: `docker-compose logs app`

## Health Check

Run the automated health check:

**Windows PowerShell:**
```powershell
npm run health-check
```

**Linux/Mac:**
```bash
./troubleshoot.sh
```

## Security Checklist

- [ ] Changed `POSTGRES_PASSWORD` to a strong password
- [ ] Changed `ADMIN_PASSWORD` to a secure value
- [ ] Configured valid SMTP credentials
- [ ] Updated `FRONTEND_HOST` to production domain
- [ ] Ensured `.env.production` is not committed to git
- [ ] Configured firewall rules (if applicable)
- [ ] Set up SSL/TLS (recommended)

## Updates

```bash
# Pull latest code
git pull origin master

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Database migrations run automatically on API startup
```

## Backup

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U konfiadmin konfidayplaner > backup-$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T postgres psql -U konfiadmin konfidayplaner < backup-20241203.sql
```

## Support

For detailed deployment information, see:
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Complete deployment checklist
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Detailed deployment guide

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart api

# Access container shell
docker-compose exec api sh

# Check container status
docker-compose ps

# Clean restart (removes volumes!)
docker-compose down -v && docker-compose up -d
```
