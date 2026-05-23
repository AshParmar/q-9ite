"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const challenges = [
  {
    icon: "🔮",
    title: "Single-View Reconstruction Limitations",
    problem: "TripoSR reconstructs geometry from only ONE image. The model has no information about occluded regions, making the back of objects geometrically inconsistent.",
    impact: "Generated meshes are not watertight — surfaces have holes on the non-visible side. Euler number anomalies indicate poor topological structure.",
    solution: "Future: Multi-view generation (MVDream / Zero123) to provide 4 orthogonal views before meshing.",
    severity: "high",
  },
  {
    icon: "💧",
    title: "Non-Watertight Mesh Topology",
    problem: "All generated meshes failed the watertight check. A watertight mesh is required for 3D printing, physics simulations, and some rendering engines.",
    impact: "The meshes are suitable for visual rendering and portfolio display but not for production game engines that require watertight geometry.",
    solution: "Integrate Manifold or Open3D mesh repair post-processing to close holes automatically.",
    severity: "high",
  },
  {
    icon: "🖥️",
    title: "GPU Memory Constraints",
    problem: "Running both Stable Diffusion AND TripoSR on a consumer GPU (8GB VRAM) required careful model offloading. Both models couldn't remain in memory simultaneously.",
    impact: "Required CPU offloading between pipeline stages, adding ~8s latency per run. Resolution limited to 512×512 for stable inference.",
    solution: "Implement streaming inference with model quantization (INT8/FP16) or use pipeline-level GPU scheduling.",
    severity: "medium",
  },
  {
    icon: "🎨",
    title: "Texture Inconsistency",
    problem: "The baked diffuse texture often doesn't align perfectly with the mesh UV layout when objects have complex silhouettes. Seams and stretching appear on curved surfaces.",
    impact: "Visible texture artifacts on cylindrical and organic-shaped objects. Limited to diffuse map — no PBR (Normal, Roughness, Metallic).",
    solution: "Generate PBR texture maps via specialized models. Use UV-aware texture baking from multi-view inputs.",
    severity: "medium",
  },
  {
    icon: "📐",
    title: "Prompt Sensitivity",
    problem: "Small changes in prompt wording cause large geometric variation. \"Robot\" vs \"robot mascot\" generates completely different topology that TripoSR struggles with differently.",
    impact: "Pipeline is hard to make deterministic — requires extensive prompt engineering and seed management for reproducible results.",
    solution: "Fine-tune SD 1.5 on game asset datasets to bias outputs toward reconstruction-friendly silhouettes.",
    severity: "low",
  },
];

const severityConfig = {
  high: { color: "#ef4444", label: "Critical" },
  medium: { color: "#f59e0b", label: "Medium" },
  low: { color: "#22d3ee", label: "Low" },
};

export default function ChallengesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="challenges"
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
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
              Technical Depth
            </div>
            <h2 className="section-title">
              Challenges &amp; <span className="gradient-text">Learnings</span>
            </h2>
            <p className="section-subtitle">
              Real problems encountered during development — the kind of depth that proves
              this was built, not copied.
            </p>
          </motion.div>

          {/* Challenge cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {challenges.map((c, i) => {
              const sev = severityConfig[c.severity as keyof typeof severityConfig];
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1 * i }}
                  className="card-glass"
                  style={{ padding: "1.75rem", overflow: "hidden", position: "relative" }}
                >
                  {/* Left accent bar */}
                  <div style={{
                    position: "absolute",
                    left: 0, top: 0, bottom: 0,
                    width: 3,
                    background: sev.color,
                    borderRadius: "4px 0 0 4px",
                  }} />

                  <div style={{ paddingLeft: "0.5rem" }}>
                    {/* Title row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontSize: "1.5rem" }}>{c.icon}</span>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
                          {c.title}
                        </h3>
                      </div>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        background: `${sev.color}18`,
                        border: `1px solid ${sev.color}40`,
                        borderRadius: 100,
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: sev.color,
                        flexShrink: 0,
                      }}>
                        {sev.label}
                      </span>
                    </div>

                    {/* Three columns */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "1.25rem",
                    }}
                      className="challenge-cols"
                    >
                      {[
                        { label: "🔴 PROBLEM", text: c.problem, color: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.15)" },
                        { label: "⚡ IMPACT", text: c.impact, color: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)" },
                        { label: "✅ SOLUTION", text: c.solution, color: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.15)" },
                      ].map((col) => (
                        <div
                          key={col.label}
                          style={{
                            padding: "1rem",
                            background: col.color,
                            border: `1px solid ${col.border}`,
                            borderRadius: 10,
                          }}
                        >
                          <div style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "var(--text-muted)",
                            marginBottom: "0.5rem",
                            fontFamily: "var(--font-mono)",
                          }}>
                            {col.label}
                          </div>
                          <p style={{
                            fontSize: "0.83rem",
                            color: "var(--text-secondary)",
                            lineHeight: 1.6,
                            margin: 0,
                          }}>
                            {col.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Future directions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            style={{
              marginTop: "3rem",
              padding: "2rem",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(34,211,238,0.03))",
            }}
          >
            <div style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              🚀 FUTURE RESEARCH DIRECTIONS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
              {[
                { icon: "👁️", title: "Multi-View Generation", desc: "MVDream / Zero123 for 4-view inputs" },
                { icon: "🌟", title: "PBR Texture Maps", desc: "Normal, Roughness, Metallic maps" },
                { icon: "📊", title: "Automated LODs", desc: "Low/Medium/High poly variants" },
                { icon: "⚡", title: "SDXL Upgrade", desc: "Higher fidelity base images" },
                { icon: "✨", title: "Gaussian Splatting", desc: "Novel view synthesis alternative" },
                { icon: "🔧", title: "Retopology", desc: "Clean game-ready mesh topology" },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "1rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .challenge-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
