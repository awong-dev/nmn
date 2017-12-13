"""Attempts to translate ip address into geolocation.

DOES NOT WORK YET.
"""

import json
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-i", "--infile",
                  dest="infile",
                  help="JSON to read", metavar="INFILE")
parser.add_option("-o", "--outfile",
                  dest="outfile",
                  help="JSON file to write", metavar="OUTFILE")

(options, args) = parser.parse_args()

data = {}
with open(options.infile) as infile:
  data = json.load(infile)

for (key, value) in data.items():
  print key, value

if open.outfile:
  with open(options.outfile, 'w') as json_file:
    # Guard against mistakes reading BOM from utf-8 dump. Stupid bad unicode
    # hygiene in survey data export.
    json_file.write(json.dumps(data, ensure_ascii=True))
