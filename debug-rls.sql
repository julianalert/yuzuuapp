-- Debug RLS Setup
-- Run this in Supabase SQL Editor to check what's happening

-- 1. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('campaign', 'leads');

-- 2. List all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as operation,
  qual as using_condition,
  with_check
FROM pg_policies 
WHERE tablename IN ('campaign', 'leads')
ORDER BY tablename, policyname;

-- 3. Test service role access (this should work)
-- Note: Only run this if you're using the service role key in SQL editor
-- SELECT COUNT(*) as total_campaigns FROM campaign;
-- SELECT COUNT(*) as total_leads FROM leads;

-- 4. Check if there are any campaign records at all
-- (This will work with service role, might be empty with anon key due to RLS)
-- SELECT id, url, email, created_at FROM campaign ORDER BY created_at DESC LIMIT 5; 