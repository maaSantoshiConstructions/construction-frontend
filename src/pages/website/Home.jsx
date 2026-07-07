import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="gift-tab">Get Best Deal</div>
        <div className="wrap">
          <div className="hero-copy">
            <span className="badge">● SMART REAL ESTATE • AI POWERED</span>
            <h1>
              Build Your Future.<br />
              <span className="accent">Invest with Confidence.</span>
            </h1>
            <p className="lead">
              AI-powered real estate platform with 20 intelligent features, smart calculators &amp; real-time insights.
            </p>
            <div className="hero-stats">
              <div className="hstat">
                <div className="ic">▦</div>
                <div>
                  <div className="num">20+</div>
                  <div className="lbl">Smart Features</div>
                </div>
              </div>
              <div className="hstat">
                <div className="ic">☺</div>
                <div>
                  <div className="num">500+</div>
                  <div className="lbl">Happy Customers</div>
                </div>
              </div>
              <div className="hstat">
                <div className="ic">▤</div>
                <div>
                  <div className="num">100+</div>
                  <div className="lbl">Acres Delivered</div>
                </div>
              </div>
            </div>
            <div className="hero-actions">
              <Link to="/projects" className="btn-gold">Explore Projects →</Link>
              <Link to="/smart-features" className="btn-outline">See 20 Features ▦</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80&auto=format&fit=crop"
                alt="Green City residential towers at dusk"
                onError={(e) => {
                  e.target.parentElement.style.background = 'linear-gradient(135deg,#3a3f6b,#7d7aa3 40%,#c9b28a 75%,#efd9a8)';
                  e.target.remove();
                }}
              />
              <div className="project-card">
                <div className="live"><span className="dot"></span> Live Project</div>
                <h4>Green City</h4>
                <p>Premium Residential Plots</p>
                <p>Bhubaneswar, Odisha</p>
                <hr />
                <div className="from">Starting From</div>
                <div className="price">₹9.99 Lakh*</div>
                <Link to="/projects" className="vd">View Details →</Link>
              </div>
            </div>

            <div className="side-dock">
              <div className="item"><div className="ic">📞</div><span>Call Us</span></div>
              <div className="item"><div className="ic">💬</div><span>WhatsApp</span></div>
              <div className="item"><div className="ic">📍</div><span>Site Visit</span></div>
              <div className="item"><div className="ic">📄</div><span>Brochure</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <div className="wrap">
        <div className="trustbar">
          <div className="trust-item">
            <div className="ic">🛡</div>
            <div><h5>RERA Certified</h5><p>All Projects</p></div>
          </div>
          <div className="trust-item">
            <div className="ic">📄</div>
            <div><h5>100% Transparent</h5><p>No Hidden Charges</p></div>
          </div>
          <div className="trust-item">
            <div className="ic">✦</div>
            <div><h5>AI-Powered Platform</h5><p>Smart Recommendations</p></div>
          </div>
          <div className="trust-item">
            <div className="ic">🔒</div>
            <div><h5>Secure &amp; Safe</h5><p>End-to-End Security</p></div>
          </div>
        </div>
      </div>

      {/* ===== PROJECTS ===== */}
      <section className="section" id="projects">
        <div className="wrap">
          <span className="eyebrow">PREMIUM PROJECTS</span>
          <div className="sec-head">
            <div>
              <h2>Our Featured Projects</h2>
              <p>Discover premium properties with world-class amenities and smart investment opportunities.</p>
            </div>
            <Link to="/projects" className="btn-line">View All Projects →</Link>
          </div>

          <div className="projects-grid">
            {/* Card 1 */}
            <div className="pcard">
              <div className="thumb t1">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&auto=format&fit=crop"
                  alt="Green City residential plot entrance"
                  loading="lazy"
                  onError={(e) => e.target.remove()}
                />
                <span className="tag premium">Premium</span>
              </div>
              <div className="body">
                <h4>Green City</h4>
                <div className="loc">Bhubaneswar, Odisha</div>
                <div className="price-row">
                  <span className="price">₹9.99 Lakh*</span>
                  <span className="onwards">Onwards</span>
                </div>
                <div className="meta">
                  <span>▦ Residential Plot</span>
                  <span>▤ 1200 - 2400 Sq.ft.</span>
                </div>
                <Link to="/projects" className="vdbtn">View Details <span className="go">→</span></Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="pcard">
              <div className="thumb t2">
                <img
                  src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80&auto=format&fit=crop"
                  alt="Royal Enclave gated community"
                  loading="lazy"
                  onError={(e) => e.target.remove()}
                />
                <span className="tag best">Best Seller</span>
              </div>
              <div className="body">
                <h4>Royal Enclave</h4>
                <div className="loc">Cuttack, Odisha</div>
                <div className="price-row">
                  <span className="price">₹14.50 Lakh*</span>
                  <span className="onwards">Onwards</span>
                </div>
                <div className="meta">
                  <span>▦ Residential Plot</span>
                  <span>▤ 1500 - 3000 Sq.ft.</span>
                </div>
                <Link to="/projects" className="vdbtn">View Details <span className="go">→</span></Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="pcard">
              <div className="thumb t3">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80&auto=format&fit=crop"
                  alt="Silver Spring luxury villas"
                  loading="lazy"
                  onError={(e) => e.target.remove()}
                />
                <span className="tag luxury">Luxury</span>
              </div>
              <div className="body">
                <h4>Silver Spring</h4>
                <div className="loc">Puri, Odisha</div>
                <div className="price-row">
                  <span className="price">₹11.75 Lakh*</span>
                  <span className="onwards">Onwards</span>
                </div>
                <div className="meta">
                  <span>▦ Residential Plot</span>
                  <span>▤ 1500 - 3000 Sq.ft.</span>
                </div>
                <Link to="/projects" className="vdbtn">View Details <span className="go">→</span></Link>
              </div>
            </div>

            {/* Card 4 */}
            <div className="pcard">
              <div className="thumb t4">
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80&auto=format&fit=crop"
                  alt="Sunrise Meadows new launch project"
                  loading="lazy"
                  onError={(e) => e.target.remove()}
                />
                <span className="tag new">New Launch</span>
              </div>
              <div className="body">
                <h4>Sunrise Meadows</h4>
                <div className="loc">Khordha, Odisha</div>
                <div className="price-row">
                  <span className="price">₹8.75 Lakh*</span>
                  <span className="onwards">Onwards</span>
                </div>
                <div className="meta">
                  <span>▦ Residential Plot</span>
                  <span>▤ 1000 - 2000 Sq.ft.</span>
                </div>
                <Link to="/projects" className="vdbtn">View Details <span className="go">→</span></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES (dark section) ===== */}
      <section className="features" id="features">
        <div className="wrap">
          <span className="eyebrow">POWERED BY INNOVATION</span>
          <div className="sec-head">
            <div>
              <h2>20 Smart Features</h2>
              <p>Experience the future of real estate with our AI-powered platform.</p>
            </div>
            <Link to="/ai-recommendation" className="btn-line">Explore All Features →</Link>
          </div>
          <div className="feat-grid">
            <Link to="/ai-recommendation" className="fcard"><div className="ic">🏠</div><span>AI Property Recommendation</span></Link>
            <Link to="/calculators" className="fcard"><div className="ic">💹</div><span>Investment Calculator</span></Link>
            <Link to="/plot-map" className="fcard"><div className="ic">🗺</div><span>Live Plot Map</span></Link>
            <Link to="/virtual-tour" className="fcard"><div className="ic">🎓</div><span>Virtual Site Visit</span></Link>
            <Link to="/customer/construction-updates" className="fcard"><div className="ic">👷</div><span>Construction Tracker</span></Link>
            <Link to="/ai-chatbot" className="fcard"><div className="ic">🤝</div><span>AI Sales Assistant</span></Link>
            <Link to="/book-visit" className="fcard"><div className="ic">📅</div><span>Smart Booking</span></Link>
            <Link to="/customer/referrals" className="fcard"><div className="ic">🎁</div><span>Referral Program</span></Link>
            <Link to="/partner/dashboard" className="fcard"><div className="ic">🧭</div><span>Channel Partner Portal</span></Link>
            <Link to="/book-visit" className="fcard"><div className="ic">📲</div><span>Online Booking</span></Link>
            <Link to="/property-comparison" className="fcard"><div className="ic">⚖</div><span>Property Comparison</span></Link>
            <Link to="/calculators" className="fcard"><div className="ic">🏷</div><span>Loan Eligibility</span></Link>
            <Link to="/calculators" className="fcard"><div className="ic">🧮</div><span>Construction Cost Calculator</span></Link>
            <Link to="/ai-followup" className="fcard"><div className="ic">📈</div><span>Lead Scoring</span></Link>
            <Link to="/customer/documents" className="fcard"><div className="ic">✅</div><span>Legal Verification</span></Link>
            <Link to="/whatsapp-crm" className="fcard"><div className="ic">💬</div><span>WhatsApp CRM</span></Link>
            <Link to="/ai-followup" className="fcard"><div className="ic">🤖</div><span>AI Follow-up</span></Link>
            <Link to="/reviews" className="fcard"><div className="ic">⭐</div><span>Reviews &amp; Ratings</span></Link>
            <Link to="/customer/dashboard" className="fcard"><div className="ic">🧑‍💼</div><span>Owner Dashboard</span></Link>
          </div>
        </div>
      </section>

      {/* ===== CALCULATORS ===== */}
      <section className="section tight-top" id="calculators">
        <div className="wrap">
          <span className="eyebrow">SMART CALCULATORS</span>
          <div className="sec-head">
            <div>
              <h2>Plan Better. Invest Smarter.</h2>
              <p>Use our intelligent calculators to make informed real estate decisions.</p>
            </div>
            <Link to="/calculators" className="btn-line">Explore All Calculators →</Link>
          </div>

          <div className="calc-grid">
            <div className="ccard">
              <div>
                <h4>Investment Returns Calculator</h4>
                <p>Calculate your property returns and future value</p>
                <Link to="/calculators" className="go-btn">Calculate Returns ▦</Link>
              </div>
              <div className="icon-box">📊</div>
            </div>
            <div className="ccard">
              <div>
                <h4>Loan Eligibility Calculator</h4>
                <p>Check your loan eligibility and EMI details instantly</p>
                <Link to="/calculators" className="go-btn">Check Eligibility ▦</Link>
              </div>
              <div className="icon-box">🏦</div>
            </div>
            <div className="ccard">
              <div>
                <h4>Construction Cost Calculator</h4>
                <p>Estimate construction cost for your dream project</p>
                <Link to="/calculators" className="go-btn">Calculate Cost ▦</Link>
              </div>
              <div className="icon-box">🏗</div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="cta-banner">
            <div>
              <h3>Ready to Build Your Future?</h3>
              <p>Join thousands of smart investors who trust Jai Santoshi Maa Infrastructure.</p>
            </div>
            <div className="cta-stats">
              <div><div className="num">500+</div><div className="lbl">Happy Customers</div></div>
              <div><div className="num">100+</div><div className="lbl">Acres Delivered</div></div>
              <div><div className="num">20+</div><div className="lbl">Smart Features</div></div>
            </div>
            <Link to="/book-visit" className="btn-gold">Enquire Now →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
