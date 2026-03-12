import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================
// COLLECTION DATA — Expanded with genres, decades, personal tags
// Alex: Add/replace records here. The "tag" field is what Daniel
// might say about when he played it. Feeds directly into the AI voice.
// ============================================================
const CURATED_RECORDS = [
  // Jazz — spotifyId is the album ID from open.spotify.com/album/{id}
  { artist: "Miles Davis", album: "Kind of Blue", year: 1959, genre: "Jazz", tag: "The one he put on when the house got quiet", spotifyId: "1weenld61qoidwYuZ1GESA" },
  { artist: "John Coltrane", album: "A Love Supreme", year: 1965, genre: "Jazz", tag: "Played this after finishing a hard job", spotifyId: "7Eoz7hJvaX1eFkbpQxC5PA" },
  { artist: "Thelonious Monk", album: "Brilliant Corners", year: 1957, genre: "Jazz", tag: "Said this album understood angles better than most architects", spotifyId: "5gWF47eGSbv4BOfxoFcQtd" },
  { artist: "Dave Brubeck", album: "Time Out", year: 1959, genre: "Jazz", tag: "Sunday mornings, without exception", spotifyId: "0nTTEAhCZsbbeplyDMIFuA" },
  { artist: "Charles Mingus", album: "The Black Saint and the Sinner Lady", year: 1963, genre: "Jazz", tag: "When he needed to think through a problem", spotifyId: "6Sts4Yh7KsDFwq2yTWrGGV" },
  { artist: "Herbie Hancock", album: "Head Hunters", year: 1973, genre: "Jazz Funk", tag: "The record that made him move while working", spotifyId: "5fmIolILp5NAtNYiRPjhzA" },
  { artist: "Nina Simone", album: "I Put a Spell on You", year: 1965, genre: "Jazz", tag: "Said her voice could lay bricks by itself", spotifyId: "6MKa7MmGRCPjnGLns1fMKC" },

  // Soul / Funk / R&B
  { artist: "Marvin Gaye", album: "What's Going On", year: 1971, genre: "Soul", tag: "The most important record in the collection", spotifyId: "2v6ANhWhZBUKkg6pJJBs3B" },
  { artist: "Al Green", album: "Let's Stay Together", year: 1972, genre: "Soul", tag: "Put this on every anniversary", spotifyId: "1FWBPHkYbzOQGMWEFaGn1f" },
  { artist: "Stevie Wonder", album: "Songs in the Key of Life", year: 1976, genre: "Soul", tag: "Called it the only double album worth every groove", spotifyId: "6YUCc2RiXcEKS9ibuGXjEe" },
  { artist: "Curtis Mayfield", album: "Superfly", year: 1972, genre: "Soul", tag: "Played it loud in the truck", spotifyId: "2wFqYhgMYzMGjiv1TNzu36" },
  { artist: "Bill Withers", album: "Still Bill", year: 1972, genre: "Soul", tag: "Workingman's music for a workingman", spotifyId: "1eNpEFOlQMop4OFBQT1bPS" },
  { artist: "Otis Redding", album: "Otis Blue", year: 1965, genre: "Soul", tag: "Could fix a bad day in four minutes", spotifyId: "4vFKErQavGgiqE47mUkwFP" },
  { artist: "Aretha Franklin", album: "I Never Loved a Man the Way I Love You", year: 1967, genre: "Soul", tag: "Handled with extra care", spotifyId: "7MSfTWBjxbbGRAqkkFMlDi" },
  { artist: "Parliament", album: "Mothership Connection", year: 1975, genre: "Funk", tag: "The weekend record", spotifyId: "5GwBYRIzETEAhFOleFaLcP" },
  { artist: "Earth, Wind & Fire", album: "That's the Way of the World", year: 1975, genre: "Soul", tag: "Cookouts, every single time", spotifyId: "2QLLU4Fgi5JMKvNtO07mjc" },

  // Rock
  { artist: "Pink Floyd", album: "Wish You Were Here", year: 1975, genre: "Rock", tag: "The sleeve was worn thin from how much he held it", spotifyId: "0bCAjiUamIFqKJsekOYuRw" },
  { artist: "Led Zeppelin", album: "Physical Graffiti", year: 1975, genre: "Rock", tag: "Appreciated the craftsmanship of it", spotifyId: "1lZahjeu4AhPkg9JARZr3F" },
  { artist: "Fleetwood Mac", album: "Rumours", year: 1977, genre: "Rock", tag: "Said everybody's got this one for a reason", spotifyId: "1bt6q2SruMsBtcerNVtpZB" },
  { artist: "The Beatles", album: "Abbey Road", year: 1969, genre: "Rock", tag: "The last great thing they built together", spotifyId: "0ETFjACtuP2ADo6LFhL6HN" },
  { artist: "Dire Straits", album: "Brothers in Arms", year: 1985, genre: "Rock", tag: "One of the first CDs he bought, then bought again on vinyl", spotifyId: "3CYTV2M8uo0PamCJSaMttw" },
  { artist: "The Who", album: "Who's Next", year: 1971, genre: "Rock", tag: "When the energy needed to match the work", spotifyId: "5MpFMGg36ldtrSXaERr1sQ" },
  { artist: "Creedence Clearwater Revival", album: "Cosmo's Factory", year: 1970, genre: "Rock", tag: "Garage door open, radio up", spotifyId: "6wPXUmYJ1sSRVyAMmTgdR8" },
  { artist: "The Allman Brothers Band", album: "At Fillmore East", year: 1971, genre: "Rock", tag: "Said live albums tell you who a band really is", spotifyId: "3e5dScVvjOZqVLm99DkaQz" },
  { artist: "Cream", album: "Disraeli Gears", year: 1967, genre: "Rock", tag: "Three guys building something bigger than themselves", spotifyId: "0bBIos1YYvOBI2wOkJOUWe" },

  // Folk / Singer-Songwriter
  { artist: "Joni Mitchell", album: "Blue", year: 1971, genre: "Folk", tag: "Quiet and careful with this one", spotifyId: "1vz94WpXDVYIEGja8cjFNa" },
  { artist: "Bob Dylan", album: "Blood on the Tracks", year: 1975, genre: "Folk Rock", tag: "Said Dylan understood what it cost to build and lose", spotifyId: "4qCKrmJBMHHVsZqIghPkRS" },
  { artist: "Cat Stevens", album: "Tea for the Tillerman", year: 1970, genre: "Folk", tag: "Played it when he was thinking about his own father", spotifyId: "6AvnF4VQKQamOKIEB9TV8S" },
  { artist: "Simon & Garfunkel", album: "Bridge over Troubled Water", year: 1970, genre: "Folk Rock", tag: "The record he reached for when someone was hurting", spotifyId: "0JwHz5SSvpYWuuCNbtYZoV" },
  { artist: "James Taylor", album: "Sweet Baby James", year: 1970, genre: "Folk", tag: "Evening record, windows open", spotifyId: "4GBARCMjMBsMYPaePGthDy" },
  { artist: "Tom Waits", album: "Closing Time", year: 1973, genre: "Folk", tag: "Said Tom Waits built songs like he built walls — rough, honest, standing", spotifyId: "5kBIulEBFJ36PnOSHqrB5l" },
  { artist: "Van Morrison", album: "Astral Weeks", year: 1968, genre: "Folk Rock", tag: "The one he said you had to sit down for", spotifyId: "2qOauwFeIONzs6jNDBGn1p" },

  // Progressive / New Wave / Other
  { artist: "Talking Heads", album: "Remain in Light", year: 1980, genre: "New Wave", tag: "Didn't understand it at first, then couldn't stop", spotifyId: "4FR8Z4e1sHwbMHqAhciGRs" },
  { artist: "Steely Dan", album: "Aja", year: 1977, genre: "Jazz Rock", tag: "Said these guys were perfectionists and he respected that", spotifyId: "1kMEoxvlpSrKECb1GB1jZe" },
  { artist: "Yes", album: "Close to the Edge", year: 1972, genre: "Progressive Rock", tag: "For long drives, nothing else", spotifyId: "7cmHCFNsgVAGpOmNsW0qNm" },
  { artist: "Peter Gabriel", album: "So", year: 1986, genre: "Art Rock", tag: "The one that surprised everyone who borrowed it", spotifyId: "4CaKWwmVT0X0Jjr8T28wlh" },

  // Blues / Country
  { artist: "B.B. King", album: "Live at the Regal", year: 1965, genre: "Blues", tag: "Said this is where all the other music comes from", spotifyId: "4jGiMRST4t9m3dvEz8cJN3" },
  { artist: "Muddy Waters", album: "Folk Singer", year: 1964, genre: "Blues", tag: "Stripped down, like good work should be", spotifyId: "2RkGOq4JlKO1F3gCxUEjyR" },
  { artist: "Johnny Cash", album: "At Folsom Prison", year: 1968, genre: "Country", tag: "Real and rough and not apologizing for it", spotifyId: "3SHTbP8FHQwCMGwxCI5bQe" },
  { artist: "Willie Nelson", album: "Red Headed Stranger", year: 1975, genre: "Country", tag: "Simple story, told right", spotifyId: "4GgcVkNma5i5NJiLv2Gieb" },
];

