#!/bin/bash

BOOK_TITLE="$1"

BASE_PATH="data/extracted/$BOOK_TITLE"
BOOK_PATH="data/books/$BOOK_TITLE.epub"

BOOK_CONTENT=$BASE_PATH/content
BOOK_JSON=$BASE_PATH/json.json

if [[ ! -f "$BOOK_PATH" ]]; then
    echo "Error: File '$BOOK_PATH' not found."
    exit 1
fi

mkdir -p $BOOK_CONTENT
touch $BOOK_JSON


# Extract the EPUB file
unzip -q $BOOK_PATH -d $BOOK_CONTENT

# Parse the content.opf file to get the structure of the book
OPF_FILE=$(find $BOOK_CONTENT -name "*.opf")
BOOK_TITLE=$(xmllint --xpath 'string(//*[local-name()="title"])' "$OPF_FILE")

# Create a JSON file
echo '{"title": "'$BOOK_TITLE'", "chapters": []}' > $BOOK_JSON

# Loop through the HTML files and extract chapter titles and content
find $BOOK_CONTENT \( -name "*.xhtml" -o -name "*.html" \) | while read -r html_file; do
    CHAPTER_TITLE=$(xmllint --html --xpath 'string(//h1 | //h3)' $html_file 2>/dev/null)
    CHAPTER_CONTENT=$(pandoc -f html -t plain $html_file)

    echo "Transforming Chapter $CHAPTER_TITLE"

    jq --arg title "$CHAPTER_TITLE" '.chapters += [{"title": $title}]' $BOOK_JSON > temp.json
    mv temp.json $BOOK_JSON

    # Word count per chunk
    WORDS_PER_CHUNK=100 

    words=($CHAPTER_CONTENT)
    total_words=${#words[@]}
    CHAPTER_CHUNK=1

    # Split text by word count
    for ((i = 0; i < total_words; i += WORDS_PER_CHUNK)); do
        chunk="${words[@]:i:WORDS_PER_CHUNK}"

        jq --arg title "$CHAPTER_TITLE" --arg value "$chunk" '.chapters |= map(if .title == $title then .sections += [$value] else . end)' $BOOK_JSON > temp2.json
        mv temp2.json $BOOK_JSON

        CHAPTER_CHUNK=$((CHAPTER_CHUNK + 1))
    done
done


# Clean up
# rm -rf $BOOK_CONTENT