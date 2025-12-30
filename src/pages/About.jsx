import React from 'react'
import a1 from '../assets/a1.png'
import a2 from '../assets/a2.png'
import a4 from '../assets/a4.png'

export default function About() {
    return (
        <div className="page about-page" style={{ padding: 0, maxWidth: '100%' }}>

            {/* HERO SECTION - MORPHING BLOB STYLE */}
            <section className="hero-section-new">
                <div className="hero-container">
                    <div className="hero-text-side">
                        <span className="yellow-badge" style={{ marginBottom: '24px', background: 'var(--color-accent)', color: 'var(--color-text)' }}>WHO WE ARE</span>
                        <h1 className="hero-title-new">
                            We Create Smiles <br /> For Every Child
                        </h1>
                        <p className="hero-description-new">
                            At JoyBox, we believe that every toy holds a sparkle of magic. We are dedicated to nurturing creativity, learning, and endless happiness in the hearts of children everywhere.
                        </p>

                        {/* Doodles */}
                        <svg className="doodle-icon doodle-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                        <svg className="doodle-icon doodle-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                    </div>

                    <div className="hero-image-side">
                        {/* Morphing Blob Image Container - Solves 'square shape' issue */}
                        <div className="about-image-blob-wrapper">
                            <div className="about-blob-shape">
                                <img src={a4} alt="The JoyBox Story" />
                            </div>
                            <div className="about-badge">
                                <span>🚀</span> since 2020
                            </div>
                        </div>

                        {/* Circle BG (Home style) - Reduced opacity for layering */}
                        <div className="hero-circle-bg" style={{ opacity: 0.3, transform: 'scale(1.2)' }}></div>
                    </div>
                </div>

                {/* Clouds Bottom */}
                <div className="hero-clouds">
                    <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#ffffff" fillOpacity="1" d="M0,224L48,224C96,224,192,224,288,197.3C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </section>

            {/* CONTENT SECTIONS */}
            <div className="container" style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px' }}>
                {/* Mission Statement */}
                <section style={{ display: 'flex', alignItems: 'center', gap: '60px', marginBottom: '100px', flexDirection: 'row', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <img src={a1} alt="Our Mission" style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', transition: 'transform 0.3s' }} className="hover-scale" />
                    </div>
                    <div style={{ flex: '1 1 400px' }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(0, 150, 199, 0.1)',
                            color: 'var(--color-primary)',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            marginBottom: '15px',
                            fontSize: '0.9rem'
                        }}>OUR MISSION</div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--color-text)', fontWeight: '700' }}>Igniting Imagination</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-light)', marginBottom: '20px' }}>
                            Our mission is simple yet profound: to bring joy and learning to every child through the power of play. We carefully curate toys that are not only fun but also safe, educational, and durable.
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-light)' }}>
                            We strive to be more than just a toy shop; we want to be a partner in your child's growth and happiness.
                        </p>
                    </div>
                </section>

                {/* Vision Statement */}
                <section style={{ display: 'flex', alignItems: 'center', gap: '60px', marginBottom: '80px', flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <img src={a2} alt="Our Vision" style={{ width: '100%', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', transition: 'transform 0.3s' }} className="hover-scale" />
                    </div>
                    <div style={{ flex: '1 1 400px' }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(72, 202, 228, 0.15)',
                            color: '#0077B6',
                            padding: '8px 20px',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            marginBottom: '15px',
                            fontSize: '0.9rem'
                        }}>OUR VISION</div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--color-text)', fontWeight: '700' }}>Building a Brighter Future</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-light)', marginBottom: '20px' }}>
                            We envision a world where every child has access to toys that inspire creativity, empathy, and innovation. We aim to foster a community of parents and educators who believe in holistic development.
                        </p>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--color-text-light)' }}>
                            Sustainability is at our core. We aim to lead the industry in eco-friendly toys that protect the planet these children will inherit.
                        </p>
                    </div>
                </section>
            </div>

        </div>
    )
}
