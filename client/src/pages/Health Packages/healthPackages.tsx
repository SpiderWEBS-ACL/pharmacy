import React from 'react';
import { Button, Card, Col, Row } from 'antd';
import './healthPackages.css';

const HealthPackages = () => {
  const pharmacyHealthPackages = [
    {
      name: 'Bronze Package',
      description: 'This Package is for People who are members for more than 5 years.',
      price: '45/m',
      discount: '10%',
      status: 'Unsubscribed',
    },
    {
      name: 'Silver Package',
      description: 'This Package is for Business Owners',
      price: '70/m',
      discount: '25%',
      status: 'Unsubscribed',
    },
    {
      name: 'Gold Package',
      description: 'This Package is for Master Card Owner.',
      price: '100/m',
      discount: '50%',
      status: 'Subscribed',
    },
  ];

  return (
    <div className="health-packages-container">
      <Row gutter={[16, 16]}>
        {pharmacyHealthPackages.map((pkg, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={8} xl={8}>
            <Card className="health-package-card" title={pkg.name}>
              <p>{pkg.description}</p>
              <p>
                <strong>Price:</strong> {pkg.price}
              </p>
              <p>
                <strong>Discount:</strong> {pkg.discount}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HealthPackages;