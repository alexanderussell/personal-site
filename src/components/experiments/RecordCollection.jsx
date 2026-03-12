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
  { artist: "Willie Nelson", album: "Always on My Mind", year: 1982, genre: "Country", tag: "You Were Always on My Mind — that song said what he couldn't", spotifyId: "" },
  { artist: "Willie Nelson", album: "Stardust", year: 1978, genre: "Country", tag: "Moonlight in Vermont, late nights, your mother falling asleep on the couch", spotifyId: "38uGoW7jS8jjJMvZA26sRq" },

  // Folk / Singer-Songwriter — additions
  { artist: "Al Stewart", album: "Year of the Cat", year: 1976, genre: "Folk Rock", tag: "Played at your mom and my wedding", spotifyId: "" },
  { artist: "Jim James", album: "Eternally Even", year: 2016, genre: "Folk", tag: "Here in Spirit — one of the newer ones, but it fit right in", spotifyId: "2wYw4vZlu7XwvtdQPRmsmL" },
  { artist: "Buffalo Springfield", album: "Buffalo Springfield", year: 1966, genre: "Folk Rock", tag: "Before they all went solo and got famous", spotifyId: "" },
  { artist: "Leonard Cohen", album: "Songs of Leonard Cohen", year: 1967, genre: "Folk", tag: "Suzanne — a song that builds a room around you", spotifyId: "" },
  { artist: "Tim Buckley", album: "Starsailor", year: 1970, genre: "Folk", tag: "Song to the Siren — like nothing else on the shelf", spotifyId: "6XtiIO1SuBl4Eli8LCYNAH" },
  { artist: "Peter, Paul and Mary", album: "In the Wind", year: 1963, genre: "Folk", tag: "We played Blowin' in the Wind while decorating for Christmas", spotifyId: "5XresJcJBgYkVQE9PATjli" },
  { artist: "Jim Croce", album: "I Got a Name", year: 1973, genre: "Folk", tag: "Gone too soon, like a lot of the good ones", spotifyId: "" },
  { artist: "Donovan", album: "Sunshine Superman", year: 1966, genre: "Folk Rock", tag: "Lighter than most of the shelf, but earned its place", spotifyId: "" },
  { artist: "Nick Drake", album: "Pink Moon", year: 1972, genre: "Folk", tag: "Twenty-eight minutes, no filler, nothing wasted", spotifyId: "" },
  { artist: "Arlo Guthrie", album: "Alice's Restaurant", year: 1967, genre: "Folk", tag: "Alice's Restaurant Massacree — Thanksgiving tradition, every single year", spotifyId: "" },
  { artist: "John Prine", album: "Fair & Square", year: 2005, genre: "Folk", tag: "Clay Pigeons — Blaze Foley wrote it, John Prine made you believe it", spotifyId: "44sOCUUf8kp3Oj1yBYAKiZ" },
  { artist: "Paul Simon", album: "Paul Simon", year: 1972, genre: "Folk Rock", tag: "Duncan — the kind of song that tells a whole life", spotifyId: "7npBPiCHjPj8PVIGPuHXep" },

  // Rock — additions
  { artist: "Creedence Clearwater Revival", album: "Green River", year: 1969, genre: "Rock", tag: "Bad Moon Rising — could feel a storm coming every time", spotifyId: "" },
  { artist: "The Doobie Brothers", album: "Toulouse Street", year: 1972, genre: "Rock", tag: "Listen to the Music — that's all he ever wanted you to do", spotifyId: "" },
  { artist: "The Beatles", album: "The Beatles (White Album)", year: 1968, genre: "Rock", tag: "Blackbird — sang it once, very quietly, when he thought no one was listening", spotifyId: "" },
  { artist: "Ten Years After", album: "A Space in Time", year: 1971, genre: "Rock", tag: "I'd love to change the world — wouldn't we all", spotifyId: "3JXkf4wjTjKxyrzFvfaVJU" },
  { artist: "Nick Cave", album: "The Boatman's Call", year: 1997, genre: "Rock", tag: "Into My Arms — as close to a prayer as he got", spotifyId: "" },
  { artist: "Nick Cave", album: "Idiot Prayer", year: 2020, genre: "Rock", tag: "Palaces of Montezuma — solo piano, alone in a palace, still had something to say", spotifyId: "2q5FE0HvayCsZ0iz2CBjIp" },
  { artist: "Father John Misty", album: "Anthem +3", year: 2020, genre: "Folk", tag: "Covered Cat Stevens' Trouble — that's how you know someone understands", spotifyId: "4MsCxk1m3oX1NFKGsVZ2Xm" },
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
function VinylRecord({ record, isSpinning, artCanvasRef, isAudioPlaying, onTogglePlay, isDecelerating }) {
  const discRef = useRef(null);
  const isDragging = useRef(false);
  const lastAngle = useRef(0);
  const rotation = useRef(0);
  const [rot, setRot] = useState(0);
  const [hovered, setHovered] = useState(false);

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

  const spinAnim = isDecelerating
    ? "spinDecel 1.8s cubic-bezier(0.25, 0, 0.6, 1) forwards"
    : isSpinning
      ? "spin 2.8s linear infinite"
      : "none";

  return (
    <div ref={discRef} onMouseDown={onDown} onTouchStart={onDown}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ width: 300, height: 300, position: "relative", cursor: isSpinning ? "pointer" : "grab" }}>
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(circle at center,
          #1a1a1a 0%, #0d0d0d 14%, #1a1a1a 15%, #111 28%, #1a1a1a 29%,
          #0f0f0f 43%, #1a1a1a 44%, #111 58%, #1a1a1a 59%,
          #0d0d0d 73%, #1a1a1a 74%, #111 88%, #1a1a1a 89%, #0d0d0d 100%)`,
        transform: isSpinning || isDecelerating ? undefined : `rotate(${rot}deg)`,
        animation: spinAnim,
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
        animation: spinAnim,
        transform: isSpinning || isDecelerating ? undefined : `rotate(${rot}deg)`,
      }} />

      {/* Hover pause/play overlay */}
      {(isSpinning || isDecelerating || (isAudioPlaying !== undefined && !isSpinning)) && hovered && (
        <div onClick={(e) => { e.stopPropagation(); onTogglePlay?.(); }}
          className="absolute inset-0 rounded-full"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.35)", cursor: "pointer",
            transition: "opacity 0.2s", zIndex: 10,
          }}>
          {isAudioPlaying ? (
            <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
              <rect x="4" y="2" width="7" height="28" rx="1.5" fill="rgba(212,200,184,0.85)" />
              <rect x="17" y="2" width="7" height="28" rx="1.5" fill="rgba(212,200,184,0.85)" />
            </svg>
          ) : (
            <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
              <path d="M4 2L26 16L4 30V2Z" fill="rgba(212,200,184,0.85)" />
            </svg>
          )}
        </div>
      )}
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
// Fetches preview URL via server-side API route.
// See HANDOFF.md for the /api/spotify-preview route implementation.
// ============================================================

