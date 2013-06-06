#!/bin/bash

WORKSPACE=$1
JS_PATH=$2
GOOG_BIN_PATH=$3
PROJECT_NAME=$4

echo "-----------------------------------------------------"

figlet Build JS Dependencies

echo "WORKSPACE:        ${WORKSPACE}"
echo "JS_PATH:          ${JS_PATH}"
echo "GOOG_BIN_PATH:    ${GOOG_BIN_PATH}"
echo "PROJECT_NAME:     ${PROJECT_NAME}"
echo "-----------------------------------------------------"
echo ""

# Just start somewhere.
cd ${WORKSPACE}

chmod +x ${GOOG_BIN_PATH}/*.py

${GOOG_BIN_PATH}/depswriter.py \
    --root_with_prefix='public/js/app ../../../app' \
    --root_with_prefix='public/js/bad-library/bad ../../../bad-library/bad'> ${JS_PATH}/deps.js
