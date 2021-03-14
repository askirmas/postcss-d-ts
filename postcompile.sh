#!/bin/bash

# From https://github.com/askirmas/react-classnaming/blob/main/postcompile.sh

src="src"
find "$src" -name '*.d.ts' -exec cp {} "$(dirname "$npm_package_types")" \;

cd "$(dirname "$npm_package_main")" || exit 1

find . -name "*.types.js" -delete
