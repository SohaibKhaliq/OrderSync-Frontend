# Support

Welcome to OrderSync Frontend support!

## 📚 Documentation

- 📖 **[README.md](README.md)** — setup, configuration, architecture
- 🔍 **[Existing Issues](https://github.com/SohaibKhaliq/OrderSync-Frontend/issues)**

## ❓ How to Get Help

| Channel | Best For |
|---------|----------|
| [🐛 Bug Report](https://github.com/SohaibKhaliq/OrderSync-Frontend/issues/new) | Confirmed bugs |
| [💬 GitHub Discussions](https://github.com/SohaibKhaliq/OrderSync-Frontend/discussions) | Questions & ideas |

## Quick Troubleshooting

```bash
# Dev server won't start
node --version  # Must be 18.x
npm install     # Try clean install
rm -rf node_modules && npm install

# Backend connection fails
# Check VITE_BACKEND in .env matches your running backend
# Ensure CORS is configured on the backend

# Build fails
npm run build   # Check for syntax errors
```
