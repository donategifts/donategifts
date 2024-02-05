# !/usr/bin/bash

# run chmod +x mongoimport.sh to make it executable
# run ./mongoimport.sh <test db url> as argument

if [[ -n "$1" ]]
  then
    mongoexport --uri="$1"  --collection=agencies  --out=data/agencies.json
    mongoexport --uri="$1"  --collection=contacts  --out=data/contacts.json
    mongoexport --uri="$1"  --collection=donations  --out=data/donations.json
    mongoexport --uri="$1"  --collection=messages  --out=data/messages.json
    mongoexport --uri="$1"  --collection=posts  --out=data/posts.json
    mongoexport --uri="$1"  --collection=users  --out=data/users.json
    mongoexport --uri="$1"  --collection=wishcards  --out=data/wishcards.json

    # mongoimport --uri="mongodb://localhost/donategifts" --collection=agencies --file=data/agencies.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=contacts --file=data/contacts.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=donations --file=data/donations.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=messages --file=data/messages.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=posts --file=data/posts.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=users --file=data/users.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=wishcards --file=data/wishcards.json

    rm *.json
fi
