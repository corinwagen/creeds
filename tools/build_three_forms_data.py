#!/usr/bin/env python3
import argparse
import json
import re
from html.parser import HTMLParser


def normalize(text):
    text = re.sub(r"\s+", " ", text)
    text = text.replace(" ,", ",").replace(" .", ".").replace(" ;", ";")
    text = text.replace("\xad", "")
    text = re.sub(r"(?<=[A-Za-z.,;:'’)\]])\d{3}(?=\s|$|[A-Z])", "", text)
    text = re.sub(r"(?<=\s)\d{3}(?=[A-Z])", "", text)
    return text.strip()


class TextParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.items = []
        self.stack = []
        self.capture_tag = None
        self.parts = []
        self.skip = 0
        self.void_tags = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def handle_starttag(self, tag, attrs):
        attr_map = dict(attrs)
        class_name = attr_map.get("class", "")
        if self.skip:
            if tag not in self.void_tags:
                self.skip += 1
            return
        if tag in {"script", "style"} or class_name in {"mnote", "footnotes", "footer_note"}:
            self.skip += 1
            return
        if tag in {"h3", "h4", "p", "td"} and self.capture_tag is None:
            self.capture_tag = tag
            self.parts = []
        elif tag == "br" and self.capture_tag:
            self.parts.append(" ")

    def handle_endtag(self, tag):
        if self.skip:
            self.skip -= 1
            return
        if tag == self.capture_tag:
            text = normalize("".join(self.parts))
            if text:
                self.items.append({"tag": self.capture_tag, "text": text})
            self.capture_tag = None
            self.parts = []

    def handle_data(self, data):
        if self.capture_tag and not self.skip:
            self.parts.append(data)


def parse_items(path):
    parser = TextParser()
    with open(path, encoding="utf-8") as source:
        parser.feed(source.read())
    return parser.items


def lord_day(question):
    if question <= 2:
        return 1
    if question <= 5:
        return 2
    if question <= 8:
        return 3
    if question <= 11:
        return 4
    if question <= 15:
        return 5
    if question <= 19:
        return 6
    if question <= 23:
        return 7
    if question <= 25:
        return 8
    if question <= 28:
        return 9
    if question <= 30:
        return 10
    if question <= 32:
        return 11
    if question <= 34:
        return 12
    if question <= 35:
        return 13
    if question <= 36:
        return 14
    if question <= 39:
        return 15
    if question <= 44:
        return 16
    if question <= 45:
        return 17
    if question <= 49:
        return 18
    if question <= 52:
        return 19
    if question <= 53:
        return 20
    if question <= 56:
        return 21
    if question <= 58:
        return 22
    if question <= 59:
        return 23
    if question <= 61:
        return 24
    if question <= 64:
        return 25
    if question <= 68:
        return 26
    if question <= 71:
        return 27
    if question <= 74:
        return 28
    if question <= 79:
        return 29
    if question <= 82:
        return 30
    if question <= 85:
        return 31
    if question <= 87:
        return 32
    if question <= 91:
        return 33
    if question <= 95:
        return 34
    if question <= 96:
        return 35
    if question <= 98:
        return 36
    if question <= 100:
        return 37
    if question <= 102:
        return 38
    if question <= 106:
        return 39
    if question <= 107:
        return 40
    if question <= 109:
        return 41
    if question <= 111:
        return 42
    if question <= 112:
        return 43
    if question <= 115:
        return 44
    if question <= 119:
        return 45
    if question <= 120:
        return 46
    if question <= 122:
        return 47
    if question <= 124:
        return 48
    if question <= 125:
        return 49
    if question <= 126:
        return 50
    if question <= 127:
        return 51
    return 52


