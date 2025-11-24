# Deployment Guide

## 🚀 Deploying Your Chinese Takeaway Website

Your application is ready to deploy to production! Here are the recommended deployment options.

## Option 1: Vercel (Recommended - Easiest)

Vercel is the company behind Next.js and offers the best Next.js hosting experience.

### Steps:

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/china-menu.git
git push -u origin main
```

2. **Deploy to Vercel**
- Go to https://vercel.com
- Sign up/login with GitHub
- Click "New Project"
- Import your repository
- Add environment variable:
  - Name: `NEXT_PUBLIC_INSTANT_APP_ID`
  - Value: Your InstantDB App ID
- Click "Deploy"

3. **Done!**
Your site will be live at `https://your-project.vercel.app`

### Custom Domain (Optional)
- Go to your project settings in Vercel
- Click "Domains"
- Add your custom domain
- Update DNS records as instructed

## Option 2: Netlify

### Steps:

1. **Build Settings**
- Build command: `npm run build`
- Publish directory: `.next`
- Add environment variable: `NEXT_PUBLIC_INSTANT_APP_ID`

2. **Deploy**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Option 3: Self-Hosted (VPS/Cloud)

For AWS, DigitalOcean, Linode, etc.

### Prerequisites:
- Node.js 18+ installed
- nginx or similar web server
- PM2 for process management

### Steps:

1. **Install PM2**
```bash
npm install -g pm2
```

2. **Clone Repository**
```bash
git clone your-repo-url
cd china-menu
npm install
```

3. **Create .env.local**
```bash
echo "NEXT_PUBLIC_INSTANT_APP_ID=your_app_id" > .env.local
```

4. **Build**
```bash
npm run build
```

5. **Start with PM2**
```bash
pm2 start npm --name "china-menu" -- start
pm2 save
pm2 startup
```

6. **Configure nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. **Enable HTTPS** (recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Option 4: Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_PUBLIC_INSTANT_APP_ID=${NEXT_PUBLIC_INSTANT_APP_ID}
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_INSTANT_APP_ID=${NEXT_PUBLIC_INSTANT_APP_ID}
    restart: unless-stopped
```

### Deploy
```bash
docker-compose up -d
```

## Environment Variables

Make sure to set these in your deployment platform:

```bash
NEXT_PUBLIC_INSTANT_APP_ID=your_instant_app_id
```

⚠️ **Important**: This variable must start with `NEXT_PUBLIC_` to be available in the browser.

## Pre-Deployment Checklist

- [ ] InstantDB App ID is set in environment variables
- [ ] Admin account created
- [ ] Admin setup page deleted (optional, for security)
- [ ] Menu data customized (`lib/menu-data.ts`)
- [ ] Colors customized (optional)
- [ ] Tested locally with `npm run build && npm start`
- [ ] All features tested in production build
- [ ] Custom domain DNS configured (if using)
- [ ] SSL certificate configured (for custom domains)

## Post-Deployment Steps

1. **Test Customer Flow**
   - Visit your live URL
   - Browse menu
   - Add items to cart
   - Place a test order

2. **Test Admin Flow**
   - Login at `/admin/login`
   - Verify order appears
   - Test consolidation
   - Test copy-to-clipboard

3. **Monitor Performance**
   - Check page load times
   - Test on mobile devices
   - Verify real-time updates work

## Performance Optimization (Optional)

### Enable Image Optimization
If you add images later, configure `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['your-image-cdn.com'],
  },
}
```

### Add Analytics
Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Monitoring

### Vercel
- Built-in analytics and error tracking
- View deployment logs in dashboard

### Self-Hosted
```bash
# View PM2 logs
pm2 logs china-menu

# Monitor resources
pm2 monit
```

## Troubleshooting

### Build Fails
- Check Node.js version (must be 18+)
- Verify all dependencies installed
- Check for TypeScript errors: `npm run build`

### Environment Variables Not Working
- Make sure they start with `NEXT_PUBLIC_`
- Rebuild after changing env vars
- Check deployment platform's env var section

### Real-time Updates Not Working
- Verify InstantDB App ID is correct
- Check browser console for errors
- Ensure WebSocket connections aren't blocked by firewall

## Scaling Considerations

### For High Traffic:

1. **Use CDN** (Vercel includes this by default)
2. **Enable caching** in nginx/reverse proxy
3. **Monitor InstantDB usage** and upgrade plan if needed
4. **Consider Redis** for session storage at scale
5. **Implement rate limiting** to prevent abuse

## Backup Strategy

Your data is stored in InstantDB, which handles backups automatically. However, you should:

1. **Keep Git repository updated**
2. **Export menu data** periodically
3. **Document customizations**
4. **Save admin credentials** securely

## Cost Estimates

### Free Tier (Suitable for Small Restaurant)
- **Vercel**: Free for personal/small projects
- **InstantDB**: Free up to 10k operations/month
- **Custom Domain**: ~$10-15/year

### Paid Tier (High Volume)
- **Vercel Pro**: $20/month
- **InstantDB Pro**: Starting at $25/month
- **Total**: ~$45/month + domain

## Security Best Practices

1. **Delete admin setup page** after initial setup
2. **Use strong admin passwords** (12+ characters)
3. **Enable HTTPS** (SSL/TLS)
4. **Keep dependencies updated**: `npm audit`
5. **Monitor access logs** regularly
6. **Use firewall** to block malicious IPs
7. **Regular security audits**

## Support

For deployment issues:
- **Vercel**: https://vercel.com/support
- **Netlify**: https://docs.netlify.com
- **InstantDB**: https://instantdb.com/discord
- **Next.js**: https://github.com/vercel/next.js/discussions

---

## 🎉 Ready to Deploy!

Choose your preferred deployment method and follow the steps above. Your Chinese takeaway ordering system will be live in minutes!

**Recommended**: Start with Vercel for the easiest deployment experience.

