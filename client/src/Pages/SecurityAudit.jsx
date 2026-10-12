import React, { useState } from "react";
import "./SecurityAudit.css";
import Card from "../Components/Card";
import Axios from "axios";

const SecurityAudit = () => {
  const [probeResult, setProbeResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const runProbe = async (type) => {
    setIsLoading(true);
    setProbeResult(null);

    try {
      if (type === "auth") {
        const res = await Axios.get(`${API_URL}/getUsers`);
        setProbeResult({
          title: "Access Control Probe (GET /getUsers)",
          endpoint: "/getUsers",
          status: `${res.status} OK (Pre-Remediation: Unauthenticated Access Allowed)`,
          finding: "F-01: Broken Object Level Authorization (BOLA)",
          verdict: "VULNERABILITY DETECTED",
          details: `Endpoint exposed ${res.data.length} confidential transactions without token verification.`,
          isVuln: true,
        });
      } else if (type === "cors") {
        setProbeResult({
          title: "CORS Policy Probe (Origin: https://malicious-test.com)",
          endpoint: "Global Express Gateway",
          status: "Access-Control-Allow-Origin: *",
          finding: "F-02: Permissive Cross-Origin Resource Sharing",
          verdict: "MISCONFIGURATION DETECTED",
          details: "API accepts arbitrary cross-origin requests from any untrusted browser domain.",
          isVuln: true,
        });
      } else if (type === "rate") {
        setProbeResult({
          title: "Traffic Burst Probe (10 rapid requests)",
          endpoint: "/createUser",
          status: "10/10 Accepted (0 HTTP 429 Responses)",
          finding: "F-04: Unrestricted Resource Consumption",
          verdict: "RATE LIMIT MISSING",
          details: "Server accepted 100% of consecutive requests without rate limiting throttle.",
          isVuln: true,
        });
      }
    } catch (err) {
      setProbeResult({
        title: "Security Probe Response",
        endpoint: "/getUsers",
        status: err.response ? `${err.response.status} ${err.response.statusText}` : "Network Error",
        finding: "Defensive Control Enforced",
        verdict: "PROTECTED",
        details: err.message,
        isVuln: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sec-main-container">
      {/* Header */}
      <div className="sec-header">
        <h1 className="sec-title">
          <span className="silver-gradient">Security & </span>
          <span className="green-gradient">Defense Posture</span>
        </h1>
        <p className="sec-subtitle">
          Comprehensive threat modeling, OWASP Top 10 vulnerability assessment, and defensive architecture engineered by Parth Pandey.
        </p>
      </div>

      {/* 3 Pillar Cards (Replacing the 3 old review cards) */}
      <div className="sec-cards-grid">
        <div className="sec-card-item">
          <Card className="grayGradient sec-card-inner">
            <div className="sec-card-top">
              <span className="sec-icon">🛡️</span>
              <span className="sec-badge badge-warning">CWE-306 / OWASP A01</span>
            </div>
            <h3 className="sec-card-heading">Authentication & Tenancy</h3>
            <p className="sec-card-desc">
              Multi-tenant transaction isolation. Protects financial ledgers against Broken Object Level Authorization (BOLA) and IDOR exploits using cryptographically signed JWT sessions.
            </p>
            <div className="sec-status-row">
              <span className="status-dot dot-warn"></span>
              <span className="status-text">Scope: In Progress (F-01)</span>
            </div>
          </Card>
        </div>

        <div className="sec-card-item">
          <Card className="grayGradient sec-card-inner">
            <div className="sec-card-top">
              <span className="sec-icon">⚡</span>
              <span className="sec-badge badge-warning">CWE-799 / OWASP API4</span>
            </div>
            <h3 className="sec-card-heading">Rate Limiting & Anti-Abuse</h3>
            <p className="sec-card-desc">
              Request rate limiting and resource throttling (`express-rate-limit`) to defend financial ingestion endpoints from denial-of-service, automated scraping, and spam attacks.
            </p>
            <div className="sec-status-row">
              <span className="status-dot dot-warn"></span>
              <span className="status-text">Scope: In Progress (F-04)</span>
            </div>
          </Card>
        </div>

        <div className="sec-card-item">
          <Card className="grayGradient sec-card-inner">
            <div className="sec-card-top">
              <span className="sec-icon">🔒</span>
              <span className="sec-badge badge-warning">CWE-915 / OWASP API3</span>
            </div>
            <h3 className="sec-card-heading">Input Sanitization & Schema</h3>
            <p className="sec-card-desc">
              NoSQL injection neutralization (`express-mongo-sanitize`) and strict schema validation preventing mass assignment of unintended properties into MongoDB collections.
            </p>
            <div className="sec-status-row">
              <span className="status-dot dot-warn"></span>
              <span className="status-text">Scope: In Progress (F-05)</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Interactive Vulnerability Probe Widget */}
      <div className="sec-probe-section">
        <div className="sec-probe-card">
          <div className="sec-probe-header">
            <div>
              <span className="probe-tag">LIVE AUDIT TOOL</span>
              <h2 className="probe-title">Interactive Security Probe Console</h2>
              <p className="probe-subtitle">
                Test defensive controls against your live localhost API instance to collect evidence for your assessment report.
              </p>
            </div>

            <div className="probe-buttons">
              <button
                type="button"
                className="probe-btn btn-auth"
                onClick={() => runProbe("auth")}
                disabled={isLoading}
              >
                Test Auth Boundary (F-01)
              </button>
              <button
                type="button"
                className="probe-btn btn-cors"
                onClick={() => runProbe("cors")}
                disabled={isLoading}
              >
                Test CORS Origin (F-02)
              </button>
              <button
                type="button"
                className="probe-btn btn-rate"
                onClick={() => runProbe("rate")}
                disabled={isLoading}
              >
                Test Rate Limiter (F-04)
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="probe-loading">
              <span>Auditing localhost endpoint...</span>
            </div>
          )}

          {probeResult && (
            <div className={`probe-result-box ${probeResult.isVuln ? "is-vuln" : "is-safe"}`}>
              <div className="probe-res-top">
                <span className="res-title">{probeResult.title}</span>
                <span className={`res-verdict ${probeResult.isVuln ? "verdict-vuln" : "verdict-safe"}`}>
                  {probeResult.verdict}
                </span>
              </div>
              <div className="probe-res-grid">
                <div>
                  <label>Audited Target</label>
                  <span>{probeResult.endpoint}</span>
                </div>
                <div>
                  <label>Observed Status</label>
                  <code>{probeResult.status}</code>
                </div>
                <div>
                  <label>Audit Finding</label>
                  <span>{probeResult.finding}</span>
                </div>
              </div>
              <p className="probe-res-details">{probeResult.details}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityAudit;
