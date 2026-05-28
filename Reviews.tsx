import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, CheckCircle, Quote, ThumbsUp, PlusCircle, AlertCircle, Sparkles } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data';
import { Review } from '../types';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Review submission form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [treatment, setTreatment] = useState('Ultrasound');
  const [comment, setComment] = useState('');
  const [submittingMsg, setSubmittingMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('bharat_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReviews([...parsed, ...INITIAL_REVIEWS]);
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
    }
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg("Please provide your name.");
      return;
    }
    if (!comment.trim() || comment.length < 10) {
      setErrorMsg("Please leave a short comment about your experience (at least 10 letters).");
      return;
    }

    const newReview: Review = {
      id: "REV-" + Date.now().toString().slice(-5),
      authorName: name.trim(),
      authorPrefix: "Verified Guest Review",
      rating,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      comment: comment.trim(),
      treatmentName: treatment,
      isVerified: true
    };

    const localSaved = localStorage.getItem('bharat_reviews');
    let updatedLocal: Review[] = [];
    if (localSaved) {
      try {
        updatedLocal = JSON.parse(localSaved);
      } catch (err) {}
    }
    updatedLocal = [newReview, ...updatedLocal];
    localStorage.setItem('bharat_reviews', JSON.stringify(updatedLocal));

    setReviews([newReview, ...reviews]);
    setSubmittingMsg(true);
    
    // Reset fields
    setName('');
    setComment('');
    setRating(5);
    setTreatment('Ultrasound');

    setTimeout(() => {
      setSubmittingMsg(false);
      setShowForm(false);
    }, 2500);
  };

  const treatmentsList = [
    "Ultrasound",
    "Pregnancy Scan",
    "Blood Test",
    "Diagnostic Services",
    "Health Checkup",
    "Routine Scanning"
  ];

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title area */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-extrabold text-xs tracking-wider uppercase font-sans">
            Client Testimonials
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-2">
            Real Reviews From Real Patients
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto mt-4 rounded-full" />
          <p className="font-sans text-slate-500 mt-4 text-base sm:text-lg">
            See why expecting moms, families, and referring doctors recommend our diagnostic center in Gurugram, Haryana.
          </p>
        </div>

        {/* Action Toggle to leave a review */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 font-semibold text-sm transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle className="h-4.5 w-4.5 shrink-0" />
            <span>{showForm ? "Cancel Review" : "Leave a Patient Review"}</span>
          </button>
        </div>

        {/* Dynamic Patient Review Form Box */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-xl mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-12 text-left overflow-hidden shadow-inner"
            >
              {submittingMsg ? (
                <div className="text-center py-8 space-y-3">
                  <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full w-fit mx-auto">
                    <Sparkles className="h-6 w-6 animate-spin" />
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-lg">Thank You for Your Feedback!</h4>
                  <p className="font-sans text-sm text-slate-500">Your review was posted and listed successfully below.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <h4 className="font-display font-bold text-slate-900 text-base">Write Your Patient Experience</h4>
                  
                  {errorMsg && (
                    <div className="p-3 bg-red-100 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 font-sans">Full Name</label>
                      <input 
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-white px-3 py-2 rounded-lg text-sm"
                        required
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 font-sans">Undergone Scan/Treatment</label>
                      <select
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-white px-3 py-2 rounded-lg text-sm"
                      >
                        {treatmentsList.map((tr) => (
                          <option key={tr} value={tr}>{tr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Rating selection stars */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 font-sans block">Rating (1 to 5 Stars)</label>
                    <div className="flex gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-hidden"
                        >
                          <Star 
                            className={`h-6 w-6 stroke-yellow-500 ${
                              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 font-sans">Patient Review Content</label>
                    <textarea 
                      rows={3}
                      placeholder="Share your detailed feedback about radiologists, staff, cleanliness, and waiting time..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full text-slate-800 border border-slate-200 focus:border-blue-600 outline-hidden bg-white p-3 rounded-lg text-sm"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-center text-sm transition-all cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Testimonial Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-slate-50/50 p-6 sm:p-8 rounded-2xl border border-slate-200/50 relative flex flex-col justify-between text-left hover:border-blue-100 transition-colors"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-blue-100 pointer-events-none" />
              
              <div>
                {/* Score Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx}
                      className={`h-4 w-4 ${
                        idx < rev.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="font-sans text-slate-600 text-sm leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author Area */}
              <div className="flex items-center justify-between border-t border-slate-200/60 pt-4 mt-auto">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-slate-900 text-sm">
                      {rev.authorName}
                    </span>
                    {rev.isVerified && (
                      <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-50 shrink-0" title="Verified review" />
                    )}
                  </div>
                  {rev.authorPrefix && (
                    <span className="text-[11px] text-slate-500 font-semibold font-sans mt-0.5">
                      {rev.authorPrefix}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-sm">
                    {rev.treatmentName}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-sans">{rev.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregated Quick Stats and Google Trust badge */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 bg-blue-50/20 p-6 rounded-2xl border border-blue-50">
          <div className="text-center sm:text-left">
            <h4 className="font-display font-bold text-slate-900 text-base">Google Ratings Trust Score</h4>
            <p className="font-sans text-xs text-slate-500 mt-0.5">Aggregated overall rating based on clinical satisfaction surveys.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-display font-extrabold text-blue-600 text-3xl sm:text-4xl">4.9 / 5.0</div>
            <div className="text-left">
              <div className="flex gap-0.5 text-yellow-400">
                <Star className="h-4.5 w-4.5 fill-yellow-400" />
                <Star className="h-4.5 w-4.5 fill-yellow-400" />
                <Star className="h-4.5 w-4.5 fill-yellow-400" />
                <Star className="h-4.5 w-4.5 fill-yellow-400" />
                <Star className="h-4.5 w-4.5 fill-yellow-400" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Over 1,200+ Reviews</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
