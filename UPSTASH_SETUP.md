# Persistent quote likes

Mayalines uses Upstash Redis for shared like counters.

Add these environment variables in Vercel Project Settings → Environment Variables:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Use the Production environment (and Preview if you want likes during previews).

Without these variables, the API deliberately returns a non-persistent response instead of failing the site build.

Security:

- Never commit the Redis token.
- Store credentials only as Vercel environment variables.
- The API validates quote IDs and only accepts the `like` / `unlike` actions.
