import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Footer() {
  const { user, getRedirectPath } = useAuth();
  const dashboardPath = user ? getRedirectPath(user.role) : '/login';
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          {/* About */}
          <div className="foot-about">
            <div className="brand">
              <div className="brand-icon">JS</div>
              <div className="brand-text">
                <div className="l1">JAI SANTOSHI MAA</div>
                <div className="l2">INFRASTRUCTURE PVT. LTD.</div>
              </div>
            </div>
            <p>Building dreams, creating value, and delivering excellence in real estate with innovation and trust.</p>
            <div className="socials">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">◎</a>
              <a href="#" aria-label="Phone">☎</a>
              <a href="#" aria-label="YouTube">▶</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/#features">20 Smart Features</Link></li>
              <li><Link to="/calculators">Calculators</Link></li>
              <li><Link to={dashboardPath}>Owner Portal</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h5>Projects</h5>
            <ul>
              <li>Green City</li>
              <li>Royal Enclave</li>
              <li>Silver Spring</li>
              <li>Sunrise Meadows</li>
              <li><Link to="/projects">All Projects</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h5>Tools</h5>
            <ul>
              <li><Link to="/calculators">Investment Calculator</Link></li>
              <li><Link to="/calculators">Loan Eligibility</Link></li>
              <li><Link to="/calculators">Construction Calculator</Link></li>
              <li><Link to="/property-comparison">Property Comparison</Link></li>
              <li><Link to="/plot-map">Live Plot Map</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5>Contact Us</h5>
            <div className="contact-line">📞 +91 70000 12345</div>
            <div className="contact-line">✉ info@jsminfra.com</div>
            <div className="contact-line">📍 Bhubaneswar, Odisha, India 751029</div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© 2025 Jai Santoshi Maa Infrastructure Pvt. Ltd. All Rights Reserved.</span>
          <span>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Disclaimer</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
