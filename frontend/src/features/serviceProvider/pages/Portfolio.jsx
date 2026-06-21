import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router'

import { portfolio as uploadPortfolio } from '../services/profile.api'

const MAX_IMAGES = 6

const Portfolio = () => {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [images, setImages] = useState([])
    const [previews, setPreviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files)
        const remaining = MAX_IMAGES - images.length
        const selected = files.slice(0, remaining)

        setImages(prev => [...prev, ...selected])
        selected.forEach(file => {
            const reader = new FileReader()
            reader.onload = (ev) => setPreviews(prev => [...prev, ev.target.result])
            reader.readAsDataURL(file)
        })

        e.target.value = ''
    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (images.length === 0) return
        setLoading(true)
        setError('')
        try {
            const formData = new FormData()
            images.forEach(img => formData.append('images', img))
            await uploadPortfolio(formData)
            setDone(true)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload images. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (done) {
        return (
            <div className="min-h-screen bg-slate-50">
                
                <div className="pt-20 flex items-center justify-center min-h-screen px-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 max-w-sm w-full text-center shadow-lg">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Portfolio Updated</h2>
                        <p className="text-[13px] text-slate-500 mb-6">
                            {images.length} image{images.length !== 1 ? 's' : ''} added to your portfolio.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard/profile')}
                            className="w-full h-[42px] text-[13px] font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transition-all"
                        >
                            View My Profile
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            
            <div className="pt-20 min-h-screen flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-2xl">
                    <div className="text-center mb-6">
                        <img src="/divine_capture_logo.svg" alt="DivineCapture" className="w-36 md:w-44 mx-auto" />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-lg">
                        <div className="text-center mb-6">
                            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Upload Portfolio</h1>
                            <p className="text-[13px] text-slate-500 mt-1">
                                Showcase your best work — up to {MAX_IMAGES} images
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-[13px] text-red-600 flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                                images.length >= MAX_IMAGES
                                    ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
                                    : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {images.length >= MAX_IMAGES ? (
                                <p className="text-[13px] text-slate-400">Maximum {MAX_IMAGES} images reached</p>
                            ) : (
                                <>
                                    <p className="text-[14px] font-medium text-slate-700">Click to select images</p>
                                    <p className="text-[12px] text-slate-400 mt-1">
                                        {MAX_IMAGES - images.length} slot{MAX_IMAGES - images.length !== 1 ? 's' : ''} remaining · JPG, PNG, WEBP
                                    </p>
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={images.length >= MAX_IMAGES}
                            />
                        </div>

                        {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-5">
                                {previews.map((preview, index) => (
                                    <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square">
                                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeImage(index) }}
                                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-slate-600 text-sm font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-md"
                                        >
                                            ×
                                        </button>
                                        <div className="absolute bottom-2 left-2 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                                            {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-7 pt-5 border-t border-slate-100">
                            <button
                                onClick={() => navigate(-1)}
                                className="h-[42px] px-5 text-[13px] font-medium text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                Back
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={loading || images.length === 0}
                                className="h-[42px] px-8 text-[13px] font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all shadow-md shadow-blue-500/20 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Uploading…
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        Upload {images.length > 0 ? `${images.length} Image${images.length !== 1 ? 's' : ''}` : 'Portfolio'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Portfolio