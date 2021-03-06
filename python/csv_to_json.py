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

def field_to_int(value):
  if value:
    return int(value)
  else:
    return None

data = {}
with open(options.infile) as csv_file:
  # Handle leading BOM in UTF-8. Grumble...grumble...stupid unicode.
  start = csv_file.tell()
  leading_bytes = csv_file.read(3)
  if leading_bytes[0] == '\xEF' and leading_bytes[1] == '\xBB' and leading_bytes[2] == '\xBF':
    print "Found UTF-8 BOM at start of file! Oh joy. Skipping it"
  else:
    csv_file.seek(start)

  header_row = None
  entry_id_index = None
  survey_csv = csv.reader(csv_file)
  for row in survey_csv:
    if header_row:
      entry = {}
      for i in xrange(len(row)):
        entry[header_row[i]] = row[i]
      # Convert numeric values to the right type.
      entry['Entered-Negative'] = field_to_int(entry['Entered-Negative'])
      entry['Entered-Suicidal'] = field_to_int(entry['Entered-Suicidal'])
      entry['Now-Negative'] = field_to_int(entry['Now-Negative'])
      entry['Now-Suicidal'] = field_to_int(entry['Now-Suicidal'])
      data[row[entry_id_index]] = entry
    else:
      header_row = row
      entry_id_index = header_row.index('Entry Id')

with open(options.outfile, 'w') as json_file:
  # Guard against mistakes reading BOM from utf-8 dump. Stupid bad unicode
  # hygiene in survey data export.
  json_file.write(json.dumps(data, ensure_ascii=True))
