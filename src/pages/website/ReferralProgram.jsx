import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { createLead } from '../../api/leads';

// Subcomponents
import ReferralHeader from '../../components/referral-program/ReferralHeader';
import ReferralSteps from '../../components/referral-program/ReferralSteps';
import ReferralForm from '../../components/referral-program/ReferralForm';
import ReferralShareCard from '../../components/referral-program/ReferralShareCard';
import ReferralGuestCard from '../../components/referral-program/ReferralGuestCard';
import ReferralFaq from '../../components/referral-program/ReferralFaq';

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

  const userReferralCode =
    user?.referralCode || (user?._id ? `REF-${user._id.slice(-6).toUpperCase()}` : '');
  const referralLink = userReferralCode
    ? `${window.location.origin}/referral-program?ref=${userReferralCode}`
    : '';

  const activeFriendName = friendName.trim() || submittedFriend?.name || '';
  const activeFriendPhone = friendPhone.trim() || submittedFriend?.phone || '';

  const handleCopy = (text) => {
    if (!text) return;
    if (!activeFriendName || !activeFriendPhone) {
      toast.error(
        "Please fill in your friend's details (Name & Phone) first before copying your referral link."
      );
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
      toast.error(
        "Please fill in your friend's details (Name & Phone) first before sharing via WhatsApp."
      );
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
      toast.error("Friend's name and phone number are required");
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
      toast.success(
        `Referral submitted for ${currentFriendName}! You can now copy or share your link.`
      );
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
    <div className="bg-[#f7f7fb] min-h-screen pb-24">
      {/* HEADER BANNER COMPONENT */}
      <ReferralHeader />

      <div className="wrap max-w-6xl mx-auto px-4 mt-12">
        {/* 3-STEP PROCESS COMPONENT */}
        <ReferralSteps />

        {/* LOGGED IN USER FORM & SHARE BOX VS GUEST CARD */}
        {user ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <ReferralForm
              user={user}
              friendName={friendName}
              setFriendName={setFriendName}
              friendPhone={friendPhone}
              setFriendPhone={setFriendPhone}
              friendEmail={friendEmail}
              setFriendEmail={setFriendEmail}
              notes={notes}
              setNotes={setNotes}
              submitting={submitting}
              onSubmit={handleSubmitReferral}
            />

            <ReferralShareCard
              user={user}
              userReferralCode={userReferralCode}
              referralLink={referralLink}
              submittedFriend={submittedFriend}
              setSubmittedFriend={setSubmittedFriend}
              copied={copied}
              onCopy={handleCopy}
              onWhatsAppShare={handleWhatsAppShare}
              setFriendName={setFriendName}
              setFriendPhone={setFriendPhone}
            />
          </div>
        ) : (
          <ReferralGuestCard />
        )}

        {/* FAQ ACCORDION COMPONENT */}
        <ReferralFaq faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />
      </div>
    </div>
  );
}
