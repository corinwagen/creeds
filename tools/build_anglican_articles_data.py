#!/usr/bin/env python3
import argparse
import json
import re
from html.parser import HTMLParser


ROMANS = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "XIV",
    "XV",
    "XVI",
    "XVII",
    "XVIII",
    "XIX",
    "XX",
    "XXI",
    "XXII",
    "XXIII",
    "XXIV",
    "XXV",
    "XXVI",
    "XXVII",
    "XXVIII",
    "XXIX",
    "XXX",
    "XXXI",
    "XXXII",
    "XXXIII",
    "XXXIV",
    "XXXV",
    "XXXVI",
    "XXXVII",
    "XXXVIII",
    "XXXIX",
]

ARTICLE_TITLES = {
    "Of Faith in the Holy Trinity.": "Of Faith in the Holy Trinity.",
    "Of the Word or Son of God, which was made very Man.": "Of the Word or Son of God, which was made very Man.",
    "Of the going down of Christ into Hell.": "Of the going down of Christ into Hell.",
    "Of the Resurrection of Christ.": "Of the Resurrection of Christ.",
    "Of the Holy Ghost.": "Of the Holy Ghost.",
    "Of the Sufficiency of the Holy Scriptures for Saltation.": "Of the Sufficiency of the Holy Scriptures for Salvation.",
    "Of the Old Testament.": "Of the Old Testament.",
    "Of the Creeds.": "Of the Creeds.",
    "Of Original or Birth-Sin.": "Of Original or Birth-Sin.",
    "Of Free-Will.": "Of Free-Will.",
    "Of the Justification of Man.": "Of the Justification of Man.",
    "Of Good Works.": "Of Good Works.",
    "Of Works before Justification.": "Of Works before Justification.",
    "Of Works of Supererogation.": "Of Works of Supererogation.",
    "Of Christ alone without Sin.": "Of Christ alone without Sin.",
    "Of Sin after Baptism.": "Of Sin after Baptism.",
    "Of Predestination and Election.": "Of Predestination and Election.",
    "Of obtaining eternal Salvation only by the Name of Christ.": "Of obtaining eternal Salvation only by the Name of Christ.",
    "Of the Church.": "Of the Church.",
    "Of the Authority of the Church.": "Of the Authority of the Church.",
    "Of the Authority of General Councils.": "Of the Authority of General Councils.",
    "Of Purgatory.": "Of Purgatory.",
    "Of Ministering in the Congregation.": "Of Ministering in the Congregation.",
    "Of Speaking in the Congregation in such a Tongue as the people understandeth.": "Of Speaking in the Congregation in such a Tongue as the people understandeth.",
    "Of the Sacraments.": "Of the Sacraments.",
    "Of the Unworthiness of the Ministers, which hinders not the effect of the Sacraments.": "Of the Unworthiness of the Ministers, which hinders not the effect of the Sacraments.",
    "Of Baptism.": "Of Baptism.",
    "Of the Lord's Supper.": "Of the Lord's Supper.",
    "Of the Wicked, which eat not the Body of Christ in the use of the Lord's Supper.": "Of the Wicked, which eat not the Body of Christ in the use of the Lord's Supper.",
    "Of both Kinds.": "Of both Kinds.",
    "Of the one Oblation of Christ finished upon the Cross.": "Of the one Oblation of Christ finished upon the Cross.",
    "Of the Marriage of Priests.": "Of the Marriage of Priests.",
    "Of excommunicate Persons, how they are to be avoided.": "Of excommunicate Persons, how they are to be avoided.",
    "Of the Traditions of the Church.": "Of the Traditions of the Church.",
    "Of the Homilies.": "Of the Homilies.",
    "Of Consecration of Bishops and Ministers.": "Of Consecration of Bishops and Ministers.",
    "Of the Power of the Civil Magistrates.": "Of the Power of the Civil Magistrates.",
    "Of Christian Men's Goods, which are not common.": "Of Christian Men's Goods, which are not common.",
    "Of a Christian Man's Oath.": "Of a Christian Man's Oath.",
}


