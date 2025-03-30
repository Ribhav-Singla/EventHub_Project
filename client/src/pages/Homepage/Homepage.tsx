import FeaturedEvent from "./Sections/FeaturedEvent";
import UpcomingEvents from "./Sections/UpcomingEvents";
import Banner from "./Sections/Banner";
import BlogSection from "./Sections/BlogSection";
import Newsletter from "./Sections/Newsletter";
import { useEffect } from "react";

function Homepage() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Banner />
      <FeaturedEvent />
      <UpcomingEvents />
      <Newsletter/>
      <BlogSection/>
    </div>
  );
}

export default Homepage;
