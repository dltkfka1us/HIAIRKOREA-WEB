
# KOSHA Migration to Next.js / Supabase

**Ultimate Goal**: Full independence from the Google Ecosystem (No Google Apps Script, No Google Sheets, No Google Drive).

**Tech Stack Requirements**: 
- Use Next.js (App Router) deployed on Vercel.
- Use Supabase (PostgreSQL) for all database storage and backend functions.
- DO NOT replicate GAS-specific patterns (like spreadsheet polling) 1:1 if a more modern backend architecture (like Vercel Cron + Supabase Webhooks + Next.js Route Handlers) is better suited.
- When migrating features that previously relied on Google forms/sheets (e.g. Edu, TBM), architect them from scratch using Next.js forms and Supabase tables.

