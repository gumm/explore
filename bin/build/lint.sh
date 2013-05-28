#!/bin/bash

JS_PATH=$1
LINT_TARGET=$2

echo "-----------------------------------------------------"

figlet Lint ${LINT_TARGET}

echo "JS_PATH: ${JS_PATH}"
echo "LINT_TARGET: ${LINT_TARGET}"
echo "-----------------------------------------------------"
echo ""

gjslint \
    --nojsdoc -r ${JS_PATH}/$2/ \
    --check_html
