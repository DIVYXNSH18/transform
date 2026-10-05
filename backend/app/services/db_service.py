import sqlite3
import json
import os
import time
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.config import GENERATED_DIR

DB_PATH = os.getenv("DB_PATH", os.path.join(os.path.dirname(os.path.dirname(__file__)), "transformai.db"))

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        primary_objective TEXT,
        formats_count INTEGER DEFAULT 0,
        timestamp_str TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        source_text TEXT,
        tone TEXT DEFAULT 'professional',
        audience TEXT DEFAULT 'executive',
        ico_json TEXT,
        outputs_json TEXT,
        pptx_url TEXT,
        docx_url TEXT,
        pdf_url TEXT
    )
    """)
    
    # Ensure pdf_url and vtt_url columns exist for existing databases
    cursor.execute("PRAGMA table_info(history)")
    cols = [col[1] for col in cursor.fetchall()]
    if "pdf_url" not in cols:
        cursor.execute("ALTER TABLE history ADD COLUMN pdf_url TEXT")
    if "vtt_url" not in cols:
        cursor.execute("ALTER TABLE history ADD COLUMN vtt_url TEXT")

    # Check if empty, seed default records if needed
    cursor.execute("SELECT COUNT(*) as count FROM history")
    row = cursor.fetchone()
    if row and row["count"] == 0:
        seed_defaults(cursor)
    
    conn.commit()
    conn.close()
    print(f"[*] SQLite Database initialized at {DB_PATH}")

def seed_defaults(cursor):
    sample_items = [
        (
            "hist_1",
            "Product Strategy All-Hands",
            "Align engineering deliverables and hit Q3 launch.",
            4,
            "10 mins ago",
            "Sync with Mobile Engineering and Product Strategy leads. Target launch is set for Q3 Sprint 4.",
            "professional",
            "executive",
            json.dumps({
                "event_title": "Product Strategy All-Hands",
                "timestamp": "10 mins ago",
                "location": "Virtual / HQ",
                "primary_objective": "Align engineering deliverables and hit Q3 launch.",
                "executive_overview": "Leadership alignment across Mobile Engineering and Strategy tracks.",
                "key_findings": [
                    "Workflow turnaround reduced from 45 minutes to 48 seconds.",
                    "Zero prompt engineering required from end-user.",
                    "Factual consistency guaranteed across all 4 formats."
                ],
                "action_items": [
                    {"owner": "Alex", "task": "Finalize PWA service worker", "deadline": "Friday 5 PM"},
                    {"owner": "Priya", "task": "Calibrate python-pptx widescreen templates", "deadline": "Monday EOD"}
                ],
                "entities": {
                    "teams": ["Mobile Engineering", "Product Strategy"],
                    "dates": ["Friday 5 PM", "Monday EOD"],
                    "metrics": ["<60s latency", "4 deliverables"]
                },
                "citations": [
                    {"id": 1, "claim": "Turnaround reduced to 48s", "source_quote": "Sync with Mobile Engineering"}
                ]
            }),
            json.dumps({
                "executive_summary": "## Executive Brief: Product Strategy\n\n- **Target**: Q3 Sprint 4 Launch.\n- **Objective**: Full workflow automation.\n- **Impact**: Turnaround reduced from 45 minutes to under 60 seconds.",
                "linkedin": "🚀 Thrilled to announce the latest milestones from our Product Strategy sync! We are hitting Q3 targets with breakthrough edge intelligence. #Productivity #AI",
                "twitter": "1/3 Scaling edge intelligence with TransformAI. One voice memo -> 4 boardroom-ready deliverables in <60s. ⚡",
                "slides_data": [
                    {
                        "slide_number": 1,
                        "title": "Product Strategy All-Hands",
                        "subtitle": "Q3 Launch Target Alignment",
                        "bullets": ["Sprint 4 target confirmed", "Under 60s transformation latency", "Zero prompt engineering required"],
                        "speaker_notes": "Introduce the core objective of the Q3 Sprint 4 launch."
                    }
                ]
            }),
            "/api/download/pptx",
            "/api/download/docx",
            "/api/download/pdf"
        ),
        (
            "hist_2",
            "Growth Architecture Whiteboard OCR",
            "Scale retention from 42% to 58%.",
            4,
            "2 hours ago",
            "[WHITEBOARD SNAPSHOT - OCR TRANSCRIBED] Objective: Scale user engagement across 12 product markets.",
            "professional",
            "executive",
            json.dumps({
                "event_title": "Growth Architecture Whiteboard OCR",
                "timestamp": "2 hours ago",
                "primary_objective": "Scale retention from 42% to 58%.",
                "executive_overview": "Whiteboard session focusing on user retention lift and cross-device handoffs.",
                "key_findings": ["Retention lift benchmark from 42% to 58%"],
                "action_items": [{"owner": "David", "task": "Speech visualizer", "deadline": "Nov 15"}],
                "entities": {"teams": ["Frontend", "Core Engine"], "dates": ["Nov 15"], "metrics": ["58% retention"]},
                "citations": []
            }),
            json.dumps({
                "executive_summary": "## Growth Architecture\n\nFocus on scaling user retention across 12 product markets.",
                "linkedin": "Excited to share insights from our Growth Architecture session on retention scaling. 📈",
                "twitter": "Whiteboard to deck in 60s. Lifting 30-day retention from 42% to 58%. 🎯",
                "slides_data": []
            }),
            "/api/download/pptx",
            "/api/download/docx",
            "/api/download/pdf"
        ),
        (
            "hist_3",
            "Executive Client Debrief (Singapore)",
            "Enterprise pilot deployment with 250 seats.",
            3,
            "Yesterday",
            "Quick voice memo from the offsite meeting in Singapore. Client loved the Honest Split demo.",
            "professional",
            "executive",
            json.dumps({
                "event_title": "Executive Client Debrief (Singapore)",
                "timestamp": "Yesterday",
                "primary_objective": "Enterprise pilot deployment with 250 seats.",
                "executive_overview": "Singapore client debrief confirming 250 enterprise pilot seats.",
                "key_findings": ["Enterprise interest in local compute", "Conversion rate target 85%"],
                "action_items": [{"owner": "Lead", "task": "Commercial proposal", "deadline": "Thursday"}],
                "entities": {"teams": ["Sales", "Enterprise"], "dates": ["Thursday"], "metrics": ["250 seats"]},
                "citations": []
            }),
            json.dumps({
                "executive_summary": "## Executive Debrief: Singapore Client\n\nConfirmed pilot deployment with 250 enterprise seats.",
                "linkedin": "Key takeaways from our Singapore offsite: enterprise demand for local privacy-first AI is surging. 🌐",
                "twitter": "250 enterprise pilot seats approved! The power of on-device privacy + headless local compute. 🔒",
                "slides_data": []
            }),
            "/api/download/pptx",
            "/api/download/docx",
            "/api/download/pdf"
        )
    ]
    
    cursor.executemany("""
    INSERT INTO history (
        id, title, primary_objective, formats_count, timestamp_str, source_text,
        tone, audience, ico_json, outputs_json, pptx_url, docx_url, pdf_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, sample_items)

