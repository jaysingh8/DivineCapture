import React from 'react'
import { useProfile } from "../hooks/useProfile"
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const PROFESSION_OPTIONS = [
    { value: "photographer", label: "Photographer" },
    { value: "videographer", label: "Videographer" },
    { value: "editor", label: "Editor" },
]

const Profile = () => {

    const { handleProfile } = useProfile()
    const navigate = useNavigate()
    const loading = useSelector((state) => state.profile.loading)

    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        professions: [],
        bio: "",
        experience: "",
        city: "",
        state: "",
        address: "",
        equipments: "",
        profileImage: "",
        pricePerHour: "",
       
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                profileImage: file
            }))
        }
    }

    const handlePortfolioImages = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                portfolioImages: files
            }))
        }
    }

    const toggleProfession = (profession) => {
        setFormData((prev) => {
            const exists = prev.professions.includes(profession)
            if (exists) {
                return { ...prev, professions: prev.professions.filter(p => p !== profession) }
            } else {
                return { ...prev, professions: [...prev.professions, profession] }
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                profession: formData.professions,
                bio: formData.bio,
                experience: Number(formData.experience),
                city: formData.city,
                state: formData.state,
                address: formData.address,
                equipments: formData.equipments.split(",").map(e => e.trim()).filter(Boolean),
                profileImage: formData.profileImage,
                pricePerHour: Number(formData.pricePerHour)
            }
            await handleProfile(payload)
            navigate("/")
        } catch (error) {
            console.error("Profile submission failed", error);
        }
    }

    const nextStep = () => {
        setStep((prev) => Math.min(prev + 1, 4))
    }

    const prevStep = () => {
        setStep((prev) => Math.max(prev - 1, 1))
    }

    const isStepValid = () => {
        if (step === 1) return formData.professions.length > 0 && formData.bio
        if (step === 2) return formData.experience && formData.city
        if (step === 3) return formData.state && formData.address && formData.equipments
        return true
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl">

                {/* Logo */}
                <div className="text-center mb-6">
                    <img
                        src="/divine_capture_logo.svg"
                        alt="DivineCapture"
                        className="w-36 md:w-44 mx-auto"
                    />
                </div>

                <div className="bg-white border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 shadow-lg shadow-[#D4AF37]/5">

                    {/* Heading */}
                    <div className="text-center mb-6">
                        <h1 className="text-xl sm:text-2xl font-semibold text-[#4E342E]">Create Your Profile</h1>
                        <p className="text-[13px] text-[#5D4037]/60 mt-1">Step {step} of 3 — Tell us about your services</p>
                    </div>

                    {/* Step Progress Indicator */}
                    <div className="flex items-center justify-between mb-8 px-2">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                {/* Step Circle */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2
                                            ${step > s
                                                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#4E342E]'
                                                : step === s
                                                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#4E342E] shadow-md shadow-[#D4AF37]/30'
                                                    : 'bg-white border-[#D4AF37]/30 text-[#5D4037]/50'
                                            }`}
                                    >
                                        {step > s ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            s
                                        )}
                                    </div>
                                    <span className={`text-[11px] mt-1.5 font-medium tracking-wide
                                        ${step >= s ? 'text-[#4E342E]' : 'text-[#5D4037]/40'}`}>
                                        {s === 1 ? 'Basic' : s === 2 ? 'Location' : 'Details'}
                                    </span>
                                </div>

                                {/* Connecting Line */}
                                {s < 3 && (
                                    <div className="flex-1 mx-3">
                                        <div className="h-[2px] rounded-full bg-[#D4AF37]/20 relative overflow-hidden">
                                            <div
                                                className={`h-full bg-[#D4AF37] transition-all duration-500 ease-out`}
                                                style={{ width: step > s ? '100%' : '0%' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* ===================== STEP 1 ===================== */}
                        {step === 1 && (
                            <div className="animate-[fadeIn_0.3s_ease-out]">
                                <div className="space-y-5">
                                    {/* Profession — Multi-select chips */}
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-2 tracking-wide">Profession <span className="text-[#D4AF37]">*</span></label>
                                        <div className="flex flex-wrap gap-2.5">
                                            {PROFESSION_OPTIONS.map((p) => {
                                                const selected = formData.professions.includes(p.value)
                                                return (
                                                    <button
                                                        key={p.value}
                                                        type="button"
                                                        onClick={() => toggleProfession(p.value)}
                                                        className={`px-4 py-2.5 text-[13px] font-medium rounded-[10px] border-2 transition-all duration-200 cursor-pointer
                                                            ${selected
                                                                ? 'bg-[#D4AF37] border-[#D4AF37] text-[#4E342E] shadow-sm shadow-[#D4AF37]/30'
                                                                : 'bg-white border-[#D4AF37]/25 text-[#5D4037]/70 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5'
                                                            }`}
                                                    >
                                                        {p.label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        {formData.professions.length > 0 && (
                                            <p className="text-[11px] text-[#5D4037]/50 mt-2">
                                                Selected: {formData.professions.map(p => PROFESSION_OPTIONS.find(o => o.value === p)?.label).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                    {/* Bio */}
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-1.5 tracking-wide">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            maxLength={500}
                                            placeholder="Tell us about yourself and your experience... (max 500 characters)"
                                            required
                                            className="w-full px-3 sm:px-4 py-3 text-[14px] rounded-[10px] border border-[#D4AF37]/30 outline-none bg-white text-[#4E342E] placeholder-[#5D4037]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all duration-200 resize-none"
                                        />
                                        <p className="text-[11px] text-[#5D4037]/40 mt-1 text-right">{formData.bio.length}/500</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===================== STEP 2 ===================== */}
                        {step === 2 && (
                            <div className="animate-[fadeIn_0.3s_ease-out]">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-1.5 tracking-wide">Experience (Years)</label>
                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            min="0"
                                            step="0.5"
                                            placeholder="e.g. 5"
                                            required
                                            className="w-full h-[44px] px-3 sm:px-4 text-[14px] rounded-[10px] border border-[#D4AF37]/30 outline-none bg-white text-[#4E342E] placeholder-[#5D4037]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-1.5 tracking-wide">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter your city"
                                            required
                                            className="w-full h-[44px] px-3 sm:px-4 text-[14px] rounded-[10px] border border-[#D4AF37]/30 outline-none bg-white text-[#4E342E] placeholder-[#5D4037]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all duration-200"
                                        />
                                    </div>
                                    {/* Price Per Hour — extra field */}
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-1.5 tracking-wide">Price Per Hour ($)</label>
                                        <input
                                            type="number"
                                            name="pricePerHour"
                                            value={formData.pricePerHour}
                                            onChange={handleChange}
                                            min="0"
                                            step="1"
                                            placeholder="e.g. 50"
                                            className="w-full h-[44px] px-3 sm:px-4 text-[14px] rounded-[10px] border border-[#D4AF37]/30 outline-none bg-white text-[#4E342E] placeholder-[#5D4037]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===================== STEP 3 ===================== */}
                        {step === 3 && (
                            <div className="animate-[fadeIn_0.3s_ease-out]">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-1.5 tracking-wide">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Enter your state"
                                            required
                                            className="w-full h-[44px] px-3 sm:px-4 text-[14px] rounded-[10px] border border-[#D4AF37]/30 outline-none bg-white text-[#4E342E] placeholder-[#5D4037]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-1.5 tracking-wide">Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="Enter your full address"
                                            required
                                            className="w-full px-3 sm:px-4 py-3 text-[14px] rounded-[10px] border border-[#D4AF37]/30 outline-none bg-white text-[#4E342E] placeholder-[#5D4037]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all duration-200 resize-none"
                                        />
                                    </div>
                                    {/* Equipments */}
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-1.5 tracking-wide">Equipments <span className="text-[#D4AF37]">*</span></label>
                                        <textarea
                                            name="equipments"
                                            value={formData.equipments}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder='Comma-separated list (e.g. Canon EOS R5, DJI Mavic 3, Godox Flash)'
                                            required
                                            className="w-full px-3 sm:px-4 py-3 text-[14px] rounded-[10px] border border-[#D4AF37]/30 outline-none bg-white text-[#4E342E] placeholder-[#5D4037]/30 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all duration-200 resize-none"
                                        />
                                    </div>
                                    {/* Profile Image */}
                                    <div>
                                        <label className="block text-[12px] font-medium text-[#5D4037]/70 mb-1.5 tracking-wide">Profile Image</label>
                                        <input
                                            type="file"
                                            name="profileImage"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="w-full h-[44px] px-3 sm:px-4 text-[14px] rounded-[10px] border border-[#D4AF37]/30 outline-none bg-white text-[#4E342E] file:mr-3 file:py-1.5 file:px-3 file:rounded-[8px] file:border-0 file:text-[12px] file:font-semibold file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20 transition-all duration-200 cursor-pointer"
                                        />
                                    </div>
                                    
                                   
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#D4AF37]/10">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="h-[42px] px-6 text-[13px] font-medium text-[#5D4037] rounded-[10px] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all duration-200 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isStepValid()}
                                    className="h-[42px] px-8 text-[13px] font-semibold rounded-[10px] bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#C5A028] hover:to-[#B89620] text-[#4E342E] transition-all duration-200 shadow-md shadow-[#D4AF37]/20 hover:shadow-lg hover:shadow-[#D4AF37]/30 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
                                >
                                    Continue
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="h-[42px] px-8 text-[13px] font-semibold rounded-[10px] bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#C5A028] hover:to-[#B89620] text-[#4E342E] transition-all duration-200 shadow-md shadow-[#D4AF37]/20 hover:shadow-lg hover:shadow-[#D4AF37]/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                            Complete
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                    </form>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default Profile