"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import {
  bridges,
  evacuationRoutes,
  floodZones,
  hospitals,
  REGION_CENTER,
  rescueTeams,
  rivers,
  roads,
  shelters,
  zones,
} from "@/lib/mock-data";
import { SEVERITY_COLOR } from "@/lib/severity";
import type { LngLat } from "@/lib/types";
import { MapLegend } from "./map-legend";
import { Crosshair, Layers, Maximize2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type LayerKey =
  | "flood"
  | "rivers"
  | "roads"
  | "bridges"
  | "hospitals"
  | "shelters"
  | "teams"
  | "evac"
  | "zones";

const LAYER_LABELS: Record<LayerKey, string> = {
  flood: "Flood zones",
  rivers: "Rivers",
  roads: "Roads",
  bridges: "Bridges",
  hospitals: "Hospitals",
  shelters: "Shelters",
  teams: "Rescue teams",
  evac: "Evacuation routes",
  zones: "Risk zones",
};

const coords = (p: LngLat): [number, number] => [p.lng, p.lat];

/**
 * MapLibre dark map.
 *
 * No Mapbox token is required.
 * Uses CARTO raster tiles.
 */
const darkStyle: maplibregl.StyleSpecification = {
  version: 8,

  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap © CARTO",
    },
  },

  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#0b1220",
      },
    },

    {
      id: "carto",
      type: "raster",
      source: "carto",
      paint: {
        "raster-opacity": 0.9,
      },
    },
  ],
};

