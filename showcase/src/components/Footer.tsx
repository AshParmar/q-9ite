"use client";



export default function Footer() {
  return (
    <footer style={{
      padding: "4rem 1.5rem 2rem",
      position: "relative",
    }}>
      <div className="section-divider" style={{ marginBottom: "3rem" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "2rem",
          marginBottom: "3rem",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "white",
                fontFamily: "var(--font-mono)",
              }}>
                Q9
              </span>
              <span style={{ fontWeight: 700, fontSize: "1.15rem" }}>Q-9ite</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: 280, lineHeight: 1.6 }}>
              AI-Powered Text-to-3D Asset Pipeline.<br />
              Stable Diffusion 1.5 · TripoSR · Python
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "4rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                NAVIGATE
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { label: "Pipeline", id: "pipeline" },
                  { label: "Gallery", id: "gallery" },
                  { label: "Experiments", id: "experiments" },
                  { label: "CLI Demo", id: "cli" },
                  { label: "Challenges", id: "challenges" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth" })}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      textAlign: "left",
                      padding: 0,
                      transition: "color 0.2s",
                      fontFamily: "var(--font-sans)",
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = "var(--text-primary)"}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = "var(--text-secondary)"}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                RESOURCES
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { label: "GitHub Repository", href: "https://github.com/AshParmar/q-9ite" },
                  { label: "TripoSR Paper", href: "https://github.com/VAST-AI-Research/TripoSR" },
                  { label: "Stable Diffusion 1.5", href: "https://huggingface.co/runwayml/stable-diffusion-v1-5" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = "var(--accent-secondary)"}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = "var(--text-secondary)"}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © 2025 Ash Parmar · Apache License · Built with Next.js & model-viewer
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span style={{
              padding: "0.3rem 0.75rem",
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: 100,
              fontSize: "0.72rem",
              color: "#34d399",
              fontWeight: 600,
            }}>
              Apache License
            </span>
            <a
              href="https://github.com/AshParmar/q-9ite"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--text-muted)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = "var(--text-primary)"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = "var(--text-muted)"}
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
