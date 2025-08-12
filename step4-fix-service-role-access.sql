-- Step 4: Fix RLS policies to allow service role access
-- This will allow n8n's native Supabase node to work with service role key

-- First, drop the existing restrictive policies
DROP POLICY IF EXISTS "Block public campaign writes" ON campaign;
DROP POLICY IF EXISTS "Block public campaign updates" ON campaign;
DROP POLICY IF EXISTS "Block public campaign deletes" ON campaign;
DROP POLICY IF EXISTS "Block public lead writes" ON leads;
DROP POLICY IF EXISTS "Block public lead updates" ON leads;
DROP POLICY IF EXISTS "Block public lead deletes" ON leads;

-- Campaign table policies - Allow service role, block anon role
CREATE POLICY "Allow service role campaign inserts" ON campaign
  FOR INSERT WITH CHECK (
    current_setting('role') = 'service_role' OR 
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

CREATE POLICY "Allow service role campaign updates" ON campaign
  FOR UPDATE USING (
    current_setting('role') = 'service_role' OR 
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

CREATE POLICY "Allow service role campaign deletes" ON campaign
  FOR DELETE USING (
    current_setting('role') = 'service_role' OR 
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- Leads table policies - Allow service role, block anon role
CREATE POLICY "Allow service role lead inserts" ON leads
  FOR INSERT WITH CHECK (
    current_setting('role') = 'service_role' OR 
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

CREATE POLICY "Allow service role lead updates" ON leads
  FOR UPDATE USING (
    current_setting('role') = 'service_role' OR 
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

CREATE POLICY "Allow service role lead deletes" ON leads
  FOR DELETE USING (
    current_setting('role') = 'service_role' OR 
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  ); 