def save_transformation_to_db(
    item_id: str,
    title: str,
    primary_objective: str,
    formats_count: int,
    source_text: str,
    tone: str,
    audience: str,
    ico: Dict[str, Any],
    outputs: Dict[str, Any],
    pptx_url: Optional[str] = None,
    docx_url: Optional[str] = None,
    pdf_url: Optional[str] = None,
    vtt_url: Optional[str] = None
) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    
    timestamp_str = datetime.now().strftime("%b %d, %H:%M")
    ico_json = json.dumps(ico)
    outputs_json = json.dumps(outputs)
    
    cursor.execute("""
    INSERT OR REPLACE INTO history (
        id, title, primary_objective, formats_count, timestamp_str, source_text,
        tone, audience, ico_json, outputs_json, pptx_url, docx_url, pdf_url, vtt_url, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    """, (
        item_id, title, primary_objective, formats_count, timestamp_str, source_text,
        tone, audience, ico_json, outputs_json, pptx_url, docx_url, pdf_url, vtt_url
    ))
    
    conn.commit()
    conn.close()
    
    return {
        "id": item_id,
        "title": title,
        "timestamp": timestamp_str,
        "formatsCount": formats_count,
        "primaryObjective": primary_objective
    }

def get_all_history(limit: int = 30) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    SELECT id, title, primary_objective as primaryObjective, formats_count as formatsCount,
           timestamp_str as timestamp, created_at
    FROM history
    ORDER BY created_at DESC
    LIMIT ?
    """, (limit,))
    
    rows = cursor.fetchall()
    results = [dict(row) for row in rows]
    conn.close()
    return results

def get_history_by_id(item_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    
    clean_id = (item_id or "").strip()
    row = None

    if clean_id and clean_id.lower() not in ["latest", "null", "undefined", "default", ""]:
        cursor.execute("""
        SELECT id, title, primary_objective, formats_count, timestamp_str, source_text,
               tone, audience, ico_json, outputs_json, pptx_url, docx_url, pdf_url, vtt_url, created_at
        FROM history
        WHERE id = ?
        """, (clean_id,))
        row = cursor.fetchone()

        if not row:
            cursor.execute("""
            SELECT id, title, primary_objective, formats_count, timestamp_str, source_text,
                   tone, audience, ico_json, outputs_json, pptx_url, docx_url, pdf_url, vtt_url, created_at
            FROM history
            WHERE title LIKE ?
            ORDER BY created_at DESC
            LIMIT 1
            """, (f"%{clean_id}%",))
            row = cursor.fetchone()

    # Fallback to latest record
    if not row:
        cursor.execute("""
        SELECT id, title, primary_objective, formats_count, timestamp_str, source_text,
               tone, audience, ico_json, outputs_json, pptx_url, docx_url, pdf_url, vtt_url, created_at
        FROM history
        ORDER BY created_at DESC
        LIMIT 1
        """)
        row = cursor.fetchone()

    conn.close()
    
    if not row:
        return None
    
    d = dict(row)
    try:
        ico = json.loads(d.get("ico_json") or "{}")
    except Exception:
        ico = {}
        
    try:
        outputs = json.loads(d.get("outputs_json") or "{}")
    except Exception:
        outputs = {}
        
    return {
        "id": d["id"],
        "title": d["title"],
        "primaryObjective": d["primary_objective"],
        "formatsCount": d["formats_count"],
        "timestamp": d["timestamp_str"],
        "created_at": d["created_at"],
        "source_text": d["source_text"],
        "tone": d["tone"],
        "audience": d["audience"],
        "ico": ico,
        "outputs": outputs,
        "pptx_url": d["pptx_url"],
        "docx_url": d["docx_url"],
        "pdf_url": d.get("pdf_url"),
        "vtt_url": d.get("vtt_url")
    }

def delete_history_by_id(item_id: str) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM history WHERE id = ?", (item_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted
