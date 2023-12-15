import { Layout, Card, Button , Row, Col} from 'antd';
import {
    SmileTwoTone,
    StarTwoTone,
    CarryOutTwoTone,
    DollarTwoTone,
    setTwoToneColor,
    DownCircleTwoTone,
  } from '@ant-design/icons';
import './Home.css';
import { useEffect , useRef } from 'react';
import { useNavigate } from "react-router-dom";
const color = 'rgb(57, 132, 237)'
setTwoToneColor(color)

const { Header, Content , Footer } = Layout;

function Home() {
  const navigate = useNavigate();
  var started = true;
  var started2 = true;
  var started3 = true;
  
  const getStartedHandler = () =>{
    if(started){
      handleGetStarted();
      started = false;
    }
    else if(started2){
      handleGetStarted2();
      started2 = false;
    }
    else if(started3){
      handleGetStarted3();
      started3 = false
    }
    else {
      handleBackToTop();
      started = true
      started2 = true
      started3 = true
    }
  }

  const handleGetStarted = () => {
    const middleSection = document.getElementById('top-section');
    if (middleSection) {
      middleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleGetStarted2 = () => {
    const middleSection = document.getElementById('middle-section');
    if (middleSection) {
      middleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleGetStarted3 = () => {
    const middleSection = document.getElementById('bottom-section');
    if (middleSection) {
      middleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleBackToTop = () => {
    const middleSection = document.getElementById('head-section');
    if (middleSection) {
      middleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
 
  
  const handlePharmacy = async ()=>{
    navigate("/reglog");
  }
  const handleClinic = () => {
    window.location.href = 'http://localhost:5174/';
  };

  return (
    <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', background: "white" }}>
        {/* Logo */}
        <div className="logo" id="head-section">
          <img src="/logo.png" alt="Logo" style={{ height: '50px', marginRight: '16px' }} />
        </div>
        <div><h2 className='header'>spiderwebs</h2></div>
        <div className="header-buttons">
          <button onClick={handleClinic}>Clinic Portal</button>
          <button onClick={handlePharmacy}>Pharmacy Portal</button>
        </div>
    </Header>
    <Content>
  
     <div className='home-image' >  <img src="/home-page.png" alt="Home Page" style={{ width: '100%'}} />
       
</div>
      <div className="gradient-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} id="top-section">
        <br></br>
      <br></br>
      <br></br>
        <Card title="Have a Medical Question?" style={{ width: '60%', marginBottom: '16px' }}>
            <p>Chat with your personal doctor and receive an answer right away.</p>
            <Button type="primary" style={{backgroundColor: color}} onClick={handleClinic} >Ask Now</Button>
          </Card>

      <Card title="Have a Medical Question?" style={{ width: '60%', marginBottom: '16px' }}>
            <p>Chat with your personal doctor and receive an answer right away.</p>
            <Button type="primary" style={{backgroundColor: color}} onClick={handleClinic} >Ask Now</Button>
          </Card>

          {/* Pharmacy Card */}
          <Card title="Pharmacy" style={{ width: '60%', marginBottom: '16px' }}>
            <p>Get your medicine and all your pharmacy needs.</p>
            <Button type="primary" style={{backgroundColor: color}} onClick={handlePharmacy}>Go to Pharmacy</Button>
          </Card>
          <div id="middle-section" ></div>
          <div className="card-container" >
          <Card
            cover={<img alt="Teleconsultation" src="/teleconsultation.jpeg" />}
            title="Teleconsultation"
            style={{ width: 'auto', marginBottom: '16px', marginRight: '20px' }}
            >
            <p>Schedule a video call with a specialized doctor.</p>
        <Button type="primary"style={{backgroundColor: color}} onClick={handleClinic}>Book a Call</Button>
            </Card>
          
       
        {/* Health Packages Card */}
        <Card
        cover={<img alt="Health Packages" src="/health-packages.jpeg" />}
        title="Health Packages"
        style={{ width: 'auto', marginBottom: '16px',marginRight: '20px'}}
        >
        <p>Subscribe to a package and get your money's worth</p>
        <Button type="primary"style={{backgroundColor: color}} onClick={handleClinic}>Packages</Button>
        </Card>
        <Card
        cover={<img alt="Health Packages" src="/health-packages.jpeg" />}
        title="Health Packages"
        style={{ width: 'auto', marginBottom: '16px'}}
        >
        <p>Subscribe to a package and get your money's worth</p>
        <Button type="primary"style={{backgroundColor: color}}>Packages</Button>
        </Card>
        </div>
        
        <div className= "about-company-container" id = "bottom-section">
        <div className="about-company">
            {/* First Row */}
            <div className="about-item">
              <SmileTwoTone  style={{ fontSize: '32px' }} />
              <h3>All your healthcare needs</h3>
              <p>Search and book a clinic visit, home visit, or a teleconsultation. Order your medicine and book a service or operation.</p>
            </div>

            <div className="about-item">
              <StarTwoTone style={{ fontSize: '32px' }} />
              <h3>Verified patient reviews</h3>
              <p>Doctor ratings are from patients who booked and visited the doctor through spiderwebs.</p>
            </div>

            {/* Second Row */}
            <div className="about-item">
              <CarryOutTwoTone style={{ fontSize: '32px' }} />
              <h3>Your booking is confirmed</h3>
              <p>Your booking is automatically confirmed, as the doctor specifies his working hours and is notified of the booking details.</p>
            </div>

            <div className="about-item">
              <DollarTwoTone style={{ fontSize: '32px' }} />
              <h3>Book from anywhere</h3>
              <p>Choose to pay using your wallet or any online card</p>
            </div>
          </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
      </div>
    </Content>
    <Footer style={{ backgroundColor: color, color: 'white', padding: '20px', textAlign: 'center' }}>
       <br></br>
        <Row gutter={16}>
          <Col span={8}>
            <h4>Company</h4>
            <p>spiderwebs</p>
            <p>Cairo, Egypt</p>
          </Col>
          <Col span={8}>
            <h4>Contact</h4>
            <p>spiderwebs@gmail.com</p>
            <p>+9984685456</p>
            {/* Add more contact information if needed */}
          </Col>
          <Col span={8}>
            <h4>Socials</h4>
            <p>spiderwebs_insta</p>
            <p>spiderwebs_facebook</p>
          </Col>
        </Row>
        <Button type="primary" onClick={getStartedHandler} style={{ position: 'fixed', bottom: 16, right: 16 }}>
        <DownCircleTwoTone />
        <br></br>
        </Button>
      </Footer>
    </Layout>
  );
}

export default Home;
