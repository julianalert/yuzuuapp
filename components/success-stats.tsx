'use client';

import { useState, useEffect } from 'react';

interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: string;
}

export default function SuccessStats() {
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0]);

  const stats: StatItem[] = [
    {
      label: "Businesses served last 30 days",
      value: 123,
      icon: "🏢"
    },
    {
      label: "Leads unlocked today",
      value: 4983,
      icon: "🔓"
    },
    {
      label: "Average reply rate",
      value: 12,
      suffix: "%",
      icon: "📈"
    }
  ];

  useEffect(() => {
    const animateCounters = () => {
      stats.forEach((stat, index) => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = stat.value / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
          currentStep++;
          const currentValue = Math.min(increment * currentStep, stat.value);
          
          setAnimatedValues(prev => {
            const newValues = [...prev];
            newValues[index] = Math.floor(currentValue);
            return newValues;
          });

          if (currentStep >= steps) {
            clearInterval(timer);
          }
        }, duration / steps);
      });
    };

    // Start animation after component mounts
    const timeout = setTimeout(animateCounters, 500);
    return () => clearTimeout(timeout);
  }, []);

  const formatNumber = (value: number, stat: StatItem) => {
    const formattedValue = value.toLocaleString();
    return `${stat.prefix || ''}${formattedValue}${stat.suffix || ''}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🎉 Real-time stats from our users
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
              {formatNumber(animatedValues[index], stat)}
            </div>
            <div className="text-xs text-gray-600 leading-tight">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 italic">
          ⏰ Updated in real-time • Join the success stories
        </p>
      </div>
    </div>
  );
} 