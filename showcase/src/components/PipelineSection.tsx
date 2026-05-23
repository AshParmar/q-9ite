"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    id: 1,
    icon: "💬",
    label: "Text Prompt",
    desc: "Natural language description",
    example: '"isometric treasure chest, glowing gold, stylized"',
    color: "#6366f1",
  },
  {
    id: 2,
    icon: "🎨",
    label: "Stable Diffusion 1.5",
    desc: "Text-to-image generation",
    example: "512×512 PNG concept art",
    color: "#818cf8",
  },
  {
    id: 3,
    icon: "🖼️",
    label: "Concept Art",
    desc: "High-quality 2D output",
    example: "Guidance 7.5 · Steps 30",
    color: "#a78bfa",
  },
  {
    id: 4,
    icon: "🧠",
    label: "TripoSR",
    desc: "Single-view 3D reconstruction",
    example: "Feed-forward neural inference",
    color: "#c084fc",
  },
  {
    id: 5,
    icon: "🔷",
    label: "3D Reconstruction",
    desc: "Volumetric mesh extraction",
    example: "Marching Cubes · Res 512",
    color: "#e879f9",
  },
  {
    id: 6,
    icon: "⚙️",
    label: "Post-Processing",
    desc: "Mesh cleaning & validation",
    example: "Winding fix · UV check",
    color: "#22d3ee",
  },
  {
    id: 7,
    icon: "📦",
    label: "GLB / OBJ Output",
    desc: "Game-ready 3D asset",
    example: "335k faces · UV textured",
    color: "#34d399",
  },
];

export default function PipelineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="pipeline"
      ref={ref}
      style={{ padding: "6rem 0", position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div
        className="bg-orb"
        style={{
          width: 500,
          height: 500,
          background: "rgba(99, 102, 241, 0.07)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          position: "absolute",
        }}
      />

      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <div className="section-tag" style={{ display: "inline-flex" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-primary)", display: "inline-block" }} />
            Architecture
          </div>
          <h2 className="section-title" style={{ textAlign: "center" }}>
            The <span className="gradient-text">Pipeline</span>
          </h2>
          <p className="section-subtitle" style={{ textAlign: "center", margin: "0 auto" }}>
            A fully automated 7-stage pipeline from natural language to
            game-ready 3D asset — no human in the loop.
          </p>
        </motion.div>

        {/* Pipeline steps */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            maxWidth: 760,
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: 27,
              top: 56,
              bottom: 56,
              width: 2,
              background: "linear-gradient(180deg, #6366f1, #22d3ee)",
              transformOrigin: "top",
              borderRadius: 2,
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 * i + 0.3, duration: 0.5 }}
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
                padding: "1.25rem 0",
                position: "relative",
              }}
            >
              {/* Icon bubble */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: `${step.color}18`,
                  border: `2px solid ${step.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  flexShrink: 0,
                  boxShadow: `0 0 24px ${step.color}20`,
                  position: "relative",
                  zIndex: 1,
                  backgroundColor: "var(--bg-primary)",
                }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <div
                className="card-glass"
                style={{
                  flex: 1,
                  padding: "1rem 1.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-mono)",
                        color: step.color,
                        background: `${step.color}15`,
                        padding: "0.15rem 0.5rem",
                        borderRadius: 4,
                        fontWeight: 600,
                      }}
                    >
                      STEP {step.id}
                    </span>
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {step.desc}
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    background: "rgba(255,255,255,0.03)",
                    padding: "0.35rem 0.75rem",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.example}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5 }}
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "3rem",
          }}
        >
          {[
            "Python", "HuggingFace Diffusers", "Stable Diffusion 1.5",
            "TripoSR", "Trimesh", "Open3D", "Marching Cubes", "GLB/OBJ"
          ].map((tech) => (
            <span
              key={tech}
              style={{
                padding: "0.4rem 1rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 100,
                fontSize: "0.82rem",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
