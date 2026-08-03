import React from 'react';

const SocialMediaLinks = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#f9f3f0',
      borderRadius: '15px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      margin: '30px auto',
      maxWidth: '600px',
      border: '1px solid #f0e6e0'
    }}>
      <a 
        href="https://wa.me/message/OTRSHLMNW7CEE1" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: 'white',
          fontSize: '24px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 8px rgba(37, 211, 102, 0.3)',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(37, 211, 102, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(37, 211, 102, 0.3)';
        }}
      >
        <i className="ri-whatsapp-line"></i>
      </a>

      <a 
        href="https://www.facebook.com/share/1BDethAHew/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#1877F2',
          color: 'white',
          fontSize: '24px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 8px rgba(24, 119, 242, 0.3)',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(24, 119, 242, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(24, 119, 242, 0.3)';
        }}
      >
        <i className="ri-facebook-fill"></i>
      </a>

      <a 
        href="https://www.instagram.com/al_https://www.instagram.com/scarfaura._?igsh=OW9uNTQxeDZ1OWVp_clothing_store?igsh=MW00enJzejJodjUydg==" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
          color: 'white',
          fontSize: '24px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 8px rgba(225, 48, 108, 0.3)',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(225, 48, 108, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(225, 48, 108, 0.3)';
        }}
      >
        <i className="ri-instagram-line"></i>
      </a>

      <a 
        href="https://www.instagram.com/scarfaura._?igsh=OW9uNTQxeDZ1OWVp" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#000000',
          color: 'white',
          fontSize: '24px',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        }}
      >
        <i className="ri-tiktok-fill"></i>
      </a>
    </div>
  );
};

export default SocialMediaLinks;