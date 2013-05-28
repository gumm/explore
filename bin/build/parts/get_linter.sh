#!/bin/bash

WORKSPACE=$1
PROJECT_NAME=$2

# Just start somewhere.
cd ${WORKSPACE}

echo "-----------------------------------------------------"

figlet Closure Linter

echo "WORKSPACE:    ${WORKSPACE}"
echo "PROJECT_NAME: ${PROJECT_NAME}"
echo "-----------------------------------------------------"
echo ""

os=${OSTYPE//[0-9.]/};

if command -v gjslint >/dev/null 2>&1; then
        echo "We already have the linter. No need to download it."
    else
        echo "We don't have the linter. Download it now..."
        if [[ "$os" == 'linux' || "$os" == 'linux-gnu' ]]; then
            echo "Install for Linux"
            sudo easy_install http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
        elif [[ "$os" == 'darwin' ]]; then
            echo "Install for Mac OS X"
            sudo easy_install http://closure-linter.googlecode.com/files/closure_linter-latest.tar.gz
        fi;
    fi