// ============================================================
// GENRE-AWARE GENERATIVE ART SYSTEM
// ============================================================
const GENRE_PALETTES = {
  Jazz: { bg: [[20,25,45],[30,28,38],[15,20,35]], accent: [[180,155,90],[140,120,80],[200,170,100]], mood: "smoky" },
  "Jazz Funk": { bg: [[25,40,30],[30,35,25],[20,38,35]], accent: [[200,160,60],[180,140,50],[160,190,80]], mood: "groovy" },
  Soul: { bg: [[45,25,20],[40,22,28],[50,30,25]], accent: [[220,140,60],[200,100,50],[240,180,80]], mood: "warm" },
  Funk: { bg: [[40,18,45],[35,20,40],[50,22,38]], accent: [[255,180,0],[200,80,200],[100,255,150]], mood: "electric" },
  Rock: { bg: [[35,30,25],[40,32,28],[30,28,30]], accent: [[200,80,50],[180,60,40],[220,100,60]], mood: "bold" },
  Folk: { bg: [[35,32,25],[40,38,30],[30,28,22]], accent: [[160,140,100],[140,160,120],[180,150,110]], mood: "organic" },
  "Folk Rock": { bg: [[38,34,26],[42,36,28],[32,30,24]], accent: [[170,130,80],[150,140,100],[190,150,90]], mood: "organic" },
  "Jazz Rock": { bg: [[25,30,40],[28,32,38],[22,28,42]], accent: [[160,150,120],[180,140,80],[140,160,140]], mood: "smoky" },
  "New Wave": { bg: [[20,20,30],[25,18,35],[18,22,32]], accent: [[255,80,100],[80,200,255],[255,200,60]], mood: "electric" },
  "Art Rock": { bg: [[22,22,32],[28,20,35],[20,25,30]], accent: [[180,100,200],[100,180,220],[220,160,100]], mood: "electric" },
  "Progressive Rock": { bg: [[18,22,35],[22,20,38],[15,25,32]], accent: [[100,160,220],[180,120,200],[120,200,160]], mood: "electric" },
  Blues: { bg: [[15,18,35],[20,15,30],[18,22,40]], accent: [[100,120,180],[80,90,160],[140,100,80]], mood: "raw" },
  Country: { bg: [[40,35,25],[45,38,28],[38,32,22]], accent: [[180,140,80],[160,120,70],[200,160,100]], mood: "organic" },
};

