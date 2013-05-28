#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
WORKSPACE=${PWD}
PROJECT_NAME=${PWD##*/}
TESTS_ROOT=${WORKSPACE}/media/js/trin/tests/
REPORT_TARGET=${WORKSPACE}/media/coverage/
SERVER=0.0.0.0
PORT=8080
TESTS_FILE=/media/js/trin/tests/all_tests.html
IGNORE_DIR=/media/js/closure-library/
TAP_FILE_NAME=tap.txt
TEST_FINDER=${WORKSPACE}/scripts/testing/closure_test_finder.py
OUTPUT_FORMAT=Spec

# Update tests
cd ${TESTS_ROOT}
python ${TEST_FINDER} ../ > ./alltests.js

# Clear current reports
rm -rf ${REPORT_TARGET}/*

# Return to the workspace
cd ${WORKSPACE}

figlet SMART Tests

echo "-----------------------------------------------------"
echo "WORKSPACE: ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "START Date: $(date) Host: $(hostname)"
echo "REPORTING TO: ${REPORT_TARGET}"

clipcover -f ${TESTS_FILE} \
          -i ${IGNORE_DIR} \
          -r ${REPORT_TARGET} \
          -s ${SERVER} \
          -p ${PORT} \
          -o ${TAP_FILE_NAME} \
          -w ${OUTPUT_FORMAT} \
          ${WORKSPACE}


