# !/usr/bin/bash

# run chmod +x mongoimport.sh to make it executable
# run ./mongoimport.sh <test db url> as argument

if [[ -n "$1" ]]
  then
    mongoexport --uri="$1"  --collection=agencies  --out=seeder-data/agencies.json
    mongoexport --uri="$1"  --collection=contacts  --out=seeder-data/contacts.json
    mongoexport --uri="$1"  --collection=donations  --out=seeder-data/donations.json
    mongoexport --uri="$1"  --collection=messages  --out=seeder-data/messages.json
    mongoexport --uri="$1"  --collection=posts  --out=seeder-data/posts.json
    mongoexport --uri="$1"  --collection=users  --out=seeder-data/users.json
    mongoexport --uri="$1"  --collection=wishcards  --out=seeder-data/wishcards.json

    # mongoimport --uri="mongodb://localhost/donategifts" --collection=agencies --file=seeder-data/agencies.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=contacts --file=seeder-data/contacts.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=donations --file=seeder-data/donations.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=messages --file=seeder-data/messages.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=posts --file=seeder-data/posts.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=users --file=seeder-data/users.json
    # mongoimport --uri="mongodb://localhost/donategifts" --collection=wishcards --file=seeder-data/wishcards.json

    rm *.json
fi