function seededRandom(seed) {
  let s = seed;
  return (min = 0, max = 1) => {
    s = (s * 9301 + 49297) % 233280;
    return min + (s / 233280) * (max - min);
  };
}

function generateGenreArt(record, canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = 300;
  canvas.width = size;
  canvas.height = size;

  let seed = 0;
  for (let i = 0; i < (record.album + record.artist).length; i++) {
    seed += (record.album + record.artist).charCodeAt(i) * (i + 1);
  }
  const rand = seededRandom(seed);

  const palette = GENRE_PALETTES[record.genre] || GENRE_PALETTES["Rock"];
  const bgChoice = palette.bg[Math.floor(rand(0, palette.bg.length))];
  const accentChoice = palette.accent[Math.floor(rand(0, palette.accent.length))];

  const gradient = ctx.createRadialGradient(
    size * rand(0.3, 0.7), size * rand(0.3, 0.7), 0,
    size / 2, size / 2, size * 0.8
  );
  gradient.addColorStop(0, `rgb(${bgChoice[0]+15},${bgChoice[1]+15},${bgChoice[2]+15})`);
  gradient.addColorStop(1, `rgb(${bgChoice[0]},${bgChoice[1]},${bgChoice[2]})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const mood = palette.mood;
  const [ar, ag, ab] = accentChoice;

  if (mood === "smoky") {
    for (let i = 0; i < 12; i++) {
      const cx = rand(size*0.1, size*0.9), cy = rand(size*0.1, size*0.9), radius = rand(20, 80);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `rgba(${ar},${ag},${ab},${rand(0.08,0.2)})`);
      grad.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI*2); ctx.fill();
    }
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      const sa = rand(0, Math.PI*2);
      ctx.arc(size/2, size/2, rand(30,120), sa, sa + rand(1,4));
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${rand(0.1,0.3)})`;
      ctx.lineWidth = rand(0.5,2); ctx.stroke();
    }
  } else if (mood === "warm" || mood === "groovy") {
    for (let layer = 0; layer < 6; layer++) {
      ctx.beginPath(); ctx.moveTo(0, size * rand(0.2, 0.8));
      for (let x = 0; x <= size; x += 4) {
        const y = size*0.5 + Math.sin(x*0.015 + layer*1.2)*(30+layer*15) + Math.cos(x*0.008+layer*0.7)*20 + (layer-3)*25;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(size, size); ctx.lineTo(0, size); ctx.closePath();
      ctx.fillStyle = `rgba(${ar-layer*10},${ag-layer*8},${ab},${rand(0.06,0.15)})`; ctx.fill();
    }
    for (let i = 0; i < 4; i++) {
      const gx = rand(0,size), gy = rand(0,size);
      const grad = ctx.createRadialGradient(gx,gy,0,gx,gy,rand(40,100));
      grad.addColorStop(0, `rgba(${ar},${ag},${ab},0.12)`);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad; ctx.fillRect(0,0,size,size);
    }
  } else if (mood === "bold") {
    for (let i = 0; i < 8; i++) {
      ctx.save(); ctx.translate(rand(0,size), rand(0,size)); ctx.rotate(rand(-0.5,0.5));
      ctx.fillStyle = `rgba(${ar},${ag},${ab},${rand(0.08,0.25)})`;
      ctx.fillRect(-rand(20,80), -rand(1.5,10), rand(40,160), rand(3,20));
      ctx.restore();
    }
    ctx.beginPath();
    const sx = rand(size*0.2, size*0.8);
    ctx.moveTo(sx, 0); ctx.lineTo(sx + rand(-60,60), size);
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},${rand(0.15,0.35)})`;
    ctx.lineWidth = rand(2,6); ctx.stroke();
    ctx.fillStyle = `rgba(${ar},${ag},${ab},0.1)`;
    ctx.fillRect(0, 0, rand(40,120), rand(40,120));
  } else if (mood === "organic") {
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      const sx2 = rand(0,size), sy2 = rand(0,size); ctx.moveTo(sx2, sy2);
      for (let step = 0; step < 6; step++) ctx.lineTo(sx2+rand(-50,50), sy2+rand(-50,50));
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${rand(0.04,0.12)})`;
      ctx.lineWidth = rand(0.5,2); ctx.stroke();
    }
    for (let i = 0; i < 30; i++) {
      ctx.beginPath(); ctx.arc(rand(0,size), rand(0,size), rand(1,3), 0, Math.PI*2);
      ctx.fillStyle = `rgba(${ar},${ag},${ab},${rand(0.1,0.3)})`; ctx.fill();
    }
  } else if (mood === "electric") {
    const gs = Math.floor(rand(4,8)), cs = size/gs;
    for (let gx2 = 0; gx2 < gs; gx2++) {
      for (let gy2 = 0; gy2 < gs; gy2++) {
        if (rand() > 0.6) {
          const a2 = palette.accent[Math.floor(rand(0,palette.accent.length))];
          ctx.fillStyle = `rgba(${a2[0]},${a2[1]},${a2[2]},${rand(0.05,0.2)})`;
          ctx.fillRect(gx2*cs+2, gy2*cs+2, cs-4, cs-4);
        }
      }
    }
    ctx.beginPath(); ctx.moveTo(rand(0,size*0.3), rand(0,size));
    ctx.bezierCurveTo(rand(0,size),rand(0,size),rand(0,size),rand(0,size),rand(size*0.7,size),rand(0,size));
    ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.4)`; ctx.lineWidth = rand(1,3); ctx.stroke();
  } else if (mood === "raw") {
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(${ar+rand(-30,30)},${ag+rand(-20,20)},${ab+rand(-20,20)},${rand(0.01,0.06)})`;
      ctx.fillRect(rand(0,size), rand(0,size), rand(1,4), rand(1,4));
    }
    for (let i = 0; i < 6; i++) {
      const y2 = rand(size*0.1, size*0.9); ctx.beginPath(); ctx.moveTo(0, y2);
      for (let x = 0; x < size; x += 3) ctx.lineTo(x, y2 + rand(-2,2));
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${rand(0.08,0.2)})`;
      ctx.lineWidth = rand(0.5,1.5); ctx.stroke();
    }
  }

  // Film grain
  const imageData = ctx.getImageData(0, 0, size, size);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = rand(-1,1) * 8;
    d[i] = Math.min(255, Math.max(0, d[i]+n));
    d[i+1] = Math.min(255, Math.max(0, d[i+1]+n));
    d[i+2] = Math.min(255, Math.max(0, d[i+2]+n));
  }
  ctx.putImageData(imageData, 0, 0);
}

// ============================================================
// VINYL — drag-to-spin
// ============================================================
function VinylRecord({ record, isSpinning, artCanvasRef }) {
  const discRef = useRef(null);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const rotation = useRef(0);
  const [rot, setRot] = useState(0);

  const angleFromCenter = (e, rect) => {
    const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
    const px = e.touches ? e.touches[0].clientX : e.clientX;
    const py = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(py - cy, px - cx);
  };

  const onDown = (e) => {
    if (isSpinning) return;
    isDragging.current = true;
    lastAngle.current = angleFromCenter(e, discRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current || isSpinning) return;
      const a = angleFromCenter(e, discRef.current.getBoundingClientRect());
      rotation.current += (a - lastAngle.current) * (180/Math.PI);
      lastAngle.current = a;
      setRot(rotation.current);
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isSpinning]);

  const grooves = useRef(Array.from({ length: 28 }, () => 0.2 + Math.random() * 0.2)).current;

  return (
    <div ref={discRef} onMouseDown={onDown} onTouchStart={onDown}
      style={{ width: 300, height: 300, position: "relative", cursor: isSpinning ? "default" : "grab" }}>
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle at center,
          #1a1a1a 0%, #0d0d0d 14%, #1a1a1a 15%, #111 28%, #1a1a1a 29%,
          #0f0f0f 43%, #1a1a1a 44%, #111 58%, #1a1a1a 59%,
          #0d0d0d 73%, #1a1a1a 74%, #111 88%, #1a1a1a 89%, #0d0d0d 100%)`,
        transform: isSpinning ? undefined : `rotate(${rot}deg)`,
        animation: isSpinning ? "spin 2.8s linear infinite" : "none",
        boxShadow: "0 4px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
      }}>
        {grooves.map((op, i) => (
          <div key={i} className="absolute rounded-full"
            style={{ inset: `${8+i*3.2}px`, border: `0.5px solid rgba(50,50,50,${op})` }} />
        ))}
        <div className="absolute rounded-full overflow-hidden" style={{
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 100, height: 100, boxShadow: "inset 0 0 8px rgba(0,0,0,0.6)",
        }}>
          <canvas ref={artCanvasRef} style={{ width: 100, height: 100, objectFit: "cover" }} />
          <div className="absolute rounded-full" style={{
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 8, height: 8, background: "#0a0a0a",
            boxShadow: "inset 0 0 3px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.5)",
          }} />
        </div>
      </div>
      <div className="absolute inset-0 rounded-full pointer-events-none" style={{
        background: "conic-gradient(from 200deg, transparent 0%, rgba(255,255,255,0.04) 10%, transparent 20%, transparent 100%)",
        animation: isSpinning ? "spin 2.8s linear infinite" : "none",
        transform: isSpinning ? undefined : `rotate(${rot}deg)`,
      }} />
    </div>
  );
}

