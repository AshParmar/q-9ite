"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type ExperimentTab = "steps" | "guidance" | "mesh";

const experiments: Record<ExperimentTab, {
  title: string;
  description: string;
  finding: string;
  rows: { label: string; values: { key: string; img: string; desc: string }[] }[];
}> = {
  steps: {
    title: "Inference Steps",
    description: "How the number of denoising steps affects image quality, detail, and texture clarity.",
    finding: "Steps 15→30 shows a big quality jump. Steps 30→50 gives diminishing returns for simple shapes but improves texture clarity.",
    rows: [
      {
        label: "Seed 42",
        values: [
          { key: "Steps 15", img: "/assets/experiments/steps_variation/steps_15/seed_42.png", desc: "Noisy, rough edges" },
          { key: "Steps 30", img: "/assets/experiments/steps_variation/steps_30/seed_42.png", desc: "Clean silhouette" },
          { key: "Steps 50", img: "/assets/experiments/steps_variation/steps_50/seed_42.png", desc: "Smooth textures" },
        ],
      },
      {
        label: "Seed 123",
        values: [
          { key: "Steps 15", img: "/assets/experiments/steps_variation/steps_15/seed_123.png", desc: "Low detail" },
          { key: "Steps 30", img: "/assets/experiments/steps_variation/steps_30/seed_123.png", desc: "Balanced" },
          { key: "Steps 50", img: "/assets/experiments/steps_variation/steps_50/seed_123.png", desc: "High detail" },
        ],
      },
      {
        label: "Seed 999",
        values: [
          { key: "Steps 15", img: "/assets/experiments/steps_variation/steps_15/seed_999.png", desc: "Artifacts visible" },
          { key: "Steps 30", img: "/assets/experiments/steps_variation/steps_30/seed_999.png", desc: "Stylized clean" },
          { key: "Steps 50", img: "/assets/experiments/steps_variation/steps_50/seed_999.png", desc: "Detailed" },
        ],
      },
    ],
  },
  guidance: {
    title: "Guidance Scale",
    description: "How prompt adherence (CFG scale) changes the style — from dreamy/creative to strict/high-contrast.",
    finding: "Guidance 5.0 → dreamy, ill-defined edges (bad for 3D). Guidance 12.0 → sharp silhouettes, ideal for TripoSR reconstruction.",
    rows: [
      {
        label: "Seed 42",
        values: [
          { key: "Guidance 5.0", img: "/assets/experiments/guidance_variation/guidance_5.0/seed_42.png", desc: "Dreamy, soft" },
          { key: "Guidance 7.5", img: "/assets/experiments/guidance_variation/guidance_7.5/seed_42.png", desc: "Balanced default" },
          { key: "Guidance 12.0", img: "/assets/experiments/guidance_variation/guidance_12.0/seed_42.png", desc: "Sharp, high contrast" },
        ],
      },
      {
        label: "Seed 123",
        values: [
          { key: "Guidance 5.0", img: "/assets/experiments/guidance_variation/guidance_5.0/seed_123.png", desc: "Creative, noisy" },
          { key: "Guidance 7.5", img: "/assets/experiments/guidance_variation/guidance_7.5/seed_123.png", desc: "Natural look" },
          { key: "Guidance 12.0", img: "/assets/experiments/guidance_variation/guidance_12.0/seed_123.png", desc: "Stylized game asset" },
        ],
      },
      {
        label: "Seed 999",
        values: [
          { key: "Guidance 5.0", img: "/assets/experiments/guidance_variation/guidance_5.0/seed_999.png", desc: "Over-creative" },
          { key: "Guidance 7.5", img: "/assets/experiments/guidance_variation/guidance_7.5/seed_999.png", desc: "Good baseline" },
          { key: "Guidance 12.0", img: "/assets/experiments/guidance_variation/guidance_12.0/seed_999.png", desc: "Best for reconstruction" },
        ],
      },
    ],
  },
  mesh: {
    title: "Mesh Resolution",
    description: "How Marching Cubes resolution affects geometric fidelity, face count, and \"blobbiness\".",
    finding: "Resolution 128 → fast but blobby geometry. Resolution 256 → significant improvement. Resolution 512 → best quality, ~335k faces, highest compute cost.",
    rows: [
      {
        label: "Seed 42",
        values: [
          { key: "Res 128", img: "/assets/experiments/mesh_quality/mesh_res_128/seed_42.png", desc: "~22k faces, blobby" },
          { key: "Res 256", img: "/assets/experiments/mesh_quality/mesh_res_256/seed_42.png", desc: "~88k faces, clean" },
          { key: "Res 512 (Blender)", img: "/assets/experiments/blender_ss/Screenshot 2025-12-06 193810.png", desc: "335k faces, highest detail" },
        ],
      },
      {
        label: "Seed 123",
        values: [
          { key: "Res 128", img: "/assets/experiments/mesh_quality/mesh_res_128/seed_123.png", desc: "Draft quality" },
          { key: "Res 256", img: "/assets/experiments/mesh_quality/mesh_res_256/seed_123.png", desc: "Standard quality" },
          { key: "Blender View", img: "/assets/experiments/blender_ss/Screenshot 2025-12-06 175006.png", desc: "Topology analysis" },
        ],
      },
    ],
  },
};

