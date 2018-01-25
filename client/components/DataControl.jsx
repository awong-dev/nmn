import React from 'react';
import Highcharts from 'highcharts'
import ChartCard from './ChartCard'
import Checkbox from './Checkbox'
import jStat from 'jstat';

class DataControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {dichotomy, onDichotomyChange, category, onCategoryChange, demographic, onDemographicChange, source_url, onSourceUrlChange} = this.props;
   return (
     <ul className="mdc-list">
       <li className="mdc-list-item">
         Dichotomize:
         <select value={dichotomy} onChange={onDichotomyChange}>
           <option value="">None</option>
           <option value="1-minute-survey">1-minute-survey</option>
           <option value="3-minute-survey">3-minute-survey</option>
           <option value="high-enter">high-enter</option>
         </select>
       </li>

       <li className="mdc-list-item">
         Category:
         <select value={category} onChange={onCategoryChange}>
           <option value="Negative">Negative</option>
           <option value="Suicidal">Suicidal</option>
         </select>
       </li>

       <li className="mdc-list-item">
         Source url:
         <select value={source_url} onChange={onSourceUrlChange}>
           <option value="">All</option>
           <option value="/help-line">/help-line</option>
           <option value="/skills">Something under /skills</option>
           <option value="/">Landing Page</option>
         </select>
       </li>

       <hr />
       <li className="mdc-list-item">
         <h2 className="mdc-typography--title">Demographic filter:</h2>
       </li>

       <li>
         <Checkbox name="mhprov" checked={demographic.mhprov} onChange={onDemographicChange} label="Mental Health Provider"/>
       </li>

       <li>
         <Checkbox name="otherprov" checked={demographic.otherprov} onChange={onDemographicChange} label="Other Provider"/>
       </li>

       <li>
         <Checkbox name="male36_64" checked={demographic.male36_64} onChange={onDemographicChange} label="Male 36-64"/>
       </li>

       <li>
         <Checkbox name="uncategorized" checked={demographic.uncategorized} onChange={onDemographicChange} label="Uncategorized"/>
       </li>
     </ul>
     );
  }
}

export default DataControl;
