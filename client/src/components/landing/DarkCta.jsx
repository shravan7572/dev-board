import { useEffect, useState } from "react";

function DarkCta({ name, setName, onClaim }) {
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);

  const clean = (name || "").trim().toLowerCase();

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
          `http://localhost:5001/api/auth/check-username/${encodeURIComponent(clean)}`
        );

        if (!response.ok) {
          throw new Error("Failed to check username");
        }

        const data = await response.json();

        if (!cancelled) {
          setAvailable(data.available);
        }
      } catch (error) {
        console.error(error);

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

  const isTaken = available === false;
  const isAvailable = available === true;

  return (
    <section className="dark-cta-section">
      <div className="dark-cta-grid" aria-hidden="true" />

      <div className="dark-cta-inner">
        <div className="dark-cta-badge">
          Free forever · No credit card
        </div>

        <h2 className="dark-cta-heading">
          Your profile is
          <br />
          waiting for you
        </h2>

        <p className="dark-cta-sub">
          Takes 3 minutes. Looks like you spent 3 days on it.
        </p>

        <div className="dark-cta-input-row">
          <div
            className={`dark-cta-input-wrap ${isAvailable
              ? "available"
              : isTaken
                ? "taken"
                : ""
              }`}
          >
            <span className="dark-cta-prefix">
              devboard.app/
            </span>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value.replace(/\s/g, ""))
              }
              placeholder="yourname"
              className="dark-cta-input"
              aria-label="Choose your devboard username"
              autoComplete="off"
              spellCheck={false}
            />

            {checking && (
              <span className="dark-cta-checking">
                ...
              </span>
            )}

            {!checking && isAvailable && (
              <span className="dark-cta-check">✓</span>
            )}

            {!checking && isTaken && (
              <span className="dark-cta-x">✕</span>
            )}
          </div>

          <button
            onClick={onClaim}
            disabled={!clean || checking || !isAvailable}
            className="dark-cta-btn"
          >
            Claim yours →
          </button>
        </div>

        <p className="dark-cta-note">
          {!clean
            ? "devboard.app/yourname · always free · no ads"
            : checking
              ? "Checking availability..."
              : isTaken
                ? `devboard.app/${clean} is taken`
                : isAvailable
                  ? `✓ devboard.app/${clean} is available · always free · no ads`
                  : `devboard.app/${clean} · unable to check`}
        </p>
      </div>
    </section>
  );
}

export default DarkCta;
