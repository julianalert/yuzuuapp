-- Temporary fix: Disable RLS to test n8n, then we'll re-enable with proper policies

-- Temporarily disable RLS on both tables to test n8n
ALTER TABLE campaign DISABLE ROW LEVEL SECURITY;
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- Note: This temporarily removes all security restrictions
-- We'll re-enable RLS with better policies once n8n is working

-- To re-enable later, run:
-- ALTER TABLE campaign ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY; 