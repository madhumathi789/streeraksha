import { useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import './SosButton.css';

export default function SOSButton() {
  const [showModal, setShowModal] = useState(false);
  const [guardianCount, setGuardianCount] = useState(0);

  const triggerSOS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`;

        try {
          const res = await fetch("http://localhost:5050/api/guardian/sos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ location }),
          });

          const data = await res.json();

          if (res.ok) {
            setGuardianCount(data.count);
            setShowModal(true);
          } else {
            alert(data.message);
          }

        } catch (error) {
          alert("Failed to send SOS alert");
        }
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  return (
    <>
      <div className="sos-wrap">
        <div className="sos-glow-wrap">
          <div className="sos-glow"></div>
          <div className="sos-btn" onClick={triggerSOS}>
            <div className="sos-icon">!</div>
            <div className="sos-text">SOS</div>
            <div className="sos-sub">Hold for 2s</div>
          </div>
        </div>
        <p className="sos-caption">
          Hold for 2 seconds to trigger emergency alert
        </p>
      </div>

      {showModal && (
        <div className="sos-overlay">
          <div className="sos-modal">
            <div className="sos-modal-icon">
              <AlertTriangle size={28} color="#ef4444" />
            </div>

            <h2>SOS Alert Triggered!</h2>
            <p className="sos-modal-desc">
              Your emergency contacts have been notified with your live location.
            </p>

            <div className="sos-status success">
              <Check /> Location shared
            </div>

            <div className="sos-status success">
              <Check /> {guardianCount} guardian(s) notified
            </div>

            <button className="sos-cancel" onClick={() => setShowModal(false)}>
              <X size={16} /> Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}