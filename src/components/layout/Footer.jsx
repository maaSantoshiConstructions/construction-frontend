import { useState, useEffect } from 'react';
import constructionLogo from '../../assets/construction logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProjects } from '../../api/projects';
import { LuPhone, LuMail, LuMapPin, LuFacebook, LuInstagram, LuYoutube } from 'react-icons/lu';

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
            <Link to="/" className="inline-block no-underline mb-3">
              <img
                src={constructionLogo}
                alt="JSMIL – Jai Santoshi Maa Infrastructure"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p>Building dreams, creating value, and delivering excellence in real estate with innovation and trust.</p>
            <div className="socials">
              <a href="#" aria-label="Facebook"><LuFacebook size={15} /></a>
              <a href="#" aria-label="Instagram"><LuInstagram size={15} /></a>
              <a href="tel:+919142328629" aria-label="Phone"><LuPhone size={15} /></a>
              <a href="#" aria-label="YouTube"><LuYoutube size={15} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5>Quick Links</h5>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/#features">Smart Features</Link></li>
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
                <Link to="/projects" className="text-[#e8b355] font-semibold">All Projects →</Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h5>Tools</h5>
            <ul>
              <li><Link to="/calculators?tab=investment">Investment Calculator</Link></li>
              <li><Link to="/calculators?tab=loan-eligibility">Loan Eligibility</Link></li>
              <li><Link to="/calculators?tab=emi">Home Loan EMI</Link></li>
              <li><Link to="/calculators?tab=construction">Construction Calculator</Link></li>
              <li><Link to="/property-comparison">Property Comparison</Link></li>
              <li><Link to="/plot-map">Live Plot Map</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="foot-contact-box bg-white/[0.04] sm:bg-transparent p-4 sm:p-0 rounded-xl border border-white/10 sm:border-0">
            <h5>Contact Us</h5>
            <div className="contact-line">
              <LuPhone size={16} className="text-[#e8b355] shrink-0 mt-0.5" />
              <span>+91 8798675654</span>
            </div>
            <div className="contact-line">
              <LuMail size={16} className="text-[#e8b355] shrink-0 mt-0.5" />
              <span className="break-all sm:break-normal">support@maasantoshiconstructions.com</span>
            </div>
            <div className="contact-line">
              <LuMapPin size={16} className="text-[#e8b355] shrink-0 mt-0.5" />
              <span>Bhubaneswar, Odisha, India</span>
            </div>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Jai Santoshi Maa Infrastructure Pvt. Ltd. All Rights Reserved.</span>
          <div>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
