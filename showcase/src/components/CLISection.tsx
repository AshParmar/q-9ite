"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const cliExamples = [
  {
    id: "basic",
    label: "Basic Asset",
    command: `python pipeline.py \\
  --prompt "isometric treasure chest, glowing gold, stylized" \\
  --steps 30 \\
  --guidance 7.5`,
    output: [
      { delay: 0, text: "🚀 Q-9ite Pipeline v1.0 — Text-to-3D Asset Generator", color: "var(--accent-secondary)" },
      { delay: 0.3, text: "📝 Prompt: isometric treasure chest, glowing gold, stylized", color: "var(--text-secondary)" },
      { delay: 0.6, text: "🎨 Loading Stable Diffusion 1.5...", color: "var(--text-muted)" },
      { delay: 1.1, text: "✓ Model loaded (CUDA · 4.2GB VRAM)", color: "#34d399" },
      { delay: 1.5, text: "🖌  Generating concept art (30 steps, CFG 7.5)...", color: "var(--text-muted)" },
      { delay: 2.2, text: "✓ Image saved → outputs/images/seed_42.png", color: "#34d399" },
      { delay: 2.6, text: "🧠 Loading TripoSR (single-view 3D reconstruction)...", color: "var(--text-muted)" },
      { delay: 3.4, text: "✓ Model loaded · Running inference...", color: "#34d399" },
      { delay: 4.0, text: "🔷 Extracting mesh via Marching Cubes (res=512)...", color: "var(--text-muted)" },
      { delay: 5.2, text: "✓ Raw mesh: 274,978 vertices · 335,776 faces", color: "#34d399" },
      { delay: 5.6, text: "⚙  Post-processing: cleaning · UV check · format conversion...", color: "var(--text-muted)" },
      { delay: 6.3, text: "✓ mesh.glb saved → outputs/processed_meshes/seed_42/", color: "#34d399" },
      { delay: 6.8, text: "", color: "transparent" },
      { delay: 6.9, text: "✅ Pipeline complete in 42.3s", color: "var(--accent-cyan)" },
    ],
  },
  {
    id: "image-only",
    label: "Image Only",
    command: `python pipeline.py \\
  --prompt "a sci-fi glowing cube" \\
  --model sd15 \\
  --steps 50 \\
  --guidance 12.0 \\
  --skip-mesh`,
    output: [
      { delay: 0, text: "🚀 Q-9ite Pipeline — Image-Only Mode (--skip-mesh)", color: "var(--accent-secondary)" },
      { delay: 0.4, text: "📝 Prompt: a sci-fi glowing cube", color: "var(--text-secondary)" },
      { delay: 0.8, text: "🎨 Loading Stable Diffusion 1.5 (sd15)...", color: "var(--text-muted)" },
      { delay: 1.3, text: "✓ Model loaded", color: "#34d399" },
      { delay: 1.7, text: "🖌  Generating (50 steps, CFG 12.0)...", color: "var(--text-muted)" },
      { delay: 3.1, text: "✓ Image saved → outputs/images/seed_42.png", color: "#34d399" },
      { delay: 3.5, text: "⏩ Skipping 3D reconstruction (--skip-mesh)", color: "#f59e0b" },
      { delay: 4.0, text: "✅ Done in 18.7s", color: "var(--accent-cyan)" },
    ],
  },
  {
    id: "from-image",
    label: "Image → 3D",
    command: `python pipeline.py \\
  --input-image my_asset.png \\
  --guidance 12.0 \\
  --steps 30`,
    output: [
      { delay: 0, text: "🚀 Q-9ite Pipeline — Image-to-3D Mode", color: "var(--accent-secondary)" },
      { delay: 0.4, text: "📂 Input image: my_asset.png", color: "var(--text-secondary)" },
      { delay: 0.8, text: "⏩ Skipping image generation (input provided)", color: "#f59e0b" },
      { delay: 1.2, text: "🧠 Loading TripoSR...", color: "var(--text-muted)" },
      { delay: 1.9, text: "✓ Running single-view 3D reconstruction...", color: "#34d399" },
      { delay: 2.8, text: "🔷 Marching Cubes extraction...", color: "var(--text-muted)" },
      { delay: 3.6, text: "✓ Mesh: 274,978 verts · 335,776 faces · UV: ✓", color: "#34d399" },
      { delay: 4.1, text: "✅ mesh.glb saved in 24.1s", color: "var(--accent-cyan)" },
    ],
  },
];

