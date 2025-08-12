-- Step 1: Basic Database Security
-- This will allow public read access but block public write operations

-- Enable Row Level Security on both tables
ALTER TABLE campaign ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read campaigns (for your leads page)
CREATE POLICY "Allow public read access to campaigns" ON campaign
  FOR SELECT USING (true);

-- Allow anyone to read leads (for your leads page)  
CREATE POLICY "Allow public read access to leads" ON leads
  FOR SELECT USING (true);

-- Block all public write operations on campaigns
CREATE POLICY "Block public campaign writes" ON campaign
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Block public campaign updates" ON campaign
  FOR UPDATE USING (false);

CREATE POLICY "Block public campaign deletes" ON campaign
  FOR DELETE USING (false);

-- Block all public write operations on leads
CREATE POLICY "Block public lead writes" ON leads
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Block public lead updates" ON leads
  FOR UPDATE USING (false);

CREATE POLICY "Block public lead deletes" ON leads
  FOR DELETE USING (false); 