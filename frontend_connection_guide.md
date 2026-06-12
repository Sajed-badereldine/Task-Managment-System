# Connecting Frontend to your AWS Load Balancer (ALB)

Yes! In production, the React frontend should connect to the Application Load Balancer (ALB) address:
`http://ecs-app-alb-1577202263.us-east-1.elb.amazonaws.com`

---

## 💡 The Best Practice: Use a Relative Path `/api`

Since we configured **path-based routing** on the ALB:
- Any traffic to `/api/*` goes to the **NestJS Backend**.
- All other traffic goes to the **React Frontend**.

Because both frontend and backend are hosted on the **same domain**, you can simply configure the frontend API URL to be a relative path:
```env
VITE_API_BASE_URL=/api
```

### Why this is better:
1. **No CORS Issues**: Since the frontend and backend share the exact same domain, scheme, and port, browsers will never block requests due to CORS.
2. **Environment Agnostic**: You don't have to rebuild the Docker image with a hardcoded ALB URL. The same Docker image will work whether you access it via the ALB DNS name or map a custom domain (like `app.yourdomain.com`) later.

---

## 🛠️ Required Backend Update (Global API Prefix)

Because the ALB forwards requests starting with `/api/` directly to the NestJS backend (e.g. `/api/auth/login`), your NestJS backend needs to know it should listen on `/api/...` routes.

I have updated `server/src/main.ts` to include:
```typescript
app.setGlobalPrefix('api');
```

This ensures that all NestJS routes are prefixed with `/api` (matching the ALB rules perfectly).
