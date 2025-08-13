'use client';

import { useState } from 'react';

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}

interface Lead {
  full_name?: string;
  job_title?: string;
  photo_url?: string;
  linkedin_url?: string;
  company_name?: string;
  company_website?: string;
  company_linkedin_url?: string;
  company_size?: string;
  industry?: string;
  country?: string;
  city?: string;
  lead_email?: string;
  whygreatfit?: string;
  warmintro?: string;
}

interface LeadsHeaderStatsProps {
  totalLeads: number;
  displayUrl: string;
  isPaid: boolean;
  onExport: () => void;
  isExporting: boolean;
  leads: Lead[];
}

function calculateLeadQuality(lead: Lead): number {
  let score = 0;
  let totalFactors = 0;

  // Essential contact information
  if (lead.lead_email) score += 25;
  totalFactors += 25;

  // Professional profile
  if (lead.linkedin_url) score += 15;
  if (lead.job_title) score += 10;
  totalFactors += 25;

  // Company information
  if (lead.company_website) score += 15;
  if (lead.company_linkedin_url) score += 10;
  totalFactors += 25;

  // Location and context
  if (lead.company_size) score += 10;
  if (lead.industry) score += 10;
  if (lead.country) score += 5;
  totalFactors += 25;

  return Math.round((score / totalFactors) * 100);
}

function calculatePotentialValue(leads: Lead[]): number {
  // Base price per lead
  const basePrice = 27; // Updated from 250 to 27

  // Industry-based multipliers
  const industryMultipliers: { [key: string]: number } = {
    'Technology': 1.2,
    'Healthcare': 1.15,
    'Finance': 1.25,
    'Manufacturing': 1.1,
    'Retail': 1.0,
    'Other': 1.0
  };

  // Company size multipliers
  const sizeMultipliers: { [key: string]: number } = {
    '1-10': 0.8,
    '11-50': 0.9,
    '51-200': 1.0,
    '201-500': 1.2,
    '501-1000': 1.3,
    '1001+': 1.5
  };

  let totalValue = 0;
  leads.forEach(lead => {
    let value = basePrice;
    
    // Apply industry multiplier
    if (lead.industry) {
      const industryMultiplier = industryMultipliers[lead.industry] || industryMultipliers['Other'];
      value *= industryMultiplier;
    }

    // Apply size multiplier
    if (lead.company_size) {
      const sizeMultiplier = sizeMultipliers[lead.company_size] || 1.0;
      value *= sizeMultiplier;
    }

    // Bonus for complete information
    if (lead.lead_email && lead.linkedin_url && lead.company_website) {
      value *= 1.1; // 10% bonus for complete data
    }

    totalValue += value;
  });

  return Math.round(totalValue);
}

export default function LeadsHeaderStats({ 
  totalLeads, 
  displayUrl, 
  isPaid, 
  onExport,
  isExporting,
  leads 
}: LeadsHeaderStatsProps) {
  // Calculate average lead quality
  const averageQuality = leads.length > 0
    ? Math.round(leads.reduce((sum, lead) => sum + calculateLeadQuality(lead), 0) / leads.length)
    : 0;

  // Calculate total potential value
  const potentialValue = calculatePotentialValue(leads);

  return (
    <div className="mb-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads Card */}
        <article className="group relative flex w-full flex-col rounded-2xl bg-white/70 p-5 shadow-lg shadow-black/[0.03] transition before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white">
          <div className="mb-3 inline-flex">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-400/10">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="mb-1 font-bold text-gray-800">Total Leads</h3>
          <p className="text-3xl font-bold text-blue-500 mb-2">{totalLeads.toLocaleString()}</p>
          <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="truncate">{displayUrl}</span>
          </p>
        </article>

        {/* Estimated Value Card */}
        <article className="group relative flex w-full flex-col rounded-2xl bg-white/70 p-5 shadow-lg shadow-black/[0.03] transition before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white">
          <div className="mb-3 inline-flex">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-green-400/10">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="mb-1 font-bold text-gray-800">Potential Value</h3>
          <p className="text-3xl font-bold text-green-500 mb-2">${potentialValue.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Based on industry average</p>
        </article>

        {/* Lead Quality Card */}
        <article className="group relative flex w-full flex-col rounded-2xl bg-white/70 p-5 shadow-lg shadow-black/[0.03] transition before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white">
          <div className="mb-3 inline-flex">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-purple-400/10">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <h3 className="mb-1 font-bold text-gray-800">Lead Quality</h3>
          <p className="text-3xl font-bold text-purple-500 mb-2">{averageQuality}%</p>
          <p className="text-sm text-gray-600">Average data completeness</p>
        </article>

        {/* Export Card */}
        <article className="group relative flex w-full flex-col rounded-2xl bg-white/70 p-5 shadow-lg shadow-black/[0.03] transition before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white">
          <div className="mb-3 inline-flex">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-orange-400/10">
              <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
          </div>
          <h3 className="mb-1 font-bold text-gray-800">Export Data</h3>
          <p className="text-lg text-gray-600 mb-3">CSV Format</p>
          {isPaid ? (
            <button
              onClick={onExport}
              disabled={isExporting}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h8v2H6V4zm0 4h8v2H6V8zm0 4h6v2H6v-2z"/>
              </svg>
              {isExporting ? 'Exporting...' : 'Export as CSV'}
            </button>
          ) : (
            <button
              disabled
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg border border-gray-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM6 4h8v2H6V4zm0 4h8v2H6V8zm0 4h6v2H6v-2z"/>
              </svg>
              Export as CSV
              <LockIcon className="w-3 h-3 ml-2" style={{ color: '#ffc123' }} />
            </button>
          )}
        </article>
      </div>
    </div>
  );
} 