const tabInfo: { key: ExperimentTab; label: string; icon: string }[] = [
  { key: "steps", label: "Inference Steps", icon: "📈" },
  { key: "guidance", label: "Guidance Scale", icon: "🎯" },
  { key: "mesh", label: "Mesh Resolution", icon: "🔷" },
];

export default function ExperimentsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState<ExperimentTab>("steps");

  const exp = experiments[activeTab];

  return (
    <section
      id="experiments"
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
          >
            <div className="section-tag">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-violet)", display: "inline-block" }} />
              Research
            </div>
            <h2 className="section-title">
              Experiment <span className="gradient-text">Dashboard</span>
            </h2>
            <p className="section-subtitle">
              Controlled parameter sweeps to understand how each variable affects
              output quality — the research behind the results.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              gap: "0.75rem",
              margin: "2.5rem 0",
              flexWrap: "wrap",
            }}
          >
            {tabInfo.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "0.65rem 1.5rem",
                  borderRadius: 10,
                  border: `1px solid ${activeTab === tab.key ? "var(--accent-primary)" : "var(--border)"}`,
                  background: activeTab === tab.key ? "var(--accent-primary)" : "transparent",
                  color: activeTab === tab.key ? "white" : "var(--text-secondary)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Key finding banner */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              padding: "1rem 1.5rem",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 12,
              marginBottom: "2rem",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-secondary)", marginBottom: "0.25rem", letterSpacing: "0.05em" }}>
                KEY FINDING
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {exp.finding}
              </div>
            </div>
          </motion.div>

          {/* Comparison grids */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {exp.rows.map((row, ri) => (
              <motion.div
                key={row.label + activeTab}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * ri }}
              >
                <div style={{
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: "var(--accent-primary)", color: "white",
                    fontSize: "0.65rem", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {ri + 1}
                  </span>
                  {row.label}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${row.values.length}, 1fr)`,
                    gap: "1rem",
                  }}
                >
                  {row.values.map((v) => (
                    <div key={v.key} className="card-glass" style={{ padding: "0.75rem", overflow: "hidden" }}>
                      <div style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--accent-secondary)",
                        fontFamily: "var(--font-mono)",
                        marginBottom: "0.5rem",
                      }}>
                        {v.key}
                      </div>
                      <div style={{
                        width: "100%",
                        aspectRatio: "1",
                        borderRadius: 8,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.03)",
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.img}
                          alt={v.key}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          onError={(e) => {
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) parent.style.background = "rgba(99,102,241,0.06)";
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {v.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: "3rem",
              padding: "1.5rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: "1rem" }}>
              FULL EXPERIMENT MATRIX
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr>
                    {["Parameter", "Values Tested", "Best Setting", "Observation"].map((h) => (
                      <th key={h} style={{
                        textAlign: "left",
                        padding: "0.75rem 1rem",
                        background: "rgba(99,102,241,0.08)",
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                        fontSize: "0.78rem",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid var(--border)",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { param: "Inference Steps", values: "15, 30, 50", best: "30", obs: "30→50 gives diminishing returns" },
                    { param: "Guidance Scale", values: "5.0, 7.5, 12.0", best: "12.0", obs: "Higher = sharper edges for 3D" },
                    { param: "Seed", values: "42, 123, 999", best: "999", obs: "Highly stylized with unique geometry" },
                    { param: "Image Resolution", values: "512×512, 768×768", best: "512×512", obs: "768 slower, marginal gain" },
                    { param: "Mesh Resolution", values: "128, 256, 512", best: "512", obs: "256→512 big quality jump" },
                  ].map((row, i) => (
                    <tr key={row.param} style={{ borderBottom: "1px solid var(--border)" }}>
                      {[row.param, row.values, row.best, row.obs].map((cell, ci) => (
                        <td key={ci} style={{
                          padding: "0.75rem 1rem",
                          color: ci === 2 ? "var(--accent-secondary)" : "var(--text-secondary)",
                          fontFamily: ci === 1 || ci === 2 ? "var(--font-mono)" : "inherit",
                          fontSize: "0.82rem",
                          background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
