class SurveyData {
  // Takes survey data in the structure of
  // {
  //   header: ["column1", "column2", "column3"]
  //   data: { id1: [col1val, col2val, col3val],
  //           id2: [col1val, col2val, col3val]
  //          }
  // }
  constructor(survey_data) {
    this.headers = {};
    survey_data.header.map((value, index) => this.headers[value] = index);
    this.data = survey_data.data;

    // Memoization fields.
    this.deltas = {};
    this.correlations = {};
  }

  get(entry_id, column_name) {
    return this.data[entry_id][this.header[column_name]];
  }

  getEntryMetadata(row) {
    return {
      is_midaged_male: row[this.headers['male ages 36-64']],
      is_mental_health_provider: row[this.headers['mental health provider']],
      is_other_healthcare_provider: row[this.headers['other healthcare provider']],
      entry_date: new Date(row[this.headers['Entry Date']]),
    };
  }

  getEnteredIndex(category) { return this.headers[`Entered-${category}`]; }
  getNowIndex(category) { return this.headers[`Now-${category}`]; }

  // Returns delta between "Entered" and "Now" for the given category.
  // Category can be one of "Negative" or "Suicidal".
  calculateDeltas(category) {
    // Memoize!
    if (this.deltas[category]) {
      return this.deltas[category];
    }

    const deltas = this.deltas[category] = [];
    const enter_index = this.getEnteredIndex(category);
    const now_index = this.getNowIndex(category);
    Object.entries(this.data).forEach(
      ([entry_id, row]) => {
        const entered = row[enter_index];
        const now = row[now_index];
        if (entered && now) {
          deltas.push(Object.assign(
            {
              val: now - entered,
              label: entry_id
            },
            this.getEntryMetadata(row)
          ));
        }
      }
    );

    // Return data sorted by deltas.
    deltas.sort((a, b) => {
      if (a.val < b.val)
        return -1;
      if (a.val > b.val) 
        return 1;
      return 0;
    });

    return deltas;
  }

  // Returns a 2-D array of correlations between "Entered" and "Now"
  // response values for the given attribute filters.
  // Category can be one of "Negative" or "Suicidal". The other attributes
  // are booleans.
  getCorrelations(category, is_mental_health_provider, is_other_healthcare_provider, is_midaged_male) {
    const memoization_key = category + !!is_mental_health_provider + !!is_other_healthcare_provider + !!is_mental_health_provider;
    if (this.correlations[memoization_key]) {
      return this.correlations[memoization_key];
    }

    const correlations = this.correlations[memoization_key] = { data:[] }
    // Initialize array.
    for (let entered = 1; entered <= 5; entered++) {
      correlations.data[entered] = [];
      for (let now = 1; now <= 5; now++) {
        correlations.data[entered][now] = 0;
      }
    }

    // Go through data and tabulate.
    const enter_index = getEnteredIndex(category);
    const now_index = getNowIndex(category);
    let total_entries = 0;
    Object.entries(this.data).forEach(
      ([_, row]) => {
        entry_metadata = getEntryMetadata(row);
        if (entry_metadata.is_midaged_male == is_midaged_male &&
           entry_metadata.is_mental_health_provider == is_mental_health_provider &&
           entry_metadata.is_other_healthcare_provider == is_other_healthcare_provider) {
             correlations.data[row[enter_index]][row[now_index]]++;
             total_entries++;
        }
      }
    );

    correlations.is_other_healthcare_provider = is_other_healthcare_provider;
    correlations.is_mental_health_provider = is_mental_health_provider;
    correlations.is_midaged_male = is_midaged_male;
    correlations.total_entries = total_entries;
    return correlations;
  }
}

export default SurveyData;
