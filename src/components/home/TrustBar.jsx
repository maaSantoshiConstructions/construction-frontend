import React from 'react';
import { LuShieldCheck, LuFileText, LuCpu, LuLock } from 'react-icons/lu';

export default function TrustBar() {
  return (
    <div className="wrap">
      <div className="trustbar">
        <div className="trust-item">
          <div className="ic"><LuShieldCheck size={22} className="text-amber-500" /></div>
          <div><h5>RERA Certified</h5><p>All Projects</p></div>
        </div>
        <div className="trust-item">
          <div className="ic"><LuFileText size={22} className="text-amber-500" /></div>
          <div><h5>100% Transparent</h5><p>No Hidden Charges</p></div>
        </div>
        <div className="trust-item">
          <div className="ic"><LuCpu size={22} className="text-amber-500" /></div>
          <div><h5>AI-Powered Platform</h5><p>Smart Recommendations</p></div>
        </div>
        <div className="trust-item">
          <div className="ic"><LuLock size={22} className="text-amber-500" /></div>
          <div><h5>Secure &amp; Safe</h5><p>End-to-End Security</p></div>
        </div>
      </div>
    </div>
  );
}
