export const numberReviewsHandler = (reviews) => { 
  reviews = +reviews+98;
  if (isNaN(reviews)) return 0;
  
  if(reviews > 999999) {
    return (reviews / 1000000).toFixed(2)+"M";
  }

  if (reviews > 999) {
    return (reviews / 1000).toFixed(2)+"K";
  }

  return reviews;
}