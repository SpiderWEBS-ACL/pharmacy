import { Carousel } from 'antd';
import './Carousel.css'; // Import a separate CSS file for styling (if needed)

function Commercial() {
  return (
    <div>
      <Carousel autoplay autoplaySpeed={3000}>
        <div>
          <img src={"/carousel1.jpg"} alt="Image 1" className="carousel-image" />
        </div>
        <div>
          <img src={"/carousel2.jpg"} alt="Image 2" className="carousel-image" />
        </div>
        <div>
          <img src={"/carousel3.jpg"} alt="Image 3" className="carousel-image" />
        </div>
      </Carousel>

      {/* Text content and additional elements for the web application */}
      <div className="webapp-content">
        <h1 className="welcome">SpiderWEBS Pharmacy Portal</h1>
        <br />
        <div className="about-company">
          <h2><b>About Us</b></h2>
          <p>Your Trusted Partner in Healthcare Solutions</p>
          <p>
            SpiderWEBS Medical is dedicated to transforming healthcare through innovation and technology.
            Our team of experts is committed to providing cutting-edge medical solutions that improve patient care.
          </p>
          <p>Discover our world-class facilities, state-of-the-art equipment, and dedicated healthcare professionals.</p>
        </div>
        <br />
        <div className="services">
          <h2><b>Our Services</b></h2>
          <ul>
            <li>Telemedicine and Remote Consultations</li>
            <li>Free Shipping anywhere</li>
            <li>Personalized Treatment Plans</li>
            <li>Medical Research and Innovation</li>
            <li>24/7 Patient Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Commercial;
