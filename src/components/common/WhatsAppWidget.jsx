import React from "react";

export default function WhatsAppWidget() {
    return (
        <a
            href="https://wa.me/919876543210" // Update this with your actual hotel WhatsApp number
            className="whatsapp_float"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                width: '60px',
                height: '60px',
                bottom: '40px',
                right: '40px',
                backgroundColor: '#25d366',
                color: '#FFF',
                borderRadius: '50px',
                textAlign: 'center',
                fontSize: '30px',
                boxShadow: '2px 2px 3px #999',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none' // Remove underline
            }}
        >
            {/* FontAwesome 5 syntax */}
            <i className="fab fa-whatsapp" style={{ fontSize: '35px' }}></i>
        </a>
    );
}
