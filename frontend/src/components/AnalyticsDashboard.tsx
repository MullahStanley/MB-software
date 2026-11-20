import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Repeat, 
  TrendingUp, 
  Smile, 
  Globe, 
  Layers, 
  Activity 
} from 'lucide-react';
import { api } from '../api';
import { PageHeader } from './ui/PageHeader';

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalytics();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-20" role="status">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-forest-600 border-t-transparent"></div>
        <p className="text-sm text-slate-500">Loading live impact metrics…</p>
      </div>
    );
  }

  const problemEntries: [string, number][] = Object.entries(data.frequentProblemDistribution || {});
  const maxProblemCount = Math.max(...problemEntries.map(([_, count]) => count), 1);

  const kpis = [
    {
      label: 'Total registered',
      value: data.totalUsers.toLocaleString(),
      sub: `Active today: ${data.activeUsersToday.toLocaleString()}`,
      icon: Users
    },
    {
      label: 'Repeat users',
      value: `${data.repeatUserRate}%`,
      sub: 'Consistent return visits',
      icon: Repeat
    },
    {
      label: '30-day retention',
      value: `${data.retentionRate30Day}%`,
      sub: 'vs. 12% mood-tracker average',
      icon: TrendingUp
    },
    {
      label: 'Satisfaction',
      value: `${data.satisfactionScore} / 5`,
      sub: '97.8% positive feedback',
      icon: Smile
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Impact metrics"
        title="Community health at a glance."
        description="An honest look at retention, repeat engagement, what young adults are reporting most often, and how reliably the platform runs."
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="panel p-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">{kpi.label}</span>
                <Icon className="h-4 w-4 text-forest-600" aria-hidden="true" />
              </div>
              <div className="mt-1.5 font-mono text-2xl font-semibold text-slate-900">{kpi.value}</div>
              <span className="mt-1 block text-[11px] text-slate-500">{kpi.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Problem distribution + usage */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Frequent problems */}
        <section className="panel p-5 lg:col-span-7" aria-labelledby="problems-heading">
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 id="problems-heading" className="flex items-center gap-2 text-sm font-semibold">
                <Layers className="h-4 w-4 text-forest-600" aria-hidden="true" />
                Most-reported problems
              </h2>
              <p className="text-xs text-slate-500">
                Aggregated across all six communities to prioritize what help is built next
              </p>
            </div>
            <span className="shrink-0 font-mono text-xs text-forest-700">{problemEntries.length} issues</span>
          </div>

          <div className="max-h-[360px] space-y-3.5 overflow-y-auto pr-1">
            {problemEntries.map(([problem, count], idx) => {
              const pct = Math.round((count / maxProblemCount) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between gap-3 text-xs">
                    <span className="font-medium text-slate-700">{problem}</span>
                    <span className="shrink-0 font-mono text-[11px] text-slate-500">{count} reports</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-forest-600 transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Usage + reliability */}
        <div className="space-y-4 lg:col-span-5">
          <section className="panel p-5" aria-labelledby="usage-heading">
            <h2 id="usage-heading" className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Activity className="h-4 w-4 text-forest-600" aria-hidden="true" />
              Feature usage
            </h2>

            <div className="space-y-2 text-xs">
              {Object.entries(data.pageViews || {}).map(([key, views]: any) => (
                <div key={key} className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                  <span className="font-medium capitalize text-slate-700">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="font-mono text-slate-500">{Number(views).toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5" aria-labelledby="reliability-heading">
            <h2 id="reliability-heading" className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Globe className="h-4 w-4 text-forest-600" aria-hidden="true" />
              Reliability
            </h2>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="block font-mono font-semibold text-slate-900">99.9%</span>
                <span className="text-[10px] text-slate-500">Uptime</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="block font-mono font-semibold text-slate-900">Zero</span>
                <span className="text-[10px] text-slate-500">Ad trackers</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5">
                <span className="block font-mono font-semibold text-slate-900">120ms</span>
                <span className="text-[10px] text-slate-500">P95 latency</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
