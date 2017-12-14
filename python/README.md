# Python scripts for plotting data.


## Python dev environment bootstrap.
Bootstrap a virtual enviroment to ensure packages are all hermitic.

You'll need to have pip installed on your machine. Following online instructions
for that. Then you can use pip to install virtualenv by doing
`pip install virtualenv`. Virtualenv is not strictly necessary, but without it,
installing the project dependencies may require root privileges and that gets messy.
It's worth the time getting virtualenv setup.

```
$ virtualenv venv  # Creates the venv directory to store python packages.
$ source bin/activate  # sets up your shell environment.
$ pip install -r requirements.txt # Install packages from requirements.txt
```

## The scripts
Right now, the scripts are a bunch of hacks with some copy/paste code. We should
pull out common things like basic argument parsing into a functions. Here
are the scripts:

| script name | description | how to run |
|-------------|-------------|------------|
| `csv_to_json.py` | Converts a csv dump into json. Used so other scripts don't need to deal with csv parsing quirks. The json structure currently will bloat the filesize, but until there's a real problem, not caring about that. | `python csv_to_json.py -i input.csv -o output.json` |
| `ip_to_geo.py` | Assumes an entry named `User IP`. This script replaces the IP with an anonymized value and a geolocation making it suitable for uploading publicly w/o disclosing too much info about our users. All subsequent scripts should be based on the output of this data and not the raw json conversion. | `python csv_to_json.py -i input.json -o output.json` |
| `ip_to_geo.py` | Assumes an entry named `User IP`. This script replaces the IP with an anonymized value and a geolocation making it suitable for uploading publicly w/o disclosing too much info about our users. | `python csv_to_json.py -i input.csv -o output.json` |
| `geolocation-graph.py` | Uses Plot.ly to dump a scatter plot of survey responses on a map. | `python csv_to_json.py -i input.csv -o output.json` |
