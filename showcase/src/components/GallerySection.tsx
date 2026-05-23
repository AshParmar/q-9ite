"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": any;
    }
  }
}

const galleryItems = [
  {
    id: "seed42",
    title: "Stylized Robot Mascot",
    prompt: "a cute stylized robot mascot, round body, thick arms and legs, glossy metal surface, full body centered, studio lighting",
    image: "/assets/outputs/images/seed_42.png",
    glb: "/assets/outputs/processed_meshes/seed_42/mesh.glb",
    params: { seed: 42, guidance: 7.5, steps: 30, meshRes: 512 },
    metrics: { vertices: "274,978", faces: "335,776", watertight: false, uvTexture: true },
    tag: "Best Result",
    tagColor: "#6366f1",
  },
  {
    id: "seed999",
    title: "High-Stylization Variant",
    prompt: "a cute stylized robot mascot, round body, thick arms and legs, glossy metal surface, full body centered, studio lighting",
    image: "/assets/outputs/images/seed_999.png",
    glb: "/assets/outputs/processed_meshes/seed_999 copy/mesh.glb",
    params: { seed: 999, guidance: 12.0, steps: 30, meshRes: 256 },
    metrics: { vertices: "~98k", faces: "~120k", watertight: false, uvTexture: true },
    tag: "High Guidance",
    tagColor: "#e879f9",
  },
  {
    id: "mesh128",
    title: "Draft Mesh (Res 128)",
    prompt: "Robot mascot — low-resolution draft",
    image: "/assets/experiments/mesh_quality/mesh_res_128/seed_42.png",
    glb: "/assets/experiments/mesh_quality/mesh_res_128/seed_42.glb",
    params: { seed: 42, guidance: 7.5, steps: 30, meshRes: 128 },
    metrics: { vertices: "~18k", faces: "~22k", watertight: false, uvTexture: true },
    tag: "Res 128",
    tagColor: "#f59e0b",
  },
  {
    id: "mesh256",
    title: "Standard Mesh (Res 256)",
    prompt: "Robot mascot — standard quality",
    image: "/assets/experiments/mesh_quality/mesh_res_256/seed_42.png",
    glb: "/assets/experiments/mesh_quality/mesh_res_256/seed_42.glb",
    params: { seed: 42, guidance: 7.5, steps: 30, meshRes: 256 },
    metrics: { vertices: "~72k", faces: "~88k", watertight: false, uvTexture: true },
    tag: "Res 256",
    tagColor: "#22d3ee",
  },
];