export function DisasterMap({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const mapRef = useRef<maplibregl.Map | null>(null);

  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [ready, setReady] = useState(false);

  const [layersOpen, setLayersOpen] = useState(false);

  const [visible, setVisible] = useState<Record<LayerKey, boolean>>({
    flood: true,
    rivers: true,
    roads: true,
    bridges: true,
    hospitals: true,
    shelters: true,
    teams: true,
    evac: true,
    zones: true,
  });

  /**
   * =========================================================
   * INITIALIZE MAP
   * =========================================================
   */

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      console.error("AEGISRESQ MAP: Map container not found.");

      return;
    }

    if (mapRef.current) {
      return;
    }

    console.log("AEGISRESQ MAP: Initializing MapLibre...");

    const map = new maplibregl.Map({
      container,
      style: darkStyle,

      center: coords(REGION_CENTER),

      zoom: 12.4,

      minZoom: 8,
      maxZoom: 18,

      attributionControl: false,

      cooperativeGestures: false,
    });

    mapRef.current = map;

    /**
     * ---------------------------------------------------------
     * MAP ERROR HANDLER
     * ---------------------------------------------------------
     */

    map.on("error", (event) => {
      console.error("AEGISRESQ MAPLIBRE ERROR:", event);
    });

    /**
     * ---------------------------------------------------------
     * LOAD EVENT
     * ---------------------------------------------------------
     */

    map.on("load", () => {
      console.log("AEGISRESQ MAP: Base map loaded successfully.");

      /**
       * =======================================================
       * FLOOD ZONES
       * =======================================================
       */

      if (!map.getSource("flood")) {
        map.addSource("flood", {
          type: "geojson",

          data: {
            type: "FeatureCollection",

            features: floodZones.map((fz) => ({
              type: "Feature",

              properties: {
                color: SEVERITY_COLOR[fz.severity],

                name: fz.name,
              },

              geometry: {
                type: "Polygon",

                coordinates: [
                  [...fz.polygon.map(coords), coords(fz.polygon[0])],
                ],
              },
            })),
          },
        });
      }

      if (!map.getLayer("flood-fill")) {
        map.addLayer({
          id: "flood-fill",

          type: "fill",

          source: "flood",

          paint: {
            "fill-color": ["get", "color"],

            "fill-opacity": 0.28,
          },
        });
      }

      if (!map.getLayer("flood-line")) {
        map.addLayer({
          id: "flood-line",

          type: "line",

          source: "flood",

          paint: {
            "line-color": ["get", "color"],

            "line-width": 2,

            "line-opacity": 0.9,

            "line-dasharray": [2, 1],
          },
        });
      }

      /**
       * =======================================================
       * RIVERS
       * =======================================================
       */

      if (!map.getSource("rivers")) {
        map.addSource("rivers", {
          type: "geojson",

          data: {
            type: "FeatureCollection",

            features: rivers.map((river) => ({
              type: "Feature",

              properties: {
                name: river.name,
              },

              geometry: {
                type: "LineString",

                coordinates: river.path.map(coords),
              },
            })),
          },
        });
      }

      if (!map.getLayer("rivers-line")) {
        map.addLayer({
          id: "rivers-line",

          type: "line",

          source: "rivers",

          layout: {
            "line-cap": "round",
            "line-join": "round",
          },

          paint: {
            "line-color": "#3b82f6",

            "line-width": 5,

            "line-opacity": 0.75,
          },
        });
      }

      /**
       * =======================================================
       * ROADS
       * =======================================================
       */

      if (!map.getSource("roads")) {
        map.addSource("roads", {
          type: "geojson",

          data: {
            type: "FeatureCollection",

            features: roads.map((road) => ({
              type: "Feature",

              properties: {
                color: SEVERITY_COLOR[road.status],

                name: road.name,

                id: road.id,

                status: road.status,
              },

              geometry: {
                type: "LineString",

                coordinates: road.path.map(coords),
              },
            })),
          },
        });
      }

      if (!map.getLayer("roads-line")) {
        map.addLayer({
          id: "roads-line",

          type: "line",

          source: "roads",

          layout: {
            "line-cap": "round",
            "line-join": "round",
          },

          paint: {
            "line-color": ["get", "color"],

            "line-width": 3.5,

            "line-opacity": 0.95,
          },
        });
      }

      /**
       * =======================================================
       * EVACUATION ROUTES
       * =======================================================
       */

      if (!map.getSource("evac")) {
        map.addSource("evac", {
          type: "geojson",

          data: {
            type: "FeatureCollection",

            features: evacuationRoutes.map((route) => ({
              type: "Feature",

              properties: {
                color: SEVERITY_COLOR[route.status],

                name: route.label,
              },

              geometry: {
                type: "LineString",

                coordinates: route.path.map(coords),
              },
            })),
          },
        });
      }

      if (!map.getLayer("evac-line")) {
        map.addLayer({
          id: "evac-line",

          type: "line",

          source: "evac",

          layout: {
            "line-cap": "round",
            "line-join": "round",
          },

          paint: {
            "line-color": ["get", "color"],

            "line-width": 3,

            "line-opacity": 0.9,

            "line-dasharray": [1.5, 1],
          },
        });
      }

      /**
       * =======================================================
       * ROAD CLICK
       * =======================================================
       */

      map.on("click", "roads-line", (event) => {
        const feature = event.features?.[0];

        if (!feature) return;

        const properties = feature.properties as {
          name?: string;
          id?: string;
          status?: string;
        };

        new maplibregl.Popup({
          offset: 12,
          closeButton: true,
        })
          .setLngLat(event.lngLat)

          .setHTML(
            `
              <div
                style="
                  padding:10px 12px;
                  min-width:160px;
                  color:#e5e7eb;
                  background:#111827;
                "
              >
                <div
                  style="
                    font-size:10px;
                    color:#94a3b8;
                    margin-bottom:4px;
                  "
                >
                  ${properties.id ?? ""}
                </div>

                <div
                  style="
                    font-size:13px;
                    font-weight:700;
                    margin-bottom:5px;
                  "
                >
                  ${properties.name ?? "Road"}
                </div>

                <div
                  style="
                    font-size:10px;
                    text-transform:uppercase;
                    color:#94a3b8;
                  "
                >
                  Status:
                  ${properties.status ?? "unknown"}
                </div>
              </div>
            `,
          )

          .addTo(map);
      });

      map.on("mouseenter", "roads-line", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "roads-line", () => {
        map.getCanvas().style.cursor = "";
      });

      /**
       * =======================================================
       * MAP READY
       * =======================================================
       */

      setReady(true);

      /**
       * Make sure dimensions are correct.
       */
      setTimeout(() => {
        map.resize();
      }, 100);
    });

    /**
     * ResizeObserver makes the map responsive when
     * the dashboard/container changes size.
     */

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(container);

    /**
     * CLEANUP
     */

    return () => {
      console.log("AEGISRESQ MAP: Destroying map...");

      resizeObserver.disconnect();

      markersRef.current.forEach((marker) => marker.remove());

      markersRef.current = [];

      map.remove();

      mapRef.current = null;

      setReady(false);
    };
  }, []);

  /**
   * =========================================================
   * CREATE MARKERS
   * =========================================================
   */

  useEffect(() => {
    const map = mapRef.current;

    if (!map || !ready) {
      return;
    }

    console.log("AEGISRESQ MAP: Creating operational markers...");

    /**
     * Remove old markers.
     */

    markersRef.current.forEach((marker) => marker.remove());

    markersRef.current = [];

    /**
     * ---------------------------------------------------------
     * GENERIC MARKER
     * ---------------------------------------------------------
     */

    const addMarker = (
      location: LngLat,
      html: string,
      popupHtml: string,
      layer: LayerKey,
    ) => {
      const element = document.createElement("div");

      element.innerHTML = html;

      element.style.cursor = "pointer";

      element.dataset.layer = layer;

      const marker = new maplibregl.Marker({
        element,
        anchor: "center",
      })
        .setLngLat(coords(location))

        .setPopup(
          new maplibregl.Popup({
            offset: 16,

            closeButton: true,
          }).setHTML(popupHtml),
        )

        .addTo(map);

      /**
       * Respect current layer state.
       */

      if (!visible[layer]) {
        element.style.display = "none";
      }

      markersRef.current.push(marker);
    };

    /**
     * ---------------------------------------------------------
     * PIN DESIGN
     * ---------------------------------------------------------
     */

    const pin = (color: string, glyph: string, ring = false) => `
      <div
        style="
          display:flex;
          align-items:center;
          justify-content:center;

          width:26px;
          height:26px;

          border-radius:7px;

          background:${color};

          color:#07111f;

          font-size:12px;

          font-weight:900;

          border:2px solid rgba(255,255,255,.12);

          box-shadow:
            0 2px 6px rgba(0,0,0,.65);

          ${
            ring
              ? `
                outline:2px solid ${color};
                outline-offset:3px;
              `
              : ""
          }
        "
      >
        ${glyph}
      </div>
    `;

    /**
     * =======================================================
     * BRIDGES
     * =======================================================
     */

    bridges.forEach((bridge) => {
      addMarker(
        bridge.location,

        pin(
          SEVERITY_COLOR[bridge.status],

          "╫",

          bridge.status === "critical",
        ),

        `
          <div
            style="
              padding:12px;
              min-width:200px;
              color:#e5e7eb;
            "
          >
            <div
              style="
                display:flex;
                justify-content:space-between;
                gap:15px;
                margin-bottom:8px;
              "
            >
              <span
                style="
                  font-weight:800;
                  font-size:13px;
                "
              >
                Bridge ${bridge.id}
              </span>

              <span
                style="
                  font-size:10px;
                  font-weight:800;
                  text-transform:uppercase;
                  color:${SEVERITY_COLOR[bridge.status]};
                "
              >
                ${bridge.status}
              </span>
            </div>

            <div
              style="
                font-size:11px;
                color:#94a3b8;
                margin-bottom:10px;
              "
            >
              ${bridge.name}
            </div>

            <div
              style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;
                font-size:11px;
              "
            >
              <div>
                <div style="color:#94a3b8">
                  Structural Risk
                </div>

                <strong>
                  ${bridge.structuralRisk}%
                </strong>
              </div>

              <div>
                <div style="color:#94a3b8">
                  Failure Prob.
                </div>

                <strong>
                  ${bridge.failureProbability}%
                </strong>
              </div>

              <div>
                <div style="color:#94a3b8">
                  River Level
                </div>

                <strong>
                  ${bridge.riverLevel} m
                </strong>
              </div>

              <div>
                <div style="color:#94a3b8">
                  Status
                </div>

                <strong
                  style="
                    color:${SEVERITY_COLOR[bridge.status]};
                  "
                >
                  ${bridge.status.toUpperCase()}
                </strong>
              </div>
            </div>
          </div>
        `,

        "bridges",
      );
    });

    /**
     * =======================================================
     * HOSPITALS
     * =======================================================
     */

    hospitals.forEach((hospital) => {
      addMarker(
        hospital.location,

        pin(
          SEVERITY_COLOR[hospital.status],

          "✚",
        ),

        `
          <div
            style="
              padding:12px;
              min-width:180px;
              color:#e5e7eb;
            "
          >
            <div
              style="
                font-weight:800;
                font-size:13px;
              "
            >
              ${hospital.id} · Hospital
            </div>

            <div
              style="
                font-size:11px;
                color:#94a3b8;
                margin:5px 0 8px;
              "
            >
              ${hospital.name}
            </div>

            <div style="font-size:11px">
              Occupancy:
              <strong>
                ${hospital.occupancy}/${hospital.capacity}
              </strong>
            </div>

            <div
              style="
                font-size:11px;
                margin-top:4px;
              "
            >
              Risk:

              <strong
                style="
                  color:${SEVERITY_COLOR[hospital.status]};
                "
              >
                ${hospital.risk}%
              </strong>
            </div>
          </div>
        `,

        "hospitals",
      );
    });

    /**
     * =======================================================
     * SHELTERS
     * =======================================================
     */

    shelters.forEach((shelter) => {
      addMarker(
        shelter.location,

        pin(
          SEVERITY_COLOR[shelter.status],

          "⌂",
        ),

        `
          <div
            style="
              padding:12px;
              min-width:180px;
              color:#e5e7eb;
            "
          >
            <div
              style="
                font-weight:800;
                font-size:13px;
              "
            >
              ${shelter.id} · Shelter
            </div>

            <div
              style="
                font-size:11px;
                color:#94a3b8;
                margin:5px 0 8px;
              "
            >
              ${shelter.name}
            </div>

            <div style="font-size:11px">
              Occupancy:

              <strong>
                ${shelter.occupancy}/${shelter.capacity}
              </strong>
            </div>
          </div>
        `,

        "shelters",
      );
    });

    /**
     * =======================================================
     * RESCUE TEAMS
     * =======================================================
     */

    rescueTeams
      .filter(
        (team) =>
          ["en-route", "busy"].includes(team.status) || team.id === "T02",
      )

      .forEach((team) => {
        const destination = team.destinationZoneId
          ? `Destination: Zone ${team.destinationZoneId}`
          : "";

        const eta = team.etaMinutes ? `ETA: ${team.etaMinutes} min` : "";

        addMarker(
          team.location,

          `
            <div
              style="
                display:flex;
                align-items:center;
                justify-content:center;

                width:24px;
                height:24px;

                border-radius:50%;

                background:#3b82f6;

                color:#fff;

                font-size:10px;

                font-weight:900;

                border:2px solid #0b1220;

                box-shadow:
                  0 2px 7px rgba(0,0,0,.7);
              "
            >
              ${team.id.replace("T", "")}
            </div>
          `,

          `
            <div
              style="
                padding:12px;
                min-width:180px;
                color:#e5e7eb;
              "
            >
              <div
                style="
                  font-weight:800;
                  font-size:13px;
                "
              >
                ${team.name}
              </div>

              <div
                style="
                  font-size:11px;
                  margin-top:5px;
                "
              >
                Status:

                <strong
                  style="
                    text-transform:uppercase;
                  "
                >
                  ${team.status.replace("-", " ")}
                </strong>
              </div>

              ${
                destination
                  ? `
                    <div
                      style="
                        font-size:11px;
                        margin-top:3px;
                      "
                    >
                      ${destination}
                    </div>
                  `
                  : ""
              }

              ${
                eta
                  ? `
                    <div
                      style="
                        font-size:11px;
                        margin-top:3px;
                      "
                    >
                      ${eta}
                    </div>
                  `
                  : ""
              }
            </div>
          `,

          "teams",
        );
      });

    /**
     * =======================================================
     * ZONE LABELS
     * =======================================================
     */

    zones.forEach((zone) => {
      addMarker(
        zone.center,

        `
          <div
            style="
              padding:3px 7px;

              border-radius:5px;

              background:rgba(11,18,32,.92);

              border:1px solid ${SEVERITY_COLOR[zone.status]};

              color:${SEVERITY_COLOR[zone.status]};

              font-size:10px;

              font-weight:800;

              white-space:nowrap;

              box-shadow:
                0 2px 5px rgba(0,0,0,.5);
            "
          >
            ${zone.id} · ${zone.risk}%
          </div>
        `,

        `
          <div
            style="
              padding:12px;
              min-width:190px;
              color:#e5e7eb;
            "
          >
            <div
              style="
                font-weight:800;
                font-size:13px;
              "
            >
              ${zone.id} · ${zone.name}
            </div>

            <div
              style="
                font-size:11px;
                color:#94a3b8;
                margin-top:6px;
              "
            >
              Population:
              ${zone.population.toLocaleString()}
            </div>

            <div
              style="
                font-size:11px;
                margin-top:5px;
              "
            >
              Overall risk:

              <strong
                style="
                  color:${SEVERITY_COLOR[zone.status]};
                "
              >
                ${zone.risk}%
              </strong>
            </div>

            <div
              style="
                font-size:11px;
                margin-top:4px;
              "
            >
              Isolation probability:

              <strong>
                ${zone.isolationProbability}%
              </strong>
            </div>
          </div>
        `,

        "zones",
      );
    });

    console.log(`AEGISRESQ MAP: ${markersRef.current.length} markers created.`);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());

      markersRef.current = [];
    };
  }, [ready]);

  /**
   * =========================================================
   * LAYER TOGGLE
   * =========================================================
   */

  const toggleLayer = (key: LayerKey) => {
    const map = mapRef.current;

    if (!map) return;

    const next = !visible[key];

    setVisible((current) => ({
      ...current,

      [key]: next,
    }));

    const visibility = next ? "visible" : "none";

    /**
     * GeoJSON layers.
     */

    const layerMap: Record<LayerKey, string[]> = {
      flood: ["flood-fill", "flood-line"],

      rivers: ["rivers-line"],

      roads: ["roads-line"],

      bridges: [],

      hospitals: [],

      shelters: [],

      teams: [],

      evac: ["evac-line"],

      zones: [],
    };

    layerMap[key].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visibility);
      }
    });

    /**
     * HTML markers.
     */

    markersRef.current.forEach((marker) => {
      const element = marker.getElement();

      if (element.dataset.layer === key) {
        element.style.display = next ? "" : "none";
      }
    });
  };

  /**
   * =========================================================
   * MAP CONTROLS
   * =========================================================
   */

  const zoomIn = () => {
    mapRef.current?.zoomIn({
      duration: 300,
    });
  };

  const zoomOut = () => {
    mapRef.current?.zoomOut({
      duration: 300,
    });
  };

  const recenter = () => {
    mapRef.current?.flyTo({
      center: coords(REGION_CENTER),

      zoom: 12.4,

      duration: 700,
    });
  };

  /**
   * =========================================================
   * FULLSCREEN
   * =========================================================
   */

  const fullscreen = async () => {
    const element = containerRef.current?.parentElement;

    if (!element) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen?.();
      }

      setTimeout(() => {
        mapRef.current?.resize();
      }, 300);
    } catch (error) {
      console.error("AEGISRESQ fullscreen error:", error);
    }
  };

  /**
   * Resize map whenever fullscreen state changes.
   */

  useEffect(() => {
    const handleFullscreen = () => {
      setTimeout(() => {
        mapRef.current?.resize();
      }, 200);
    };

    document.addEventListener("fullscreenchange", handleFullscreen);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreen);
    };
  }, []);

  /**
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-[#0b1220]",
        className,
      )}
    >
      {/* MAP CONTAINER */}

      <div ref={containerRef} className="absolute inset-0" />

      {/* LOADING */}

      {!ready && (
        <div
          className="
            absolute
            inset-0
            z-20
            flex
            items-center
            justify-center
            bg-[#0b1220]
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-md
              border
              border-border
              bg-card
              px-4
              py-3
              text-xs
              text-muted-foreground
            "
          >
            <span
              className="
                h-3
                w-3
                animate-spin
                rounded-full
                border-2
                border-primary
                border-t-transparent
              "
            />
            Loading tactical map…
          </div>
        </div>
      )}

      {/* =====================================================
          CONTROLS
      ====================================================== */}

      <div
        className="
          absolute
          right-3
          top-3
          z-30
          flex
          flex-col
          gap-1.5
        "
      >
        {/* ZOOM */}

        <div
          className="
            flex
            flex-col
            overflow-hidden
            rounded-md
            border
            border-border
            bg-card
            shadow-lg
          "
        >
          <button
            onClick={zoomIn}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              text-muted-foreground
              transition-colors
              hover:bg-accent
              hover:text-foreground
            "
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            onClick={zoomOut}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              border-t
              border-border
              text-muted-foreground
              transition-colors
              hover:bg-accent
              hover:text-foreground
            "
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* RECENTER */}

        <button
          onClick={recenter}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-md
            border
            border-border
            bg-card
            text-muted-foreground
            shadow-lg
            transition-colors
            hover:bg-accent
            hover:text-foreground
          "
          aria-label="Locate region"
        >
          <Crosshair className="h-4 w-4" />
        </button>

        {/* LAYERS */}

        <div className="relative">
          <button
            onClick={() => setLayersOpen((open) => !open)}
            className={cn(
              `
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                border
                border-border
                bg-card
                text-muted-foreground
                shadow-lg
                transition-colors
                hover:bg-accent
                hover:text-foreground
              `,

              layersOpen && "border-primary/50 text-primary",
            )}
            aria-label="Toggle layers"
            aria-expanded={layersOpen}
          >
            <Layers className="h-4 w-4" />
          </button>

          {layersOpen && (
            <div
              className="
                absolute
                right-9
                top-0
                w-48
                rounded-md
                border
                border-border
                bg-popover
                p-1.5
                shadow-2xl
              "
            >
              <p
                className="
                  px-1.5
                  py-1
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-muted-foreground
                "
              >
                Map Layers
              </p>

              {(Object.keys(LAYER_LABELS) as LayerKey[]).map((key) => (
                <label
                  key={key}
                  className="
                    flex
                    cursor-pointer
                    items-center
                    gap-2
                    rounded
                    px-1.5
                    py-1.5
                    text-[12px]
                    text-foreground
                    hover:bg-accent
                  "
                >
                  <input
                    type="checkbox"
                    checked={visible[key]}
                    onChange={() => toggleLayer(key)}
                    className="
                      h-3.5
                      w-3.5
                      accent-primary
                    "
                  />

                  {LAYER_LABELS[key]}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* FULLSCREEN */}

        <button
          onClick={fullscreen}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-md
            border
            border-border
            bg-card
            text-muted-foreground
            shadow-lg
            transition-colors
            hover:bg-accent
            hover:text-foreground
          "
          aria-label="Fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>

      {/* =====================================================
          LEGEND
      ====================================================== */}

      <div
        className="
          absolute
          bottom-3
          left-3
          z-30
        "
      >
        <MapLegend />
      </div>

      {/* =====================================================
          DEBUG STATUS
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-3
          bottom-3
          z-20
          rounded
          border
          border-border
          bg-black/60
          px-2
          py-1
          font-mono
          text-[9px]
          text-muted-foreground
          backdrop-blur
        "
      >
        MAPLIBRE · {ready ? "ONLINE" : "LOADING"}
      </div>
    </div>
  );
}
