'use client'

import Image from "next/image";

export default function DashboardCard({
  campaign,
  children,
}: {
  campaign: {
    name: string;
    image?: string;
    link: string;
    status?: 'active' | 'paused' | 'draft';
    leadsCount?: number;
  };
  children: React.ReactNode;
}) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    draft: 'bg-gray-100 text-gray-800'
  };

  return (
    <article className="group relative flex w-full flex-col rounded-2xl bg-white/70 p-5 shadow-lg shadow-black/[0.03] transition before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-white">
      <svg
        className="absolute right-5 top-5 transition-transform group-hover:rotate-45"
        xmlns="http://www.w3.org/2000/svg"
        width={9}
        height={9}
      >
        <path
          className="fill-gray-400"
          d="M1.065 9 0 7.93l6.456-6.46H1.508L1.519 0H9v7.477H7.516l.011-4.942L1.065 9Z"
        />
      </svg>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {campaign.image && (
            <div className="relative">
              <Image
                className="rounded-full shadow-lg shadow-black/[0.03]"
                src={campaign.image}
                width={48}
                height={48}
                alt={campaign.name}
              />
            </div>
          )}
          <div>
            <h3 className="font-bold">
              <a className="before:absolute before:inset-0" href={campaign.link}>
                {campaign.name}
              </a>
            </h3>
            {campaign.status && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[campaign.status]}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            )}
          </div>
        </div>
        {campaign.leadsCount !== undefined && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Leads</div>
            <div className="text-2xl font-bold text-gray-900">{campaign.leadsCount}</div>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-700">{children}</p>
    </article>
  );
} 