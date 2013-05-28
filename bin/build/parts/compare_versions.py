#!/usr/bin/python

import sys
from distutils.version import LooseVersion, StrictVersion

ver_first = str(sys.argv[1])
ver_second = str(sys.argv[2])
first_is_bigger = LooseVersion(ver_first) > LooseVersion(ver_second)

print first_is_bigger

