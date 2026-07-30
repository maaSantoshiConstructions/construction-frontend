import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  LuGift,
  LuShare2,
  LuHandCoins,
  LuCopy,
  LuCheck,
  LuSend,
  LuMessageSquare,
  LuCircleHelp,
  LuChevronDown,
  LuSparkles,
  LuUserCheck,
  LuBuilding2,
  LuLock,
  LuUserPlus,
} from 'react-icons/lu';
import { useAuth } from '../../context/AuthContext';
import { createLead } from '../../api/leads';

export default function ReferralProgram() {
  const { user } = useAuth();

  // State
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [submittedFriend, setSubmittedFriend] = useState(null);
  const [friendName, setFriendName] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [notes, setNotes] = useState('');

  const userReferralCode = user?.referralCode || (user?._id ? `REF-${user._id.slice(-6).toUpperCase()}` : '');
  const referralLink = userReferralCode ? `${window.location.origin}/referral-program?ref=${userReferralCode}` : '';

  const activeFriendName = friendName.trim() || submittedFriend?.name || '';
  const activeFriendPhone = friendPhone.trim() || submittedFriend?.phone || '';

  const handleCopy = (text) => {
    if (!text) return;
    if (!activeFriendName || !activeFriendPhone) {
      toast.error('Please fill in your friend\'s details (Name & Phone) first before copying your referral link.');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Referral link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    if (!referralLink) return;
    if (!activeFriendName || !activeFriendPhone) {
      toast.error('Please fill in your friend\'s details (Name & Phone) first before sharing via WhatsApp.');
      return;
    }
    const message = encodeURIComponent(
      `Hey ${activeFriendName}! Looking for premium residential & commercial plots at prime growth corridors in Odisha? Check out Maa Santoshi Constructions: ${referralLink} (Use my Referral Code: ${userReferralCode})`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handleSubmitReferral = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit a referral');
      return;
    }
    if (!friendName.trim() || !friendPhone.trim()) {
      toast.error('Friend\'s name and phone number are required');
      return;
    }

    setSubmitting(true);
    try {
      const currentFriendName = friendName.trim();
      const currentFriendPhone = friendPhone.trim();

      await createLead({
        name: currentFriendName,
        phone: currentFriendPhone,
        email: friendEmail.trim() || undefined,
        source: 'customer_referral',
        referralCode: userReferralCode,
        referredBy: user._id,
        referrerInfo: {
          name: user.name,
          phone: user.phone || '',
        },
        notes: notes.trim() ? `Referral details: ${notes.trim()}` : undefined,
      });

      setSubmittedFriend({ name: currentFriendName, phone: currentFriendPhone });
      toast.success(`Referral submitted for ${currentFriendName}! You can now copy or share your link.`);
      setFriendName('');
      setFriendPhone('');
      setFriendEmail('');
      setNotes('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit referral');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'Who is eligible to participate in the Referral Program?',
      a: 'Registered customers and channel partners can participate! Simply log in to access your referral code and share your link with friends, family, or colleagues interested in buying plot properties.',
    },
    {
      q: 'How much cash reward can I earn?',
      a: 'You earn 1% cash reward of the total plot agreement value for every successful referral booking (e.g. ₹25,000 reward for a ₹25 Lakh plot booking). There is no upper limit on how many friends you can refer!',
    },
    {
      q: 'When will I receive my referral payout?',
      a: 'Referral rewards are disbursed via Direct Bank Transfer or UPI within 7 working days after your referred buyer completes their token payment and signs the plot booking agreement.',
    },
    {
      q: 'How do I track the status of my referred friends?',
      a: 'Logged-in users can view their real-time referral pipeline, conversion statuses, and total earnings under their Owner Dashboard -> My Referrals section.',
    },
  ];

  return (
    <div style={{ background: '#f7f7fb', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* ===== HEADER ===== */}
      <div
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(91,79,224,.35), transparent 55%), linear-gradient(120deg,#0b0f2e 0%,#161b45 55%,#1c1450 100%)',
          padding: '64px 0 60px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'rgba(91,79,224,.1)',
          }}
        />
        <div className="wrap max-w-4xl mx-auto px-4">
          <span
            className="eyebrow"
            style={{
              background: 'rgba(255,255,255,.08)',
              color: 'var(--gold)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '1px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LuSparkles size={14} /> REFER &amp; EARN REWARDS
          </span>
          <h1
            style={{
              fontFamily: 'Poppins,Inter,sans-serif',
              fontSize: '40px',
              fontWeight: 800,
              color: '#fff',
              margin: '16px 0 14px',
              lineHeight: 1.25,
            }}
          >
            Turn Your Connections Into <span style={{ color: '#e8b355' }}>Real Estate Payouts</span>
          </h1>
          <p style={{ color: '#b7bade', fontSize: '16px', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Invite your friends and family to invest in prime land with Maa Santoshi Constructions. Log in to access your referral code and earn cash rewards!
          </p>
        </div>
      </div>

      <div className="wrap max-w-6xl mx-auto px-4" style={{ marginTop: '48px' }}>
        {/* ===== 3-STEP PROCESS ===== */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900">How The Referral Program Works</h2>
            <p className="text-sm text-slate-500 mt-2">Earn rewards in 3 simple, transparent steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <LuShare2 size={18} className="text-indigo-600" /> Share &amp; Invite
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log in to get your custom referral link or submit your friend's details directly using your referral dashboard.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 font-bold text-xl mb-4 flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <LuBuilding2 size={18} className="text-amber-600" /> Site Visit &amp; Booking
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our sales team guides your friend with live plot maps, virtual tours, and site visits to pick their plot.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-xl mb-4 flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <LuHandCoins size={18} className="text-emerald-600" /> Earn Cash Payout
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once their plot booking agreement is confirmed, your 1% cash reward is transferred directly to your bank account.
              </p>
            </div>
          </div>
        </div>

        {/* ===== REFERRAL SECTION: LOGGED IN VS GUEST ===== */}
        {user ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Left: Referral Lead Form for Logged In User */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <LuSend size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Refer a Friend Directly</h3>
                  <p className="text-xs text-slate-500">Welcome, {user.name}! Submit your friend's info below.</p>
                </div>
              </div>

              <form onSubmit={handleSubmitReferral} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Friend's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Friend's full name"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Friend's Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Friend's mobile number"
                      value={friendPhone}
                      onChange={(e) => setFriendPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Friend's Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="Friend's email address"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Preferred Location</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Interested in Bhubaneswar residential plot, budget 25 Lakhs"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#0b0f2e] hover:bg-[#161b45] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting Referral...' : 'Submit Referral Lead →'}
                </button>
              </form>
            </div>

            {/* Right: Share Tools & Dashboard link */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-[#0b0f2e] to-[#1c1450] text-white rounded-2xl p-6 shadow-md border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#e8b355]">
                    <LuGift size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Your Referral Link</h3>
                    <p className="text-xs text-slate-300">Code: <span className="font-mono text-amber-300">{userReferralCode}</span></p>
                  </div>
                </div>

                {submittedFriend && (
                  <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                        <LuCheck size={14} className="text-emerald-400 shrink-0" /> Lead Created for: <strong>{submittedFriend.name}</strong>
                      </span>
                      <span className="text-[10px] bg-emerald-800/60 text-emerald-200 px-2 py-0.5 rounded-md font-mono">
                        {submittedFriend.phone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-emerald-800/40 text-[11px] text-slate-300">
                      <span>Want to refer another friend?</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedFriend(null);
                          setFriendName('');
                          setFriendPhone('');
                          toast.success('Form reset. Enter your next friend\'s details!');
                        }}
                        className="text-[#e8b355] font-bold hover:underline"
                      >
                        + Refer Another Friend
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white/10 rounded-xl p-3 mb-4 flex items-center justify-between gap-2 border border-white/10">
                  <span className="text-xs font-mono truncate text-amber-200">{referralLink}</span>
                  <button
                    onClick={() => handleCopy(referralLink)}
                    className="px-3 py-1.5 bg-[#e8b355] hover:bg-[#d8a345] text-[#0b0f2e] text-xs font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1"
                  >
                    {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleWhatsAppShare}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <LuMessageSquare size={16} /> Share on WhatsApp
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <LuUserCheck size={16} className="text-indigo-600" /> Track Payouts &amp; Earnings
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">View real-time referral conversions in your Owner Dashboard.</p>
                </div>
                <Link
                  to={user?.role === 'channel_partner' ? '/partner/referrals' : '/customer/referrals'}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors shrink-0 ml-3"
                >
                  My Referrals →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* GUEST USER LOGIN REQUIRED CARD */
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-slate-200 text-center max-w-2xl mx-auto mb-12 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6">
              <LuLock size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Login Required to Refer &amp; Earn Rewards</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              To get your custom referral link, submit referrals directly, and track your cash payouts, please log in to your account.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?redirect=/referral-program"
                style={{ color: '#0b0f2e' }}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#e8b355] hover:bg-[#d8a345] text-[#0b0f2e] text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <LuUserCheck size={18} /> Log In to Refer →
              </Link>
              <Link
                to="/register?redirect=/referral-program"
                style={{ color: '#ffffff' }}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0b0f2e] hover:bg-[#161b45] text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LuUserPlus size={18} /> Create Account
              </Link>
            </div>
          </div>
        )}

        {/* ===== FAQs ===== */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <LuCircleHelp size={20} className="text-indigo-600" /> Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 bg-slate-50 hover:bg-slate-100/80 font-semibold text-xs sm:text-sm text-slate-800 flex justify-between items-center transition-colors"
                >
                  <span>{faq.q}</span>
                  <LuChevronDown
                    size={16}
                    className={`transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
