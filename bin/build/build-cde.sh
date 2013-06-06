#!/bin/bash

WORKSPACE=$1
BIN_PATH=$2
BUILD_PATH=$3
JS_PATH=$4
GOOG_BIN_PATH=$5
PROJECT_NAME=$6
PARTS_PATH=${BUILD_PATH}/parts

echo "-----------------------------------------------------"

command -v wget >/dev/null 2>&1 || { echo >&2 "I require wget but it's not installed.  Aborting."; exit 1; }
command -v figlet >/dev/null 2>&1 || { echo >&2 "I require figlet but it's not installed.  Aborting."; exit 1; }
command -v ant >/dev/null 2>&1 || { echo >&2 "I require ant but it's not installed.  Aborting."; exit 1; }

figlet JS Environment

echo "WORKSPACE: ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "-----------------------------------------------------"
echo ""

#${PARTS_PATH}/get_linter.sh ${WORKSPACE} ${PROJECT_NAME}
#${PARTS_PATH}/get_library.sh ${WORKSPACE} ${PROJECT_NAME} ${JS_PATH} ${GOOG_BIN_PATH}
${PARTS_PATH}/get_bad-library.sh ${WORKSPACE} ${PROJECT_NAME} ${JS_PATH} ${GOOG_BIN_PATH}
#${PARTS_PATH}/get_stylesheets.sh ${WORKSPACE} ${PROJECT_NAME} ${BIN_PATH}
#${PARTS_PATH}/get_compiler.sh ${WORKSPACE} ${PROJECT_NAME} ${BIN_PATH}
#${PARTS_PATH}/get_cssembed.sh ${WORKSPACE} ${PROJECT_NAME} ${BIN_PATH}