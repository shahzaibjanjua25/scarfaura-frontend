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
                        Dheri Hassanabad, Rawalpindi
                    </p>
                    <p>
                        <span><i className="ri-mail-fill"></i></span>
                        scarfauraa@gmail.com
                    </p>
                    <p>
                        <span><i className="ri-phone-fill"></i></span>
                        +9231302677570
                    </p>
                </div>
                <div className="footer__col">
                    <h4>COMPANY</h4>
                    <Link to="/">Home</Link>
                    <Link to="/about-us">About Us</Link>
                </div>
                <div className="footer__col">
                    <h4>USEFUL LINK</h4>
                    {user?.role === 'admin' ? (
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
                        <a 
                            href="https://wa.me/message/OTRSHLMNW7CEE1" 
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

                        <a 
                            href="https://www.facebook.com/share/1BDethAHew/" 
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
                                backgroundColor: '#000000',
                                color: 'white',
                                fontSize: '20px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
                Copyright © 2025 Scarfaura. All rights reserved.
            </div>
        </>
    )
}

export default Footer