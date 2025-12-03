# Security Notes

## Known Vulnerabilities

As of December 3, 2025, the following dependencies have known vulnerabilities:

### 1. MJML (html-minifier)
- **Severity**: High (31 vulnerabilities)
- **Issue**: REDoS vulnerability in html-minifier used by MJML
- **Status**: Requires major version update (breaking change)
- **Risk**: Low - MJML is only used server-side for email template generation
- **Mitigation**: 
  - MJML runs in controlled environment (server-side only)
  - Input is from trusted sources (application templates)
  - Not exposed to user input directly
- **Action**: Monitor for MJML updates to v5.x when stable

### 2. Nodemailer
- **Severity**: Moderate (1 vulnerability)
- **Issue**: Email domain interpretation conflict and DoS vulnerability
- **Status**: Fix available via `npm audit fix --force`
- **Risk**: Low - Used for sending emails only, no user-controlled email parsing
- **Mitigation**:
  - Email sending is rate-limited
  - Only used for system-generated emails
  - Not vulnerable to DoS in our usage pattern
- **Action**: Can update to 7.0.11+ when testing confirms no breaking changes

## Security Best Practices

### In Production

1. **Environment Variables**
   - Never commit `.env.production` to version control
   - Use strong passwords for all services
   - Rotate credentials regularly

2. **Database**
   - Use strong PostgreSQL passwords
   - Limit database access to internal network only
   - Regular backups

3. **API**
   - CORS configured for production domains only
   - Session tokens with expiration
   - Password hashing with bcrypt (12 rounds)

4. **HTTPS/SSL**
   - Recommended: Set up reverse proxy (nginx/traefik) with SSL
   - Use Let's Encrypt for free SSL certificates
   - Force HTTPS in production

5. **Monitoring**
   - Regular log reviews
   - Health check monitoring
   - Set up alerts for failed containers

## Recommended Actions

### Immediate
- [x] Remove console.log with sensitive data
- [x] Use bcrypt for password hashing
- [x] Environment variable validation
- [x] Secure default passwords
- [x] Add .env.production to .gitignore

### Short Term (Next 1-3 months)
- [ ] Update nodemailer to latest stable version
- [ ] Test and validate email functionality after update
- [ ] Set up automated security scanning
- [ ] Implement rate limiting on API endpoints

### Long Term
- [ ] Migrate to MJML v5 when stable
- [ ] Implement API authentication rate limiting
- [ ] Add request logging middleware
- [ ] Set up automated dependency updates (Dependabot/Renovate)
- [ ] Regular security audits

## Reporting Security Issues

If you discover a security vulnerability, please email: security@lu2adevelopment.de

Do NOT open public issues for security vulnerabilities.

## Security Update Process

1. Review npm audit regularly: `npm audit`
2. Check for breaking changes in updates
3. Test in development environment
4. Update staging environment
5. Monitor for issues
6. Deploy to production
7. Document changes in CHANGELOG.md

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Prisma Security](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