// ============================================================
// TONEARM
// ============================================================
function Tonearm({ isPlaying }) {
  return (
    <svg width="100" height="180" viewBox="0 0 100 180" style={{
      position: "absolute", top: -10, right: -20,
      transformOrigin: "72px 22px",
      transform: isPlaying ? "rotate(20deg)" : "rotate(-8deg)",
      transition: "transform 1.4s cubic-bezier(0.22,1,0.36,1)",
      filter: "drop-shadow(2px 3px 5px rgba(0,0,0,0.5))",
    }}>
      <circle cx="72" cy="22" r="10" fill="#252525" stroke="#333" strokeWidth="0.5" />
      <circle cx="72" cy="22" r="4" fill="#1a1a1a" />
      <line x1="72" y1="22" x2="22" y2="155" stroke="#3a3a3a" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="155" x2="14" y2="172" stroke="#444" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="9" y="168" width="10" height="5" rx="1" fill="#333" />
      <line x1="14" y1="173" x2="14" y2="176" stroke="#777" strokeWidth="0.8" />
    </svg>
  );
}

// ============================================================
// SPOTIFY PREVIEW PLAYER
// Uses Client Credentials flow to get a token, fetches album tracks,
// and plays 30-second preview MP3s via native <audio>.
//
// IMPORTANT FOR PRODUCTION: Move the token fetch to a serverless
// function so client_secret isn't exposed. For now, this works
// for the prototype.
// ============================================================
const SPOTIFY_CLIENT_ID = "1604decab0a0489d87698f7f7c9f93ab";
const SPOTIFY_CLIENT_SECRET = "090d69da8d9d4034b0958c38b7921fed";

