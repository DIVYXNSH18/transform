import os
import re
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
    KeepTogether,
)

def _md_to_reportlab_html(text: str) -> str:
    """Escapes XML entities and converts basic markdown (**bold**, *italic*, `code`) to ReportLab XML tags."""
    t = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<!\*)\*([^*]+?)\*(?!\*)', r'<i>\1</i>', t)
    t = re.sub(r'`([^`]+?)`', r'<font face="Courier">\1</font>', t)
    return t

def _parse_markdown_table_to_flowable(table_lines: List[str], cell_style: ParagraphStyle, hdr_style: ParagraphStyle, dark_slate, border_color, row_alt_bg) -> Table:
    """Parses markdown table lines into a styled ReportLab Table flowable."""
    data_rows = []
    for line in table_lines:
        cells = [c.strip() for c in line.strip("|").split("|")]
        # Filter separator rows like |---|---|
        if cells and not all(re.match(r'^[\-:]+$', c) for c in cells):
            data_rows.append(cells)

    if not data_rows:
        return None

    num_cols = len(data_rows[0])
    total_width = 516.0  # standard printable width (letter 612 - 96 margin)
    col_width = total_width / max(num_cols, 1)
    col_widths = [col_width] * num_cols

    flowable_data = []
    for r_idx, row in enumerate(data_rows):
        flowable_row = []
        for c_idx in range(num_cols):
            cell_txt = row[c_idx] if c_idx < len(row) else ""
            fmt_txt = _md_to_reportlab_html(cell_txt)
            cur_style = hdr_style if r_idx == 0 else cell_style
            flowable_row.append(Paragraph(fmt_txt, cur_style))
        flowable_data.append(flowable_row)

    table = Table(flowable_data, colWidths=col_widths)
    t_style = [
        ("BACKGROUND", (0, 0), (-1, 0), dark_slate),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.5, border_color),
    ]
    for row_idx in range(1, len(data_rows)):
        if row_idx % 2 == 0:
            t_style.append(("BACKGROUND", (0, row_idx), (-1, row_idx), row_alt_bg))

    table.setStyle(TableStyle(t_style))
    return table

def _parse_markdown_to_story(markdown_text: str, styles: dict, story: list):
    """Parses markdown text into ReportLab Flowables and appends them to story."""
    lines = markdown_text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if not stripped:
            i += 1
            continue

        # Markdown Table Detection
        if stripped.startswith("|") and "|" in stripped:
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i].strip())
                i += 1
            tbl = _parse_markdown_table_to_flowable(
                table_lines,
                styles["TableCell"],
                styles["TableHdr"],
                styles["dark_slate"],
                styles["border_color"],
                styles["row_alt_bg"]
            )
            if tbl:
                story.append(Spacer(1, 4))
                story.append(tbl)
                story.append(Spacer(1, 6))
            continue

        # Headings
        if stripped.startswith("### "):
            story.append(Paragraph(_md_to_reportlab_html(stripped[4:].strip()), styles["H3"]))
            i += 1
            continue
        if stripped.startswith("## "):
            story.append(Paragraph(_md_to_reportlab_html(stripped[3:].strip()), styles["H2"]))
            i += 1
            continue
        if stripped.startswith("# "):
            story.append(Paragraph(_md_to_reportlab_html(stripped[2:].strip()), styles["H1"]))
            i += 1
            continue

        # Bullet items
        if stripped.startswith("- ") or stripped.startswith("* ") or stripped.startswith("• "):
            bullet_body = stripped[2:].strip()
            formatted_bullet = f"&bull;&nbsp;&nbsp;{_md_to_reportlab_html(bullet_body)}"
            story.append(Paragraph(formatted_bullet, styles["BulletPoint"]))
            i += 1
            continue

        # Blockquote / Callout Box
        if stripped.startswith(">"):
            quote_lines = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_lines.append(lines[i].strip().lstrip("> ").strip())
                i += 1
            quote_text = " ".join(quote_lines)
            callout_p = Paragraph(_md_to_reportlab_html(quote_text), styles.get("CalloutText", styles["BodyDark"]))
            callout_tbl = Table([[callout_p]], colWidths=[516.0])
            callout_tbl.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF7ED")),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LINELEFT", (0, 0), (0, -1), 3.5, colors.HexColor("#FF6B00")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#FFEDD5")),
            ]))
            story.append(Spacer(1, 4))
            story.append(callout_tbl)
            story.append(Spacer(1, 6))
            continue

        # Regular paragraph
        story.append(Paragraph(_md_to_reportlab_html(stripped), styles["BodyDark"]))
        i += 1