def parse_heidelberg(path):
    cells = [item["text"] for item in parse_items(path) if item["tag"] == "td"]
    sections = []
    index = 0
    question_pattern = re.compile(r"^\(?Question\s*(\d+)\.?$", re.I)
    while index < len(cells):
        match = question_pattern.match(cells[index])
        if not match:
            index += 1
            continue
        number = int(match.group(1))
        answer_index = None
        next_question_index = len(cells)
        for cursor in range(index + 1, len(cells)):
            if cursor != index and question_pattern.match(cells[cursor]):
                next_question_index = cursor
                break
            if cells[cursor].startswith("Answer"):
                answer_index = cursor
                break
        if answer_index is None:
            index += 1
            continue

        question_parts = [part for part in cells[index + 2 : answer_index : 2] if not is_divider(part)]
        next_question_index = len(cells)
        for cursor in range(answer_index + 1, len(cells)):
            if question_pattern.match(cells[cursor]):
                next_question_index = cursor
                break
        answer_parts = [part for part in cells[answer_index + 2 : next_question_index : 2] if not is_divider(part)]
        question = " ".join(question_parts)
        answer = " ".join(answer_parts)
        sections.append(
            {
                "number": number,
                "roman": str(number),
                "title": f"Q. {number}",
                "text": f"Q. {question}\n\nA. {answer}",
                "proofs": [],
            }
        )
        index = next_question_index

    chapters = []
    for day in range(1, 53):
        day_sections = [section for section in sections if lord_day(section["number"]) == day]
        if day_sections:
            chapters.append(
                {
                    "number": day,
                    "roman": str(day),
                    "title": f"Lord's Day {day}",
                    "kicker": f"Questions {day_sections[0]['number']}-{day_sections[-1]['number']}",
                    "sections": day_sections,
                }
            )
    if len(sections) != 129:
        raise SystemExit(f"Expected 129 Heidelberg questions, found {len(sections)}")
    return chapters


def is_divider(text):
    if text.strip("—- " ) == "":
        return True
    letters = re.sub(r"[^A-Za-z]", "", text)
    return bool(letters) and len(letters) > 6 and text.upper() == text


def parse_belgic(path):
    cells = [item["text"] for item in parse_items(path) if item["tag"] == "td"]
    articles = []
    article_pattern = re.compile(r"^Art\.\s+([IVXLCDM]+)\.?$", re.I)
    index = 0
    while index < len(cells):
        match = article_pattern.match(cells[index])
        if not match:
            index += 1
            continue
        if index == 0 or cells[index - 1].replace(".", "") != cells[index].replace(".", ""):
            index += 1
            continue

        next_article_index = len(cells)
        for cursor in range(index + 1, len(cells)):
            if article_pattern.match(cells[cursor]):
                next_article_index = cursor
                break
        title = cells[index + 2] if index + 2 < len(cells) else f"Article {len(articles) + 1}"
        body_parts = cells[index + 4 : next_article_index : 2]
        articles.append(
            {
                "number": len(articles) + 1,
                "roman": str(len(articles) + 1),
                "title": title_case(title),
                "text_parts": body_parts,
            }
        )
        index = next_article_index

    chapters = []
    for article in articles[:37]:
        chapters.append(
            {
                "number": article["number"],
                "roman": str(article["number"]),
                "title": article["title"],
                "kicker": f"Article {article['number']}",
                "sections": [
                    {
                        "number": 1,
                        "roman": "1",
                        "title": "Text",
                        "text": "\n\n".join(article["text_parts"]),
                        "proofs": [],
                    }
                ],
            }
        )
    if len(chapters) != 37:
        raise SystemExit(f"Expected 37 Belgic articles, found {len(chapters)}")
    return chapters


