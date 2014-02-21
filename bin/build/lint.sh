#!/bin/bash

JS_PATH=$1
LINT_TARGET=$2

command -v ~/.local/bin/fixjsstyle >/dev/null 2>&1 || { echo >&2 "I require fixjsstyle and can not find it. Run buildout to install it"; exit 1; }
command -v ~/.local/bin/gjslint >/dev/null 2>&1 || { echo >&2 "I require gjslint and can not find it. Run buildout to install it"; exit 1; }

echo "-----------------------------------------------------"

figlet Lint ${LINT_TARGET}

echo "JS_PATH: ${JS_PATH}"
echo "LINT_TARGET: ${LINT_TARGET}"
echo "-----------------------------------------------------"
echo ""

~/.local/bin/fixjsstyle --nojsdoc -r ${JS_PATH}/${LINT_TARGET}/
~/.local/bin/gjslint \
    --nojsdoc -r ${JS_PATH}/${LINT_TARGET}/ \
    --multiprocess \
    --summary \
    --time \
    --closurized_namespaces goog,trin,smart