let spotifyTokenCache = { token: null, expires: 0 };

async function getSpotifyToken() {
  if (spotifyTokenCache.token && Date.now() < spotifyTokenCache.expires) {
    return spotifyTokenCache.token;
  }
  try {
    const resp = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET),
      },
      body: "grant_type=client_credentials",
    });
    const data = await resp.json();
    spotifyTokenCache = { token: data.access_token, expires: Date.now() + (data.expires_in - 60) * 1000 };
    return data.access_token;
  } catch (e) {
    console.error("Spotify auth failed:", e);
    return null;
  }
}

async function getPreviewUrl(spotifyId) {
  const token = await getSpotifyToken();
  if (!token) return null;
  try {
    const resp = await fetch(`https://api.spotify.com/v1/albums/${spotifyId}/tracks?limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await resp.json();
    // Find first track with a preview URL
    for (const track of (data.items || [])) {
      if (track.preview_url) return { url: track.preview_url, name: track.name };
    }
    return null;
  } catch (e) {
    console.error("Spotify tracks fetch failed:", e);
    return null;
  }
}

function SpotifyPlayer({ spotifyId, isVisible, isSpinning }) {
  const [preview, setPreview] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);
  const lastSpotifyId = useRef(null);

  // Fetch preview when album changes
  useEffect(() => {
    if (!spotifyId || !isVisible) return;
    if (spotifyId === lastSpotifyId.current) return;
    lastSpotifyId.current = spotifyId;

    setPreview(null);
    setIsPlaying(false);
    setProgress(0);
    setFailed(false);

    (async () => {
      const result = await getPreviewUrl(spotifyId);
      if (result) {
        setPreview(result);
      } else {
        setFailed(true);
      }
    })();
  }, [spotifyId, isVisible]);

  // Auto-play when preview loads and vinyl is spinning
  useEffect(() => {
    if (preview && isSpinning && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [preview, isSpinning]);

  // Track progress
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(pct || 0);
        }
      }, 100);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !preview) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  if (!spotifyId || !isVisible) return null;

  // Fallback: link to Spotify if no preview available
  if (failed) {
    return (
      <div style={{ marginTop: 16, textAlign: "center", animation: "fadeUp 0.6s ease-out" }}>
        <a href={`https://open.spotify.com/album/${spotifyId}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            fontSize: 10, color: "#5a4a3a", fontFamily: "'Courier New', monospace",
            letterSpacing: 1.5, textDecoration: "none",
            padding: "6px 16px", border: "1px solid rgba(138,122,106,0.15)",
            borderRadius: 20, transition: "all 0.3s",
          }}
          onMouseEnter={(e) => { e.target.style.color = "#b89850"; e.target.style.borderColor = "rgba(180,140,80,0.3)"; }}
          onMouseLeave={(e) => { e.target.style.color = "#5a4a3a"; e.target.style.borderColor = "rgba(138,122,106,0.15)"; }}
        >
          LISTEN ON SPOTIFY &rarr;
        </a>
      </div>
    );
  }

  if (!preview) {
    return (
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%", background: "#3a2a1a",
          margin: "0 auto", animation: "pulse 1.5s ease-in-out infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20, animation: "fadeUp 0.6s ease-out",
      display: "flex", flexDirection: "column", alignItems: "center" }}>
      <audio
        ref={audioRef}
        src={preview.url}
        onEnded={() => { setIsPlaying(false); setProgress(0); }}
        preload="auto"
      />

      {/* Minimal custom player */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, width: 280,
      }}>
        {/* Play/pause button */}
        <button onClick={togglePlay} style={{
          width: 32, height: 32, borderRadius: "50%", border: "1px solid rgba(180,140,80,0.25)",
          background: "rgba(180,140,80,0.08)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.3s",
        }}>
          {isPlaying ? (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <rect x="1" y="1" width="3" height="10" rx="0.5" fill="#b89850" />
              <rect x="6" y="1" width="3" height="10" rx="0.5" fill="#b89850" />
            </svg>
          ) : (
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M1 1L9 6L1 11V1Z" fill="#b89850" />
            </svg>
          )}
        </button>

        {/* Progress bar + track name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontSize: 9, color: "#5a4a3a", fontFamily: "'Courier New', monospace",
            letterSpacing: 0.5, marginBottom: 5, overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {preview.name}
          </p>
          <div
            onClick={(e) => {
              if (!audioRef.current) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              audioRef.current.currentTime = pct * audioRef.current.duration;
              setProgress(pct * 100);
            }}
            style={{
              width: "100%", height: 3, background: "rgba(138,122,106,0.12)",
              borderRadius: 2, cursor: "pointer", position: "relative",
            }}
          >
            <div style={{
              width: `${progress}%`, height: "100%",
              background: "rgba(180,140,80,0.5)", borderRadius: 2,
              transition: "width 0.1s linear",
            }} />
          </div>
        </div>
      </div>

      <p style={{
        marginTop: 6, fontSize: 8, color: "#2a1a0a", fontFamily: "'Courier New', monospace",
        letterSpacing: 1, opacity: 0.4,
      }}>
        30-SECOND PREVIEW
      </p>
    </div>
  );
}

// ============================================================
// MOOD HISTORY WALL
// ============================================================
function MoodWall({ moodHistory }) {
  if (!moodHistory || moodHistory.length === 0) return null;
  return (
    <div style={{ marginTop: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(138,122,106,0.08)" }} />
        <p style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
          color: "#4a3a2a", fontFamily: "'Courier New', monospace" }}>
          What people brought to the collection
        </p>
        <div style={{ flex: 1, height: 1, background: "rgba(138,122,106,0.08)" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", maxHeight: 140, overflow: "hidden" }}>
        {moodHistory.slice(-40).map((entry, i) => (
          <div key={i} style={{
            padding: "3px 10px", fontSize: 10, fontFamily: "'Georgia', serif", fontStyle: "italic",
            color: `rgba(${130+(i%3)*15},${110+(i%4)*10},${95+(i%5)*8},${0.3+(i/40)*0.5})`,
            background: "rgba(255,255,255,0.008)",
            border: "1px solid rgba(138,122,106,0.05)", borderRadius: 14, whiteSpace: "nowrap",
          }}>
            {entry.mood}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SHELF VIEW
// ============================================================
function ShelfView({ onSelectRecord }) {
  const genreGroups = [
    { label: "Jazz", match: (g) => g.includes("Jazz") },
    { label: "Soul & Funk", match: (g) => g.includes("Soul") || g === "Funk" },
    { label: "Rock", match: (g) => (g.includes("Rock") || g === "New Wave" || g === "Art Rock") && !g.includes("Folk") && !g.includes("Jazz") },
    { label: "Folk", match: (g) => g.includes("Folk") },
    { label: "Blues & Country", match: (g) => g.includes("Blues") || g.includes("Country") },
  ];

  return (
    <div style={{ animation: "fadeUp 0.5s ease-out" }}>
      {genreGroups.map(({ label, match }) => {
        const records = CURATED_RECORDS.filter(r => match(r.genre));
        if (!records.length) return null;
        return (
          <div key={label} style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
              color: "#4a3a2a", fontFamily: "'Courier New', monospace", marginBottom: 10 }}>
              {label} ({records.length})
            </p>
            <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 6 }}>
              {records.map((record, idx) => {
                const pal = GENRE_PALETTES[record.genre] || GENRE_PALETTES["Rock"];
                const c = pal.accent[idx % pal.accent.length];
                return (
                  <div key={record.album} onClick={() => onSelectRecord(record)}
                    title={`${record.album} — ${record.artist}\n${record.tag}`}
                    style={{
                      width: 26, minHeight: 110, flexShrink: 0, borderRadius: 2, cursor: "pointer",
                      background: `linear-gradient(180deg, rgba(${c[0]},${c[1]},${c[2]},0.55) 0%, rgba(${c[0]-20},${c[1]-15},${c[2]-10},0.75) 100%)`,
                      boxShadow: "inset -1px 0 2px rgba(0,0,0,0.3), 1px 0 1px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s, box-shadow 0.2s", position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-10px)";
                      e.currentTarget.style.boxShadow = "inset -1px 0 2px rgba(0,0,0,0.3), 0 10px 24px rgba(0,0,0,0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "inset -1px 0 2px rgba(0,0,0,0.3), 1px 0 1px rgba(0,0,0,0.1)";
                    }}>
                    <div style={{
                      position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
                      writingMode: "vertical-rl", textOrientation: "mixed",
                      fontSize: 6.5, color: "rgba(255,255,255,0.65)",
                      fontFamily: "'Courier New', monospace", letterSpacing: 0.3,
                      whiteSpace: "nowrap", overflow: "hidden", maxHeight: "88%",
                    }}>
                      {record.artist.split(" ").pop()}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{
              height: 3, borderRadius: 1,
              background: "linear-gradient(180deg, rgba(70,55,38,0.35) 0%, rgba(35,28,18,0.5) 100%)",
              boxShadow: "0 2px 5px rgba(0,0,0,0.25)",
            }} />
          </div>
        );
      })}
      <p style={{ textAlign: "center", fontSize: 10, color: "#3a2a1a", fontStyle: "italic",
        fontFamily: "'Georgia', serif", marginTop: 8 }}>
        Pull a record to hear what Daniel would say
      </p>
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
export default function RecordCollection() {
  const [mood, setMood] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentView, setCurrentView] = useState("turntable");
  const artCanvasRef = useRef(null);

  const SAMPLE_MOODS = [
    "Sunday morning, coffee getting cold",
    "Driving at night with the windows down",
    "Missing someone who moved away",
    "Finally finished something I've been building",
    "Rain on the roof, nowhere to be",
  ];

  useEffect(() => {
    (async () => {
      try {
        const stored = await window.storage.get("mood-history", true);
        if (stored?.value) setMoodHistory(JSON.parse(stored.value));
      } catch (e) {}
    })();
  }, []);

  const saveMood = async (moodText, albumTitle) => {
    const entry = { mood: moodText, album: albumTitle, ts: Date.now() };
    const updated = [...moodHistory, entry].slice(-200);
    setMoodHistory(updated);
    try { await window.storage.set("mood-history", JSON.stringify(updated), true); } catch (e) {}
  };

  useEffect(() => {
    if (result?.record && artCanvasRef.current) {
      generateGenreArt(result.record, artCanvasRef.current);
    }
  }, [result]);

  const fetchRecommendation = useCallback(async (moodText) => {
    setIsLoading(true); setShowResult(false); setIsSpinning(false);
    setHasInteracted(true); setCurrentView("turntable");

    const recordList = CURATED_RECORDS.map(
      r => `"${r.album}" by ${r.artist} (${r.year}, ${r.genre}) — ${r.tag}`
    ).join("\n");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `You are the ghost of a record collection. You belong to Daniel, a brick mason and audiophile who spent decades building this collection. You speak warmly but plainly, like a craftsman who knows his materials. No pretension — just someone who deeply loved music and understood that the right album at the right moment is a kind of shelter.

Your records and when you played them:
${recordList}

Someone comes to you feeling: "${moodText}"

Pick the ONE record that fits best. Consider both the music and the personal context of when Daniel played it. Respond ONLY with valid JSON, no markdown, no backticks:
{"artist":"...","album":"...","year":...,"reason":"..."}

The reason should be 2-3 sentences max. Speak as Daniel would — direct, warm, a man who worked with his hands and chose his words carefully. You're handing someone a record, not writing an essay.` }],
        }),
      });

      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      if (!data.content?.length) throw new Error("Empty");

      const text = data.content.filter(i => i.type === "text").map(i => i.text).join("");
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON");

      const rec = JSON.parse(match[0]);
      const found = CURATED_RECORDS.find(r =>
        r.album.toLowerCase() === rec.album.toLowerCase() ||
        r.artist.toLowerCase() === rec.artist.toLowerCase()
      );
      setResult({ ...rec, record: found || { ...rec, genre: "Rock", tag: "" } });
      saveMood(moodText, rec.album);
      setTimeout(() => setIsSpinning(true), 400);
      setTimeout(() => setShowResult(true), 1000);
    } catch (err) {
      console.error("Fallback:", err);
      const idx = Math.abs(moodText.split("").reduce((a,c) => a+c.charCodeAt(0), 0)) % CURATED_RECORDS.length;
      const fb = CURATED_RECORDS[idx];
      setResult({
        artist: fb.artist, album: fb.album, year: fb.year,
        reason: "Sometimes you don't overthink it. You pull one off the shelf because the spine catches your eye. Trust that.",
        record: fb,
      });
      saveMood(moodText, fb.album);
      setTimeout(() => setIsSpinning(true), 400);
      setTimeout(() => setShowResult(true), 1000);
    } finally { setIsLoading(false); }
  }, [moodHistory]);

  const selectFromShelf = (record) => {
    setResult({ artist: record.artist, album: record.album, year: record.year, reason: record.tag, record });
    setCurrentView("turntable"); setHasInteracted(true);
    setTimeout(() => setIsSpinning(true), 400);
    setTimeout(() => setShowResult(true), 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0808", color: "#d4c9b8",
      fontFamily: "'Georgia','Times New Roman',serif", position: "relative", overflow: "hidden" }}>

      <div style={{ position: "fixed", inset: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(139,90,43,0.2) 3px, rgba(139,90,43,0.2) 5px)" }} />

      <div style={{ position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(180,120,60,0.05) 0%, transparent 70%)" }} />

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "48px 20px", position: "relative" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 9, letterSpacing: 4, textTransform: "uppercase",
            color: "#5a4a3a", marginBottom: 12, fontFamily: "'Courier New', monospace" }}>
            The Collection of Daniel Russell
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 400, lineHeight: 1.25, color: "#e8dcc8", marginBottom: 8 }}>
            Ask My Dad's<br />Record Collection
          </h1>
          <div style={{ width: 36, height: 1, background: "#3a2a1a", margin: "14px auto" }} />
          <p style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>
            Tell it your mood, your moment, the weather outside.<br />It'll pull the right record.
          </p>
        </div>

        {/* View toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 24 }}>
          {[{ id: "turntable", label: "Ask" }, { id: "shelf", label: "Browse the Shelf" }].map(v => (
            <button key={v.id} onClick={() => setCurrentView(v.id)} style={{
              padding: "5px 18px", fontSize: 10, fontFamily: "'Courier New', monospace",
              letterSpacing: 2, textTransform: "uppercase",
              background: currentView === v.id ? "rgba(180,140,80,0.1)" : "transparent",
              border: `1px solid rgba(180,140,80,${currentView === v.id ? 0.25 : 0.08})`,
              borderRadius: 3, color: currentView === v.id ? "#b89850" : "#4a3a2a",
              cursor: "pointer", transition: "all 0.3s",
            }}>
              {v.label}
            </button>
          ))}
        </div>

        {currentView === "shelf" && <ShelfView onSelectRecord={selectFromShelf} />}

        {currentView === "turntable" && (
          <>
            <div style={{ marginBottom: 36 }}>
              <input type="text" value={mood}
                onChange={e => setMood(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !isLoading && mood.trim() && fetchRecommendation(mood.trim())}
                placeholder="How are you feeling right now?"
                disabled={isLoading}
                style={{
                  width: "100%", padding: "13px 16px", fontSize: 14,
                  fontFamily: "'Georgia', serif", background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(138,122,106,0.15)", borderRadius: 3,
                  color: "#d4c9b8", outline: "none", transition: "border-color 0.3s",
                  boxSizing: "border-box", marginBottom: 10,
                }}
                onFocus={e => e.target.style.borderColor = "rgba(180,140,80,0.3)"}
                onBlur={e => e.target.style.borderColor = "rgba(138,122,106,0.15)"}
              />
              <button
                onClick={() => mood.trim() && !isLoading && fetchRecommendation(mood.trim())}
                disabled={!mood.trim() || isLoading}
                style={{
                  width: "100%", padding: "11px 16px", fontSize: 11,
                  fontFamily: "'Courier New', monospace", letterSpacing: 2, textTransform: "uppercase",
                  background: isLoading ? "rgba(180,140,80,0.06)" : "rgba(180,140,80,0.1)",
                  border: "1px solid rgba(180,140,80,0.2)", borderRadius: 3,
                  color: !mood.trim() || isLoading ? "#3a2a1a" : "#a88840",
                  cursor: !mood.trim() || isLoading ? "default" : "pointer", transition: "all 0.3s",
                }}>
                {isLoading ? "Pulling from the shelf..." : "Drop the needle"}
              </button>

              {!hasInteracted && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <p style={{ fontSize: 9, color: "#3a2a1a", letterSpacing: 1.5,
                    textTransform: "uppercase", marginBottom: 7, fontFamily: "'Courier New', monospace" }}>
                    Or try
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
                    {SAMPLE_MOODS.map(s => (
                      <button key={s} onClick={() => { setMood(s); fetchRecommendation(s); }}
                        style={{
                          padding: "4px 11px", fontSize: 10, fontFamily: "'Georgia', serif",
                          fontStyle: "italic", background: "rgba(255,255,255,0.01)",
                          border: "1px solid rgba(138,122,106,0.08)", borderRadius: 14,
                          color: "#5a4a3a", cursor: "pointer", transition: "all 0.3s",
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(result || isLoading) && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                opacity: isLoading && !result ? 0.3 : 1, transition: "opacity 0.5s",
              }}>
                <div style={{
                  position: "relative", width: 350, height: 330,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
                }}>
                  <div style={{
                    position: "absolute", width: 316, height: 316, borderRadius: "50%",
                    background: "rgba(16,14,11,0.9)",
                    boxShadow: "0 2px 20px rgba(0,0,0,0.35), inset 0 0 25px rgba(0,0,0,0.2)",
                  }} />
                  {result && (
                    <>
                      <VinylRecord record={result.record} isSpinning={isSpinning} artCanvasRef={artCanvasRef} />
                      <Tonearm isPlaying={isSpinning} />
                    </>
                  )}
                </div>

                {result && showResult && (
                  <div style={{ textAlign: "center", animation: "fadeUp 0.8s ease-out" }}>
                    <p style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
                      color: "#4a3a2a", marginBottom: 6, fontFamily: "'Courier New', monospace" }}>
                      {result.record?.genre || "Vinyl"} &middot; {result.year}
                    </p>
                    <h2 style={{ fontSize: 22, fontWeight: 400, color: "#e8dcc8",
                      marginBottom: 3, fontStyle: "italic" }}>
                      {result.album}
                    </h2>
                    <p style={{ fontSize: 14, color: "#8a7a6a", marginBottom: 18 }}>
                      {result.artist}
                    </p>
                    <div style={{
                      maxWidth: 370, margin: "0 auto", padding: "14px 18px",
                      background: "rgba(255,255,255,0.01)",
                      borderLeft: "2px solid rgba(180,140,80,0.18)",
                    }}>
                      <p style={{ fontSize: 12, lineHeight: 1.7, color: "#7a6a5a", fontStyle: "italic" }}>
                        "{result.reason}"
                      </p>
                    </div>
                    <SpotifyPlayer spotifyId={result.record?.spotifyId} isVisible={showResult} isSpinning={isSpinning} />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <MoodWall moodHistory={moodHistory} />

        <div style={{ marginTop: 56, textAlign: "center", paddingBottom: 28 }}>
          <div style={{ width: 18, height: 1, background: "#201810", margin: "0 auto 10px" }} />
          <p style={{ fontSize: 9, color: "#201810", fontFamily: "'Courier New', monospace",
            letterSpacing: 1.5, lineHeight: 1.8 }}>
            For Daniel Mark Russell<br />Brick mason. Audiophile. Father.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.5); } }
        input::placeholder { color: #3a2a1a; font-style: italic; }
        button:hover { filter: brightness(1.2); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(138,122,106,0.15); border-radius: 2px; }
      `}</style>
    </div>
  );
}
