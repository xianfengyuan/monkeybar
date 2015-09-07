import React from 'react';

export default class FilteredList extends React.Component {
	render() {
    let stacked = this.props.stacked;
    let length = stacked ? stacked.length : 0;
		return (
      <div className="filter-list">
        <input type="text" placeholder="Search" onChange={this.props.onFilteredList}/>
        <span className="current"> Total instance count: {length} </span>
      </div>
    );
  }
}
