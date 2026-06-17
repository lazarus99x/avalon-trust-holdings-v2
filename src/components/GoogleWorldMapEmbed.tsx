import React from 'react';
import { ExternalLink, Globe2, MapPin } from 'lucide-react';

const GOOGLE_WORLD_QUERY = 'ATH logistics hubs worldwide';

export const GoogleWorldMapEmbed: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${encodeURIComponent(GOOGLE_WORLD_QUERY)}&zoom=2`
    : null;

  if (!embedUrl) {
    return (
      <div className="rounded-[2rem] border border-dashed border-ups-brown/20 bg-white p-8 sm:p-10 text-ups-brown">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ups-yellow/20 text-ups-brown">
            <Globe2 className="h-7 w-7" />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-ups-yellow-dark">
                Google Maps Setup
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-tight">
                Add your public embed key to enable the world map.
              </h3>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-ups-brown/70">
              Set <code>VITE_GOOGLE_MAPS_API_KEY</code> in your local environment with a Google Maps Embed API key,
              then reload the app. The page is already wired to render the map once the key is available.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-ups-brown/60">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                <MapPin className="h-3.5 w-3.5" />
                Query: ATH logistics hubs worldwide
              </span>
              <a
                href="https://developers.google.com/maps/documentation/embed/get-started"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-ups-brown px-4 py-2 text-ups-yellow transition-opacity hover:opacity-90"
              >
                Maps Embed Docs
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-ups-brown/10 bg-white shadow-[0_30px_80px_-40px_rgba(75,46,6,0.45)]">
      <iframe
        title="ATH World Map"
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[420px] w-full sm:h-[560px] lg:h-[680px]"
      />
    </div>
  );
};
