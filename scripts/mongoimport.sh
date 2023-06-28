# !/usr/bin/bash

# run chmod +x mongoimport.sh to make it executable
# run ./mongoimport.sh <test db url> as argument

if [[ -n "$1" ]]
  then
    mongoexport --uri="$1"  --collection=agencies  --out=agencies.json
    mongoexport --uri="$1"  --collection=contacts  --out=contacts.json
    mongoexport --uri="$1"  --collection=donations  --out=donations.json
    mongoexport --uri="$1"  --collection=messages  --out=messages.json
    mongoexport --uri="$1"  --collection=posts  --out=posts.json
    mongoexport --uri="$1"  --collection=sessions  --out=sessions.json
    mongoexport --uri="$1"  --collection=users  --out=users.json
    mongoexport --uri="$1"  --collection=wishcards  --out=wishcards.json
    
    mongoimport --uri="mongodb://localhost/donategifts" --collection=agencies --file=agencies.json
    mongoimport --uri="mongodb://localhost/donategifts" --collection=contacts --file=contacts.json
    mongoimport --uri="mongodb://localhost/donategifts" --collection=donations --file=donations.json
    mongoimport --uri="mongodb://localhost/donategifts" --collection=messages --file=messages.json
    mongoimport --uri="mongodb://localhost/donategifts" --collection=posts --file=posts.json
    mongoimport --uri="mongodb://localhost/donategifts" --collection=sessions --file=sessions.json
    mongoimport --uri="mongodb://localhost/donategifts" --collection=users --file=users.json
    mongoimport --uri="mongodb://localhost/donategifts" --collection=wishcards --file=wishcards.json

    rm *.json
fi
