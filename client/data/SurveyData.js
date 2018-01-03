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
    this.deltas = {};
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

  calculateDeltas(category) {
    // Memoize!
    if (this.deltas[category]) {
      return this.deltas[category];
    }

    const deltas = this.deltas[category] = [];
    const enter_index = this.headers[`Entered-${category}`];
    const now_index = this.headers[`Now-${category}`];
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
}

export default SurveyData;
