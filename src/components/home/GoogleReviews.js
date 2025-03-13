import { useEffect } from "react";

const GoogleReviews = () => {
  useEffect(() => {
    // Reinitialize Elfsight script when component mounts
    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
        <center><h1>Google Reviews</h1></center>
    <div className="elfsight-app-0cfa3806-56d5-4b0c-a9ba-92feb65b693e" data-elfsight-app-lazy></div>
    </div>
  );
};

export default GoogleReviews;
