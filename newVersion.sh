#!/bin/bash

set -e
set -v

./check.sh

arg="$@"

namber=$(cat package.json | grep '\"version\": \"' | grep -o '[0-9]*\.[0-9]*\.[0-9]*')
num1=$(echo -e "$namber" | awk -F"." '{print $1}')
num2=$(echo -e "$namber" | awk -F"." '{print $2}')
num3=$(echo -e "$namber" | awk -F"." '{print $3}')
num3=$(($num3+1))
new_number="$num1.$num2.$num3"
echo new_number $new_number
sed -i "s/^  \"version\": \".*\"/  \"version\": \"$new_number\"/" package.json
git add .
git commit -am "$arg"
git push
npm publish
