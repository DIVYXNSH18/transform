import os
import json
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation_deck(slides_data: list, output_path: str):
    """
    Builds a high-impact, professional 16:9 widescreen presentation deck
    with rich corporate dark aesthetics and embedded speaker notes.
    """
    prs = Presentation()
    prs.slide_width = Inches(13.333) # 16:9 Widescreen standard
    prs.slide_height = Inches(7.5)
    
    blank_layout = prs.slide_layouts[6] # Blank slide layout
    
    # Palette definition
    DARK_BG = RGBColor(15, 23, 42)        # Deep Navy / Slate 900
    ACCENT_ORANGE = RGBColor(255, 107, 0) # Performance Orange
    ACCENT_CYAN = RGBColor(56, 189, 248)  # Cyan 400
    TEXT_WHITE = RGBColor(248, 250, 252)  # Slate 50
    TEXT_MUTED = RGBColor(148, 163, 184)  # Slate 400
    CARD_BG = RGBColor(30, 41, 59)        # Slate 800

    # Sanitize slides_data
    safe_slides = []
    if isinstance(slides_data, list):
        for item in slides_data:
            if isinstance(item, dict):
                safe_slides.append(item)
            elif isinstance(item, str):
                safe_slides.append({"title": item, "bullets": []})
    if not safe_slides:
        safe_slides = [
            {"title": "TransformAI Executive Summary", "bullets": ["High-impact deliverable generated via edge intelligence."]}
        ]

    for idx, slide_info in enumerate(safe_slides):
        slide = prs.slides.add_slide(blank_layout)
        
        # 1. Background Fill Shape
        bg_shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5)
        )
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = DARK_BG
        bg_shape.line.fill.background()

        # 2. Top Accent Glow Bar
        top_bar = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12)
        )
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = ACCENT_ORANGE
        top_bar.line.fill.background()

        # 3. Slide Index & Telemetry Header
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        h_tf = header_box.text_frame
        h_p = h_tf.paragraphs[0]
        h_p.text = f"TRANSFORMAI // SLIDE {idx + 1:02d} OF {len(safe_slides):02d} // iQOO EDGE ENGINE"
        h_p.font.size = Pt(11)
        h_p.font.bold = True
        h_p.font.color.rgb = ACCENT_CYAN

        # 4. Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(1.1))
        t_tf = title_box.text_frame
        t_tf.word_wrap = True
        t_p = t_tf.paragraphs[0]
        t_p.text = str(slide_info.get("title", f"Deliverable Section {idx + 1}"))
        t_p.font.size = Pt(32)
        t_p.font.bold = True
        t_p.font.color.rgb = TEXT_WHITE

        # Subtitle if available
        subtitle = slide_info.get("subtitle", "")
        if subtitle:
            s_p = t_tf.add_paragraph()
            s_p.text = str(subtitle)
            s_p.font.size = Pt(16)
            s_p.font.color.rgb = ACCENT_ORANGE

        # 5. Content Card Shape
        card = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(2.3), Inches(11.733), Inches(4.5)
        )
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = RGBColor(51, 65, 85)
        card.line.width = Pt(1.5)

        # 6. Bullets inside Content Box
        body_box = slide.shapes.add_textbox(Inches(1.2), Inches(2.5), Inches(10.9), Inches(4.1))
        b_tf = body_box.text_frame
        b_tf.word_wrap = True

        raw_bullets = slide_info.get("bullets", [])
        if isinstance(raw_bullets, str):
            bullets = [b.strip("-*▸ \t") for b in raw_bullets.split("\n") if b.strip()]
        elif isinstance(raw_bullets, list):
            bullets = [str(b) for b in raw_bullets if b is not None]
        else:
            bullets = [str(raw_bullets)]

        if not bullets:
            bullets = ["Key insight captured and synthesized from source telemetry."]

        for b_i, bullet in enumerate(bullets):
            p = b_tf.paragraphs[0] if b_i == 0 else b_tf.add_paragraph()
            p.text = f"▸   {bullet}"
            p.font.size = Pt(19)
            p.font.color.rgb = TEXT_WHITE
            p.space_after = Pt(18)

        # 7. Speaker Notes
        notes_slide = slide.notes_slide
        tf_notes = notes_slide.notes_text_frame
        speaker_notes = slide_info.get("speaker_notes", "")
        if not speaker_notes:
            speaker_notes = f"Presentation notes for slide {idx + 1}: {slide_info.get('title')}. Focus on delivering the key points clearly."
        tf_notes.text = str(speaker_notes)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    prs.save(output_path)
    return output_path
