#!/bin/bash

set -e
set -v

arg="$@"

git add .
git commit -am "$arg"
git push
npm publish
