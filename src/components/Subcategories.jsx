import React, { useState, useEffect } from "react";
import headphone1 from "../img/headphone1.svg";
import headphone2 from "../img/headphone2.svg";
import headphone3 from "../img/headphone3.svg";
import axios from "axios";

const Subcategories = ({ category, onSubcategorySelect, setSelectedSubcategory }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/category/${category}/subcategory`
        );
        setSubcategories(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (category) {
      fetchSubcategories();
    }
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="subcategories">
      <div className="subcategories__content wrap">
        {subcategories.map((data) => (
          <a
            href="#"
            onClick={() => setSelectedSubcategory(data.name_subcategory)}
            className="subcategorie"
            key={data.name_subcategory}
          >
            <img src={data.link_images_subcategory} alt="" />
            <p className="desc">{data.name_subcategory}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Subcategories;

