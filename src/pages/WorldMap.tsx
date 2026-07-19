import React from 'react';
import { ArrowRight, Globe2, MapPinned, ShieldCheck, Truck } from 'lucide-react';
import { GoogleWorldMapEmbed } from '../components/GoogleWorldMapEmbed';

const networkStats = [
  { label: 'Coverage', value: '220+ Countries', icon: Globe2 },
  { label: 'Daily Flow', value: '12M Packages', icon: Truck },
  { label: 'Visibility', value: 'Live Routing', icon: MapPinned },
];

export const WorldMap: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white">
      <section className="relative overflow-hidden border-b border-ups-brown/10 bg-[radial-gradient(circle_at_top_right,_rgba(245,196,10,0.24),_transparent_30%),linear-gradient(180deg,#fff7df_0%,#ffffff_58%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ups-yellow-dark/50 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-ups-yellow/30 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-ups-brown shadow-sm backdrop-blur">
              <Globe2 className="h-4 w-4 text-ups-yellow-dark" />
              GSS Global Network
            </span>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-ups-brown sm:text-6xl lg:text-7xl">
              Explore the GSS world map with a branded live Google view.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-ups-brown/70 sm:text-lg">
              This page keeps the same GSS visual language already used across the site while giving you a dedicated
              map surface for global network storytelling, routing context, and public location visibility.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {networkStats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-[1.75rem] border border-ups-brown/10 bg-white/90 p-5 shadow-[0_18px_45px_-35px_rgba(75,46,6,0.5)] backdrop-blur"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ups-yellow/20 text-ups-brown">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-[10px] font-black uppercase tracking-[0.25em] text-ups-brown/45">{label}</p>
                  <p className="mt-2 text-lg font-black tracking-tight text-ups-brown">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2.5rem] bg-ups-brown p-8 text-white shadow-[0_40px_90px_-45px_rgba(75,46,6,0.8)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-ups-yellow">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-ups-yellow/80">Brand Standard</p>
                  <h2 className="text-2xl font-black tracking-tight">Consistent with the current GSS look</h2>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-white/70">
                The page uses the same brown and gold palette, rounded premium cards, dense uppercase utility labels,
                and high-contrast sectional rhythm already present on the homepage and navigation.
              </p>
              <div className="mt-8 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-white/70">Map provider</span>
                  <span className="font-bold text-ups-yellow">Google Maps Embed API</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-white/70">Route path</span>
                  <span className="font-bold text-ups-yellow">/worldmap</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-white/70">Mobile ready</span>
                  <span className="font-bold text-ups-yellow">Responsive embed</span>
                </div>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-ups-yellow">
                View the network surface
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-ups-yellow-dark">Global Surface</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-ups-brown sm:text-4xl">
                Embedded world view for public logistics storytelling
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-ups-brown/65">
              The map is framed inside the same premium card system used throughout the site, so it feels like a
              natural product page instead of a disconnected widget.
            </p>
          </div>

          <GoogleWorldMapEmbed />
        </div>
      </section>
    </div>
  );
};
