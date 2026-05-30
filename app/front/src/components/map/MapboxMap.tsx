import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
export const BRAZIL_CENTER: [number, number] = [-47.9, -15.8];

type MapboxMapProps = {
  className?: string;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
};

export const MapboxMap = ({
  className,
  center = BRAZIL_CENTER,
  zoom = 4,
  interactive = true,
}: MapboxMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainerRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center,
      zoom,
      interactive,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom, interactive]);

  if (MAPBOX_TOKEN) {
    return (
      <div ref={mapContainerRef} className={cn("overflow-hidden", className)} />
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 border border-dashed border-neutral-300 bg-neutral-50 text-center",
        className,
      )}
    >
      <MapPin className="h-10 w-10 text-muted-foreground" />
      <p className="max-w-xs text-sm text-muted-foreground">Indisponível</p>
    </div>
  );
};
