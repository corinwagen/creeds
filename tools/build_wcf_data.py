#!/usr/bin/env python3
import json
import re
import sys
from html.parser import HTMLParser


ROMAN_VALUES = {
    "I": 1,
    "V": 5,
    "X": 10,
    "L": 50,
    "C": 100,
    "D": 500,
    "M": 1000,
}

CANON_BOOK_LIST = """Of the Old Testament

Genesis. Exodus. Leviticus. Numbers. Deuteronomy. Joshua. Judges. Ruth. I Samuel. II Samuel. I Kings. II Kings. I Chronicles. II Chronicles. Ezra. Nehemiah. Esther. Job. Psalms. Proverbs. Ecclesiastes. The Song of Songs. Isaiah. Jeremiah. Lamentations. Ezekiel. Daniel. Hosea. Joel. Amos. Obadiah. Jonah. Micah. Nahum. Habakkuk. Zephaniah. Haggai. Zechariah. Malachi.

Of the New Testament

The Gospels according to Matthew, Mark, Luke, John. The Acts of the Apostles. Paul's Epistles to the Romans. Corinthians I. Corinthians II. Galatians. Ephesians. Philippians. Colossians. Thessalonians I. Thessalonians II. To Timothy I. To Timothy II. To Titus. To Philemon. The Epistle to the Hebrews. The Epistle of James. The First and Second Epistles of Peter. The First, Second, and Third Epistles of John. The Epistle of Jude. The Revelation."""


def roman_to_int(value):
    total = 0
    previous = 0
    for char in reversed(value):
        amount = ROMAN_VALUES[char]
        if amount < previous:
            total -= amount
        else:
            total += amount
            previous = amount
    return total


def normalize(text):
    text = re.sub(r"\s+", " ", text)
    text = text.replace(" ;", ";").replace(" ,", ",").replace(" .", ".")
    return text.strip()


def fix_known_source_artifacts(text):
    replacements = {
        "wrath of Godc and curse of the law": "wrath of God^{c} and curse of the law",
    }
    for source, replacement in replacements.items():
        text = text.replace(source, replacement)
    text = re.sub(r"(\^\{\s*[a-z]\s*\})(?=[A-Za-z])", r"\1 ", text)
    return text


class ContentParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.items = []
        self.capture_tag = None
        self.capture_parts = []
        self.in_ignored = False
        self.in_sup = False

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style"}:
            self.in_ignored = True
            return
        if self.in_ignored:
            return
        if tag in {"h1", "h2", "h3", "p"} and self.capture_tag is None:
            self.capture_tag = tag
            self.capture_parts = []
        elif tag == "br" and self.capture_tag is not None:
            self.capture_parts.append(" ")
        elif tag == "sup" and self.capture_tag is not None:
            self.in_sup = True
            self.capture_parts.append("^{")

    def handle_endtag(self, tag):
        if tag in {"script", "style"}:
            self.in_ignored = False
            return
        if self.in_ignored:
            return
        if tag == "sup" and self.capture_tag is not None and self.in_sup:
            self.in_sup = False
            self.capture_parts.append("}")
            return
        if tag == self.capture_tag:
            text = normalize("".join(self.capture_parts))
            if text:
                self.items.append({"tag": self.capture_tag, "text": text})
            self.capture_tag = None
            self.capture_parts = []

    def handle_data(self, data):
        if self.in_ignored or self.capture_tag is None:
            return
        self.capture_parts.append(data)


def split_proofs(text):
    text = re.sub(r"\^\{[a-z]\}", "", text, flags=re.I)
    text = normalize(text)
    groups = []
    for part in re.split(r"\s*•\s*", text):
        match = re.match(r"^([a-z])\.\s*(.+)$", part)
        if not match:
            continue
        groups.append({"marker": match.group(1).lower(), "text": normalize(match.group(2))})
    return groups


def build_data(items):
    starts = [
        index
        for index, item in enumerate(items)
        if item["tag"] == "h1" and item["text"].startswith("I. Of the Holy Scripture")
    ]
    if not starts:
        raise SystemExit("Could not find the first confession chapter in the source HTML")
    start = starts[1] if len(starts) > 1 else starts[0]

    chapters = []
    current_chapter = None
    current_section = None
    pending_section = None
    seen_chapters = set()

    for item in items[start:]:
        tag = item["tag"]
        text = item["text"]

        chapter_match = re.match(r"^([IVXLCDM]+)\.\s+(.+)$", text)
        if tag == "h1" and chapter_match:
            number = roman_to_int(chapter_match.group(1))
            if number in seen_chapters:
                if number == 1 and len(chapters) >= 33:
                    break
                continue
            seen_chapters.add(number)
            current_chapter = {
                "number": number,
                "roman": chapter_match.group(1),
                "title": chapter_match.group(2),
                "sections": [],
            }
            chapters.append(current_chapter)
            current_section = None
            pending_section = None
            if number == 33:
                continue
            continue

        if current_chapter is None:
            continue
        if len(chapters) > 33:
            break
        if text.lower().startswith("back to the top") or text == "Contents" or text.startswith("©"):
            continue

        proof_groups = split_proofs(text)
        if proof_groups and current_section is not None:
            current_section["proofs"] = proof_groups
            continue

        section_only = re.match(r"^([IVXLCDM]+)\.$", text)
        if tag == "p" and section_only:
            pending_section = section_only.group(1)
            continue

        section_match = re.match(r"^([IVXLCDM]+)\.\s+(.+)$", text)
        if tag == "p" and section_match:
            roman = section_match.group(1)
            section_text = section_match.group(2)
            current_section = {
                "number": roman_to_int(roman),
                "roman": roman,
                "text": fix_known_source_artifacts(section_text),
                "proofs": [],
            }
            current_chapter["sections"].append(current_section)
            pending_section = None
            continue

        if tag == "p" and pending_section:
            current_section = {
                "number": roman_to_int(pending_section),
                "roman": pending_section,
                "text": fix_known_source_artifacts(text),
                "proofs": [],
            }
            current_chapter["sections"].append(current_section)
            pending_section = None
            continue

        if tag == "p" and current_section is not None:
            current_section["text"] = current_section["text"] + "\n\n" + fix_known_source_artifacts(text)

    if chapters and chapters[0]["sections"]:
        for section in chapters[0]["sections"]:
            if section["roman"] == "II" and "Genesis." not in section["text"]:
                section["text"] = section["text"].replace(
                    "\n\nAll which are given",
                    f"\n\n{CANON_BOOK_LIST}\n\nAll which are given",
                )

    return {
        "title": "The Westminster Confession of Faith",
        "edition": "1646-1647 proof-text reader edition",
        "source": {
            "name": "The Westminster Standard",
            "url": "https://thewestminsterstandard.org/the-westminster-confession/",
            "retrieved": "2026-06-14",
        },
        "chapters": chapters[:33],
    }


def main():
    parser = ContentParser()
    parser.feed(sys.stdin.read())
    data = build_data(parser.items)
    if len(data["chapters"]) != 33:
        raise SystemExit(f"Expected 33 chapters, found {len(data['chapters'])}")
    section_count = sum(len(chapter["sections"]) for chapter in data["chapters"])
    if section_count < 160:
        raise SystemExit(f"Expected at least 160 sections, found {section_count}")
    print("window.WCF_DATA = ")
    print(json.dumps(data, ensure_ascii=False, indent=2))
    print(";")


if __name__ == "__main__":
    main()
