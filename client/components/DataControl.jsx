import React from 'react';
import Highcharts from 'highcharts'
import ChartCard from './ChartCard'
import jStat from 'jstat';

const DataControl = ({category, onCategoryChange, demographic, onDemographicChange, source_url, onSourceUrlChange}) => (
  <ChartCard title="Data Controls" >
    <div className="mdc-layout-grid">
      <div className="mdc-layout-grid__inner">
        <div className="mdc-layout-grid__cell">
          <div>
            Demographics:
            <br />
            <label>
              <input type="checkbox" name="mhprov" checked={demographic.mhprov} onChange={onDemographicChange} />
              Mental Health Provider
            </label>

            <br />
            <label>
              <input type="checkbox" name="otherprov" checked={demographic.otherprov} onChange={onDemographicChange} />
              Other Provider
            </label>

            <br />
            <label>
              <input type="checkbox" name="male36_64" checked={demographic.male36_64} onChange={onDemographicChange} />
              Male 36-64
            </label>

            <br />
            <label>
              <input type="checkbox" name="uncategorized" checked={demographic.uncategorized} onChange={onDemographicChange} />
              Uncategorized
            </label>
          </div>
        </div>
        <div className="mdc-layout-grid__cell">
          <div>
            Category
            <select value={category} onChange={onCategoryChange}>
              <option value="Negative">Negative</option>
              <option value="Suicidal">Suicidal</option>
            </select>
          </div>
          <div>
            Source url:
            <select value={source_url} onChange={onSourceUrlChange}>
              <option value="">All</option>
              <option value="/help-line">/help-line</option>
              <option value="/skills">Something under /skills</option>
              <option value="/">Landing Page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </ChartCard>
  );

export default DataControl;
