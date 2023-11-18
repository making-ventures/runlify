#!/bin/bash

set -e
set -v

# yarn lint
yarn build
yarn test
