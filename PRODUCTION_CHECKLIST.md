# Production Deployment Checklist

## Pre-Deployment

### Environment Configuration
- [ ] Copy `.env.production.template` to `.env.production`
- [ ] Set secure `POSTGRES_PASSWORD` (use strong random password)
- [ ] Configure SMTP settings with valid credentials
- [ ] Set `SMTP_PASS` for email functionality
- [ ] Set `ADMIN_PASSWORD` for initial admin user
- [ ] Update `FRONTEND_HOST` to production domain
- [ ] Verify `APP_BASE_PATH` matches your deployment path

### Database
- [ ] Ensure PostgreSQL is accessible
- [ ] Database credentials are secure
- [ ] Backup strategy is in place
- [ ] Migration files are committed

### Security
- [ ] Remove any hardcoded passwords or secrets
- [ ] Ensure `.env.production` is in `.gitignore`
- [ ] Review CORS allowed origins in `server/index.ts`
- [ ] SSL/TLS certificates configured (if applicable)
- [ ] Update security headers in `nginx.conf` if needed

### Docker
- [ ] Docker and Docker Compose are installed on server
- [ ] Sufficient disk space for volumes
- [ ] Ports 8080 (app), 3000 (api), 5432 (postgres) are available
- [ ] Watchtower configuration reviewed

## Deployment Steps

### 1. Build and Deploy
```bash
# Pull latest code
git pull origin master

# Build containers
docker-compose build --no-cache

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### 2. Database Setup
```bash
# Database migrations will run automatically via Dockerfile.api startup script
# Or run manually:
docker-compose exec api npx prisma migrate deploy

# Seed database (optional, first time only)
docker-compose exec api npm run db:seed
```

### 3. Verify Deployment
```bash
# Check health endpoints
curl http://localhost:3000/api/health
curl http://localhost:8080/minihackathon/

# Check logs
docker-compose logs --tail=50 api
docker-compose logs --tail=50 app
docker-compose logs --tail=50 postgres

# Test API connection
curl -X GET http://localhost:3000/api/organisations
```

## Post-Deployment

### Monitoring
- [ ] API health endpoint responds: `/api/health`
- [ ] Frontend loads correctly
- [ ] Database connections are stable
- [ ] Email sending works (test email route)
- [ ] Check container logs for errors

### Testing
- [ ] Create a test organisation
- [ ] Register a test user
- [ ] Verify email functionality
- [ ] Test login flow
- [ ] Create events and day plans
- [ ] Verify schedule display

### Backup
- [ ] Database backup schedule configured
- [ ] Test restore process
- [ ] Document backup locations

## Troubleshooting

### Common Issues

**API not responding:**
```bash
docker-compose logs api
docker-compose restart api
```

**Database connection failed:**
```bash
docker-compose exec postgres pg_isready -U konfiadmin
docker-compose logs postgres
```

**Frontend 404 errors:**
- Check nginx configuration
- Verify base path in vite.config.ts matches deployment

**Email not sending:**
```bash
# Test SMTP connection
docker-compose exec api node -e "require('./server/mailer').testConnection().then(console.log)"
```

### Useful Commands
```bash
# View all logs
docker-compose logs -f

# Restart specific service
docker-compose restart <service-name>

# Rebuild and restart
docker-compose up -d --build

# Access container shell
docker-compose exec api sh
docker-compose exec postgres psql -U konfiadmin -d konfidayplaner

# Clean restart (WARNING: deletes volumes)
docker-compose down -v
docker-compose up -d
```

## Maintenance

### Regular Tasks
- Monitor disk space
- Review logs weekly
- Update dependencies monthly
- Test backups regularly
- Monitor container health

### Updates
```bash
# Pull latest images
docker-compose pull

# Rebuild
docker-compose up -d --build

# Watchtower will auto-update enabled containers
```

## Security Hardening

- [ ] Change default passwords immediately
- [ ] Limit database access to internal network only
- [ ] Configure firewall rules
- [ ] Enable HTTPS/SSL (reverse proxy)
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Rollback Plan

```bash
# Stop containers
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and start
docker-compose up -d --build

# Restore database if needed
docker-compose exec postgres psql -U konfiadmin -d konfidayplaner < backup.sql
```
