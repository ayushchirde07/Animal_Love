import React, { useMemo, useState, useEffect, Suspense, lazy } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PawPrint,
  HeartPulse,
  FileText,
  ImagePlus,
  Video,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Dog,
  Cat,
  Bird,
  HelpCircle,
} from 'lucide-react'
const MapView = lazy(() => import('../components/MapView'))
import { createReport } from '../services/reportService'

const animalTypes = ['Dog', 'Cat', 'Cow', 'Horse', 'Bird', 'Monkey', 'Goat', 'Other']
const conditions = [
  'Accident',
  'Wound',
  'Fracture',
  'Skin Disease',
  'Eye Infection',
  'Infection',
  'Weakness',
  'Malnutrition',
  'Unable to Walk',
  'Bleeding',
  'Unknown',
  'Other',
]
const severities = ['Low', 'Medium', 'High', 'Critical']
const steps = [
  'Animal Type',
  'Condition',
  'Description',
  'Uploads',
  'Location',
  'Review',
]

export default function AnimalReport() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [reportId] = useState('AG-2026-0005')
  const [form, setForm] = useState({
    animalType: 'Dog',
    otherAnimalName: '',
    condition: 'Accident',
    severity: 'High',
    description: '',
    images: [],
    video: null,
    latitude: '',
    longitude: '',
    locationNote: '',
  })
  const [geoError, setGeoError] = useState('')

  const previewImages = useMemo(
    () => form.images.map((file) => URL.createObjectURL(file)),
    [form.images],
  )

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleImageUpload = (event) => {
    setForm((current) => ({
      ...current,
      images: Array.from(event.target.files).slice(0, 4),
    }))
  }

  const handleVideoUpload = (event) => {
    setForm((current) => ({
      ...current,
      video: event.target.files[0] || null,
    }))
  }

  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported in this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoError('')
        setForm((current) => ({
          ...current,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
        }))
      },
      () => {
        setGeoError('Unable to retrieve your location. Please enter manually.')
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  // for map-based selection
  const [mapPosition, setMapPosition] = useState(null)

  useEffect(() => {
    if (form.latitude && form.longitude) {
      setMapPosition([Number(form.latitude), Number(form.longitude)])
    }
  }, [form.latitude, form.longitude])

  const [geocodingLoading, setGeocodingLoading] = useState(false)

  useEffect(() => {
    // when mapPosition changes, attempt reverse geocoding to populate location note
    const doReverse = async () => {
      if (!mapPosition) return
      const [lat, lon] = mapPosition
      setGeocodingLoading(true)
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
          lat,
        )}&lon=${encodeURIComponent(lon)}&zoom=18&addressdetails=1`
        const resp = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        if (!resp.ok) throw new Error('Reverse geocoding failed')
        const data = await resp.json()
        const display = data.display_name || ''
        if (display) {
          setForm((current) => ({ ...current, locationNote: display }))
        }
      } catch (e) {
        console.error('Reverse geocoding error', e)
      } finally {
        setGeocodingLoading(false)
      }
    }

    doReverse()
  }, [mapPosition])

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    // Prevent accidental auto-submits (e.g. hitting Enter on mobile keyboard) before the final step
    if (step !== steps.length - 1) {
      return
    }

    setSubmitted(true)

    const finalAnimalType = form.animalType === 'Other' && form.otherAnimalName
      ? form.otherAnimalName
      : form.animalType;

    try {
      const base64Images = await Promise.all(
        form.images.map(file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        }))
      );

      await createReport({
        animalType: finalAnimalType,
        condition: form.condition,
        severity: form.severity,
        description: form.description,
        images: base64Images,
        video: null,
        latitude: form.latitude,
        longitude: form.longitude,
        locationNote: form.locationNote,
      })

      setTimeout(() => navigate('/citizen/dashboard'), 1800)
    } catch (error) {
      console.error('Report submission failed:', error)
      setSubmitted(false)
    }
  }

  return (
    <main className="report-page">
      <section className="report-header">
        <div>
          <p className="section-meta">Citizen report</p>
          <h1>Submit a new animal rescue request</h1>
          <p className="dashboard-copy">
            Complete the report with condition details, media, and location so rescue teams can act fast.
          </p>
        </div>
        <Link to="/citizen/dashboard" className="button button-secondary">
          Back to dashboard
        </Link>
      </section>

      <section className="steps-panel">
        {steps.map((label, index) => (
          <div key={label} className={`step-pill ${index === step ? 'active' : ''}`}>
            <span>{index + 1}</span>
            <p>{label}</p>
          </div>
        ))}
      </section>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="report-card">
          {step === 0 && (
            <div className="form-step">
              <h2>Choose the animal type</h2>
              <div className="button-group">
                {animalTypes.map((type) => {
                  let Icon = PawPrint;
                  if (type === 'Dog') Icon = Dog;
                  else if (type === 'Cat') Icon = Cat;
                  else if (type === 'Bird') Icon = Bird;
                  else if (type === 'Other') Icon = HelpCircle;

                  return (
                    <button
                      key={type}
                      type="button"
                      className={`pill-button ${form.animalType === type ? 'selected' : ''}`}
                      onClick={() => setForm((current) => ({ ...current, animalType: type }))}
                    >
                      <Icon size={16} /> {type}
                    </button>
                  );
                })}
              </div>
              {form.animalType === 'Other' && (
                <div style={{ marginTop: '1.5rem' }}>
                  <label>
                    Specify animal name
                    <input
                      type="text"
                      placeholder="e.g. Rabbit, Turtle"
                      value={form.otherAnimalName}
                      onChange={handleChange('otherAnimalName')}
                      required
                    />
                  </label>
                  {!form.otherAnimalName.trim() && (
                    <p className="form-error" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      Please write the animal type to continue.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="form-step">
              <h2>Condition and severity</h2>
              <label>
                Condition
                <select value={form.condition} onChange={handleChange('condition')}>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Severity
                <select value={form.severity} onChange={handleChange('severity')}>
                  {severities.map((severity) => (
                    <option key={severity} value={severity}>
                      {severity}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Tell us more about the situation</h2>
              <label>
                Description
                <textarea
                  rows="6"
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Describe the animal condition, behavior, and surroundings."
                  required
                />
              </label>
              {!form.description.trim() && (
                <p className="form-error" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Please provide a description of the condition.
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>Upload images and optional video</h2>
              <label className="upload-label">
                <div>
                  <ImagePlus size={18} /> Add up to 4 images
                </div>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
              </label>
              <label className="upload-label">
                <div>
                  <Video size={18} /> Optional video
                </div>
                <input type="file" accept="video/*" onChange={handleVideoUpload} />
              </label>
              
              {form.images.length === 0 && (
                <p className="form-error" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Please upload at least one photo to continue.
                </p>
              )}

              <div className="upload-preview">
                {previewImages.length ? (
                  previewImages.map((src, index) => (
                    <img key={index} src={src} alt={`Preview ${index + 1}`} />
                  ))
                ) : (
                  <p>No images selected yet</p>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="form-step">
              <h2>Location details</h2>
              <p className="subtext">
                Use browser geolocation or enter latitude/longitude manually.
              </p>
              <button type="button" className="button button-secondary" onClick={handleGeoLocate}>
                <MapPin size={18} /> Use current location
              </button>
              {geoError && <p className="form-error">{geoError}</p>}
              <div className="location-grid">
                <label>
                  Latitude
                  <input
                    type="text"
                    value={form.latitude}
                    onChange={handleChange('latitude')}
                    placeholder="e.g. 40.712776"
                    required
                  />
                </label>
                <label>
                  Longitude
                  <input
                    type="text"
                    value={form.longitude}
                    onChange={handleChange('longitude')}
                    placeholder="e.g. -74.005974"
                    required
                  />
                </label>
              </div>
              <div style={{ marginTop: 12 }}>
                <p className="subtext">Or click on the map to set the report location.</p>
                <Suspense fallback={<div>Loading map…</div>}>
                  <MapView
                    position={mapPosition}
                    setPosition={(pos) => {
                      setMapPosition(pos)
                      setForm((current) => ({ ...current, latitude: String(pos[0]), longitude: String(pos[1]) }))
                    }}
                    zoom={13}
                    height="240px"
                  />
                </Suspense>
                {geocodingLoading ? (
                  <p className="subtext">Resolving address…</p>
                ) : (
                  form.locationNote && <p className="subtext">Address: {form.locationNote}</p>
                )}
              </div>
              <label>
                Location note
                <input
                  type="text"
                  value={form.locationNote}
                  onChange={handleChange('locationNote')}
                  placeholder="Add nearby landmarks or street names"
                />
              </label>
              
              {(!form.latitude || !form.longitude || !form.locationNote.trim()) && (
                <p className="form-error" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Please fill in all location details (Latitude, Longitude, and Location note).
                </p>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="form-step">
              <h2>Review and submit</h2>
              <div className="review-grid">
                <div className="review-item">
                  <p className="review-label">Report ID</p>
                  <p>{reportId}</p>
                </div>
                <div className="review-item">
                  <p className="review-label">Animal type</p>
                  <p>{form.animalType === 'Other' && form.otherAnimalName ? form.otherAnimalName : form.animalType}</p>
                </div>
                <div className="review-item">
                  <p className="review-label">Condition</p>
                  <p>{form.condition}</p>
                </div>
                <div className="review-item">
                  <p className="review-label">Severity</p>
                  <p>{form.severity}</p>
                </div>
                <div className="review-item review-full">
                  <p className="review-label">Description</p>
                  <p>{form.description || 'No description provided yet.'}</p>
                </div>
                <div className="review-item review-full">
                  <p className="review-label">Location</p>
                  <p>
                    {form.latitude}, {form.longitude}
                    {form.locationNote ? ` · ${form.locationNote}` : ''}
                  </p>
                </div>
                <div className="review-item review-full">
                  <p className="review-label">Media</p>
                  <p>{form.images.length} images, {form.video ? 'video attached' : 'no video'}</p>
                </div>
              </div>
              <p className="subtext">
                You can go back to adjust any field before submitting the rescue request.
              </p>
            </div>
          )}
        </div>

        <div className="report-actions">
          <button
            type="button"
            className="button button-secondary"
            disabled={step === 0 || submitted}
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
          >
            <ArrowLeft size={18} /> Back
          </button>
          {step < steps.length - 1 ? (
            <button
              key="next"
              type="button"
              className="button button-primary"
              disabled={
                (step === 0 && form.animalType === 'Other' && !form.otherAnimalName.trim()) ||
                (step === 2 && !form.description.trim()) ||
                (step === 3 && form.images.length === 0) ||
                (step === 4 && (!form.latitude || !form.longitude || !form.locationNote.trim()))
              }
              onClick={(e) => {
                e.preventDefault();
                setStep((current) => Math.min(current + 1, steps.length - 1))
              }}
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button key="submit" type="submit" className="button button-primary" disabled={submitted}>
              {submitted ? 'Submitting…' : 'Submit report'}
            </button>
          )}
        </div>
      </form>

      {submitted && (
        <motion.div
          className="submit-toast"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CheckCircle2 size={24} />
          <div>
            <p className="toast-title">Report submitted</p>
            <p>Your report {reportId} has been registered successfully.</p>
          </div>
        </motion.div>
      )}
    </main>
  )
}
