"""Converts the nmn survey csv into json format.

Just is just easier to handle.
"""

import csv
import json
from optparse import OptionParser

parser = OptionParser()
parser.add_option("-i", "--infile",
                  dest="infile",
                  help="CSV to read", metavar="INFILE")
parser.add_option("-o", "--outfile",
                  dest="outfile",
                  help="JSON file to write", metavar="OUTFILE")

(options, args) = parser.parse_args()

data = {}
with open(options.infile) as csv_file:
  header_row = None
  entry_id_index = None
  survey_csv = csv.reader(csv_file)
  for row in survey_csv:
    if header_row:
      entry = {}
      for i in xrange(len(row)):
        entry[header_row[i]] = row[i]
      data[row[entry_id_index]] = entry
    else:
      header_row = row
      entry_id_index = header_row.index('Entry Id')

with open(options.outfile, 'w') as json_file:
  # Guard against mistakes reading BOM from utf-8 dump. Stupid bad unicode
  # hygiene in survey data export.
  json_file.write(json.dumps(data, ensure_ascii=True))
