# !/usr/bin/bash

# run chmod +x mongoimport.sh to make it executable
# run ./mongoimport.sh <test db url> as argument

mongoexport --uri="$1"  --collection=users  --out=users.json
mongoexport --uri="$1"  --collection=agencies  --out=agencies.json
mongoexport --uri="$1"  --collection=messages  --out=messages.json
mongoexport --uri="$1"  --collection=wishcards  --out=wishcards.json

mongoimport --uri="mongodb://localhost/donategifts" --collection=users --file=users.json
mongoimport --uri="mongodb://localhost/donategifts" --collection=agencies --file=agencies.json
mongoimport --uri="mongodb://localhost/donategifts" --collection=messages --file=messages.json
mongoimport --uri="mongodb://localhost/donategifts" --collection=wishcards --file=wishcards.json

rm *.json