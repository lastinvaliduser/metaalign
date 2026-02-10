import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TagMaster AI — Free SEO Meta Tag Analyzer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #09090b 0%, #0f0a2e 50%, #09090b 100%)",
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                {/* Grid pattern overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                        display: "flex",
                    }}
                />

                {/* Glow effect */}
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                    }}
                />

                {/* Icon */}
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "20px",
                        background: "linear-gradient(135deg, #6366f1, #818cf8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "32px",
                        boxShadow: "0 0 60px rgba(99, 102, 241, 0.3)",
                    }}
                >
                    <span style={{ fontSize: "40px", color: "white" }}>⚡</span>
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontSize: "64px",
                        fontWeight: 800,
                        color: "#fafafa",
                        margin: "0 0 16px 0",
                        letterSpacing: "-2px",
                        display: "flex",
                    }}
                >
                    TagMaster AI
                </h1>

                {/* Subtitle */}
                <p
                    style={{
                        fontSize: "28px",
                        color: "#a1a1aa",
                        margin: 0,
                        display: "flex",
                    }}
                >
                    Free SEO Meta Tag Analyzer & Optimizer
                </p>

                {/* Badge */}
                <div
                    style={{
                        marginTop: "40px",
                        padding: "12px 28px",
                        borderRadius: "100px",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        background: "rgba(99, 102, 241, 0.1)",
                        color: "#818cf8",
                        fontSize: "18px",
                        fontWeight: 600,
                        display: "flex",
                    }}
                >
                    Check your SEO score in 3 seconds →
                </div>
            </div>
        ),
        { ...size }
    );
}
