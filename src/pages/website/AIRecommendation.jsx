import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createRecommendation } from '../../api/aiRecommendations';

// Import refactored modular components
import RecommendationLoading from '../../components/ai-recommendation/RecommendationLoading';
import RecommendationResults from '../../components/ai-recommendation/RecommendationResults';
import RecommendationWizard from '../../components/ai-recommendation/RecommendationWizard';

export default function AIRecommendation() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ budget: '', location: '', propertyType: '', purpose: '' });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [analyzingStep, setAnalyzingStep] = useState(0);

  const updateField = (field, value) => setFormData((p) => ({ ...p, [field]: value }));
  const getFieldForStep = (s) => ({ 1: 'budget', 2: 'location', 3: 'propertyType', 4: 'purpose' })[s];

  const handleNext = () => {
    if (!formData[getFieldForStep(step)]) {
      toast.error('Please select an option to continue');
      return;
    }
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    setAnalyzingStep(0);
    const iv = setInterval(() => {
      i++;
      if (i < 4) setAnalyzingStep(i);
    }, 600);
    return () => clearInterval(iv);
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await createRecommendation(formData);
      const rec = data?.data;
      if (rec?.recommendedPlots?.length > 0) {
        setResults(rec);
      } else {
        toast.error('No matching plots found. Try different preferences.');
        setResults({ recommendedPlots: [], totalResults: 0, preferences: formData });
      }
    } catch {
      toast.error('Unable to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setResults(null);
    setStep(1);
    setFormData({ budget: '', location: '', propertyType: '', purpose: '' });
  };

  /* ===== LOADING STATE ===== */
  if (loading) {
    return <RecommendationLoading analyzingStep={analyzingStep} />;
  }

  /* ===== RESULTS STATE ===== */
  if (results) {
    return (
      <RecommendationResults
        results={results}
        formData={formData}
        resetWizard={resetWizard}
      />
    );
  }

  /* ===== WIZARD STATE ===== */
  return (
    <RecommendationWizard
      step={step}
      formData={formData}
      updateField={updateField}
      getFieldForStep={getFieldForStep}
      handleBack={handleBack}
      handleNext={handleNext}
      loading={loading}
    />
  );
}