// TODO: Replace with your public Spotify playlist URL
const DANS_PLAYLIST_URL = "https://open.spotify.com/playlist/YOUR_PLAYLIST_ID";

const linkStyle = {
  fontSize: 12, color: "#9a8a7a", fontFamily: "'Courier New', monospace",
  letterSpacing: 1.5, textDecoration: "none",
  padding: "7px 18px", border: "1px solid rgba(138,122,106,0.2)",
  borderRadius: 20, transition: "all 0.3s", display: "inline-block",
};

function SpotifyLinks({ artist, album, spotifyId }) {
  const onEnter = (e) => { e.target.style.color = "#d4b870"; e.target.style.borderColor = "rgba(180,140,80,0.4)"; };
  const onLeave = (e) => { e.target.style.color = "#9a8a7a"; e.target.style.borderColor = "rgba(138,122,106,0.2)"; };

  // Use album page if we have a spotifyId, otherwise search
  const spotifyUrl = spotifyId
    ? `https://open.spotify.com/album/${spotifyId}`
    : `https://open.spotify.com/search/${encodeURIComponent(`${artist} ${album}`)}`;

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
      <a href={spotifyUrl}
        target="_blank" rel="noopener noreferrer"
        style={linkStyle}
        onMouseEnter={onEnter} onMouseLeave={onLeave}>
        LISTEN ON SPOTIFY
      </a>
      <a href={DANS_PLAYLIST_URL}
        target="_blank" rel="noopener noreferrer"
        style={linkStyle}
        onMouseEnter={onEnter} onMouseLeave={onLeave}>
        DAN'S PLAYLIST
      </a>
    </div>
  );
}