def create_executive_pdf(title: str, summary_markdown: str, ico_data: Dict[str, Any], output_path: str) -> str:
    """
    Builds a high-impact, professional executive PDF deliverable using ReportLab.
    Parses and renders the full LLM-generated summary_markdown if provided,
    with ICO metadata as header and fallback support.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=48,
        rightMargin=48,
        topMargin=48,
        bottomMargin=48
    )

    styles = getSampleStyleSheet()

    # Custom colors & styles
    primary_color = colors.HexColor("#FF6B00")  # TransformAI accent
    dark_slate = colors.HexColor("#0F172A")
    muted_text = colors.HexColor("#64748B")
    border_color = colors.HexColor("#E2E8F0")
    row_alt_bg = colors.HexColor("#F8FAFC")

    brand_style = ParagraphStyle(
        "BrandHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11,
        textColor=primary_color,
        textTransform="uppercase",
        spaceAfter=4,
    )

    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=dark_slate,
        spaceAfter=8,
    )

    meta_style = ParagraphStyle(
        "MetaText",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=13,
        textColor=muted_text,
        spaceAfter=12,
    )

    h1_style = ParagraphStyle(
        "PDFHeading1",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=19,
        textColor=dark_slate,
        spaceBefore=14,
        spaceAfter=6,
    )

    h2_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12.5,
        leading=16,
        textColor=dark_slate,
        spaceBefore=12,
        spaceAfter=6,
    )

    h3_style = ParagraphStyle(
        "PDFHeading3",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceBefore=8,
        spaceAfter=4,
    )

    body_style = ParagraphStyle(
        "BodyDark",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )

    bullet_style = ParagraphStyle(
        "BulletPoint",
        parent=body_style,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=4,
    )

    table_cell_style = ParagraphStyle(
        "TableCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1E293B"),
    )

    table_hdr_style = ParagraphStyle(
        "TableHdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=colors.white,
    )

    callout_style = ParagraphStyle(
        "CalloutText",
        parent=styles["Normal"],
        fontName="Helvetica-Oblique",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#0F172A")
    )

    style_dict = {
        "H1": h1_style,
        "H2": h2_style,
        "H3": h3_style,
        "BodyDark": body_style,
        "BulletPoint": bullet_style,
        "TableCell": table_cell_style,
        "TableHdr": table_hdr_style,
        "CalloutText": callout_style,
        "dark_slate": dark_slate,
        "border_color": border_color,
        "row_alt_bg": row_alt_bg
    }

    story = []

    # 1. Header Banner
    story.append(Paragraph("TRANSFORMAI // EXECUTIVE DELIVERABLE BRIEF", brand_style))
    story.append(HRFlowable(width="100%", thickness=2, color=primary_color, spaceBefore=2, spaceAfter=8))

    # 2. Main Title
    clean_title = title.replace("#", "").strip() if title else "Executive Briefing"
    story.append(Paragraph(_md_to_reportlab_html(clean_title), title_style))

    # 3. Metadata Bar
    timestamp = ico_data.get("timestamp", "Present")
    loc = ico_data.get("location", "TransformAI Edge Engine")
    obj = ico_data.get("primary_objective", "Operational alignment & execution")
    meta_content = f"<b>Generated:</b> {_md_to_reportlab_html(str(timestamp))} &nbsp;|&nbsp; <b>Location:</b> {_md_to_reportlab_html(str(loc))} &nbsp;|&nbsp; <b>Core Objective:</b> {_md_to_reportlab_html(str(obj))}"
    story.append(Paragraph(meta_content, meta_style))
    story.append(Spacer(1, 6))

    # 4. Render LLM-generated summary if available
    if summary_markdown and summary_markdown.strip():
        _parse_markdown_to_story(summary_markdown, style_dict, story)
    else:
        # Fallback to ICO fields
        overview_text = ico_data.get("executive_overview", "")
        if overview_text:
            story.append(Paragraph("1. Strategic Overview", h2_style))
            story.append(Paragraph(_md_to_reportlab_html(overview_text), body_style))
            story.append(Spacer(1, 4))

        findings = ico_data.get("key_findings", [])
        if findings:
            story.append(Paragraph("2. Key Findings & Insights", h2_style))
            for f in findings:
                bullet_text = f"&bull;&nbsp;&nbsp;{_md_to_reportlab_html(f)}"
                story.append(Paragraph(bullet_text, bullet_style))
            story.append(Spacer(1, 4))

        actions = ico_data.get("action_items", [])
        if actions:
            story.append(Paragraph("3. Action Matrix & Ownership", h2_style))
            table_data = [
                [
                    Paragraph("Owner", table_hdr_style),
                    Paragraph("Action Item / Milestone", table_hdr_style),
                    Paragraph("Deadline", table_hdr_style),
                ]
            ]
            for item in actions:
                owner = item.get("owner", "Team")
                task = item.get("task", "")
                deadline = item.get("deadline", "TBD")
                table_data.append([
                    Paragraph(f"<b>{_md_to_reportlab_html(owner)}</b>", table_cell_style),
                    Paragraph(_md_to_reportlab_html(task), table_cell_style),
                    Paragraph(_md_to_reportlab_html(deadline), table_cell_style),
                ])

            col_widths = [110, 316, 90]
            matrix_table = Table(table_data, colWidths=col_widths)
            t_style = [
                ("BACKGROUND", (0, 0), (-1, 0), dark_slate),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("GRID", (0, 0), (-1, -1), 0.5, border_color),
            ]
            for row_idx in range(1, len(table_data)):
                if row_idx % 2 == 0:
                    t_style.append(("BACKGROUND", (0, row_idx), (-1, row_idx), row_alt_bg))

            matrix_table.setStyle(TableStyle(t_style))
            story.append(matrix_table)
            story.append(Spacer(1, 8))

        entities = ico_data.get("entities", {})
        metrics = entities.get("metrics", []) if isinstance(entities, dict) else []
        if metrics:
            story.append(Paragraph("4. Key Milestones & Metrics", h2_style))
            for m in metrics:
                story.append(Paragraph(f"&bull;&nbsp;&nbsp;<b>Target:</b> {_md_to_reportlab_html(m)}", bullet_style))
            story.append(Spacer(1, 6))

    # 5. Footer divider
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.5, color=border_color, spaceBefore=4, spaceAfter=6))
    footer_text = "Verified Intent Context Object (ICO) &bull; Zero Hallucination Pipeline &bull; TransformAI Headless Engine"
    story.append(Paragraph(footer_text, ParagraphStyle("Footer", parent=meta_style, fontSize=7.5, alignment=1)))

    doc.build(story)
    return output_path
