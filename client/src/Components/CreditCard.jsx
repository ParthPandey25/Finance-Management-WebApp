import React, { useState, useRef } from "react";
import "./CreditCard.css";

export default function CreditCard() {
  const [rotation, setRotation] = useState({ x: 12, y: -22 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) {
      // Smooth subtle tilt on hover when not actively dragging
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setRotation({
        x: -ny * 16 + 10,
        y: nx * 22 - 15,
      });
      return;
    }

    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setRotation((prev) => ({
      x: prev.x - deltaY * 0.6,
      y: prev.y + deltaX * 0.6,
    }));
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setRotation({ x: 12, y: -22 });
  };

  return (
    <div
      className="credit-card-stage"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="crypto-card-3d-wrapper"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* FRONT FACE */}
        <div className="crypto-card-face crypto-card-front">
          <div className="card-holo-strip"></div>

          <div className="card-top-row">
            <div className="card-wallet-group">
              <span className="card-label">wallet ID:</span>
              <span className="card-wallet-id">
                0x71C7656EC7ab88b098defB751B7401B5f6d8976F
              </span>
            </div>
            <div className="card-cvc-group">
              <span className="card-cvc-number">4826</span>
              <span className="card-cvc-label">CVC</span>
            </div>
          </div>

          <div className="card-middle-row">
            <div className="card-owner-info">
              <h2 className="card-owner-name">Parth Pandey</h2>
              <p className="card-owner-title">Lead Security Architect</p>
            </div>

            <div className="card-chip">
              <div className="chip-line chip-line-1"></div>
              <div className="chip-line chip-line-2"></div>
              <div className="chip-core"></div>
            </div>
          </div>

          <div className="card-bottom-row">
            <span className="card-footer-text">
              © 2026 Parth Pandey | Secure Financial Architecture
            </span>
          </div>
        </div>

        {/* BACK FACE (For full 360-degree rotation) */}
        <div className="crypto-card-face crypto-card-back">
          <div className="card-mag-stripe"></div>
          <div className="card-back-cvv-panel">
            <div className="cvv-signature-strip">
              <span>AUTHORIZED SIGNATURE - SECURE MERN PORTAL</span>
            </div>
            <div className="cvv-box">
              <span>826</span>
            </div>
          </div>
          <div className="card-back-info">
            <p className="card-back-disclaimer">
              Cryptographic card issued for Parth Pandey's Secure Financial Platform.
              Engineered with OWASP Top 10 defenses, rate-limiting & JWT session encryption.
            </p>
            <div className="card-back-badges">
              <span className="hologram-seal">SECURE</span>
              <span className="visa-text">CRYPTO VISA</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card-drag-hint">
        <span>✦ Drag in any direction to spin 360°</span>
        <button
          type="button"
          onClick={handleReset}
          className="card-reset-btn"
          title="Reset card view"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