function TerminalOutput({ lines, running }: {
  lines: typeof cliExamples[0]["output"];
  running: boolean;
}) {
  const [visible, setVisible] = useState<number>(0);

  useEffect(() => {
    if (!running) { 
      setTimeout(() => setVisible(0), 0);
      return; 
    }
    setTimeout(() => setVisible(0), 0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisible(i + 1), lines[i].delay * 1000)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [running, lines]);

  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.82rem",
        lineHeight: 1.8,
        minHeight: 280,
        padding: "1.25rem",
      }}
    >
      {lines.slice(0, visible).map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: line.color }}
        >
          {line.text}
        </motion.div>
      ))}
      {running && visible < lines.length && (
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 14,
            background: "var(--accent-primary)",
            marginLeft: 2,
          }}
          className="animate-blink"
        />
      )}
    </div>
  );
}

export default function CLISection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [activeExample, setActiveExample] = useState(0);
  const [running, setRunning] = useState(false);

  const runDemo = () => {
    setRunning(false);
    setTimeout(() => setRunning(true), 50);
  };

  return (
    <section
      id="cli"
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
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
              Developer Tool
            </div>
            <h2 className="section-title">
              CLI <span className="gradient-text">Demo</span>
            </h2>
            <p className="section-subtitle">
              A simple, composable command-line interface. Run the full pipeline or any individual stage independently.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: "2.5rem",
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr",
              gap: "1.5rem",
              alignItems: "start",
            }}
            className="cli-grid"
          >
            {/* Left: Command */}
            <div>
              {/* Example selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {cliExamples.map((ex, i) => (
                  <button
                    key={ex.id}
                    onClick={() => { setActiveExample(i); setRunning(false); }}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: 10,
                      border: `1px solid ${activeExample === i ? "var(--accent-primary)" : "var(--border)"}`,
                      background: activeExample === i ? "rgba(99,102,241,0.1)" : "transparent",
                      color: activeExample === i ? "var(--accent-secondary)" : "var(--text-secondary)",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              {/* Command box */}
              <div
                style={{
                  background: "#0a0a12",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <div style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                  <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    pipeline.py
                  </span>
                </div>
                <pre style={{
                  padding: "1.25rem",
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  color: "var(--accent-secondary)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}>
                  <span style={{ color: "var(--text-muted)" }}>$ </span>
                  {cliExamples[activeExample].command}
                </pre>
              </div>

              <button
                onClick={runDemo}
                className="btn-primary"
                style={{ marginTop: "1rem", width: "100%", justifyContent: "center" }}
                id={`cli-run-${cliExamples[activeExample].id}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {running ? "Running..." : "Run Demo"}
              </button>
            </div>

            {/* Right: Terminal output */}
            <div
              style={{
                background: "#050508",
                border: "1px solid var(--border)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{
                padding: "0.75rem 1rem",
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  Terminal Output
                </span>
                {running && (
                  <span style={{
                    padding: "0.15rem 0.5rem",
                    background: "rgba(52,211,153,0.15)",
                    border: "1px solid rgba(52,211,153,0.3)",
                    borderRadius: 100,
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: "#34d399",
                  }}>
                    ● RUNNING
                  </span>
                )}
              </div>
              <TerminalOutput
                lines={cliExamples[activeExample].output}
                running={running}
              />
            </div>
          </motion.div>

          {/* Options reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: "1rem" }}>
              CLI OPTIONS REFERENCE
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.75rem" }}>
              {[
                { flag: "--prompt", desc: "Text description of the asset to generate" },
                { flag: "--model", desc: "sd15 | turbo | pixart (default: sd15)" },
                { flag: "--steps", desc: "Inference steps for SD (default: 30)" },
                { flag: "--guidance", desc: "CFG guidance scale (default: 7.5)" },
                { flag: "--skip-mesh", desc: "Generate 2D image only, no 3D" },
                { flag: "--input-image", desc: "Skip SD, use existing image for TripoSR" },
              ].map((opt) => (
                <div key={opt.flag} style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", color: "var(--accent-secondary)", fontSize: "0.82rem", fontWeight: 600 }}>
                    {opt.flag}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {opt.desc}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .cli-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
