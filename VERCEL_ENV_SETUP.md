# Vercel Environment Variables

Add these environment variables in your Vercel project settings (Project Settings → Environment Variables):

## For Production
| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_BASE` | `https://theomverse-svaraxa-api.hf.space` | Health prediction API endpoint |

## For Staging (Optional)
| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_BASE` | `https://staging-api.example.com` | Your staging API endpoint |

## For Preview (Optional)
| Variable | Value | Notes |
|----------|-------|-------|
| `VITE_API_BASE` | `https://preview-api.example.com` | Your preview API endpoint |

---

## How to Set Up in Vercel Dashboard

1. Go to **Project Settings** → **Environment Variables**
2. Click **Add** to create a new variable
3. Set the following:
   - **Name**: `VITE_API_BASE`
   - **Value**: `https://theomverse-svaraxa-api.hf.space`
   - **Environments**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application

---

## Verification

After deployment, verify the API is working:
1. Open the deployed app in Vercel
2. Go to the "Assess" section
3. Complete any health assessment form
4. Click "Analyze My Health"
5. Verify results load without errors

If you see API errors:
- Check that `VITE_API_BASE` is set correctly
- Verify the API endpoint is accessible (not blocked by CORS or firewall)
- Check Vercel build logs for any configuration warnings

---

## Build Output

The following variables are available at build time:
- `VITE_API_BASE` - Your configured API base URL

These are injected during the build process by Vite.
