import { useState, useRef, useEffect, useCallback } from "react";

// ============================================================
// COLLECTION DATA — Expanded with genres, decades, personal tags
// Alex: Add/replace records here. The "tag" field is what Daniel
// might say about when he played it. Feeds directly into the AI voice.
// ============================================================
const CURATED_RECORDS = [
  // Jazz
  { artist: "Miles Davis", album: "Kind of Blue", year: 1959, genre: "Jazz", track: "So What", tag: "When the house finally got quiet, this is what I put on. Every time.", spotifyId: "1weenld61qoidwYuZ1GESA" },
  { artist: "John Coltrane", album: "A Love Supreme", year: 1965, genre: "Jazz", track: "Acknowledgement", tag: "End of a long job, everything aching, and this made it all worth it.", spotifyId: "7Eoz7hJvaX1eFkbpQxC5PA" },
  { artist: "Thelonious Monk", album: "Brilliant Corners", year: 1957, genre: "Jazz", track: "Brilliant Corners", tag: "This album understands angles better than most architects I worked with.", spotifyId: "5gWF47eGSbv4BOfxoFcQtd" },
  { artist: "Dave Brubeck", album: "Time Out", year: 1959, genre: "Jazz", track: "Take Five", tag: "Sunday mornings. Coffee. No exceptions.", spotifyId: "0nTTEAhCZsbbeplyDMIFuA" },
  { artist: "Charles Mingus", album: "The Black Saint and the Sinner Lady", year: 1963, genre: "Jazz", track: "Solo Dancer", tag: "When I had to think something through. This one does the thinking with you.", spotifyId: "6Sts4Yh7KsDFwq2yTWrGGV" },
  { artist: "Herbie Hancock", album: "Head Hunters", year: 1973, genre: "Jazz Funk", track: "Chameleon", tag: "Try standing still to this. You can't. I tried.", spotifyId: "5fmIolILp5NAtNYiRPjhzA" },
  { artist: "Nina Simone", album: "I Put a Spell on You", year: 1965, genre: "Jazz", track: "Feeling Good", tag: "That voice could lay bricks by itself.", spotifyId: "6MKa7MmGRCPjnGLns1fMKC" },

  // Soul / Funk / R&B
  { artist: "Marvin Gaye", album: "What's Going On", year: 1971, genre: "Soul", track: "What's Going On", tag: "If you only ever listen to one record, make it this one.", spotifyId: "2v6ANhWhZBUKkg6pJJBs3B" },
  { artist: "Al Green", album: "Let's Stay Together", year: 1972, genre: "Soul", track: "Let's Stay Together", tag: "Anniversary record. June and I never skipped it.", spotifyId: "1FWBPHkYbzOQGMWEFaGn1f" },
  { artist: "Stevie Wonder", album: "Songs in the Key of Life", year: 1976, genre: "Soul", track: "Sir Duke", tag: "Only double album where every single groove earns its place.", spotifyId: "6YUCc2RiXcEKS9ibuGXjEe" },
  { artist: "Curtis Mayfield", album: "Superfly", year: 1972, genre: "Soul", track: "Superfly", tag: "Loud in the truck. Windows down. That's all you need to know.", spotifyId: "2wFqYhgMYzMGjiv1TNzu36" },
  { artist: "Bill Withers", album: "Still Bill", year: 1972, genre: "Soul", track: "Lean on Me", tag: "Guy worked in a factory before he made records. You can hear it. That's a compliment.", spotifyId: "1eNpEFOlQMop4OFBQT1bPS" },
  { artist: "Otis Redding", album: "Otis Blue", year: 1965, genre: "Soul", track: "I've Been Loving You Too Long", tag: "Four minutes of Otis fixes just about any bad day you're having.", spotifyId: "4vFKErQavGgiqE47mUkwFP" },
  { artist: "Aretha Franklin", album: "I Never Loved a Man the Way I Love You", year: 1967, genre: "Soul", track: "Respect", tag: "You handle this record with care. She earned that.", spotifyId: "7MSfTWBjxbbGRAqkkFMlDi" },
  { artist: "Parliament", album: "Mothership Connection", year: 1975, genre: "Funk", track: "Give Up the Funk", tag: "Friday night record. Don't overthink it.", spotifyId: "5GwBYRIzETEAhFOleFaLcP" },
  { artist: "Earth, Wind & Fire", album: "That's the Way of the World", year: 1975, genre: "Soul", track: "Shining Star", tag: "Cookouts. Every single time. Not negotiable.", spotifyId: "2QLLU4Fgi5JMKvNtO07mjc" },

  // Rock
  { artist: "Pink Floyd", album: "Wish You Were Here", year: 1975, genre: "Rock", track: "Wish You Were Here", tag: "Sleeve's worn thin. That should tell you something.", spotifyId: "0bCAjiUamIFqKJsekOYuRw" },
  { artist: "Led Zeppelin", album: "Physical Graffiti", year: 1975, genre: "Rock", track: "Kashmir", tag: "The craftsmanship on this thing. They built it to last.", spotifyId: "1lZahjeu4AhPkg9JARZr3F" },
  { artist: "Fleetwood Mac", album: "Rumours", year: 1977, genre: "Rock", track: "Dreams", tag: "Everybody's got this one. There's a reason for that.", spotifyId: "1bt6q2SruMsBtcerNVtpZB" },
  { artist: "The Beatles", album: "Abbey Road", year: 1969, genre: "Rock", track: "Come Together", tag: "Last great thing they built together. You can hear them knowing it.", spotifyId: "0ETFjACtuP2ADo6LFhL6HN" },
  { artist: "Dire Straits", album: "Brothers in Arms", year: 1985, genre: "Rock", track: "Brothers in Arms", tag: "Bought this on CD first. Then bought it again on vinyl because it deserved it.", spotifyId: "3CYTV2M8uo0PamCJSaMttw" },
  { artist: "The Who", album: "Who's Next", year: 1971, genre: "Rock", track: "Baba O'Riley", tag: "When the energy in the room needed to match the work getting done.", spotifyId: "5MpFMGg36ldtrSXaERr1sQ" },
  { artist: "Creedence Clearwater Revival", album: "Cosmo's Factory", year: 1970, genre: "Rock", track: "Travelin' Band", tag: "Garage door open, this cranked up. Best way to spend a Saturday.", spotifyId: "6wPXUmYJ1sSRVyAMmTgdR8" },
  { artist: "The Allman Brothers Band", album: "At Fillmore East", year: 1971, genre: "Rock", track: "Whipping Post", tag: "Live albums tell you who a band really is. These guys were the real deal.", spotifyId: "3e5dScVvjOZqVLm99DkaQz" },
  { artist: "Cream", album: "Disraeli Gears", year: 1967, genre: "Rock", track: "Sunshine of Your Love", tag: "Three guys who built something way bigger than themselves. I respect that.", spotifyId: "0bBIos1YYvOBI2wOkJOUWe" },

  // Folk / Singer-Songwriter
  { artist: "Joni Mitchell", album: "Blue", year: 1971, genre: "Folk", track: "A Case of You", tag: "Careful with this one. It'll get in there if you let it.", spotifyId: "1vz94WpXDVYIEGja8cjFNa" },
  { artist: "Bob Dylan", album: "Blood on the Tracks", year: 1975, genre: "Folk Rock", track: "Tangled Up in Blue", tag: "Dylan understood what it costs to build something and then lose it.", spotifyId: "4qCKrmJBMHHVsZqIghPkRS" },
  { artist: "Cat Stevens", album: "Tea for the Tillerman", year: 1970, genre: "Folk", track: "Wild World", tag: "Put this on when I was thinking about my own old man.", spotifyId: "6AvnF4VQKQamOKIEB9TV8S" },
  { artist: "Simon & Garfunkel", album: "Bridge over Troubled Water", year: 1970, genre: "Folk Rock", track: "Bridge over Troubled Water", tag: "When somebody's hurting, you don't say much. You put this on.", spotifyId: "0JwHz5SSvpYWuuCNbtYZoV" },
  { artist: "James Taylor", album: "Sweet Baby James", year: 1970, genre: "Folk", track: "Fire and Rain", tag: "Evening. Windows open. Nothing else to do but listen.", spotifyId: "4GBARCMjMBsMYPaePGthDy" },
  { artist: "Tom Waits", album: "Closing Time", year: 1973, genre: "Folk", track: "Ol' 55", tag: "Tom Waits builds songs the way I build walls. Rough, honest, and still standing.", spotifyId: "5kBIulEBFJ36PnOSHqrB5l" },
  { artist: "Van Morrison", album: "Astral Weeks", year: 1968, genre: "Folk Rock", track: "Astral Weeks", tag: "Sit down for this one. I mean it.", spotifyId: "2qOauwFeIONzs6jNDBGn1p" },

  // Progressive / New Wave / Other
  { artist: "Talking Heads", album: "Remain in Light", year: 1980, genre: "New Wave", track: "Once in a Lifetime", tag: "Didn't get it at first. Then I couldn't stop playing it. That's how the good ones work.", spotifyId: "4FR8Z4e1sHwbMHqAhciGRs" },
  { artist: "Steely Dan", album: "Aja", year: 1977, genre: "Jazz Rock", track: "Deacon Blues", tag: "These guys were perfectionists. I can respect a perfectionist.", spotifyId: "1kMEoxvlpSrKECb1GB1jZe" },
  { artist: "Yes", album: "Close to the Edge", year: 1972, genre: "Progressive Rock", track: "Close to the Edge", tag: "Long drives. This and the road and nothing else.", spotifyId: "7cmHCFNsgVAGpOmNsW0qNm" },
  { artist: "Peter Gabriel", album: "So", year: 1986, genre: "Art Rock", track: "In Your Eyes", tag: "Lent this out a hundred times. Surprised everyone who borrowed it.", spotifyId: "4CaKWwmVT0X0Jjr8T28wlh" },

  // Blues / Country
  { artist: "B.B. King", album: "Live at the Regal", year: 1965, genre: "Blues", track: "Every Day I Have the Blues", tag: "Everything else on this shelf comes from right here. Start here.", spotifyId: "4jGiMRST4t9m3dvEz8cJN3" },
  { artist: "Muddy Waters", album: "Folk Singer", year: 1964, genre: "Blues", track: "My Home Is in the Delta", tag: "Stripped way down. No fuss. That's how good work should be.", spotifyId: "2RkGOq4JlKO1F3gCxUEjyR" },
  { artist: "Johnny Cash", album: "At Folsom Prison", year: 1968, genre: "Country", track: "Folsom Prison Blues", tag: "Real and rough and not apologizing for any of it.", spotifyId: "3SHTbP8FHQwCMGwxCI5bQe" },
  { artist: "Willie Nelson", album: "Red Headed Stranger", year: 1975, genre: "Country", track: "Blue Eyes Crying in the Rain", tag: "Simple story, told right. That's harder than people think.", spotifyId: "4GgcVkNma5i5NJiLv2Gieb" },
  { artist: "Willie Nelson", album: "Always on My Mind", year: 1982, genre: "Country", track: "Always on My Mind", tag: "That title track said what I never quite could. June knew.", spotifyId: "" },
  { artist: "Willie Nelson", album: "Stardust", year: 1978, genre: "Country", track: "Moonlight in Vermont", tag: "Moonlight in Vermont. Late nights. Your mother asleep on the couch.", spotifyId: "38uGoW7jS8jjJMvZA26sRq" },

  // Folk / Singer-Songwriter — additions
  { artist: "Al Stewart", album: "Year of the Cat", year: 1976, genre: "Folk Rock", track: "Year of the Cat", tag: "Played this at our wedding. Your mom and me. That's all I need to say.", spotifyId: "" },
  { artist: "Jim James", album: "Eternally Even", year: 2016, genre: "Folk", track: "Here in Spirit", tag: "Newer than most of what's on here, but it earned its spot.", spotifyId: "2wYw4vZlu7XwvtdQPRmsmL" },
  { artist: "Buffalo Springfield", album: "Buffalo Springfield", year: 1966, genre: "Folk Rock", track: "For What It's Worth", tag: "Before Neil Young and Stephen Stills went off and got famous. This is where it started.", spotifyId: "" },
  { artist: "Leonard Cohen", album: "Songs of Leonard Cohen", year: 1967, genre: "Folk", track: "Suzanne", tag: "Suzanne. That song builds a whole room around you and locks the door.", spotifyId: "" },
  { artist: "Tim Buckley", album: "Starsailor", year: 1970, genre: "Folk", track: "Song to the Siren", tag: "Song to the Siren. Nothing else on the shelf sounds like this. Nothing.", spotifyId: "6XtiIO1SuBl4Eli8LCYNAH" },
  { artist: "Peter, Paul and Mary", album: "In the Wind", year: 1963, genre: "Folk", track: "Blowin' in the Wind", tag: "We'd put Blowin' in the Wind on while decorating for Christmas. Every year.", spotifyId: "5XresJcJBgYkVQE9PATjli" },
  { artist: "Jim Croce", album: "I Got a Name", year: 1973, genre: "Folk", track: "I Got a Name", tag: "Gone way too soon. Thirty years old. Hell of a thing.", spotifyId: "" },
  { artist: "Donovan", album: "Sunshine Superman", year: 1966, genre: "Folk Rock", track: "Sunshine Superman", tag: "Lighter than most of what I keep. But not everything has to be heavy.", spotifyId: "" },
  { artist: "Nick Drake", album: "Pink Moon", year: 1972, genre: "Folk", track: "Pink Moon", tag: "Twenty-eight minutes. No filler. Nothing wasted. Kid knew what he was doing.", spotifyId: "" },
  { artist: "Arlo Guthrie", album: "Alice's Restaurant", year: 1967, genre: "Folk", track: "Alice's Restaurant Massacree", tag: "Thanksgiving. Every year. The whole massacree. Non-negotiable.", spotifyId: "" },
  { artist: "John Prine", album: "Fair & Square", year: 2005, genre: "Folk", track: "Clay Pigeons", tag: "Clay Pigeons. Blaze Foley wrote it but Prine made you believe every word.", spotifyId: "44sOCUUf8kp3Oj1yBYAKiZ" },
  { artist: "Paul Simon", album: "Paul Simon", year: 1972, genre: "Folk Rock", track: "Duncan", tag: "Duncan tells a whole life in four minutes. That's not easy to do.", spotifyId: "7npBPiCHjPj8PVIGPuHXep" },

  // Rock — additions
  { artist: "Creedence Clearwater Revival", album: "Green River", year: 1969, genre: "Rock", track: "Bad Moon Rising", tag: "Bad Moon Rising. Could feel the storm coming every single time.", spotifyId: "" },
  { artist: "The Doobie Brothers", album: "Toulouse Street", year: 1972, genre: "Rock", track: "Listen to the Music", tag: "Listen to the Music. That's all I ever wanted anybody to do.", spotifyId: "" },
  { artist: "The Beatles", album: "The Beatles (White Album)", year: 1968, genre: "Rock", track: "Blackbird", tag: "Blackbird. Caught myself singing it once when I thought nobody was around.", spotifyId: "" },
  { artist: "Ten Years After", album: "A Space in Time", year: 1971, genre: "Rock", track: "I'd Love to Change the World", tag: "I'd love to change the world. Well. Wouldn't we all.", spotifyId: "3JXkf4wjTjKxyrzFvfaVJU" },
  { artist: "Nick Cave", album: "The Boatman's Call", year: 1997, genre: "Rock", track: "Into My Arms", tag: "Into My Arms. About as close to a prayer as I ever got.", spotifyId: "" },
  { artist: "Nick Cave", album: "Idiot Prayer", year: 2020, genre: "Rock", track: "Palaces of Montezuma", tag: "Just him and a piano in an empty palace. Still had plenty to say.", spotifyId: "2q5FE0HvayCsZ0iz2CBjIp" },
  { artist: "Father John Misty", album: "Anthem +3", year: 2020, genre: "Folk", track: "Trouble", tag: "Covered Cat Stevens' Trouble. That's how you know somebody gets it.", spotifyId: "4MsCxk1m3oX1NFKGsVZ2Xm" },

  // Van Morrison — additions
  { artist: "Van Morrison", album: "Tupelo Honey", year: 1971, genre: "Folk Rock", track: "Tupelo Honey", tag: "Picked this up at an estate sale in a box of fifty records. The rest were junk. This one paid for all of them.", spotifyId: "" },
  { artist: "Van Morrison", album: "Moondance", year: 1970, genre: "Folk Rock", track: "And It Stoned Me", tag: "Road trips. Van on the stereo. Nobody needed to say a word.", spotifyId: "" },

  // Rock — more additions
  { artist: "The Band", album: "Music from Big Pink", year: 1968, genre: "Rock", track: "The Weight", tag: "The kind of song you play when you punch the card and head into the weekend.", spotifyId: "" },
  { artist: "The Rolling Stones", album: "Sticky Fingers", year: 1971, genre: "Rock", track: "Moonlight Mile", tag: "When you want to hear the Stones play a slow one. They could do that too.", spotifyId: "" },
  { artist: "Neil Young", album: "Harvest", year: 1972, genre: "Folk Rock", track: "Old Man", tag: "Reminds me of my own old man. And my kid at the same time. Funny how that works.", spotifyId: "" },

  // Folk — more additions
  { artist: "Peter, Paul and Mary", album: "Moving", year: 1963, genre: "Folk", track: "Puff the Magic Dragon", tag: "Don't ask what I was thinking about when I played this one. You already know.", spotifyId: "" },
  { artist: "Townes Van Zandt", album: "Live at the Old Quarter, Houston, Texas", year: 1977, genre: "Folk", track: "Lungs", tag: "Townes was a real cowboy. You could hear the dust on his boots.", spotifyId: "" },
  { artist: "Jackson C. Frank", album: "Jackson C. Frank", year: 1965, genre: "Folk", track: "Blues Run the Game", tag: "This guy lived in misery and made something beautiful out of it. That takes guts.", spotifyId: "" },
  { artist: "Kevin Morby", album: "My Name", year: 2014, genre: "Folk Rock", track: "We Did It All Wrong", tag: "Alex showed me this one. Kid's got good taste. Can't stop playing it.", spotifyId: "" },

  // Jazz — additions
  { artist: "Yusef Lateef", album: "Suite 16", year: 1970, genre: "Jazz", track: "Michelle", tag: "A nice warm jazz album to make the tube amp hum. Found it in a box lot at auction and never let it go.", spotifyId: "" },
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
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(circle at center,
          #1a1a1a 0%, #0d0d0d 14%, #1a1a1a 15%, #111 28%, #1a1a1a 29%,
          #0f0f0f 43%, #1a1a1a 44%, #111 58%, #1a1a1a 59%,
          #0d0d0d 73%, #1a1a1a 74%, #111 88%, #1a1a1a 89%, #0d0d0d 100%)`,
        transform: isSpinning || isDecelerating ? undefined : `rotate(${rot}deg)`,
        animation: spinAnim,
        boxShadow: "0 4px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
      }}>
        {grooves.map((op, i) => (
          <div key={i} style={{ position: "absolute", borderRadius: "50%", inset: `${8+i*3.2}px`, border: `0.5px solid rgba(50,50,50,${op})` }} />
        ))}
        <div style={{
          position: "absolute", borderRadius: "50%", overflow: "hidden",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          width: 100, height: 100, boxShadow: "inset 0 0 8px rgba(0,0,0,0.6)",
        }}>
          <canvas ref={artCanvasRef} style={{ width: 100, height: 100, objectFit: "cover" }} />
          <div style={{
            position: "absolute", borderRadius: "50%",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 8, height: 8, background: "#0a0a0a",
            boxShadow: "inset 0 0 3px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.5)",
          }} />
        </div>
      </div>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", pointerEvents: "none",
        background: "conic-gradient(from 200deg, transparent 0%, rgba(255,255,255,0.04) 10%, transparent 20%, transparent 100%)",
        animation: spinAnim,
        transform: isSpinning || isDecelerating ? undefined : `rotate(${rot}deg)`,
      }} />

      {/* Hover pause/play overlay */}
      {(isSpinning || isDecelerating || (isAudioPlaying !== undefined && !isSpinning)) && hovered && (
        <div onClick={(e) => { e.stopPropagation(); onTogglePlay?.(); }}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
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
const DANS_PLAYLIST_URL = "https://open.spotify.com/playlist/2lKMgLpNcQYslxnKb0OTE9";

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

async function getPreviewUrl(artist, album, spotifyId, track) {
  try {
    const params = new URLSearchParams({ artist, album });
    if (spotifyId) params.set('spotifyId', spotifyId);
    if (track) params.set('track', track);
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
  const shelf = { spineWidth: 20, spineHeight: 200, fontSize: 10, hoverLift: 24, textOpacity: 0.85, gap: 2.5 };

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
  const [askAgainMood, setAskAgainMood] = useState("");
  const artCanvasRef = useRef(null);

  // Audio state — lifted from SpotifyPlayer so vinyl controls playback
  const audioRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioFailed, setAudioFailed] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const lastAudioKey = useRef(null);

  const resetPlayer = useCallback((targetView = "turntable") => {
    if (audioRef.current) audioRef.current.pause();
    setResult(null); setShowResult(false); setIsSpinning(false);
    setIsDecelerating(false); setIsAudioPlaying(false);
    setPreview(null); setAudioFailed(false); lastAudioKey.current = null;
    setMood(""); setAskAgainMood(""); setCurrentView(targetView);
  }, []);

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
      const data = await getPreviewUrl(result.artist, result.album, result.record?.spotifyId, result.record?.track);
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

      if (response.status === 429) {
        setIsLoading(false);
        setRateLimited(true);
        setCurrentView("shelf");
        return;
      }
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
    setTimeout(() => { setIsLoading(false); setIsSpinning(true); }, 300);
    setTimeout(() => setShowResult(true), 500);
  };

  const selectFromShelf = (record) => {
    setHasInteracted(true);
    setShowResult(false);
    setIsSpinning(false);
    setResult({ artist: record.artist, album: record.album, year: record.year, reason: record.tag, record });
    setCurrentView("turntable");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    // Quick sequence: vinyl appears → starts spinning → info fades in
    setTimeout(() => setIsSpinning(true), 300);
    setTimeout(() => setShowResult(true), 500);
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

        {/* Persistent "← Back to shelf" — anchored to content column */}
        <div style={{
          position: "fixed", top: 20, left: "50%", zIndex: 20,
          transform: "translateX(max(-380px, calc(-50vw + 20px)))",
          opacity: showResult && result ? 1 : 0,
          pointerEvents: showResult && result ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}>
          <button onClick={() => resetPlayer("shelf")} style={{
            background: "rgba(10,8,8,0.7)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(180,140,80,0.15)", borderRadius: 4,
            cursor: "pointer", padding: "8px 14px",
            fontSize: 11, fontFamily: "'Courier New', monospace", letterSpacing: 1.5,
            color: "#7a6a5a", transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={e => { e.target.style.color = "#d4b870"; e.target.style.borderColor = "rgba(180,140,80,0.35)"; }}
          onMouseLeave={e => { e.target.style.color = "#7a6a5a"; e.target.style.borderColor = "rgba(180,140,80,0.15)"; }}>
            ← Back to shelf
          </button>
        </div>

        {/* Header — smoothly collapses when showing a result */}
        <div style={{ textAlign: "center", marginBottom: showResult && result ? 12 : 36, transition: "margin-bottom 0.3s ease" }}>
          <p style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
            color: "#7a6a5a", marginBottom: 12, fontFamily: "'Courier New', monospace" }}>
            The Collection of Daniel Russell
          </p>

          {/* Expandable intro text — collapses smoothly */}
          <div style={{
            maxHeight: showResult && result ? 0 : 200,
            opacity: showResult && result ? 0 : 1,
            overflow: "hidden",
            transition: showResult && result
              ? "opacity 0.15s ease, max-height 0.01s ease 0.15s"
              : "opacity 0.3s ease 0.1s, max-height 0.01s ease",
          }}>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 400, lineHeight: 1.2, color: "#efe5d5", marginBottom: 8,
              fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              Ask My Dad's Record Collection
            </h1>
            <div style={{ width: 36, height: 1, background: "#4a3a2a", margin: "14px auto" }} />
            <p style={{ fontSize: 14, color: "#7a6a5a", lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>
              Tell it your mood, your moment, the weather outside.<br />It'll pull the right record.
            </p>
          </div>
        </div>

        {/* Controls — quickly fade when result is showing */}
        <div style={{
          maxHeight: showResult && result ? 0 : 2000,
          opacity: showResult && result ? 0 : 1,
          overflow: showResult && result ? "hidden" : "visible",
          transition: showResult && result
            ? "opacity 0.15s ease, max-height 0.01s ease 0.15s"
            : "opacity 0.3s ease 0.1s, max-height 0.01s ease",
        }}>
          {/* Side A / Side B toggle */}
          <div style={{
            display: "flex", marginBottom: 28,
            border: "1px solid rgba(180,140,80,0.15)",
            borderRadius: 4, overflow: "hidden",
            position: "relative",
          }}>
            {/* Sliding highlight */}
            <div style={{
              position: "absolute", top: 0, bottom: 0,
              width: "50%",
              left: currentView === "turntable" ? "0%" : "50%",
              background: "rgba(180,140,80,0.08)",
              borderBottom: "2px solid rgba(212,184,112,0.6)",
              transition: "left 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: "none",
            }} />
            {/* Divider */}
            <div style={{
              position: "absolute", top: "20%", bottom: "20%", left: "50%",
              width: 1, background: "rgba(180,140,80,0.12)",
              pointerEvents: "none",
            }} />
            {[
              { id: "turntable", side: "Side A", label: "Ask the Collection", desc: "Tell it your mood" },
              { id: "shelf", side: "Side B", label: "Browse the Shelf", desc: "Pull one yourself" },
            ].map(v => (
              <button key={v.id} onClick={() => setCurrentView(v.id)} style={{
                flex: 1, padding: "14px 16px", background: "transparent", border: "none",
                cursor: "pointer", position: "relative", textAlign: "center",
                transition: "color 0.3s",
              }}>
                <span style={{
                  display: "block", fontSize: 9, letterSpacing: 3, textTransform: "uppercase",
                  fontFamily: "'Courier New', monospace",
                  color: currentView === v.id ? "rgba(212,184,112,0.7)" : "rgba(106,90,74,0.5)",
                  marginBottom: 4, transition: "color 0.3s",
                }}>{v.side}</span>
                <span style={{
                  display: "block", fontSize: 14,
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  color: currentView === v.id ? "#efe5d5" : "#7a6a5a",
                  fontWeight: 400, transition: "color 0.3s",
                }}>{v.label}</span>
                <span style={{
                  display: "block", fontSize: 11, marginTop: 3,
                  fontFamily: "'Georgia', serif", fontStyle: "italic",
                  color: currentView === v.id ? "rgba(154,138,122,0.8)" : "rgba(106,90,74,0.4)",
                  transition: "color 0.3s",
                }}>{v.desc}</span>
              </button>
            ))}
          </div>

          {/* Shelf view with cross-fade */}
          <div style={{
            opacity: currentView === "shelf" ? 1 : 0,
            maxHeight: currentView === "shelf" ? 2000 : 0,
            overflow: currentView === "shelf" ? "visible" : "hidden",
            transition: "opacity 0.4s ease, max-height 0.4s ease",
          }}>
            {rateLimited && (
              <p style={{
                textAlign: "center", color: "#b48c50", fontStyle: "italic",
                fontFamily: "'Georgia', serif", fontSize: "14px",
                margin: "0 0 1rem", padding: "0 1rem",
              }}>
                Even I need a break between records. Pick somethin' off the shelf while you wait.
              </p>
            )}
            <ShelfView onSelectRecord={selectFromShelf} />
          </div>
        </div>

        {/* Turntable input — smooth fade */}
        <div style={{
          opacity: currentView === "turntable" && !(showResult && result) ? 1 : 0,
          maxHeight: currentView === "turntable" && !(showResult && result) ? 500 : 0,
          overflow: "hidden",
          transition: "opacity 0.4s ease, max-height 0.4s ease",
        }}>
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
        </div>

        {/* Vinyl + result — slides up smoothly when a record is picked */}
        {(result || isLoading) && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            opacity: isLoading && !result ? 0.3 : 1,
            transform: result ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
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

        {/* "Ask again" section — visible below result */}
        {showResult && result && (
          <div style={{
            textAlign: "center", marginTop: 40, marginBottom: 8,
            animation: "fadeUp 0.6s ease-out 0.3s both",
          }}>
            <div style={{ width: 36, height: 1, background: "#4a3a2a", margin: "0 auto 20px" }} />
            <p style={{
              fontSize: 13, color: "#7a6a5a", fontStyle: "italic",
              fontFamily: "'Georgia', serif", marginBottom: 14,
            }}>
              What else are you feeling?
            </p>
            <div style={{ maxWidth: 400, margin: "0 auto", display: "flex", gap: 8 }}>
              <input
                type="text"
                value={askAgainMood}
                onChange={e => setAskAgainMood(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && askAgainMood.trim()) {
                    const m = askAgainMood.trim();
                    resetPlayer("turntable");
                    // Small delay to let reset clear, then fire the new ask
                    setTimeout(() => {
                      setMood(m);
                      fetchRecommendation(m);
                    }, 50);
                  }
                }}
                placeholder="Try another mood..."
                style={{
                  flex: 1, padding: "10px 14px", fontSize: 14,
                  fontFamily: "'Georgia', serif", background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(138,122,106,0.18)", borderRadius: 3,
                  color: "#d4c9b8", outline: "none", transition: "border-color 0.3s",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(180,140,80,0.3)"}
                onBlur={e => e.target.style.borderColor = "rgba(138,122,106,0.18)"}
              />
              <button
                onClick={() => {
                  if (!askAgainMood.trim()) return;
                  const m = askAgainMood.trim();
                  resetPlayer("turntable");
                  setTimeout(() => {
                    setMood(m);
                    fetchRecommendation(m);
                  }, 50);
                }}
                disabled={!askAgainMood.trim()}
                style={{
                  padding: "10px 18px", fontSize: 11,
                  fontFamily: "'Courier New', monospace", letterSpacing: 2, textTransform: "uppercase",
                  background: askAgainMood.trim() ? "rgba(180,140,80,0.1)" : "transparent",
                  border: "1px solid rgba(180,140,80,0.25)", borderRadius: 3,
                  color: askAgainMood.trim() ? "#d4b870" : "#6a5a4a",
                  cursor: askAgainMood.trim() ? "pointer" : "default",
                  transition: "all 0.3s", whiteSpace: "nowrap",
                }}>
                Ask
              </button>
            </div>
          </div>
        )}

        <MoodWall moodHistory={moodHistory} onSelectMood={(entry) => {
          if (!entry.album) return;
          // Exact match first, then case-insensitive, then partial match
          const album = entry.album.toLowerCase();
          const record = CURATED_RECORDS.find(r => r.album === entry.album)
            || CURATED_RECORDS.find(r => r.album.toLowerCase() === album)
            || CURATED_RECORDS.find(r => album.includes(r.album.toLowerCase()) || r.album.toLowerCase().includes(album));
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
