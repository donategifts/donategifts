# !/usr/bin/bash

if [[ -n "$1" ]]
    then
        mongoexport --uri="$1"  --collection=agencies  --out=agencies.json
        mongoexport --uri="$1"  --collection=contacts  --out=contacts.json
        mongoexport --uri="$1"  --collection=donations  --out=donations.json
        mongoexport --uri="$1"  --collection=messages  --out=messages.json
        mongoexport --uri="$1"  --collection=posts  --out=posts.json
        mongoexport --uri="$1"  --collection=users  --out=users.json
        mongoexport --uri="$1"  --collection=wishcards  --out=wishcards.json

        node fixMongoExport.js

        rm *.json
fi