import React, { useState, useRef } from 'react'
import { useProfile } from "../hooks/useProfile"
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'

const MAX_IMAGES = 3

const Portfolio = () => {
    const { handlePortfolio } = useProfile()
    const navigate = useNavigate()
    const loading = useSelector((state) => state.profile.loading)
    const fileInputRef = useRef(null)

    const [images, setImages] = useState([])
    const [previews, setPreviews] = useState([])
    const [error, setError] = useState('')

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)
        const remaining = MAX_IMAGES - images.length

        if (files.length > remaining) {
            setError(`You can only upload up to ${remaining} more image(s)`)
            return
        }

        setError('')

        const newImages = [...images, ...files].slice(0, MAX_IMAGES)
        setImages(newImages)

        // Generate previews
        const newPreviews = newImages.map((file) => URL.createObjectURL(file))
        setPreviews(newPreviews)
    }

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)

        // Revoke old object URL to free memory
        URL.revokeObjectURL(previews[index])

        setImages(newImages)
        setPreviews(newPreviews)
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (images.length === 0) {
            setError('Please select at least one image')
            return
        }

        try {
            await handlePortfolio({ images })
            navigate('/')
        } catch (error) {
            console.error('Portfolio upload failed', error)
            setError('Upload failed. Please try again.')
        }
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
                        <h1 className="text-xl sm:text-2xl font-semibold text-[#4E342E]">Upload Portfolio</h1>
                        <p className="text-[13px] text-[#5D4037]/60 mt-1">Showcase your work — up to {MAX_IMAGES} images</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Upload Area */}
                        <div className="space-y-4">
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            {/* Drop zone / Upload button */}
                            {images.length < MAX_IMAGES && (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-8 text-center cursor-pointer hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/5 transition-all duration-200"
                                >
                                    <svg className="w-10 h-10 mx-auto text-[#D4AF37]/50 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-[14px] text-[#5D4037]/70 font-medium">
                                        Click to select images
                                    </p>
                                    <p className="text-[12px] text-[#5D4037]/40 mt-1">
                                        {MAX_IMAGES - images.length} slot(s) remaining
                                    </p>
                                </div>
                            )}

                            {/* Image Previews */}
                            {previews.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {previews.map((preview, index) => (
                                        <div key={index} className="relative group rounded-xl overflow-hidden border border-[#D4AF37]/20 bg-[#FAF7F2]">
                                            <img
                                                src={preview}
                                                alt={`Portfolio ${index + 1}`}
                                                className="w-full h-40 object-cover"
                                            />
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-lg"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            {/* Index badge */}
                                            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#D4AF37] text-[#4E342E] text-[11px] font-bold flex items-center justify-center shadow-md">
                                                {index + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Error message */}
                            {error && (
                                <p className="text-[13px] text-red-500 text-center bg-red-50 py-2 px-4 rounded-lg">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#D4AF37]/10">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="h-[42px] px-6 text-[13px] font-medium text-[#5D4037] rounded-[10px] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all duration-200 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>

                            <button
                                type="submit"
                                disabled={loading || images.length === 0}
                                className="h-[42px] px-8 text-[13px] font-semibold rounded-[10px] bg-gradient-to-r from-[#D4AF37] to-[#C5A028] hover:from-[#C5A028] hover:to-[#B89620] text-[#4E342E] transition-all duration-200 shadow-md shadow-[#D4AF37]/20 hover:shadow-lg hover:shadow-[#D4AF37]/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        Upload
                                    </>
                                )}
                            </button>
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

export default Portfolio