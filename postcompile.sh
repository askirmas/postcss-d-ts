#!/bin/bash

# From https://github.com/askirmas/react-classnaming/blob/main/postcompile.sh

dir=$(realpath "$(dirname "${BASH_SOURCE[0]}")")
src="src"
find "$src" -name '*.d.ts' -exec cp {} "$npm_package_types" \;


cd "$(dirname "$npm_package_main")"  || exit 1
find . -name "*.types.js" -delete 
cd "$dir" || exit 1

cd "$npm_package_types" || exit 1
