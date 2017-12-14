"""Attempts to translate ip address into geolocation.
"""

import json
from optparse import OptionParser
import geoip2.database
import os

parser = OptionParser()
parser.add_option("-i", "--infile",
                  dest="infile",
                  help="JSON to read", metavar="INFILE")
parser.add_option("-o", "--outfile",
                  dest="outfile",
                  help="JSON file to write", metavar="OUTFILE")

(options, args) = parser.parse_args()

# Load the json data.
data = {}
with open(options.infile) as infile:
  data = json.load(infile)


# Setup the geolocation and anonymization vars.
ip_anonymize = {}
current_id = 1
reader = geoip2.database.Reader(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'GeoLite2-City.mmdb'))

for (key, value) in data.items():
  # Anonymize the IP.
  USER_IP_KEY = 'User IP'
  ip = value[USER_IP_KEY]
  if (ip not in ip_anonymize):
      ip_anonymize[ip] = current_id + 1
      current_id = current_id + 1
  value[USER_IP_KEY] = ip_anonymize[ip]

  # Fill in geolocation data.
  try:
      response = reader.city(ip)
      value['City'] = response.city.name
      value['Country'] = response.country.name
      value['PostalCode'] = response.postal.code
      value['Lat'] = response.location.latitude
      value['Lon'] = response.location.longitude
  except:
      value['City'] = None
      value['Country'] = None
      value['PostalCode'] = None
      value['Lat'] = None
      value['Lon'] = None


if options.outfile:
  with open(options.outfile, 'w') as json_file:
    # Guard against mistakes reading BOM from utf-8 dump. Stupid bad unicode
    # hygiene in survey data export.
    json_file.write(json.dumps(data, ensure_ascii=True))
