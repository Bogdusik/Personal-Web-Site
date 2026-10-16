import { ImageResponse } from 'next/og';

export const alt = 'Bohdan Bozhenko — Backend / AI Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#F1EFE8', padding: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid #BDB9AE', padding: '48px 56px', color: '#191917' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 2, color: '#5E5C55' }}>
            <span>SHEET 01 / 04 — INDEX</span>
            <span style={{ color: '#2438D8' }}>● AVAILABLE — IMMEDIATE START</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 120, fontWeight: 600, letterSpacing: -5, lineHeight: 0.95 }}>Bohdan Bozhenko</span>
            <span style={{ marginTop: 24, fontSize: 48, color: '#2438D8' }}>Backend / AI Engineer</span>
            <span style={{ marginTop: 12, fontSize: 30, color: '#3E3C38' }}>Python / FastAPI · Spring Boot · PostgreSQL</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
