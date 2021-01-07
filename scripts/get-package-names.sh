#!/bin/bash
names=""
for f in $1/**/package.json; do
	name=`sed '/"name":/!d;s///;s/"//g;s/,//g' $f`
	names="$names,$name"
done
echo `echo $names | sed 's/ //g;s/^,//'`