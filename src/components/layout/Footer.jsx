import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProjects } from '../../api/projects';

export default function Footer() {
  const { user, getRedirectPath } = useAuth();
  const dashboardPath = user ? getRedirectPath(user.role) : '/login';

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getProjects({ limit: 4 })
      .then(({ data: res }) => {
        if (isMounted && Array.isArray(res?.data)) {
          setProjects(res.data);
        }
      })
      .catch((err) => console.error('Failed to load footer projects:', err));
    return () => { isMounted = false; };
  }, []);

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
              <a href="tel:+919142328629" aria-label="Phone">☎</a>
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

          {/* Real Projects */}
          <div>
            <h5>Projects</h5>
            <ul>
              {projects.length > 0 ? (
                projects.slice(0, 4).map((p) => (
                  <li key={p._id || p.slug}>
                    <Link to={`/projects/${p.slug || p._id}`}>{p.name}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/projects">Ongoing Developments</Link></li>
                  <li><Link to="/projects">Completed Projects</Link></li>
                  <li><Link to="/projects">Plotted Estates</Link></li>
                </>
              )}
              <li>
                <Link to="/projects" style={{ color: '#e8b355', fontWeight: 600 }}>All Projects →</Link>
              </li>
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
            <div className="contact-line">📞 +91 91423 28629</div>
            <div className="contact-line">✉ support@maasantoshiconstructions.com</div>
            <div className="contact-line">📍 Bhubaneswar, Odisha, India</div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Jai Santoshi Maa Infrastructure Pvt. Ltd. All Rights Reserved.</span>
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