def parse_dort(path):
    items = parse_items(path)
    chapters = []
    current = None
    section_number = 1
    for item in items:
        text = item["text"]
        head = re.match(r"^(FIRST|SECOND|THIRD AND FOURTH|FIFTH) HEADS? OF DOCTRINE", text, re.I)
        if head:
            if current:
                chapters.append(current)
            current = {
                "number": len(chapters) + 1,
                "roman": str(len(chapters) + 1),
                "title": title_case(text),
                "kicker": f"Head {len(chapters) + 1}",
                "sections": [],
            }
            section_number = 1
            continue
        if not current:
            continue
        if re.match(r"^Conclusion\.?$", text, re.I):
            break
        article = re.match(r"^(?:ARTICLE|Art\.|Aet\.)\s+([IVXLCDM]+|\d+)\.?\s*(.*)$", text, re.I)
        rejection = re.match(r"^REJECTION\s+([IVXLCDM]+|\d+)\.?\s*(.*)$", text, re.I)
        if article or rejection:
            match = article or rejection
            title = f"{'Article' if article else 'Rejection'} {match.group(1)}"
            body = match.group(2).strip()
            current["sections"].append(
                {
                    "number": section_number,
                    "roman": str(section_number),
                    "title": title,
                    "text": body,
                    "proofs": [],
                }
            )
            section_number += 1
            continue
        if current["sections"] and item["tag"] in {"p", "td"}:
            if not text.startswith("[") and not text.startswith("*"):
                current["sections"][-1]["text"] += ("\n\n" if current["sections"][-1]["text"] else "") + text
    if current:
        chapters.append(current)
    if len(chapters) != 4:
        raise SystemExit(f"Expected 4 Canons of Dort heads, found {len(chapters)}")
    return chapters


def title_case(text):
    small = {"a", "an", "and", "as", "by", "for", "in", "of", "or", "the", "to", "with"}
    words = re.split(r"(\s+)", text.lower())
    result = []
    for index, word in enumerate(words):
        if not word.strip() or (index > 0 and word in small):
            result.append(word)
        else:
            result.append(word[:1].upper() + word[1:])
    return "".join(result).replace("God’S", "God's")


def make_document(title, short_title, slug, mark, edition, description, source_name, source_url, chapters):
    return {
        "title": title,
        "shortTitle": short_title,
        "slug": slug,
        "mark": mark,
        "edition": edition,
        "description": description,
        "unitLabel": "Section",
        "source": {"name": source_name, "url": source_url, "retrieved": "2026-06-15"},
        "chapters": chapters,
    }


def main():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("--heidelberg", required=True)
    arg_parser.add_argument("--belgic", required=True)
    arg_parser.add_argument("--dort", required=True)
    arg_parser.add_argument("--output", required=True)
    args = arg_parser.parse_args()

    docs = [
        make_document(
            "The Heidelberg Catechism",
            "Heidelberg",
            "heidelberg-catechism",
            "H",
            "A.D. 1563 reader edition",
            "The Palatinate catechism arranged by Lord's Days.",
            "Philip Schaff, Creeds of Christendom, Vol. III",
            "https://ccel.org/ccel/schaff/creeds3/creeds3.iv.vi.html",
            parse_heidelberg(args.heidelberg),
        ),
        make_document(
            "The Belgic Confession",
            "Belgic",
            "belgic-confession",
            "B",
            "A.D. 1561, revised 1619 reader edition",
            "The confession of faith associated with Guido de Brès and the Dutch Reformed churches.",
            "Philip Schaff, Creeds of Christendom, Vol. III",
            "https://ccel.org/ccel/schaff/creeds3/creeds3.iv.viii.html",
            parse_belgic(args.belgic),
        ),
        make_document(
            "The Canons of Dort",
            "Dort",
            "canons-of-dort",
            "D",
            "A.D. 1618-1619 reader edition",
            "The Synod of Dort's doctrinal judgment on the disputed Remonstrant articles.",
            "Philip Schaff, Creeds of Christendom, Vol. III",
            "https://ccel.org/ccel/schaff/creeds3/creeds3.iv.xvi.html",
            parse_dort(args.dort),
        ),
    ]

    with open(args.output, "w", encoding="utf-8") as target:
        target.write("window.THREE_FORMS_DATA = ")
        json.dump(docs, target, ensure_ascii=False, indent=2)
        target.write(";\n")


if __name__ == "__main__":
    main()
