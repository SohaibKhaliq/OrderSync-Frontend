# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, **please do not open a public issue**. Report privately by emailing the repository maintainer.

**Response timeline:**
- Acknowledgment within 48 hours
- Investigation within 5 business days
- Fix or mitigation plan within 10 business days

## Best Practices

- ⚠️ The `.env` file with Stripe publishable keys is committed to this repo. These are public keys by design, but commit `.env` should still be avoided.
- Never commit `.env` files with secret keys (`sk_test_`, `sk_live_`)
- Keep `VITE_STRIPE_PUBLIC_KEY` — this is publishable and safe to expose
- Use environment variables for all sensitive configuration
- Keep dependencies updated: `npm audit` regularly
