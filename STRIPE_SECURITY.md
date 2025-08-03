# Stripe Security Checklist

## ✅ Environment Variables Setup

### Local Development (.env.local)
```bash
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
```

### Vercel Production
- [ ] Add `STRIPE_SECRET_KEY` (sk_live_...) in Vercel Environment Variables
- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...) in Vercel Environment Variables
- [ ] Set environment to "Production" for both variables

### Vercel Preview/Development
- [ ] Add test keys for preview deployments
- [ ] Set environment to "Preview" for test variables

## 🔒 Security Measures

### ✅ Already Implemented
- [x] Secret key only used server-side
- [x] Publishable key safe for client-side
- [x] .env.local in .gitignore (prevents accidental commits)
- [x] Key format validation
- [x] Environment validation (test vs live keys)

### 🔍 Additional Security
- [ ] Enable Stripe webhook signature verification in production
- [ ] Set up Stripe Dashboard alerts for failed payments
- [ ] Monitor Stripe Dashboard for suspicious activity
- [ ] Use Stripe's fraud detection features

## 🚨 Never Do This
- ❌ Never commit secret keys to Git
- ❌ Never expose secret keys in client-side code
- ❌ Never use test keys in production
- ❌ Never use live keys in development

## 🔧 Testing
- [ ] Test with test keys in development
- [ ] Test with live keys in production
- [ ] Verify webhook endpoints work
- [ ] Test payment success/failure flows

## 📊 Monitoring
- [ ] Set up Stripe Dashboard notifications
- [ ] Monitor payment success rates
- [ ] Check for failed webhook deliveries
- [ ] Review Stripe logs regularly 