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

# Calculate deltas.
shifts = []
for (entry_id, entry) in survey_data.items():
  entered_negative = entry['Entered-Negative'] 
  now_negative = entry['Now-Negative'] 
  entered_suicidal = entry['Entered-Suicidal'] 
  now_suicidal = entry['Now-Suicidal'] 
  the_shift = {}
  the_shift['entry_id'] = entry_id
  if entered_negative and now_negative:
    the_shift['negative'] = entered_negative - now_negative
  if entered_suicidal and now_suicidal:
    the_shift['suicidal'] = entered_suicidal - now_suicidal
  shifts.append(the_shift)

by_suicidal = sorted([x for x in shifts if 'suicidal' in x], key=lambda entry: (entry['suicidal'], entry['entry_id']))
by_negative = sorted([x for x in shifts if 'negative' in x], key=lambda entry: (entry['negative'], entry['entry_id']))

def plot_bar(ids, values, series_name, name):
  # Create the plot arrays.
  trace = go.Bar(
    name=series_name,
    text=ids,
    ids=ids,
    x=range(len(ids)),
    y=values,
    hoverinfo='text',
    )

  layout = go.Layout(
      title = 'Pizza Vs Falafel: %s' % series_name,
      showlegend = True,
      )
  fig = go.Figure( data=[trace], layout=layout)
  py.plot(fig, validate=False, filename=name)

plot_bar([x['entry_id'] for x in by_suicidal], [x['suicidal'] for x in by_suicidal], 'really need', 'bar-really-need-falafel')
plot_bar([x['entry_id'] for x in by_negative], [x['negative'] for x in by_negative], 'could use', 'bar-could-use-falafel')
