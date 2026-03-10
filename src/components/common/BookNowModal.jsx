import React from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import './BookNowModal.css';

const bookingOptions = [
    {
        name: 'Booking.com',
        link: 'https://www.booking.com/hotel/in/sampath-residency.en-gb.html', // Placeholder link based on search results/name
        color: '#003580'
    },
    {
        name: 'Agoda',
        link: 'https://www.agoda.com/en-in/sampath-residency/hotel/palani-in.html', // Placeholder link
        color: '#5392F9'
    },
    {
        name: 'MakeMyTrip',
        link: 'https://www.makemytrip.com/hotels/sampath_residency-details-palani.html', // Placeholder link
        color: '#d0021b'
    },
    {
        name: 'Goibibo',
        link: 'https://www.goibibo.com/hotels/sampath-residency-hotel-in-palani-7764084231793021136/', // Placeholder link
        color: '#2276E3'
    }
];

const BookNowModal = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} centered size="lg" className="book-now-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="w-100 text-center fw-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-color)' }}>
                    Choose Your Booking Partner
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 py-4">
                <p className="text-center mb-4 text-muted">Select an option below to secure your reservation at Sampath Residency.</p>

                <Row className="g-4 justify-content-center">
                    {bookingOptions.map((option, index) => (
                        <Col xs={12} sm={6} md={6} lg={3} key={index}>
                            <a
                                href={option.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="booking-card d-block text-decoration-none shadow-sm h-100"
                                style={{ '--hover-color': option.color }}
                            >
                                <div className="card-content d-flex flex-column align-items-center justify-content-center p-4 h-100 text-center">
                                    <h4 className="fw-bold mb-3 platform-text-logo" style={{ color: option.color }}>
                                        {option.name}
                                    </h4>
                                    <span className="book-btn-text align-items-center mt-auto text-dark pb-1" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                        Book Here <i className="bi bi-arrow-right ms-1"></i>
                                    </span>
                                </div>
                            </a>
                        </Col>
                    ))}

                    <Col xs={12} sm={12} md={12} lg={12} className="mt-4">
                        <div className="direct-call-card shadow-sm p-4 d-flex flex-column flex-md-row align-items-center justify-content-between text-center text-md-start">
                            <div className="mb-3 mb-md-0">
                                <h5 className="fw-bold mb-1" style={{ color: 'var(--primary-color)' }}>Prefer to book directly?</h5>
                                <p className="mb-2 text-muted" style={{ fontSize: '0.95rem' }}>Call us for the best rates and instant confirmation.</p>
                                <div className="badge bg-success text-white py-2 px-3 fw-bold shadow-sm" style={{ fontSize: '0.9rem' }}>
                                    <i className="bi bi-tags-fill me-2"></i> Get 10% Off Direct Booking!
                                </div>
                            </div>
                            <a href="tel:+919894574934" className="btn btn-primary pulse-btn d-flex align-items-center justify-content-center px-4 py-3 rounded-pill shadow">
                                <i className="bi bi-telephone-fill me-2 fs-5"></i>
                                <span className="fw-bold fs-5">+91 98945-74934</span>
                            </a>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default BookNowModal;
