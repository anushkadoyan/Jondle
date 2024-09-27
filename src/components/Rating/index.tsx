import React, { useState } from "react";
import { Button } from "../Button";
import { Song } from "../../types/song";
// import "./StarRating.css"; // Ensure you have the necessary styles

function StarRating({ song }: { song: Song }) {
  const [rating, setRating] = useState<number | null>(null);
  const [rated, setRated] = useState<boolean>(false);

  const submitRating = async () => {
    if (rating !== null) {
      // Send the rating to a server or Google Form
      const formUrl =
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdalJs0v6c41F4az_L-HoWUlhecUXahDzLfjO7sLB7sYQrXRQ/formResponse"; // Replace with your Google Form URL
      const formData = new FormData();
      // get client ip

      let clientIp;
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        clientIp = data.ip;
        console.log(clientIp);
      } catch (error) {
        console.error("Error fetching client IP:", error);
      }

      formData.append(`entry.1454790378`, rating.toString());
      formData.append(`entry.1116586361`, clientIp || "");
      formData.append(`entry.1914949111`, `${song.artist} - ${song.name}`);

      fetch(formUrl, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      })
        .then(() => {
          // alert(`You rated ${rating} star(s). Thank you!`);
          setRated(true);
        })
        .catch(() => {
          alert("Error submitting rating");
        });
    } else {
      alert("Please select a rating!");
    }
  };

  return (
    <div className="star-rating" style={{ display: "flex" }}>
      {rated ? (
        <p>Thank you for rating!</p>
      ) : (
        <>
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;

            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                  style={{ display: "none" }} // Hide the radio input
                />
                <span
                  className="star"
                  onClick={() => setRating(ratingValue)}
                  style={{
                    cursor: "pointer",
                    color: rating && ratingValue <= rating ? "gold" : "#ccc",
                    fontSize: "2rem",
                    padding: "0.5rem", // Increase touch target size
                  }}
                  role="button"
                  aria-label={`${ratingValue} star`}
                  aria-pressed={ratingValue === rating}
                >
                  &#9733;
                </span>
              </label>
            );
          })}
          <Button disabled={!rating} onClick={submitRating}>
            Rate
          </Button>
        </>
      )}
    </div>
  );
}

export default StarRating;
