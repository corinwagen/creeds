#!/usr/bin/env python3
import argparse
import json
import re
from html.parser import HTMLParser


def normalize(text):
    text = re.sub(r"\s+", " ", text)
    text = text.replace(" ,", ",").replace(" .", ".").replace(" ;", ";")
    return text.strip()


class ParagraphParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.paragraphs = []
        self.in_p = False
        self.in_em = 0
        self.parts = []
        self.has_em = False
        self.skip = 0

    def handle_starttag(self, tag, attrs):
        attr_map = dict(attrs)
        class_name = attr_map.get("class", "")
        if tag in {"script", "style"}:
            self.skip += 1
            return
        if self.skip:
            return
        if tag == "p":
            self.in_p = True
            self.parts = []
            self.has_em = False
        elif tag == "br" and self.in_p:
            self.parts.append(" ")
        elif tag == "em" and self.in_p:
            self.in_em += 1
            self.has_em = True
        elif class_name == "mnote":
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in {"script", "style"} and self.skip:
            self.skip -= 1
            return
        if self.skip:
            if tag == "span":
                self.skip -= 1
            return
        if tag == "em" and self.in_em:
            self.in_em -= 1
        elif tag == "p" and self.in_p:
            text = normalize("".join(self.parts))
            if text:
                self.paragraphs.append({"text": text, "em": self.has_em})
            self.in_p = False
            self.parts = []
            self.has_em = False

    def handle_data(self, data):
        if self.in_p and not self.skip:
            self.parts.append(data)


def parse_qas(path):
    parser = ParagraphParser()
    with open(path, encoding="utf-8") as source:
        parser.feed(source.read())

    sections = []
    for item in parser.paragraphs:
        text = item["text"]
        if text.lower().startswith("back to top"):
            continue

        match = re.match(r"^Q\.\s*(\d+)\.?\s*(.*?)\s+A\.\s*(.+)$", text)
        if match:
            sections.append(
                {
                    "number": int(match.group(1)),
                    "roman": match.group(1),
                    "title": f"Q. {match.group(1)}",
                    "text": f"Q. {match.group(2)}\n\nA. {match.group(3)}",
                    "proofs": [],
                }
            )
            continue

        if item["em"] and sections:
            sections[-1]["proofs"] = [{"marker": "proof", "text": text}]

    return sections


def grouped_chapters(sections, groups):
    chapters = []
    for number, (start, end, title) in enumerate(groups, start=1):
        group_sections = [section for section in sections if start <= section["number"] <= end]
        chapters.append(
            {
                "number": number,
                "roman": str(number),
                "title": title,
                "kicker": f"Questions {start}-{end}",
                "sections": group_sections,
            }
        )
    return chapters


def document(title, short_title, slug, mark, edition, description, source_url, sections, groups):
    return {
        "title": title,
        "shortTitle": short_title,
        "slug": slug,
        "mark": mark,
        "edition": edition,
        "description": description,
        "unitLabel": "Part",
        "source": {
            "name": "The Westminster Standard",
            "url": source_url,
            "retrieved": "2026-06-15",
        },
        "chapters": grouped_chapters(sections, groups),
    }


def main():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("--shorter", required=True)
    arg_parser.add_argument("--larger", required=True)
    arg_parser.add_argument("--output", required=True)
    args = arg_parser.parse_args()

    shorter_sections = parse_qas(args.shorter)
    larger_sections = parse_qas(args.larger)
    if len(shorter_sections) != 107:
        raise SystemExit(f"Expected 107 Shorter Catechism questions, found {len(shorter_sections)}")
    if len(larger_sections) != 196:
        raise SystemExit(f"Expected 196 Larger Catechism questions, found {len(larger_sections)}")

    shorter_groups = [
        (1, 12, "God, Scripture, and Man's End"),
        (13, 20, "Sin and Misery"),
        (21, 38, "Christ and Redemption"),
        (39, 84, "The Duty God Requires"),
        (85, 97, "The Means of Grace"),
        (98, 107, "The Lord's Prayer"),
    ]
    larger_groups = [
        (1, 5, "Man's End, God, and Scripture"),
        (6, 90, "God, Creation, Fall, and Redemption"),
        (91, 152, "The Duty God Requires"),
        (153, 177, "The Outward Means of Grace"),
        (178, 196, "Prayer and the Lord's Prayer"),
    ]

    docs = [
        document(
            "The Westminster Shorter Catechism",
            "Shorter Catechism",
            "westminster-shorter-catechism",
            "S",
            "1647 proof-text reader edition",
            "The Westminster Assembly's concise catechism in 107 questions and answers.",
            "https://thewestminsterstandard.org/westminster-shorter-catechism/",
            shorter_sections,
            shorter_groups,
        ),
        document(
            "The Westminster Larger Catechism",
            "Larger Catechism",
            "westminster-larger-catechism",
            "L",
            "1647 proof-text reader edition",
            "The Westminster Assembly's fuller catechism in 196 questions and answers.",
            "https://thewestminsterstandard.org/westminster-larger-catechism/",
            larger_sections,
            larger_groups,
        ),
    ]

    with open(args.output, "w", encoding="utf-8") as target:
        target.write("window.WESTMINSTER_CATECHISMS_DATA = ")
        json.dump(docs, target, ensure_ascii=False, indent=2)
        target.write(";\n")


if __name__ == "__main__":
    main()
