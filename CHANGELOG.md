# Changelog

## Version 1.0.0 - Mayo 2, 2026

### Features

- Login screen with password protection
- 4 predefined backgrounds (auto-loaded on login)
- Upload custom backgrounds
- Remove white background from logos automatically
- Image editor with square crop (centered, no distortion)
- Canvas rendering at original resolution
- Share directly to WhatsApp via Web Share API
- Save to gallery (iOS/Android) at maximum quality (JPEG 1.0)
- Opacity slider (0-100%) for background transparency
- Real-time canvas updates
- Rate limiting (3 attempts, 15 min lockout)
- 24-hour session duration
- Token-based authentication (HMAC-SHA256)
- Security headers (HSTS, X-Frame-Options, etc.)
- robots.txt and meta noindex (not searchable)
- iOS Keychain autocomplete support
- Responsive mobile design
- Feedback toasts (success/error messages)

### Technical

- React 19.2.5 + TypeScript
- Vite 8.0.10 (fast bundler)
- Vercel serverless deployment
- Zero external image processing dependencies
- Native APIs: Canvas, FileReader, Web Share

### Security

- Password in Vercel env vars (never in code)
- Constant-time password comparison (anti-timing attacks)
- HTTPS + HSTS enforcement
- No tracking cookies
- No third-party data sending
- 100% client-side processing (no server storage)

### Documentation

- README.md (project overview)
- REQUIREMENTS.md (functional and non-functional)
- ARCHITECTURE.md (system design)
- TECHNICAL.md (developer docs)
- USER_GUIDE.md (user manual)
- DEPLOYMENT.md (deployment guide)
- SECURITY.md (security analysis)
- API.md (API documentation)
- CHANGELOG.md (this file)

### Status

Production ready. All features complete and tested.

### Known Limitations

- Single shared password (no multi-user)
- Session-based only (no persistent storage)
- Rate limiting resets on Vercel cold starts
- No end-to-end encryption

---

## Version 0.9.0 - Development

Initial development phase.
