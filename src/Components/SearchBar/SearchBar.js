import React from "react";
import './SearchBar.css';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}
//line-12: (this.state.term) >> check if it is (term)
//line-13: (term) >> (this.state.term)
	search(term) {
		this.props.onSearch(term);
	}

	handleTermChange(event) {
		this.search({term: event.target.value});
	}

	render() {
		return (
			<div className="SearchBar">
        <input
				onChange={this.handleTermChange}
				placeholder="Enter A Song, Album, or Artist" />
        <a>SEARCH</a>
      </div>
		);
	}
}

export default SearchBar;