async function getPreviewUrl(artist, album, spotifyId) {
  try {
    const params = new URLSearchParams({ artist, album });
    if (spotifyId) params.set('spotifyId', spotifyId);
    const resp = await fetch(`/api/spotify-preview?${params}`);
    const data = await resp.json();
    return data.url ? data : data.spotifyId ? { url: null, spotifyId: data.spotifyId } : null;
  } catch (e) {
    console.error("Preview fetch failed:", e);
    return null;
  }
}

// SpotifyPlayer removed — audio now managed by main RecordCollection component.
// Vinyl disc itself serves as the play/pause control via hover overlay.

// ============================================================
// MOOD HISTORY WALL
// ============================================================
const WALL_FONTS = [
  "'Georgia', serif",
  "'Courier New', monospace",
  "'Times New Roman', serif",
  "cursive",
  "'Trebuchet MS', sans-serif",
];

function MoodWall({ moodHistory, onSelectMood }) {
  if (!moodHistory || moodHistory.length === 0) return null;

  // Deterministic pseudo-random from index
  const seed = (i) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const notes = moodHistory.slice(-40);

  return (
    <div style={{ marginTop: 56 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(138,122,106,0.08)" }} />
        <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase",
          color: "#6a5a4a", fontFamily: "'Courier New', monospace" }}>
          Written on the wall
        </p>
        <div style={{ flex: 1, height: 1, background: "rgba(138,122,106,0.08)" }} />
      </div>
      <div style={{
        position: "relative",
        display: "flex",
        flexWrap: "wrap",
        gap: 0,
        justifyContent: "center",
        padding: "10px 0",
      }}>
        {notes.map((entry, i) => {
          const r = seed(i);
          const r2 = seed(i + 50);
          const r3 = seed(i + 100);
          const rotDeg = (r - 0.5) * 8; // -4 to 4 degrees
          const font = WALL_FONTS[Math.floor(r2 * WALL_FONTS.length)];
          const fontSize = 12 + Math.floor(r3 * 4); // 12-15px
          const opacity = 0.45 + r * 0.35; // 0.45-0.80
          const marginTop = Math.floor((r2 - 0.5) * 12); // -6 to 6
          const marginLeft = Math.floor((r3 - 0.5) * 6); // -3 to 3
          const isClickable = !!entry.album;

          return (
            <div
              key={i}
              onClick={() => isClickable && onSelectMood?.(entry)}
              className="mood-note"
              style={{
                padding: "8px 14px",
                margin: `${marginTop}px ${marginLeft}px`,
                transform: `rotate(${rotDeg}deg)`,
                cursor: isClickable ? "pointer" : "default",
                transition: "transform 0.25s ease, opacity 0.25s ease",
                position: "relative",
                maxWidth: 200,
                flexShrink: 0,
              }}
            >
              <p style={{
                fontSize,
                fontFamily: font,
                fontStyle: r > 0.4 ? "italic" : "normal",
                color: `rgba(200,185,160,${opacity})`,
                lineHeight: 1.4,
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}>
                {entry.mood}
              </p>
              {isClickable && (
                <p style={{
                  fontSize: 9,
                  fontFamily: "'Courier New', monospace",
                  color: "rgba(180,140,80,0)",
                  letterSpacing: 1,
                  marginTop: 3,
                  transition: "color 0.25s ease",
                }}
                className="mood-note-album">
                  {entry.album}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// SHELF VIEW
// ============================================================
function ShelfView({ onSelectRecord }) {
  const shelf = { spineWidth: 20, spineHeight: 160, fontSize: 10, hoverLift: 24, textOpacity: 0.85, gap: 2.5 };

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
            <p style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
              color: "#6a5a4a", fontFamily: "'Courier New', monospace", marginBottom: 10 }}>
              {label} ({records.length})
            </p>
            <div style={{
              display: "flex", gap: shelf.gap, overflowX: "auto", overflowY: "visible",
              paddingTop: shelf.hoverLift + 4, paddingBottom: 6,
            }}>
              {records.map((record, idx) => {
                const pal = GENRE_PALETTES[record.genre] || GENRE_PALETTES["Rock"];
                const c = pal.accent[idx % pal.accent.length];
                return (
                  <div key={`${record.artist}-${record.album}`} onClick={() => onSelectRecord(record)}
                    title={`${record.album} — ${record.artist}\n${record.tag}`}
                    style={{
                      width: shelf.spineWidth, minHeight: shelf.spineHeight, flexShrink: 0, borderRadius: 2, cursor: "pointer",
                      background: `linear-gradient(180deg, rgba(${c[0]},${c[1]},${c[2]},0.55) 0%, rgba(${c[0]-20},${c[1]-15},${c[2]-10},0.75) 100%)`,
                      boxShadow: "inset -1px 0 2px rgba(0,0,0,0.3), 1px 0 1px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s, box-shadow 0.2s", position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = `translateY(-${shelf.hoverLift}px)`;
                      e.currentTarget.style.boxShadow = `inset -1px 0 2px rgba(0,0,0,0.3), 0 ${shelf.hoverLift}px 24px rgba(0,0,0,0.35)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "inset -1px 0 2px rgba(0,0,0,0.3), 1px 0 1px rgba(0,0,0,0.1)";
                    }}>
                    <div style={{
                      position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
                      writingMode: "vertical-rl", textOrientation: "mixed",
                      fontSize: shelf.fontSize, color: `rgba(255,255,255,${shelf.textOpacity})`,
                      fontFamily: "'Outfit Variable', 'Outfit', sans-serif", fontWeight: 400, letterSpacing: 0.5,
                      whiteSpace: "nowrap", overflow: "hidden", maxHeight: "90%",
                      display: "flex", gap: 6,
                    }}>
                      <span style={{ fontWeight: 500 }}>{record.artist.split(" ").pop()}</span>
                      <span style={{ opacity: 0.5, fontSize: shelf.fontSize - 1 }}>{record.album}</span>
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
      <p style={{ textAlign: "center", fontSize: 13, color: "#6a5a4a", fontStyle: "italic",
        fontFamily: "'Georgia', serif", marginTop: 12 }}>
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
  const [isDecelerating, setIsDecelerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentView, setCurrentView] = useState("turntable");
  const artCanvasRef = useRef(null);

  // Audio state — lifted from SpotifyPlayer so vinyl controls playback
  const audioRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const lastAudioKey = useRef(null);

  // Pre-mapped sample moods — no AI call needed, saves tokens
  const SAMPLE_MOODS = [
    { mood: "Sunday morning, coffee getting cold", artist: "Dave Brubeck", album: "Time Out" },
    { mood: "Driving at night with the windows down", artist: "Fleetwood Mac", album: "Rumours" },
    { mood: "Missing someone who moved away", artist: "Joni Mitchell", album: "Blue" },
    { mood: "Finally finished something I've been building", artist: "John Coltrane", album: "A Love Supreme" },
    { mood: "Rain on the roof, nowhere to be", artist: "Cat Stevens", album: "Tea for the Tillerman" },
  ];

  useEffect(() => {
    (async () => {
      try {
        // Replace with your persistence layer — see HANDOFF.md
        // Options: Supabase, Vercel KV, or /api/moods route
        const resp = await fetch("/api/moods");
        if (resp.ok) {
          const data = await resp.json();
          setMoodHistory(data.moods || []);
        }
      } catch (e) {}
    })();
  }, []);

  const saveMood = async (moodText, albumTitle) => {
    const entry = { mood: moodText, album: albumTitle, ts: Date.now() };
    const updated = [...moodHistory, entry].slice(-200);
    setMoodHistory(updated);
    try {
      await fetch("/api/moods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch (e) {}
  };

  useEffect(() => {
    if (result?.record && artCanvasRef.current) {
      generateGenreArt(result.record, artCanvasRef.current);
    }
  }, [result]);

  // Fetch audio preview when result changes
  useEffect(() => {
    if (!result?.artist || !result?.album || !showResult) return;
    const key = `${result.artist}-${result.album}`;
    if (key === lastAudioKey.current) return;
    lastAudioKey.current = key;

    setPreview(null);
    setIsAudioPlaying(false);
    setAudioFailed(false);

    (async () => {
      const data = await getPreviewUrl(result.artist, result.album, result.record?.spotifyId);
      if (data && data.url) {
        setPreview(data);
      } else {
        setAudioFailed(true);
      }
    })();
  }, [result, showResult]);

  // Auto-play when preview loads and vinyl is spinning
  useEffect(() => {
    if (preview && isSpinning && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise) {
        playPromise.then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false));
      }
    }
  }, [preview, isSpinning]);

  // Toggle play/pause — controls both audio and vinyl spin
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !preview) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
      // Decelerate the vinyl
      setIsDecelerating(true);
      setIsSpinning(false);
      setTimeout(() => setIsDecelerating(false), 1800);
    } else {
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
        setIsDecelerating(false);
        setIsSpinning(true);
      }).catch(() => {});
    }
  }, [preview, isAudioPlaying]);

  const fetchRecommendation = useCallback(async (moodText) => {
    setIsLoading(true); setShowResult(false); setIsSpinning(false);
    setHasInteracted(true); setCurrentView("turntable");

    const recordList = CURATED_RECORDS.map(
      r => `"${r.album}" by ${r.artist} (${r.year}, ${r.genre}) — ${r.tag}`
    ).join("\n");

    try {
      // Server-side API route handles Claude authentication
      // See HANDOFF.md for /api/recommend route implementation
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: moodText, recordList }),
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

  // Select a pre-mapped sample mood — no AI call
  const selectPreMapped = (sample) => {
    const record = CURATED_RECORDS.find(r =>
      r.artist === sample.artist && r.album === sample.album
    );
    if (!record) return;
    setIsLoading(true); setShowResult(false); setIsSpinning(false);
    setHasInteracted(true); setCurrentView("turntable");
    setResult({ artist: record.artist, album: record.album, year: record.year, reason: record.tag, record });
    setTimeout(() => { setIsLoading(false); setIsSpinning(true); }, 400);
    setTimeout(() => setShowResult(true), 1000);
  };

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

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px", position: "relative" }}>

        {/* Header — collapses when showing a result */}
        {!(showResult && result) && (
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              color: "#7a6a5a", marginBottom: 12, fontFamily: "'Courier New', monospace" }}>
              The Collection of Daniel Russell
            </p>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 400, lineHeight: 1.2, color: "#efe5d5", marginBottom: 8,
              fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Ask My Dad's Record Collection
            </h1>
            <div style={{ width: 36, height: 1, background: "#4a3a2a", margin: "14px auto" }} />
            <p style={{ fontSize: 14, color: "#7a6a5a", lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>
              Tell it your mood, your moment, the weather outside.<br />It'll pull the right record.
            </p>
          </div>
        )}

        {/* Compact header when result is showing */}
        {showResult && result && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
              color: "#7a6a5a", fontFamily: "'Courier New', monospace", marginBottom: 14 }}>
              The Collection of Daniel Russell
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => {
                if (audioRef.current) { audioRef.current.pause(); }
                setResult(null); setShowResult(false); setIsSpinning(false);
                setIsDecelerating(false); setIsAudioPlaying(false);
                setPreview(null); setAudioFailed(false); lastAudioKey.current = null;
                setMood(""); setCurrentView("turntable");
              }} style={{
                padding: "7px 20px", fontSize: 11,
                fontFamily: "'Courier New', monospace", letterSpacing: 2, textTransform: "uppercase",
                background: "transparent", border: "1px solid rgba(180,140,80,0.2)",
                borderRadius: 3, color: "#9a8a7a", cursor: "pointer", transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.target.style.color = "#d4b870"; e.target.style.borderColor = "rgba(180,140,80,0.4)"; }}
              onMouseLeave={e => { e.target.style.color = "#9a8a7a"; e.target.style.borderColor = "rgba(180,140,80,0.2)"; }}>
                Ask again
              </button>
              <button onClick={() => {
                if (audioRef.current) { audioRef.current.pause(); }
                setResult(null); setShowResult(false); setIsSpinning(false);
                setIsDecelerating(false); setIsAudioPlaying(false);
                setPreview(null); setAudioFailed(false); lastAudioKey.current = null;
                setMood(""); setCurrentView("shelf");
              }} style={{
                padding: "7px 20px", fontSize: 11,
                fontFamily: "'Courier New', monospace", letterSpacing: 2, textTransform: "uppercase",
                background: "transparent", border: "1px solid rgba(180,140,80,0.2)",
                borderRadius: 3, color: "#9a8a7a", cursor: "pointer", transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.target.style.color = "#d4b870"; e.target.style.borderColor = "rgba(180,140,80,0.4)"; }}
              onMouseLeave={e => { e.target.style.color = "#9a8a7a"; e.target.style.borderColor = "rgba(180,140,80,0.2)"; }}>
                Back to shelf
              </button>
            </div>
          </div>
        )}

        {/* Controls — hidden when result is showing */}
        {!(showResult && result) && (
          <>
            {/* View toggle */}
            <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 24 }}>
              {[{ id: "turntable", label: "Ask" }, { id: "shelf", label: "Browse the Shelf" }].map(v => (
                <button key={v.id} onClick={() => setCurrentView(v.id)} style={{
                  padding: "7px 22px", fontSize: 12, fontFamily: "'Courier New', monospace",
                  letterSpacing: 2, textTransform: "uppercase",
                  background: currentView === v.id ? "rgba(180,140,80,0.1)" : "transparent",
                  border: `1px solid rgba(180,140,80,${currentView === v.id ? 0.3 : 0.12})`,
                  borderRadius: 3, color: currentView === v.id ? "#d4b870" : "#6a5a4a",
                  cursor: "pointer", transition: "all 0.3s",
                }}>
                  {v.label}
                </button>
              ))}
            </div>

            {currentView === "shelf" && <ShelfView onSelectRecord={selectFromShelf} />}
          </>
        )}

        {(!(showResult && result) || currentView === "turntable") && currentView === "turntable" && !(showResult && result) && (
          <>
            <div style={{ marginBottom: 36 }}>
              <input type="text" value={mood}
                onChange={e => setMood(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !isLoading && mood.trim() && fetchRecommendation(mood.trim())}
                placeholder="How are you feeling right now?"
                disabled={isLoading}
                style={{
                  width: "100%", padding: "14px 16px", fontSize: 15,
                  fontFamily: "'Georgia', serif", background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(138,122,106,0.18)", borderRadius: 3,
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
                  width: "100%", padding: "12px 16px", fontSize: 13,
                  fontFamily: "'Courier New', monospace", letterSpacing: 2, textTransform: "uppercase",
                  background: isLoading ? "rgba(180,140,80,0.06)" : "rgba(180,140,80,0.1)",
                  border: "1px solid rgba(180,140,80,0.25)", borderRadius: 3,
                  color: !mood.trim() || isLoading ? "#6a5a4a" : "#d4b870",
                  cursor: !mood.trim() || isLoading ? "default" : "pointer", transition: "all 0.3s",
                }}>
                {isLoading ? "Pulling from the shelf..." : "Drop the needle"}
              </button>

              {!hasInteracted && (
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <p style={{ fontSize: 12, color: "#6a5a4a", letterSpacing: 1.5,
                    textTransform: "uppercase", marginBottom: 10, fontFamily: "'Courier New', monospace" }}>
                    Or try
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                    {SAMPLE_MOODS.map(s => (
                      <button key={s.mood} onClick={() => { setMood(s.mood); selectPreMapped(s); }}
                        style={{
                          padding: "6px 14px", fontSize: 13, fontFamily: "'Georgia', serif",
                          fontStyle: "italic", background: "rgba(255,255,255,0.015)",
                          border: "1px solid rgba(138,122,106,0.15)", borderRadius: 14,
                          color: "#9a8a7a", cursor: "pointer", transition: "all 0.3s",
                        }}>
                        {s.mood}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </>
        )}

        {/* Vinyl + result — always visible when we have a result */}
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
                  <VinylRecord
                    record={result.record}
                    isSpinning={isSpinning}
                    isDecelerating={isDecelerating}
                    isAudioPlaying={isAudioPlaying}
                    onTogglePlay={togglePlay}
                    artCanvasRef={artCanvasRef}
                  />
                  <Tonearm isPlaying={isSpinning} />
                </>
              )}
              {/* Hidden audio element */}
              {preview && (
                <audio
                  ref={audioRef}
                  src={preview.url}
                  onEnded={() => {
                    setIsAudioPlaying(false);
                    setIsDecelerating(true);
                    setIsSpinning(false);
                    setTimeout(() => setIsDecelerating(false), 1800);
                  }}
                  preload="auto"
                />
              )}
            </div>

            {result && showResult && (
              <div style={{ textAlign: "center", animation: "fadeUp 0.8s ease-out" }}>
                <p style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase",
                  color: "#6a5a4a", marginBottom: 8, fontFamily: "'Courier New', monospace" }}>
                  {result.record?.genre || "Vinyl"} &middot; {result.year}
                </p>
                <h2 style={{ fontSize: 24, fontWeight: 400, color: "#efe5d5",
                  marginBottom: 4, fontStyle: "italic" }}>
                  {result.album}
                </h2>
                <p style={{ fontSize: 15, color: "#9a8a7a", marginBottom: 20 }}>
                  {result.artist}
                </p>
                <div style={{
                  maxWidth: 370, margin: "0 auto", padding: "16px 20px",
                  background: "rgba(255,255,255,0.015)",
                  borderLeft: "2px solid rgba(180,140,80,0.25)",
                }}>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#c4b4a0", fontStyle: "italic" }}>
                    "{result.reason}"
                  </p>
                </div>
                <SpotifyLinks artist={result.artist} album={result.album} spotifyId={result.record?.spotifyId} />
                {preview && (
                  <p style={{
                    marginTop: 8, fontSize: 10, color: "#6a5a4a", fontFamily: "'Courier New', monospace",
                    letterSpacing: 1, textAlign: "center",
                  }}>
                    {isAudioPlaying ? `Playing: ${preview.name}` : "Hover the vinyl to play"}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <MoodWall moodHistory={moodHistory} onSelectMood={(entry) => {
          const record = CURATED_RECORDS.find(r => r.album === entry.album);
          if (record) selectFromShelf(record);
        }} />

        <div style={{ marginTop: 56, textAlign: "center", paddingBottom: 28 }}>
          <div style={{ width: 18, height: 1, background: "#4a3a2a", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 12, color: "#6a5a4a", fontFamily: "'Courier New', monospace",
            letterSpacing: 1.5, lineHeight: 1.8 }}>
            For Daniel Mark Russell<br />Brick mason. Audiophile. Father.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinDecel { from { transform: rotate(0deg); } to { transform: rotate(120deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.5); } }
        .mood-note:hover { transform: rotate(0deg) scale(1.05) !important; opacity: 1; z-index: 2; }
        .mood-note:hover .mood-note-album { color: rgba(180,140,80,0.5) !important; }
        input::placeholder { color: #6a5a4a; font-style: italic; }
        button:hover { filter: brightness(1.2); }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(138,122,106,0.15); border-radius: 2px; }
      `}</style>
    </div>
  );
}
