import { createClient } from '@supabase/supabase-js'

const supabaseDetails = {
    "URL": "https://vciziedlvnxwqewyvruc.supabase.co",
    "anon": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaXppZWRsdm54d3Fld3l2cnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUyNDMzOTEsImV4cCI6MTk4MDgxOTM5MX0.uUyOj9SYd5AjdlxJtNdE9K2ADnhDlf_IZvpn_k2fhJk",
    "serviceRole": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjaXppZWRsdm54d3Fld3l2cnVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NTI0MzM5MSwiZXhwIjoxOTgwODE5MzkxfQ.4WGrOujLfjyt0wXxi6a6mVUYO7X4Q9_yRaTOxS4WTKk",
};

export let supabase = createClient(supabaseDetails.URL, supabaseDetails.anon);