import * as THREE from "three";

import {
  Bin, CSS, COLOR, EMOTIONS, FONT_MONO, FONT_UI, type Chapter,
  RoundedBoxGeometry, canvasTexture, candles, clamp01, font, glassOrb, glow, label, lerp, panel, place, roundRect, seeded, smooth,
} from "./kit";

type Options = { lite: boolean };

/* -------------------------------------------------------------------------- */
/* 0 · Prologue — a calm market, before anything goes wrong                    */
/* -------------------------------------------------------------------------- */
export function prologue(bin: Bin, { lite }: Options): Chapter {
  const group = new THREE.Group();
  const orb = glassOrb(bin, COLOR.green, 1.7, lite);
  orb.group.position.set(0, 1.2, -2.5);
  group.add(orb.group);
  const n = 46;
  const set = candles(bin, n);
  const rand = seeded(7);
  const bars: { x: number; y: number; h: number; up: boolean; phase: number }[] = [];
  let price = 0;
  for (let i = 0; i < n; i++) {
    const move = (rand() - 0.46) * 0.9;
    const h = Math.abs(move) + 0.25;
    bars.push({ x: -11.5 + i * 0.5, y: price + move / 2, h, up: move >= 0, phase: rand() * 6 });
    price += move;
  }
  bars.forEach((b, i) => set.color(i, b.up ? COLOR.green : COLOR.red, b.up ? 1 : 0.85));
  set.group.position.set(0, -0.6, -3);
  group.add(set.group);

  const halo = glow(bin, COLOR.green, 18, 0.06);
  halo.position.set(0, 0, -6);
  group.add(halo);

  return {
    group,
    update(_local, time) {
      bars.forEach((b, i) => {
        const bob = Math.sin(time * 1.2 + b.phase) * 0.06;
        const rise = smooth(0, 1, clamp01(time * 0.6 - i * 0.03));
        set.set(i, b.x, b.y + bob, 0, b.h * rise);
      });
      set.commit();
      orb.update(time);
      orb.group.position.y = 1.2 + Math.sin(time * 0.7) * 0.15;
      orb.group.rotation.y = time * 0.1;
      group.rotation.y = Math.sin(time * 0.15) * 0.04;
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 1 · The low — red candles collapse, red rain                                */
/* -------------------------------------------------------------------------- */
export function theLow(bin: Bin, { lite }: Options): Chapter {
  const group = new THREE.Group();
  const n = 28;
  const set = candles(bin, n);
  const rand = seeded(11);
  const bars: { x: number; y: number; h: number; spin: number }[] = [];
  let price = 3.2;
  for (let i = 0; i < n; i++) {
    const move = -(rand() * 0.42 + 0.06) + (rand() < 0.2 ? 0.35 : 0);
    const h = Math.abs(move) + 0.2;
    bars.push({ x: -6.5 + i * 0.48, y: price + move / 2, h, spin: (rand() - 0.5) * 2 });
    price += move;
    set.color(i, move < 0 ? COLOR.red : COLOR.green, move < 0 ? 1 : 0.6);
  }
  group.add(set.group);

  // The falling chart line, drawn as the reader scrolls.
  const points = bars.map((b) => new THREE.Vector3(b.x, b.y, 0.4));
  const lineGeo = bin.add(new THREE.BufferGeometry().setFromPoints(points));
  const line = new THREE.Line(lineGeo, bin.add(new THREE.LineBasicMaterial({ color: COLOR.red })));
  group.add(line);

  // Red rain.
  const drops = lite ? 450 : 1100;
  const rain = new Float32Array(drops * 3);
  const seeds = new Float32Array(drops);
  for (let i = 0; i < drops; i++) {
    rain[i * 3] = (rand() - 0.5) * 26;
    rain[i * 3 + 2] = (rand() - 0.5) * 14 - 2;
    seeds[i] = rand();
  }
  const rainGeo = bin.add(new THREE.BufferGeometry());
  rainGeo.setAttribute("position", new THREE.BufferAttribute(rain, 3));
  const rainMat = bin.add(
    new THREE.PointsMaterial({ color: COLOR.red, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false }),
  );
  group.add(new THREE.Points(rainGeo, rainMat));

  const light = new THREE.PointLight(COLOR.red, 30, 18, 1.6);
  light.position.set(0, 4, 4);
  group.add(light);
  const halo = glow(bin, COLOR.red, 14, 0.18);
  halo.position.set(0, 0, -4);
  group.add(halo);

  return {
    group,
    update(local, time) {
      lineGeo.setDrawRange(0, Math.max(2, Math.ceil(smooth(0.05, 0.45, local) * n)));
      const crash = smooth(0.42, 0.95, local);
      bars.forEach((b, i) => {
        const delay = (i / n) * 0.35;
        const fall = smooth(delay, delay + 0.65, crash);
        const appear = smooth(i / n * 0.4, i / n * 0.4 + 0.12, local + 0.08);
        set.set(i, b.x, b.y - fall * fall * 7, 0, b.h * appear, 0.36, fall * b.spin);
      });
      set.commit();
      for (let i = 0; i < drops; i++) {
        rain[i * 3 + 1] = 9 - ((seeds[i] * 14 + time * (2.2 + seeds[i] * 2)) % 14);
      }
      rainGeo.attributes.position.needsUpdate = true;
      rainMat.opacity = 0.25 + 0.55 * smooth(0.1, 0.6, local);
      light.intensity = 30 * (1 - crash * 0.7) + Math.sin(time * 9) * 2;
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 2 · The decision — a journal opens and glows                                */
/* -------------------------------------------------------------------------- */
export function theDecision(bin: Bin): Chapter {
  const group = new THREE.Group();
  const book = new THREE.Group();
  group.add(book);

  const W = 2.6;
  const H = 3.6;
  const coverMap = canvasTexture(bin, 512, 704, (ctx, w, h) => {
    ctx.fillStyle = "#0b1410";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = CSS.deep;
    ctx.lineWidth = 6;
    ctx.strokeRect(28, 28, w - 56, h - 56);
    ctx.textAlign = "center";
    ctx.fillStyle = CSS.green;
    ctx.shadowColor = CSS.green;
    ctx.shadowBlur = 20;
    ctx.font = font(FONT_MONO, 44);
    ctx.fillText("TRADING", w / 2, h * 0.42);
    ctx.fillText("JOURNAL", w / 2, h * 0.42 + 56);
    ctx.shadowBlur = 0;
    ctx.fillStyle = CSS.muted;
    ctx.font = font(FONT_MONO, 22);
    ctx.fillText("DAY 001", w / 2, h * 0.78);
  });
  const pageMap = canvasTexture(bin, 512, 704, (ctx, w, h) => {
    ctx.fillStyle = "#e8efe9";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(39,134,91,.35)";
    ctx.lineWidth = 2;
    for (let y = 120; y < h - 40; y += 38) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 40, y);
      ctx.stroke();
    }
    ctx.fillStyle = "#14402b";
    ctx.font = font(FONT_UI, 30);
    ctx.fillText("Day 1.", 44, 100);
    ctx.font = font(FONT_UI, 24);
    ctx.fillText("Journal every trade.", 44, 186);
    ctx.fillText("No excuses.", 44, 224);
  });

  const leather = bin.add(new THREE.MeshStandardMaterial({ color: 0x0d1a14, roughness: 0.6, metalness: 0.2 }));
  const coverFace = bin.add(new THREE.MeshStandardMaterial({ map: coverMap, roughness: 0.55, emissive: 0x0a2a1a, emissiveIntensity: 0.4 }));
  const pageMat = bin.add(new THREE.MeshStandardMaterial({ map: pageMap, roughness: 0.9, side: THREE.DoubleSide }));
  const blank = bin.add(new THREE.MeshStandardMaterial({ color: 0xdfe8e1, roughness: 0.95, side: THREE.DoubleSide }));
  const slab = bin.add(new THREE.BoxGeometry(W, H, 0.08));
  const sheet = bin.add(new THREE.PlaneGeometry(W * 0.96, H * 0.95));

  // Back cover, with the text block sitting on it.
  const back = new THREE.Mesh(slab, leather);
  back.position.set(W / 2, 0, -0.16);
  const block = new THREE.Mesh(bin.add(new THREE.BoxGeometry(W * 0.96, H * 0.95, 0.22)), blank);
  block.position.set(W / 2, 0, -0.02);
  book.add(back, block);

  // Pages and front cover hinge on the spine at x = 0.
  const pages: THREE.Group[] = [];
  for (let i = 0; i < 6; i++) {
    const hinge = new THREE.Group();
    const page = new THREE.Mesh(sheet, i === 5 ? pageMat : blank);
    page.position.set((W * 0.96) / 2, 0, 0);
    hinge.position.z = 0.1 + i * 0.004;
    hinge.add(page);
    book.add(hinge);
    pages.push(hinge);
  }
  const front = new THREE.Group();
  const frontSlab = new THREE.Mesh(slab, [leather, leather, leather, leather, coverFace, leather]);
  frontSlab.position.set(W / 2, 0, 0);
  front.position.z = 0.16;
  front.add(frontSlab);
  book.add(front);
  book.position.set(-W / 2, 0, 0);

  const light = new THREE.PointLight(COLOR.green, 0, 10, 1.4);
  light.position.set(0.4, 0.2, 1.6);
  group.add(light);
  const halo = glow(bin, COLOR.green, 7, 0);
  halo.position.set(0.6, 0, 0.4);
  group.add(halo);
  const key = new THREE.DirectionalLight(0xbfffe0, 1.4);
  key.position.set(3, 4, 6);
  group.add(key);

  return {
    group,
    update(local, time) {
      const open = smooth(0.12, 0.6, local);
      front.rotation.y = -open * Math.PI * 0.92;
      pages.forEach((p, i) => {
        p.rotation.y = -open * Math.PI * (0.86 - i * 0.075) * smooth(0, 1, open * 1.3 - i * 0.05);
      });
      light.intensity = open * 26;
      halo.material.opacity = open * 0.55;
      group.rotation.y = 0.45 - open * 0.55 + Math.sin(time * 0.6) * 0.04;
      group.rotation.x = -0.12;
      group.position.y = Math.sin(time * 0.9) * 0.1 + lerp(-1.5, 0, smooth(0, 0.3, local));
    },
  };
}

/* -------------------------------------------------------------------------- */
/* Shared: the manual-entry form card                                          */
/* -------------------------------------------------------------------------- */
function formCardMap(bin: Bin) {
  return canvasTexture(bin, 512, 320, (ctx, w, h) => {
    panel(ctx, w, h, "rgba(255,77,94,.85)");
    const fields = ["SYMBOL", "ENTRY", "EXIT", "LOT SIZE", "STOP LOSS"];
    ctx.font = font(FONT_MONO, 22);
    fields.forEach((f, i) => {
      const y = 62 + i * 50;
      ctx.fillStyle = CSS.muted;
      ctx.fillText(f, 36, y);
      ctx.strokeStyle = "rgba(233,242,236,.35)";
      ctx.lineWidth = 2;
      roundRect(ctx, 200, y - 26, 270, 36, 8);
      ctx.stroke();
    });
    ctx.fillStyle = CSS.red;
    ctx.font = font(FONT_MONO, 16);
    ctx.fillText("* REQUIRED", 360, 300);
  });
}

/* -------------------------------------------------------------------------- */
/* 3 · The problem — an endless wall of manual-entry forms                     */
/* -------------------------------------------------------------------------- */
export function theProblem(bin: Bin, { lite }: Options): Chapter {
  const group = new THREE.Group();
  const cols = lite ? 7 : 10;
  const rows = 7;
  const n = cols * rows;
  const map = formCardMap(bin);
  const mat = bin.add(new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  const cards = new THREE.InstancedMesh(bin.add(new THREE.PlaneGeometry(1.6, 1)), mat, n);
  group.add(cards);
  const rand = seeded(23);
  const slots = Array.from({ length: n }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return {
      x: (c - (cols - 1) / 2) * 1.75 + (rand() - 0.5) * 0.3,
      y: (r - (rows - 1) / 2) * 1.12 + (rand() - 0.5) * 0.2,
      z: (rand() - 0.5) * 1.2,
      fx: (rand() - 0.5) * 30,
      fy: (rand() - 0.5) * 20,
      fz: 10 + rand() * 10,
      rz: (rand() - 0.5) * 0.25,
      order: rand(),
      phase: rand() * 10,
    };
  });
  const halo = glow(bin, COLOR.red, 16, 0.1);
  halo.position.z = -3;
  group.add(halo);

  return {
    group,
    update(local, time) {
      const shake = smooth(0.5, 1, local);
      slots.forEach((s, i) => {
        const t = smooth(s.order * 0.55, s.order * 0.55 + 0.2, local + 0.05);
        const jitter = shake * 0.06;
        place(
          cards, i,
          lerp(s.fx, s.x, t) + Math.sin(time * 23 + s.phase) * jitter,
          lerp(s.fy, s.y, t) + Math.cos(time * 19 + s.phase) * jitter,
          lerp(s.fz, s.z, t),
          t, t, t,
          0, (1 - t) * 1.4, s.rz + Math.sin(time * 17 + s.phase) * jitter,
        );
      });
      cards.instanceMatrix.needsUpdate = true;
      halo.material.opacity = 0.08 + shake * 0.22;
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 4 · The gap — a friend's insight splits the wall, light pours through       */
/* -------------------------------------------------------------------------- */
export function theGap(bin: Bin, { lite }: Options): Chapter {
  const group = new THREE.Group();
  const cols = lite ? 8 : 10;
  const rows = 7;
  const n = cols * rows;
  const map = formCardMap(bin);
  const mat = bin.add(new THREE.MeshBasicMaterial({ map, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  const cards = new THREE.InstancedMesh(bin.add(new THREE.PlaneGeometry(1.6, 1)), mat, n);
  group.add(cards);
  const slots = Array.from({ length: n }, (_, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return { x: (c - (cols - 1) / 2) * 1.68, y: (r - (rows - 1) / 2) * 1.08 + 0.4, left: c < cols / 2, depth: Math.abs(c - (cols - 1) / 2) };
  });

  // The beam that floods through the split.
  const beamMat = bin.add(
    new THREE.MeshBasicMaterial({ color: COLOR.green, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  const beam = new THREE.Mesh(bin.add(new THREE.PlaneGeometry(1, 11)), beamMat);
  beam.position.set(0, 0.4, -0.3);
  group.add(beam);
  const core = glow(bin, COLOR.green, 10, 0);
  core.position.set(0, 0.4, -0.6);
  group.add(core);

  // You, a friend, and the line between you.
  const nodeGeo = bin.add(new THREE.SphereGeometry(0.22, 24, 16));
  const you = new THREE.Mesh(nodeGeo, bin.add(new THREE.MeshBasicMaterial({ color: COLOR.ink })));
  const friend = new THREE.Mesh(nodeGeo, bin.add(new THREE.MeshBasicMaterial({ color: COLOR.green })));
  you.position.set(-6.4, -2.6, 2);
  friend.position.set(6.4, -2.6, 2);
  const youLabel = label(bin, "ME", CSS.ink, 0.32);
  const friendLabel = label(bin, "FRIEND", CSS.green, 0.32);
  youLabel.position.set(-6.4, -3.15, 2);
  friendLabel.position.set(6.4, -3.15, 2);
  group.add(you, friend, youLabel, friendLabel);
  const linkGeo = bin.add(new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 41 }, (_, i) => {
      const t = i / 40;
      return new THREE.Vector3(lerp(-6.4, 6.4, t), -2.6 - Math.sin(t * Math.PI) * 1.4, 2);
    }),
  ));
  group.add(new THREE.Line(linkGeo, bin.add(new THREE.LineBasicMaterial({ color: COLOR.green }))));
  const spark = glow(bin, COLOR.green, 1.4, 0);
  group.add(spark);

  return {
    group,
    update(local, time) {
      const talk = smooth(0.05, 0.35, local);
      linkGeo.setDrawRange(0, Math.ceil(talk * 41));
      // A spark travels from the friend up into the wall's centre.
      const fly = smooth(0.3, 0.45, local);
      spark.material.opacity = fly > 0 && fly < 1 ? 1 : 0;
      spark.position.set(lerp(6.4, 0, fly), lerp(-2.6, 0.4, fly), lerp(2, 0, fly));
      const split = smooth(0.42, 0.85, local);
      slots.forEach((s, i) => {
        const dir = s.left ? -1 : 1;
        const push = split * (3.2 + s.depth * 0.35);
        place(cards, i, s.x + dir * push, s.y, -split * s.depth * 0.3, 1, 1, 1, 0, -dir * split * 0.6, 0);
      });
      cards.instanceMatrix.needsUpdate = true;
      const crack = smooth(0.4, 0.55, local);
      beam.scale.x = 0.04 + split * 5.5;
      beamMat.opacity = crack * (0.22 - split * 0.12) + Math.sin(time * 4) * 0.02 * crack;
      core.material.opacity = crack * 0.6;
      core.scale.setScalar(4 + split * 14);
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 5 · The build — a screenshot is scanned and its numbers fly into a journal  */
/* -------------------------------------------------------------------------- */
export function theBuild(bin: Bin, { lite }: Options): Chapter {
  const group = new THREE.Group();

  // The phone and its trade screenshot.
  const phone = new THREE.Group();
  phone.position.set(-2.3, 0, 0);
  phone.scale.setScalar(1.25);
  group.add(phone);
  const shell = new THREE.Mesh(
    bin.add(new RoundedBoxGeometry(2.3, 4.5, 0.18, 6, 0.22)),
    bin.add(new THREE.MeshPhysicalMaterial({ color: 0x1b2a22, roughness: 0.18, metalness: 0.9, clearcoat: 1, clearcoatRoughness: 0.08 })),
  );
  const screenMap = canvasTexture(bin, 460, 900, (ctx, w, h) => {
    ctx.fillStyle = "#060c09";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = CSS.ink;
    ctx.font = font(FONT_MONO, 30);
    ctx.fillText("XAUUSD · M15", 30, 70);
    ctx.fillStyle = CSS.muted;
    ctx.font = font(FONT_MONO, 20);
    ctx.fillText("BUY 0.50 LOT", 30, 104);
    const rand = seeded(5);
    let p = 560;
    for (let i = 0; i < 18; i++) {
      const move = (rand() - 0.42) * 60;
      const up = move > 0;
      ctx.fillStyle = up ? CSS.green : CSS.red;
      const x = 30 + i * 22;
      ctx.fillRect(x + 8, Math.min(p, p - move) - 14, 2, Math.abs(move) + 28);
      ctx.fillRect(x, Math.min(p, p - move), 18, Math.abs(move) + 3);
      p -= move;
    }
    ctx.strokeStyle = CSS.green;
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(20, 470); ctx.lineTo(w - 20, 470); ctx.stroke();
    ctx.strokeStyle = CSS.red;
    ctx.beginPath(); ctx.moveTo(20, 640); ctx.lineTo(w - 20, 640); ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = font(FONT_MONO, 22);
    ctx.fillStyle = CSS.green;
    ctx.fillText("TP 2361.20", w - 170, 460);
    ctx.fillStyle = CSS.red;
    ctx.fillText("SL 2331.80", w - 170, 668);
    ctx.fillStyle = "rgba(57,255,136,.12)";
    roundRect(ctx, 30, 740, w - 60, 110, 16);
    ctx.fill();
    ctx.fillStyle = CSS.ink;
    ctx.font = font(FONT_MONO, 24);
    ctx.fillText("ENTRY 2340.50", 52, 785);
    ctx.fillStyle = CSS.green;
    ctx.fillText("P&L  +$412.00", 52, 825);
  });
  const screen = new THREE.Mesh(
    bin.add(new THREE.PlaneGeometry(2.1, 4.2)),
    bin.add(new THREE.MeshBasicMaterial({ map: screenMap })),
  );
  screen.position.z = 0.095;
  const scanMat = bin.add(
    new THREE.MeshBasicMaterial({ color: COLOR.green, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  const scan = new THREE.Mesh(bin.add(new THREE.PlaneGeometry(2.2, 0.08)), scanMat);
  scan.position.z = 0.1;
  const scanGlow = glow(bin, COLOR.green, 1, 0);
  scanGlow.scale.set(3.2, 0.7, 1);
  scanGlow.position.z = 0.12;
  phone.add(shell, screen, scan, scanGlow);

  // The extracted journal rows.
  const fields: [string, string, string][] = [
    ["SYMBOL", "XAUUSD", CSS.ink],
    ["ENTRY", "2340.50", CSS.ink],
    ["EXIT", "2361.20", CSS.ink],
    ["P&L", "+$412.00", CSS.green],
  ];
  const rows = fields.map(([k, v, c], i) => {
    const map = canvasTexture(bin, 640, 140, (ctx, w, h) => {
      panel(ctx, w, h);
      ctx.font = font(FONT_MONO, 26);
      ctx.fillStyle = CSS.muted;
      ctx.fillText(k, 36, h / 2 + 10);
      ctx.font = font(FONT_MONO, 40);
      ctx.fillStyle = c;
      ctx.textAlign = "right";
      ctx.fillText(v, w - 36, h / 2 + 14);
    });
    const mesh = new THREE.Mesh(
      bin.add(new THREE.PlaneGeometry(3, 0.66)),
      bin.add(new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false })),
    );
    mesh.position.set(2.6, 1.2 - i * 0.86, 0);
    group.add(mesh);
    return mesh;
  });
  const done = label(bin, "✓ AUTO-EXTRACTED · 0 FIELDS TYPED", CSS.green, 0.26);
  done.position.set(2.6, 2.1, 0);
  done.material.opacity = 0;
  group.add(done);

  // Data particles: from the screen to the rows.
  const count = lite ? 380 : 900;
  const pos = new Float32Array(count * 3);
  const from = new Float32Array(count * 3);
  const to = new Float32Array(count * 3);
  const delay = new Float32Array(count);
  const rand = seeded(31);
  for (let i = 0; i < count; i++) {
    from[i * 3] = -2.3 + (rand() - 0.5) * 2.5;
    from[i * 3 + 1] = (rand() - 0.5) * 5;
    from[i * 3 + 2] = 0.12;
    const row = Math.floor(rand() * 4);
    to[i * 3] = 2.6 + (rand() - 0.5) * 2.8;
    to[i * 3 + 1] = 1.2 - row * 0.86 + (rand() - 0.5) * 0.5;
    to[i * 3 + 2] = 0.02;
    delay[i] = rand();
  }
  const pGeo = bin.add(new THREE.BufferGeometry());
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pMat = bin.add(
    new THREE.PointsMaterial({ color: COLOR.green, size: 0.05, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  group.add(new THREE.Points(pGeo, pMat));

  return {
    group,
    update(local, time) {
      const scanning = smooth(0.05, 0.15, local) * (1 - smooth(0.45, 0.55, local));
      scanMat.opacity = scanning;
      scanGlow.material.opacity = scanning * 0.8;
      const sy = 2.05 - ((time * 0.9) % 1) * 4.1;
      scan.position.y = sy;
      scanGlow.position.y = sy;

      const stream = smooth(0.22, 0.75, local);
      pMat.opacity = stream > 0 && stream < 1 ? 0.95 : 0;
      for (let i = 0; i < count; i++) {
        const t = smooth(delay[i] * 0.5, delay[i] * 0.5 + 0.5, stream);
        const k = i * 3;
        pos[k] = lerp(from[k], to[k], t);
        pos[k + 1] = lerp(from[k + 1], to[k + 1], t) + Math.sin(t * Math.PI) * 0.8;
        pos[k + 2] = lerp(from[k + 2], to[k + 2], t) + Math.sin(t * Math.PI) * 1.6;
      }
      pGeo.attributes.position.needsUpdate = true;

      rows.forEach((row, i) => {
        const a = smooth(0.45 + i * 0.07, 0.6 + i * 0.07, local);
        (row.material as THREE.MeshBasicMaterial).opacity = a;
        row.scale.setScalar(0.85 + a * 0.15);
      });
      done.material.opacity = smooth(0.78, 0.88, local);
      phone.rotation.y = 0.35 + Math.sin(time * 0.5) * 0.05;
      phone.position.y = Math.sin(time * 0.8) * 0.08;
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 6 · The mind — emotion orbs orbit a trade, one is tagged                    */
/* -------------------------------------------------------------------------- */
export function theMind(bin: Bin): Chapter {
  const group = new THREE.Group();
  const cardMap = canvasTexture(bin, 640, 360, (ctx, w, h) => {
    panel(ctx, w, h);
    ctx.font = font(FONT_MONO, 30);
    ctx.fillStyle = CSS.ink;
    ctx.fillText("XAUUSD  ·  BUY", 40, 78);
    ctx.font = font(FONT_MONO, 54);
    ctx.fillStyle = CSS.green;
    ctx.fillText("+$412.00", 40, 160);
    ctx.font = font(FONT_UI, 26);
    ctx.fillStyle = CSS.muted;
    ctx.fillText("How did you feel taking this trade?", 40, 240);
    ctx.strokeStyle = "rgba(233,242,236,.3)";
    ctx.setLineDash([10, 8]);
    ctx.lineWidth = 3;
    roundRect(ctx, 40, 268, 260, 56, 28);
    ctx.stroke();
  });
  const card = new THREE.Mesh(
    bin.add(new THREE.PlaneGeometry(3.4, 1.9)),
    bin.add(new THREE.MeshBasicMaterial({ map: cardMap, transparent: true, side: THREE.DoubleSide })),
  );
  group.add(card);
  const slot = new THREE.Vector3(-0.98, -0.62, 0.15);

  const sphere = bin.add(new THREE.SphereGeometry(0.32, 32, 20));
  const orbs = EMOTIONS.map((e, i) => {
    const mesh = new THREE.Mesh(
      sphere,
      bin.add(new THREE.MeshPhysicalMaterial({ color: e.color, emissive: e.color, emissiveIntensity: 0.7, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 })),
    );
    const tag = label(bin, e.name, `#${e.color.toString(16).padStart(6, "0")}`, 0.26);
    const halo = glow(bin, e.color, 1.4, 0.35);
    group.add(mesh, tag, halo);
    return { mesh, tag, halo, offset: (i / EMOTIONS.length) * Math.PI * 2 };
  });
  const ringGeo = bin.add(new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 97 }, (_, i) => {
      const a = (i / 96) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * 3.4, Math.sin(a) * 0.9, Math.sin(a) * 2.4);
    }),
  ));
  group.add(new THREE.Line(ringGeo, bin.add(new THREE.LineBasicMaterial({ color: COLOR.deep, transparent: true, opacity: 0.5 }))));
  const tagged = label(bin, "EMOTION LOGGED: FOMO", CSS.green, 0.24);
  tagged.position.set(0, 1.35, 0.1);
  group.add(tagged);
  const v = new THREE.Vector3();

  return {
    group,
    update(local, time) {
      const snap = smooth(0.42, 0.68, local);
      orbs.forEach((o, i) => {
        const a = time * 0.45 + o.offset;
        v.set(Math.cos(a) * 3.4, Math.sin(a) * 0.9, Math.sin(a) * 2.4);
        if (i === 2) v.lerp(slot, snap);
        o.mesh.position.copy(v);
        o.halo.position.copy(v);
        o.tag.position.set(v.x, v.y - 0.55, v.z);
        const s = i === 2 ? 1 - snap * 0.45 : 1 - snap * 0.25;
        o.mesh.scale.setScalar(s);
        o.tag.material.opacity = i === 2 ? 1 - snap : 1 - snap * 0.6;
        o.halo.material.opacity = i === 2 ? 0.35 + snap * 0.4 : 0.35 - snap * 0.2;
      });
      tagged.material.opacity = smooth(0.66, 0.76, local);
      card.rotation.y = Math.sin(time * 0.4) * 0.12;
      card.position.y = Math.sin(time * 0.7) * 0.06;
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 7 · The pattern — trades and feelings braid into a helix; FOMO lights up    */
/* -------------------------------------------------------------------------- */
export function thePattern(bin: Bin): Chapter {
  const group = new THREE.Group();
  const per = 34;
  const n = per * 2;
  const nodes = new THREE.InstancedMesh(
    bin.add(new THREE.SphereGeometry(0.12, 16, 12)),
    bin.add(new THREE.MeshBasicMaterial({ color: 0xffffff })),
    n,
  );
  group.add(nodes);
  const rand = seeded(41);
  // Emotion per node; FOMO is planted on a rhythm so the pattern is real.
  const emotion = Array.from({ length: n }, (_, i) => (i % per) % 5 === 2 ? 2 : [0, 1, 3, 4][Math.floor(rand() * 4)]);
  const rungPos = new Float32Array(per * 6);
  const rungGeo = bin.add(new THREE.BufferGeometry());
  rungGeo.setAttribute("position", new THREE.BufferAttribute(rungPos, 3));
  const rungMat = bin.add(new THREE.LineBasicMaterial({ color: COLOR.deep, transparent: true, opacity: 0.55 }));
  group.add(new THREE.LineSegments(rungGeo, rungMat));
  // The thread that joins every FOMO node: the "pattern".
  const fomoIdx = emotion.map((e, i) => (e === 2 ? i : -1)).filter((i) => i >= 0);
  const threadPos = new Float32Array(fomoIdx.length * 3);
  const threadGeo = bin.add(new THREE.BufferGeometry());
  threadGeo.setAttribute("position", new THREE.BufferAttribute(threadPos, 3));
  const threadMat = bin.add(new THREE.LineBasicMaterial({ color: COLOR.fomo, transparent: true, opacity: 0 }));
  group.add(new THREE.Line(threadGeo, threadMat));

  const insight1 = label(bin, "PATTERN: FOMO → OVERTRADING", "#ff8a3d", 0.28);
  const insight2 = label(bin, "CALM ENTRIES → CLEANEST TRADES", CSS.green, 0.28);
  insight1.position.set(0, 2.6, 0);
  insight2.position.set(0, -2.6, 0);
  group.add(insight1, insight2);
  const c = new THREE.Color();
  const p = new THREE.Vector3();
  const coords = new Float32Array(n * 3);

  return {
    group,
    update(local, time) {
      const grow = smooth(0, 0.35, local);
      const reveal = smooth(0.4, 0.62, local);
      for (let i = 0; i < n; i++) {
        const k = i % per;
        const strand = i < per ? 0 : Math.PI;
        const a = k * 0.42 + time * 0.5 + strand;
        p.set(-6.6 + k * 0.4, Math.cos(a) * 1.5, Math.sin(a) * 1.5);
        coords.set([p.x, p.y, p.z], i * 3);
        const appear = smooth(k / per - 0.1, k / per + 0.1, grow * 1.2);
        const isFomo = emotion[i] === 2;
        const s = appear * (isFomo ? 1 + reveal * 0.7 : 1 - reveal * 0.35);
        place(nodes, i, p.x, p.y, p.z, s, s, s);
        c.setHex(EMOTIONS[emotion[i]].color).multiplyScalar(isFomo ? 0.75 + reveal * 0.5 : 0.65 - reveal * 0.45);
        nodes.setColorAt(i, c);
      }
      for (let k = 0; k < per; k++) {
        rungPos.set([coords[k * 3], coords[k * 3 + 1], coords[k * 3 + 2]], k * 6);
        const j = (k + per) * 3;
        rungPos.set([coords[j], coords[j + 1], coords[j + 2]], k * 6 + 3);
      }
      rungGeo.setDrawRange(0, Math.floor(grow * per) * 2);
      rungGeo.attributes.position.needsUpdate = true;
      fomoIdx.forEach((idx, j) => threadPos.set([coords[idx * 3], coords[idx * 3 + 1], coords[idx * 3 + 2]], j * 3));
      threadGeo.attributes.position.needsUpdate = true;
      threadMat.opacity = reveal;
      rungMat.opacity = 0.55 - reveal * 0.35;
      nodes.instanceMatrix.needsUpdate = true;
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
      insight1.material.opacity = smooth(0.58, 0.68, local);
      insight2.material.opacity = smooth(0.68, 0.78, local);
      group.rotation.x = Math.sin(time * 0.3) * 0.08;
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 8 · The edge — green candles climb into a rising equity curve               */
/* -------------------------------------------------------------------------- */
export function theEdge(bin: Bin, { lite }: Options): Chapter {
  const group = new THREE.Group();
  const n = 34;
  const set = candles(bin, n);
  const rand = seeded(53);
  const bars: { x: number; y: number; h: number }[] = [];
  let price = -2.4;
  for (let i = 0; i < n; i++) {
    const move = rand() < 0.22 ? -(rand() * 0.25) : rand() * 0.42 + 0.08;
    bars.push({ x: -8 + i * 0.48, y: price + move / 2, h: Math.abs(move) + 0.2 });
    price += move;
    set.color(i, move >= 0 ? COLOR.green : COLOR.red, move >= 0 ? 1 : 0.7);
  }
  group.add(set.group);

  const curve = new THREE.CatmullRomCurve3(bars.map((b) => new THREE.Vector3(b.x, b.y + 0.9, -0.6)));
  const segments = 200;
  const radial = 8;
  const tube = bin.add(new THREE.TubeGeometry(curve, segments, 0.05, radial, false));
  const tubeMesh = new THREE.Mesh(tube, bin.add(new THREE.MeshBasicMaterial({ color: COLOR.green })));
  group.add(tubeMesh);
  const tip = glow(bin, COLOR.green, 2.4, 0);
  group.add(tip);
  const total = tube.index ? tube.index.count : 0;

  // Rising sparks.
  const count = lite ? 250 : 650;
  const pos = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() - 0.5) * 22;
    pos[i * 3 + 2] = (rand() - 0.5) * 10 - 2;
    seeds[i] = rand();
  }
  const sGeo = bin.add(new THREE.BufferGeometry());
  sGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const sMat = bin.add(
    new THREE.PointsMaterial({ color: COLOR.green, size: 0.06, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  group.add(new THREE.Points(sGeo, sMat));
  const halo = glow(bin, COLOR.green, 26, 0);
  halo.position.set(4, 4, -6);
  group.add(halo);
  const orb = glassOrb(bin, COLOR.green, 1.5, lite);
  orb.group.position.set(0, 5.6, -3);
  group.add(orb.group);

  return {
    group,
    update(local, time) {
      const build = smooth(0.05, 0.6, local);
      bars.forEach((b, i) => {
        const g = smooth(i / n * 0.8, i / n * 0.8 + 0.2, build);
        set.set(i, b.x, b.y, 0, b.h * g, 0.36 * Math.max(0.001, g));
      });
      set.commit();
      const drawn = smooth(0.15, 0.7, local);
      tube.setDrawRange(0, Math.floor((drawn * total) / 6) * 6);
      tip.position.copy(curve.getPoint(Math.max(0.001, drawn)));
      tip.material.opacity = drawn > 0.01 ? 1 : 0;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] = -3 + ((seeds[i] * 12 + time * (0.6 + seeds[i])) % 12);
      }
      sGeo.attributes.position.needsUpdate = true;
      sMat.opacity = smooth(0.4, 0.8, local) * 0.8;
      halo.material.opacity = smooth(0.4, 0.9, local) * 0.22;
      const rise = smooth(0.35, 0.8, local);
      orb.group.scale.setScalar(Math.max(0.001, rise));
      orb.group.position.y = lerp(2, 5.6, rise) + Math.sin(time * 0.8) * 0.12;
      orb.update(time, 1 + rise);
    },
  };
}

/* -------------------------------------------------------------------------- */
/* 8 · The coach — the orb speaks: nudges, missions, a rising awareness ring   */
/* -------------------------------------------------------------------------- */
export function theCoach(bin: Bin, { lite }: Options): Chapter {
  const group = new THREE.Group();
  const orb = glassOrb(bin, COLOR.green, 1.35, lite);
  orb.group.position.set(-2.4, 0, 0);
  group.add(orb.group);

  // The awareness ring: an arc that fills as the coaching lands.
  const arc = new THREE.EllipseCurve(0, 0, 2.5, 2.5, Math.PI / 2, Math.PI / 2 - Math.PI * 2, true);
  const path = new THREE.CurvePath<THREE.Vector3>();
  const pts = arc.getPoints(160).map((p) => new THREE.Vector3(p.x, p.y, 0));
  path.add(new THREE.CatmullRomCurve3(pts));
  const ringGeo = bin.add(new THREE.TubeGeometry(path, 240, 0.045, 8, false));
  const ring = new THREE.Mesh(ringGeo, bin.add(new THREE.MeshBasicMaterial({ color: COLOR.green })));
  const track = new THREE.Mesh(
    bin.add(new THREE.TorusGeometry(2.5, 0.02, 8, 160)),
    bin.add(new THREE.MeshBasicMaterial({ color: COLOR.deep, transparent: true, opacity: 0.35 })),
  );
  ring.position.copy(orb.group.position);
  track.position.copy(orb.group.position);
  group.add(track, ring);
  const ringTotal = ringGeo.index ? ringGeo.index.count : 0;
  const score = label(bin, "SELF-AWARENESS ↑", CSS.green, 0.26);
  score.position.set(-2.4, -3.05, 0);
  group.add(score);

  const messages: [string, string, string][] = [
    ["COACH", "2 losses in a row. This is where you", "usually revenge trade. Pause 15 min."],
    ["MISSION", "Next 5 trades: run your checklist", "before every entry."],
    ["PROGRESS", "7 days without a FOMO entry.", "Streak +1. Keep the edge."],
  ];
  const accents = [CSS.green, "#ffc53d", CSS.green];
  const bubbles = messages.map(([tag, a, b], i) => {
    const map = canvasTexture(bin, 760, 200, (ctx, w, h) => {
      panel(ctx, w, h, accents[i]);
      ctx.font = font(FONT_MONO, 22);
      ctx.fillStyle = accents[i];
      ctx.fillText(tag, 36, 56);
      ctx.font = font(FONT_UI, 28);
      ctx.fillStyle = CSS.ink;
      ctx.fillText(a, 36, 110);
      ctx.fillStyle = CSS.muted;
      ctx.fillText(b, 36, 152);
    });
    const mesh = new THREE.Mesh(
      bin.add(new THREE.PlaneGeometry(3.5, 0.92)),
      bin.add(new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false })),
    );
    mesh.position.set(2.2, 1.3 - i * 1.15, 0.4);
    group.add(mesh);
    return mesh;
  });

  return {
    group,
    update(local, time) {
      orb.update(time, 1 + smooth(0.2, 0.8, local));
      orb.group.position.y = Math.sin(time * 0.8) * 0.1;
      const fill = smooth(0.15, 0.8, local);
      ringGeo.setDrawRange(0, Math.floor((fill * ringTotal) / 6) * 6);
      score.material.opacity = smooth(0.5, 0.65, local);
      bubbles.forEach((m, i) => {
        const a = smooth(0.15 + i * 0.15, 0.27 + i * 0.15, local);
        (m.material as THREE.MeshBasicMaterial).opacity = a;
        m.position.x = lerp(3.2, 2.2, a);
        m.position.y = 1.3 - i * 1.15 + Math.sin(time * 0.9 + i) * 0.05;
      });
    },
  };
}
