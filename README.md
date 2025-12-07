# API Translation Service

## Deployment

This is a Vercel serverless function for text translation using Xenova transformers.

### Endpoint

**POST** `/traducir`

### Headers

### Request Body

```json
{
  "texto": "Hello world",
  "from": "en",
  "to": "es"
}
```

### Response

```json
{
  "traducido": "Hola mundo"
}
```

### Supported Language Pairs

- Spanish to English (`es` → `en`)
- English to Spanish (`en` → `es`)

### Deploy to Vercel

```bash
vercel --prod
```

## Important Notes

⚠️ **Cold Start Warning**: The first request after deployment may take 30-60 seconds because the ML models need to be loaded. Subsequent requests will be faster due to caching.

⚠️ **Timeout Limits**: Vercel serverless functions have a 10-second timeout on the Hobby plan. If you experience timeouts, consider upgrading to Pro plan (60s timeout) or using a different hosting solution for ML workloads.

## Alternative: Use External Translation API

For production use, consider using a dedicated translation API instead of running ML models in serverless functions:

- Google Cloud Translation API
- AWS Translate
- DeepL API
- LibreTranslate (self-hosted)