function ModelViewer({ glb, title }: { glb: string; title: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ width: "100%", height: 320, position: "relative", borderRadius: 12, overflow: "hidden" }}>
      {loading && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "rgba(10,10,18,0.8)",
          zIndex: 2, gap: "0.75rem",
        }}>
          <div style={{
            width: 32, height: 32, border: "3px solid var(--border)",
            borderTopColor: "var(--accent-primary)", borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Loading 3D model...</span>
        </div>
      )}
      <model-viewer
        src={glb}
        alt={title}
        auto-rotate
        camera-controls
        shadow-intensity="1"
        exposure="1.2"
        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
        onLoad={() => setLoading(false)}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function GallerySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<(typeof galleryItems)[0] | null>(null);

  return (
    <section
      id="gallery"
      ref={ref}
      style={{ padding: "6rem 0", position: "relative" }}
    >
      <div className="section-divider" />
      <div style={{ padding: "6rem 0 0" }}>
        <div className="section-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            style={{ marginBottom: "3rem" }}
          >
            <div className="section-tag">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-cyan)", display: "inline-block" }} />
              3D Showcase
            </div>
            <h2 className="section-title">
              Interactive <span className="gradient-text">Mesh Gallery</span>
            </h2>
            <p className="section-subtitle">
              Every mesh was generated entirely by the pipeline — from text prompt to rotatable 3D model.
              Click any card to explore in detail.
            </p>
          </motion.div>

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {galleryItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i }}
                className="card-glass"
                style={{ padding: "1.25rem", cursor: "pointer", position: "relative" }}
                onClick={() => setSelected(item)}
              >
                {/* Tag */}
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    padding: "0.25rem 0.65rem",
                    background: `${item.tagColor}20`,
                    border: `1px solid ${item.tagColor}40`,
                    borderRadius: 100,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: item.tagColor,
                    zIndex: 2,
                  }}
                >
                  {item.tag}
                </div>

                {/* Preview image */}
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    borderRadius: 10,
                    marginBottom: "1rem",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      padding: "0.5rem",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    fontSize: "2.5rem",
                    zIndex: -1,
                  }}>
                    🔷
                  </div>
                  {/* View 3D overlay */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(99,102,241,0)",
                    transition: "background 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                    className="gallery-hover-overlay"
                  >
                    <span style={{
                      background: "var(--accent-primary)",
                      color: "white",
                      padding: "0.5rem 1.25rem",
                      borderRadius: 8,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      opacity: 0,
                      transition: "opacity 0.3s",
                    }}
                      className="gallery-hover-btn"
                    >
                      View 3D Model
                    </span>
                  </div>
                </div>

                <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>
                  {item.title}
                </h3>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {Object.entries(item.params).map(([k, v]) => (
                    <span
                      key={k}
                      style={{
                        padding: "0.2rem 0.6rem",
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 6,
                        fontSize: "0.72rem",
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {k}: {v}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {item.metrics.vertices} vertices · {item.metrics.faces} faces
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(16px)",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1.5rem",
              }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-accent)",
                  borderRadius: 20,
                  width: "100%",
                  maxWidth: 900,
                  maxHeight: "90vh",
                  overflow: "auto",
                  padding: "2rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                  <div>
                    <span style={{
                      padding: "0.25rem 0.75rem",
                      background: `${selected.tagColor}20`,
                      borderRadius: 100,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: selected.tagColor,
                      marginBottom: "0.5rem",
                      display: "inline-block",
                    }}>
                      {selected.tag}
                    </span>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{selected.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      width: 36,
                      height: 36,
                      cursor: "pointer",
                      color: "var(--text-secondary)",
                      fontSize: "1.2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {/* 3D Viewer */}
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>
                      INTERACTIVE 3D MODEL
                    </div>
                    <ModelViewer glb={selected.glb} title={selected.title} />
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.5rem", textAlign: "center" }}>
                      Drag to rotate · Scroll to zoom
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontFamily: "var(--font-mono)" }}>
                        PROMPT
                      </div>
                      <div style={{
                        padding: "0.75rem",
                        background: "rgba(99,102,241,0.06)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: 8,
                        fontSize: "0.85rem",
                        color: "var(--accent-secondary)",
                        fontFamily: "var(--font-mono)",
                        lineHeight: 1.6,
                      }}>
                        "{selected.prompt}"
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem", fontFamily: "var(--font-mono)" }}>
                        PARAMETERS
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                        {Object.entries(selected.params).map(([k, v]) => (
                          <div key={k} style={{
                            padding: "0.75rem",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                          }}>
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{k}</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)", marginTop: "0.25rem" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem", fontFamily: "var(--font-mono)" }}>
                        MESH METRICS
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {[
                          { label: "Vertices", value: selected.metrics.vertices },
                          { label: "Faces", value: selected.metrics.faces },
                          { label: "Watertight", value: selected.metrics.watertight ? "✓ Yes" : "✗ No", warn: !selected.metrics.watertight },
                          { label: "UV Texture", value: selected.metrics.uvTexture ? "✓ Present" : "✗ Missing" },
                        ].map((m) => (
                          <div key={m.label} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "0.6rem 0.75rem",
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid var(--border)",
                            borderRadius: 6,
                          }}>
                            <span style={{ fontSize: "0.83rem", color: "var(--text-secondary)" }}>{m.label}</span>
                            <span style={{
                              fontSize: "0.83rem",
                              fontFamily: "var(--font-mono)",
                              color: "warn" in m && m.warn ? "#f59e0b" : "var(--accent-secondary)",
                            }}>
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          .card-glass:hover .gallery-hover-overlay {
            background: rgba(99,102,241,0.15) !important;
          }
          .card-glass:hover .gallery-hover-btn {
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </section>
  );
}
