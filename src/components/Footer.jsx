import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer style={{
            background: 'var(--color-footer-bg)',
            color: 'var(--color-text)',
            padding: '60px 0 20px',
            marginTop: '60px',
            borderTop: '5px solid var(--color-primary)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px',
                    marginBottom: '50px'
                }}>

                    {/* Brand Section */}
                    <div>
                        <h2 style={{
                            color: 'var(--color-primary)',
                            fontSize: '2rem',
                            marginBottom: '20px',
                            fontFamily: "'Fredoka One', cursive, sans-serif",
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{ fontSize: '2.5rem' }}>🧸</span> JoyBox
                        </h2>
                        <p style={{ color: 'var(--color-text-light)', lineHeight: '1.8' }}>
                            Sparking joy and imagination in every child's heart. We provide the highest quality, safe, and educational toys for all ages.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon" style={{
                                width: '36px', height: '36px', background: 'var(--color-bg)', border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                                color: 'var(--color-primary)', transition: 'all 0.3s ease'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon" style={{
                                width: '36px', height: '36px', background: 'var(--color-bg)', border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                                color: 'var(--color-primary)', transition: 'all 0.3s ease'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon" style={{
                                width: '36px', height: '36px', background: 'var(--color-bg)', border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                                color: 'var(--color-primary)', transition: 'all 0.3s ease'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon" style={{
                                width: '36px', height: '36px', background: 'var(--color-bg)', border: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                                color: 'var(--color-primary)', transition: 'all 0.3s ease'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 style={{ color: 'var(--color-accent)', marginBottom: '25px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Quick Links</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about' },
                                { name: 'Contact', path: '/contact' },
                                { name: 'Track Order', path: '/track-order' }
                            ].map(item => (
                                <li key={item.name} style={{ marginBottom: '12px' }}>
                                    <Link to={item.path} style={{ color: 'var(--color-text-light)', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'}
                                        onMouseOut={(e) => e.target.style.color = 'var(--color-text-light)'}
                                    >{item.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 style={{ color: 'var(--color-accent)', marginBottom: '25px', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Stay in Loop</h3>
                        <p style={{ color: 'var(--color-text-light)', marginBottom: '20px' }}>Join our newsletter for exclusive offers and new toy alerts!</p>
                        <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="email"
                                placeholder="Your email..."
                                style={{
                                    padding: '12px',
                                    borderRadius: '25px',
                                    border: '1px solid var(--border)',
                                    flex: 1,
                                    background: 'var(--color-bg)',
                                    color: 'var(--color-text)',
                                    outline: 'none'
                                }}
                            />
                            <button type="submit" style={{
                                padding: '12px 20px',
                                borderRadius: '25px',
                                border: 'none',
                                background: 'var(--color-button)',
                                color: 'var(--color-text)',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >Go</button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: '25px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px',
                    fontSize: '0.9rem',
                    color: 'var(--color-text-light)'
                }}>
                    <div>&copy; {currentYear} JoyBox. All rights reserved.</div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link to="/" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
                        <Link to="/" style={{ color: 'var(--color-muted)', textDecoration: 'none' }}>Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
