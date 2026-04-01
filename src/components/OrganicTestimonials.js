import React from 'react';

const testimonials = [
  {
    id: 1,
    name: "Priya S.",
    role: "Verified Buyer",
    rating: 5,
    text: "The authentic taste of Sri Ayini's sambar powder reminds me of my grandmother's cooking. Truly organic and remarkably fresh!",
    avatar: "assets/images/reviews/author1.jpg"
  },
  {
    id: 2,
    name: "Karthik R.",
    role: "Verified Buyer",
    rating: 5,
    text: "I've switched entirely to their cold-pressed oils. You can feel and taste the purity. Highly recommended for daily health.",
    avatar: "assets/images/reviews/author2.jpg"
  },
  {
    id: 3,
    name: "Anitha V.",
    role: "Verified Buyer",
    rating: 5,
    text: "Their idli podi is an absolute lifesaver for busy mornings. It has the perfect blend of spice and texture. My family loves it!",
    avatar: "assets/images/reviews/author3.jpg"
  },
  {
    id: 4,
    name: "Deepa N.",
    role: "Verified Buyer",
    rating: 4,
    text: "Quality is top-notch. The turmeric powder has a rich color and aroma that you just don't get from commercial brands.",
    avatar: "assets/images/reviews/author4.jpg" // Using placeholders or generic
  }
];

const OrganicTestimonials = () => {
  return (
    <section className="organic-testimonials-section pt-100 pb-100" style={{ backgroundColor: '#faf9f6' }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Left Content Area */}
          <div className="col-lg-5 mb-50 mb-lg-0 pr-lg-5">
            <div className="testimonial-header wow fadeInLeft delay-0-2s">
              <h2 className="section-title-large" style={{ color: 'var(--primary-green)', fontWeight: 800, fontSize: '3rem', lineHeight: 1.2, marginBottom: '20px' }}>
                What our <br/>Tribe says
              </h2>
              <div className="reviews-summary d-flex align-items-center mb-30">
                <div className="stars mr-15" style={{ color: '#f1c40f', fontSize: '1.5rem' }}>
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                  <i className="fas fa-star" />
                </div>
                <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--secondary-accent)' }}>Rated 4.9 / 5</h4>
              </div>
              <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.6, marginBottom: '30px' }}>
                Join thousands of families who have chosen to bring heritage, health, and 100% natural ingredients into their daily lives. Our commitment to purity shows in every single jar.
              </p>
              <div className="stats-box" style={{ borderLeft: '4px solid var(--primary-green)', paddingLeft: '20px' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginBottom: '5px' }}>10k+</h3>
                <span style={{ fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Happy Families</span>
              </div>
            </div>
          </div>

          {/* Right Masonry Grid */}
          <div className="col-lg-7">
            <div className="masonry-testimonial-grid wow fadeInRight delay-0-2s">
              <div className="row">
                {/* Column 1 */}
                <div className="col-md-6">
                  {testimonials.slice(0, 2).map((test, index) => (
                    <div className="testimonial-card mb-30" key={test.id} style={{ 
                      background: '#fff', 
                      padding: '30px', 
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                      transition: 'transform 0.3s ease',
                      marginTop: index === 1 ? '0px' : '40px' 
                    }}>
                      <div className="card-stars mb-15" style={{ color: '#f1c40f', fontSize: '14px' }}>
                        {[...Array(test.rating)].map((_, i) => <i className="fas fa-star" key={i} />)}
                      </div>
                      <p style={{ fontSize: '1.05rem', color: '#333', fontStyle: 'italic', marginBottom: '25px', lineHeight: 1.6 }}>
                        "{test.text}"
                      </p>
                      <div className="author-info d-flex align-items-center">
                        <div className="avatar mr-15" style={{
                          width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#eee',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888'
                        }}>
                          <i className="fas fa-user" />
                        </div>
                        <div>
                          <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--secondary-accent)' }}>{test.name}</h6>
                          <span style={{ fontSize: '0.85rem', color: '#cfcfcf' }}><i className="fas fa-check-circle" style={{ color: '#89c74a', marginRight: '5px' }} />{test.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Column 2 */}
                <div className="col-md-6" style={{ marginTop: '0px' }}>
                  {testimonials.slice(2, 4).map((test, index) => (
                    <div className="testimonial-card mb-30" key={test.id} style={{ 
                      background: '#fff', 
                      padding: '30px', 
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                      transition: 'transform 0.3s ease',
                      marginTop: index === 0 ? '-20px' : '0px'
                    }}>
                      <div className="card-stars mb-15" style={{ color: '#f1c40f', fontSize: '14px' }}>
                        {[...Array(test.rating)].map((_, i) => <i className="fas fa-star" key={i} />)}
                      </div>
                      <p style={{ fontSize: '1.05rem', color: '#333', fontStyle: 'italic', marginBottom: '25px', lineHeight: 1.6 }}>
                        "{test.text}"
                      </p>
                      <div className="author-info d-flex align-items-center">
                        <div className="avatar mr-15" style={{
                          width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#eee',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888'
                        }}>
                          <i className="fas fa-user" />
                        </div>
                        <div>
                          <h6 style={{ margin: 0, fontWeight: 700, color: 'var(--secondary-accent)' }}>{test.name}</h6>
                          <span style={{ fontSize: '0.85rem', color: '#cfcfcf' }}><i className="fas fa-check-circle" style={{ color: '#89c74a', marginRight: '5px' }} />{test.role}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganicTestimonials;
