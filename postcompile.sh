#!/bin/bash

# From https://github.com/askirmas/react-classnaming/blob/main/postcompile.sh

src="src"
find "$src" -name '*.d.ts' -exec cp {} "$(dirname "$npm_package_types")" \;

dist="$(dirname "$npm_package_main")"

find "$dist" -name "*.types.js" -delete

find "$dist" -name "*.d.ts" -not -name "options.*" -not -name "ts-swiss.*" -not -name "_css-template.*" -delete