def normalize(text):
    text = re.sub(r"\s+", " ", text)
    text = text.replace("\xad", "")
    text = re.sub(r"(?<=[A-Za-z.,;:'’)\]])\d{3}(?=\s|$|[A-Z])", "", text)
    text = re.sub(r"(?<=\s)\d{3}(?=[A-Z])", "", text)
    return text.strip()


class RowParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows = []
        self.in_tr = False
        self.in_td = False
        self.row = []
        self.parts = []
        self.skip = 0
        self.void_tags = {"br", "hr", "img", "input", "link", "meta"}

    def handle_starttag(self, tag, attrs):
        attr_map = dict(attrs)
        if self.skip:
            if tag not in self.void_tags:
                self.skip += 1
            return
        if tag in {"script", "style"} or attr_map.get("class") in {"mnote", "footnotes", "footer_note"}:
            self.skip += 1
            return
        if tag == "tr":
            self.in_tr = True
            self.row = []
        elif tag == "td" and self.in_tr:
            self.in_td = True
            self.parts = []
        elif tag == "br" and self.in_td:
            self.parts.append(" ")

    def handle_endtag(self, tag):
        if self.skip:
            self.skip -= 1
            return
        if tag == "td" and self.in_td:
            self.row.append(normalize("".join(self.parts)))
            self.in_td = False
            self.parts = []
        elif tag == "tr" and self.in_tr:
            if self.row:
                self.rows.append(self.row)
            self.in_tr = False

    def handle_data(self, data):
        if self.in_td and not self.skip:
            self.parts.append(data)


def is_article_title(row):
    if len(row) < 3:
        return False
    modern_title = row[2]
    return modern_title in ARTICLE_TITLES


def parse_articles(path):
    parser = RowParser()
    with open(path, encoding="utf-8") as source:
        parser.feed(source.read())

    rows = parser.rows
    start = next(
        index
        for index, row in enumerate(rows)
        if len(row) >= 3 and row[1].startswith("Articles whereupon it was agreed")
    )

    articles = []
    current = None
    for row in rows[start + 1 :]:
        if is_article_title(row):
            if current:
                articles.append(current)
            current = {
                "title": ARTICLE_TITLES[row[2]],
                "parts": [],
            }
            continue
        if current and len(row) >= 2:
            part = row[1]
            if part and not part.startswith("The Ratification"):
                current["parts"].append(part)
        if len(articles) == 39:
            break
    if current and len(articles) < 39:
        articles.append(current)

    articles = articles[:39]
    if len(articles) != 39:
        raise SystemExit(f"Expected 39 articles, found {len(articles)}")

    chapters = []
    for index, article in enumerate(articles, start=1):
        chapters.append(
            {
                "number": index,
                "roman": ROMANS[index - 1],
                "title": article["title"],
                "kicker": f"Article {ROMANS[index - 1]}",
                "sections": [
                    {
                        "number": 1,
                        "roman": "1",
                        "title": "Text",
                        "text": "\n\n".join(article["parts"]),
                        "proofs": [],
                    }
                ],
            }
        )
    return chapters


def main():
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument("--source", required=True)
    arg_parser.add_argument("--output", required=True)
    args = arg_parser.parse_args()

    data = {
        "title": "The Thirty-nine Articles of Religion",
        "shortTitle": "Thirty-nine Articles",
        "slug": "thirty-nine-articles",
        "mark": "39",
        "edition": "A.D. 1571 Church of England reader edition",
        "description": "The Church of England's historic articles of religion.",
        "unitLabel": "Article",
        "source": {
            "name": "Philip Schaff, Creeds of Christendom, Vol. III",
            "url": "https://ccel.org/ccel/schaff/creeds3/creeds3.iv.xi.html",
            "retrieved": "2026-06-15",
        },
        "chapters": parse_articles(args.source),
    }

    with open(args.output, "w", encoding="utf-8") as target:
        target.write("window.ANGLICAN_ARTICLES_DATA = ")
        json.dump(data, target, ensure_ascii=False, indent=2)
        target.write(";\n")


if __name__ == "__main__":
    main()
