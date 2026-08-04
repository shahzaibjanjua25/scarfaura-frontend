import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Footer = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <>
            <footer className="section__container footer__container">
                <div className="footer__col">
                    <h4>CONTACT INFO</h4>
                    <p>
                        <span><i className="ri-map-pin-2-fill"></i></span>
                        Rawalpindi, Pakistan
                    </p>
                    <p>
                        <span><i className="ri-mail-fill"></i></span>
                        scarfauraa@gmail.com
                    </p>
                    <p>
                        <span><i className="ri-phone-fill"></i></span>
                        +923165972409
                    </p>
                </div>
                <div className="footer__col">
                    <h4>COMPANY</h4>
                    <Link to="/">Home</Link>
                    <Link to="/about-us">About Us</Link>
                </div>
                <div className="footer__col">
                    <h4>USEFUL LINK</h4>
                    {user?.role === 'admin2' ? (
                        <Link to="/dashboard/manage-orders">Manage Orders</Link>
                    ) : (
                        <Link to="/dashboard/orders">Track My Order</Link>
                    )}
                    <Link to="/shop">Shop</Link>
                </div>
                <div className="footer__col">
                    <h4>CONNECT WITH US</h4>
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginTop: '15px'
                    }}>
                        {/* WhatsApp */}
                        <a 
                            href="https://wa.me/message/JU2BB6GQGTCBL1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#25D366',
                                color: 'white',
                                fontSize: '20px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <i className="ri-whatsapp-line"></i>
                        </a>

                        {/* Facebook */}
                        <a 
                            href="https://www.facebook.com/share/1HkUYmrcEE/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#1877F2',
                                color: 'white',
                                fontSize: '20px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <i className="ri-facebook-fill"></i>
                        </a>

                        {/* Instagram */}
                        <a 
                            href="https://www.instagram.com/scarfaura._?igsh=OW9uNTQxeDZ1OWVp" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                                color: 'white',
                                fontSize: '20px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <i className="ri-instagram-line"></i>
                        </a>

                        {/* TikTok - Updated with correct link */}
                        <a 
                            href="https://www.tiktok.com/@scarfaura5?_r=1&_t=ZS-98ZeTug2XJd" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#000000',
                                color: 'white',
                                fontSize: '20px',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 242, 234, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <i className="ri-tiktok-fill"></i>
                        </a>
                    </div>
                    <p style={{ marginTop: '15px', fontSize: '0.9rem', color: '#666' }}>
                        Follow us for updates and promotions!
                    </p>
                </div>
            </footer>
            <div className="footer__bar">
                Copyright © 2026 Scarfaura. All rights reserved.
            </div>
        </>
    )
}

export default Footer