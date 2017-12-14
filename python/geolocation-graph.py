import json
import plotly
from optparse import OptionParser
import plotly.plotly as py
import plotly.graph_objs as go

parser = OptionParser()
parser.add_option("-i", "--infile",
                  dest="infile",
                  help="JSON to read", metavar="INFILE")

(options, args) = parser.parse_args()

# Load the json data.
survey_data = None
with open(options.infile) as infile:
  survey_data = json.load(infile)

# Based on example at https://plot.ly/python/bubble-maps/
ids = []
lons = []
lats = []
for (entry_id, entry) in survey_data.items():
  ids.append(entry_id)
  lons.append(entry['Lon'])
  lats.append(entry['Lat'])

trace1 = go.Scattergeo(
  name='response location',
  ids=ids,
  lon=lons,
  lat=lats,
  hoverinfo='all',
  locationmode='USA-states',
  marker={'color': 'blue', 'symbol': 'star', 'size': 10})

#  response = go.Scattergeo(
#      name='response location'
#      id: entry_id,
#      hoverinfo='all',
#      lon = entry['Lon'],
#      lat = entry['Lat'],
#      type = 'scattergeo',
#      locationmode = 'USA-states',
##      text = df_sub['text'],
#      text = entry_id,
#      marker = dict(
#	  size = 100, #df_sub['pop']/scale,
#	  color = 'rgb(255,0,0)',
#	  line = dict(width=0.5, color='rgb(40,40,40)'),
#	  sizemode = 'area'
#      ),
#      name = entry_id )
#  responses.append(response)  

layout = go.Layout(
    title = 'Survey respondant locations',
    showlegend = True,
    geo = dict(
      scope='usa',
      projection=dict( type='albers usa' ),
      showland = True,
      landcolor = 'rgb(217, 217, 217)',
      subunitwidth=1,
      countrywidth=1,
      subunitcolor="rgb(255, 255, 255)",
      countrycolor="rgb(255, 255, 255)"
      ),
    )

fig = go.Figure( data=[trace1], layout=layout )
py.plot( fig, validate=False, filename='d3-bubble-map-survey-responses' )

