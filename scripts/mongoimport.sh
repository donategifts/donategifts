# !/usr/bin/bash

# run chmod +x mongoimport.sh to make it executable

mongoexport --uri="<test db url>"  --collection=users  --out=users.json
mongoexport --uri="<test db url>"  --collection=agencies  --out=agencies.json
mongoexport --uri="<test db url>"  --collection=messages  --out=messages.json
mongoexport --uri="<test db url>"  --collection=wishcards  --out=wishcards.json

mongoimport --uri="mongodb://localhost/donategifts" --collection=users --file=users.json
mongoimport --uri="mongodb://localhost/donategifts" --collection=agencies --file=agencies.json
mongoimport --uri="mongodb://localhost/donategifts" --collection=messages --file=messages.json
mongoimport --uri="mongodb://localhost/donategifts" --collection=wishcards --file=wishcards.json

rm *.json