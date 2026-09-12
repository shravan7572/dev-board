import { useEffect, useState } from "react";

function UrlClaimer({ name, setName, onClaim }) {
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);

  const clean = (name || "").trim().toLowerCase();
  const taken = available === false;
  const display = clean || "yourname";


  const VITE_BASE_URL= import.meta.env.VITE_BASE_URL

  useEffect(() => {
    if (!clean) {
      setAvailable(null);
      setChecking(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setChecking(true);
        setAvailable(null);

        const response = await fetch(
          `${VITE_BASE_URL}/api/auth/check-username/${encodeURIComponent(clean)}`
        );

        if (!response.ok) {
          throw new Error("Failed to check username");
        }

        const data = await response.json();

        if (!cancelled) {
          setAvailable(data.available);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setAvailable(null);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      cancelled = true;
    };
  }, [clean]);

  return (
    <section id="hero" className="url-claimer-section">
      <div className="url-claimer-inner">
        <p className="section-eyebrow">your link</p>

        <h2 className="section-heading">
          Claim your URL
          <br />
          before it's gone
        </h2>

        <p className="section-sub">
          Simple, memorable, yours. Forever free.
        </p>

        <div className="url-claimer-input-wrap">
          <div
            className={`url-claimer-input-box ${available === true
                ? "available"
                : available === false
                  ? "taken"
                  : ""
              }`}
          >
            <span className="url-claimer-prefix">
              devboard.app/
            </span>

            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value.replace(/\s/g, ""));
              }}
              placeholder="yourname"
              className="url-claimer-input"
              aria-label="Choose your devboard username"
              autoComplete="off"
              spellCheck={false}
            />

            {checking && (
              <span className="url-claimer-checking">
                ...
              </span>
            )}

            {!checking && available === true && (
              <span className="url-claimer-check">
                ✓
              </span>
            )}

            {!checking && available === false && (
              <span className="url-claimer-x">
                ✕
              </span>
            )}
          </div>

          <p
            className={`url-claimer-status ${!clean
                ? "neutral"
                : checking
                  ? "neutral"
                  : taken
                    ? "taken"
                    : available === true
                      ? "free"
                      : "neutral"
              }`}
          >
            {!clean
              ? "Type a username to check availability"
              : checking
                ? "Checking availability..."
                : taken
                  ? `devboard.app/${clean} is taken`
                  : available === true
                    ? `✓ devboard.app/${clean} is available — grab it free`
                    : "Unable to check username"}
          </p>

          <button
            onClick={onClaim}
            disabled={!clean || checking || available !== true}
            className="url-claimer-btn"
          >
            Claim devboard.app/{display} →
          </button>
        </div>
      </div>
    </section>
  );
}

export default UrlClaimer;
