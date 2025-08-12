'use client';

import { useState, useEffect } from 'react';

interface ROICalculatorProps {
  totalLeads?: number;
}

export default function ROICalculator({ totalLeads = 100 }: ROICalculatorProps) {
  const [conversionRate, setConversionRate] = useState(2);
  const [averageDealValue, setAverageDealValue] = useState(500);
  const [calculatedROI, setCalculatedROI] = useState({ revenue: 0, roi: 0, convertedLeads: 0 });

  const investmentCost = 47; // One-time payment

  useEffect(() => {
    const convertedLeads = Math.floor((totalLeads * conversionRate) / 100);
    const totalRevenue = convertedLeads * averageDealValue;
    const roi = totalRevenue > 0 ? Math.floor(((totalRevenue - investmentCost) / investmentCost) * 100) : 0;

    setCalculatedROI({
      revenue: totalRevenue,
      roi: roi,
      convertedLeads: convertedLeads
    });
  }, [conversionRate, averageDealValue, totalLeads]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getROIColor = (roi: number) => {
    if (roi >= 1000) return 'text-green-600';
    if (roi >= 500) return 'text-blue-600';
    if (roi >= 100) return 'text-orange-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Calculate your potential ROI from {totalLeads} leads
        </h3>
        <p className="text-gray-600 text-sm">
        💡 Even with conservative estimates, most users see <strong>10x+ ROI</strong>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Conversion Rate
            </label>
            <div className="relative">
              <input
                type="range"
                min="1"
                max="10"
                value={conversionRate}
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1%</span>
                <span className="font-semibold text-blue-600">{conversionRate}%</span>
                <span>10%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              B2B Industry average: 2-5%
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Deal Value (What's your average customer worth?)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={averageDealValue}
                onChange={(e) => setAverageDealValue(Number(e.target.value) || 0)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 text-center">
            📊 Your Projected ROI
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Converted Leads:</span>
              <span className="font-bold text-gray-900">
                {calculatedROI.convertedLeads} leads
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Revenue:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency(calculatedROI.revenue)}
              </span>
            </div>
            
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Investment:</span>
                <span className="font-light text-gray-900">
                  {formatCurrency(investmentCost)}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">ROI:</span>
                <span className={`font-bold text-lg ${getROIColor(calculatedROI.roi)}`}>
                  {calculatedROI.roi > 0 ? '+' : ''}{calculatedROI.roi}%
                </span>
              </div>
            </div>
          </div>

          {calculatedROI.roi > 100 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs text-green-700 text-center">
                🚀 <strong>{Math.floor(calculatedROI.roi / 100)}x return</strong> on your investment!
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 Even with conservative estimates, most users see <strong>10x+ ROI</strong>
        </p>
      </div>
    </div>
  );
} 