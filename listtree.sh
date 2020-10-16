#!/bin/bash

#File: tree-md

tree=$(tree -tfd --noreport -I '*~' -I node_modules --charset ascii $1 |
       sed -e 's/| \+/  /g' -e 's/[|`]-\+/ */g' -e 's:\(* \)\(\(.*/\)\([^/]\+\)\):\1[\4](\2):g')
destdir=projectStructure.md

echo "$tree" > "$destdir"