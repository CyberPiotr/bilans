# ai-parser

Supabase Edge Function that sends meal or dish text to OpenAI and returns JSON
compatible with the current VitaTrack / Bilans data structures.

The function reads `OPENAI_API_KEY` from the Edge Function environment. Never put
that key in frontend code or commit a real key to this repository.

## CLI requirement

This repository expects the Supabase CLI as a local development dependency:

```powershell
npm install supabase --save-dev
npx supabase --version
```

Do not install the Supabase CLI globally with `npm install -g supabase`.

## Local test

Supabase CLI is required. Create an ignored local secret file:

```powershell
Copy-Item supabase/functions/.env.example supabase/functions/.env
```

Set the real local key in `supabase/functions/.env`, then run:

```powershell
npx supabase functions serve ai-parser --env-file supabase/functions/.env
```

In another PowerShell window:

```powershell
curl.exe -i -X POST "http://127.0.0.1:54321/functions/v1/ai-parser" `
  -H "Content-Type: application/json" `
  -d '{"action":"parse_meal","input":"3 jajka i 20 g masla"}'
```

Dish example:

```powershell
curl.exe -i -X POST "http://127.0.0.1:54321/functions/v1/ai-parser" `
  -H "Content-Type: application/json" `
  -d '{"action":"parse_dish","input":"Omlet: 3 jajka, 30 g sera cheddar, 10 g masla"}'
```

## Deploy

Log in and link the existing Supabase project once:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Deploy the function:

```powershell
npx supabase functions deploy ai-parser --no-verify-jwt
```

Test the deployed function:

```powershell
curl.exe -i -X POST "https://YOUR_PROJECT_REF.supabase.co/functions/v1/ai-parser" `
  -H "Content-Type: application/json" `
  -d '{"action":"parse_meal","input":"200 g lososia i 100 g brokulu"}'
```

`verify_jwt = false` is intentional for this first version without user login.
Before exposing the function publicly, add authentication or rate limiting to
protect the OpenAI budget.
