import React from 'react';
import { Link } from 'react-router-dom';
import { LuTrendingUp, LuBadgePercent, LuCalculator } from 'react-icons/lu';

export default function CalculatorsSection() {
  return (
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
            <div className="icon-box"><LuTrendingUp size={32} className="text-indigo-600" /></div>
          </div>
          <div className="ccard">
            <div>
              <h4>Loan Eligibility Calculator</h4>
              <p>Check your loan eligibility and EMI details instantly</p>
              <Link to="/calculators" className="go-btn">Check Eligibility ▦</Link>
            </div>
            <div className="icon-box"><LuBadgePercent size={32} className="text-indigo-600" /></div>
          </div>
          <div className="ccard">
            <div>
              <h4>Construction Cost Calculator</h4>
              <p>Estimate construction cost for your dream project</p>
              <Link to="/calculators" className="go-btn">Calculate Cost ▦</Link>
            </div>
            <div className="icon-box"><LuCalculator size={32} className="text-indigo-600" /></div>
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
  );
}
