import React from "react";

const SearchResults = ({ searchQuery, searchResults, addSearchResult,searchType }) => {
  
    if(!searchType){
        return (
            <div className="search-results-container">
              <div className="search-results">
                {searchQuery === "" ? (
                  <div className="search-result" style={{ textAlign: "center" }}>Введите название товара</div>
                ) : searchResults.length === 0 ? (
                  <div className="search-result" style={{ textAlign: "center" }}>Товар отсутствует</div>
                ) : (
                  searchResults.map((result, index) => (
                    <div key={index} className="search-result" onClick={() => addSearchResult(result)}>
                      <img src={result.link_image} alt={result.title} />
                      <h3>{result.name}</h3>
                      <p>{result.price}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );  
    }
    else{
      console.log(searchResults);
      
        return (
            <div className="search-results-container">
              <div className="search-results" style={{flexDirection:"column", alignContent: "flex-start"}}>
                {searchQuery === "" ? (
                  <div className="search-result" style={{ textAlign: "center" }}>Введите название товара</div>
                ) : searchResults.length === 0 ? (
                  <div className="search-result" style={{ textAlign: "center" }}>Товар отсутствует</div>
                ) : (
                  searchResults.map((result, index) => (
                    <div key={index} className="search-result" style={{display: "flex", alignItems: "flex-end",gap: "200px"}}  onClick={() => addSearchResult(result)}>
                      <h3>{result.name}</h3>
                      <p>{result.price}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
    }
  
};

export default SearchResults;