import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { Card } from '../shared/Card';
import { Upload, X, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
export function SubmitForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'AI Tools',
    tags: '',
    platform: 'Web',
    websiteUrl: '',
    appStoreUrl: '',
    playStoreUrl: '',
    thumbnail: null as File | null,
    screenshots: [] as File[],
    isForSale: false,
    price: '',
    contactEmail: '',
    whatsapp: ''
  });
  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleNext = () => {
    // Basic validation per step could go here
    if (step < 5) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Project submitted successfully!');
      navigate('/profile');
    }, 2000);
  };
  const steps = [{
    id: 1,
    name: 'Basic Info'
  }, {
    id: 2,
    name: 'Platform'
  }, {
    id: 3,
    name: 'Media'
  }, {
    id: 4,
    name: 'Marketplace'
  }, {
    id: 5,
    name: 'Review'
  }];
  return <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map(s => <div key={s.id} className={`text-xs font-medium ${step >= s.id ? 'text-blue-400' : 'text-gray-600'}`}>
              {s.name}
            </div>)}
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-300 ease-out" style={{
          width: `${step / 5 * 100}%`
        }} />
        </div>
      </div>

      <Card className="p-8">
        {/* Step 1: Basic Info */}
        {step === 1 && <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">
              Basic Information
            </h2>
            <Input label="Project Title" placeholder="e.g. DevNexus Dashboard" value={formData.title} onChange={e => updateForm('title', e.target.value)} />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description
              </label>
              <textarea className="w-full bg-[#1a1f35] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-3 h-32" placeholder="Describe your project..." value={formData.description} onChange={e => updateForm('description', e.target.value)} />
            </div>

            <Select label="Category" value={formData.category} onChange={e => updateForm('category', e.target.value)} options={[{
          value: 'AI Tools',
          label: 'AI Tools'
        }, {
          value: 'Productivity',
          label: 'Productivity'
        }, {
          value: 'Social',
          label: 'Social'
        }, {
          value: 'Entertainment',
          label: 'Entertainment'
        }, {
          value: 'Education',
          label: 'Education'
        }]} />

            <Input label="Tags (comma separated)" placeholder="react, typescript, dashboard" value={formData.tags} onChange={e => updateForm('tags', e.target.value)} />
          </div>}

        {/* Step 2: Platform Details */}
        {step === 2 && <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">
              Platform Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Platform Type
              </label>
              <div className="flex gap-4">
                <label className={`
                  flex-1 p-4 rounded-lg border cursor-pointer transition-all
                  ${formData.platform === 'Web' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'}
                `}>
                  <input type="radio" className="hidden" checked={formData.platform === 'Web'} onChange={() => updateForm('platform', 'Web')} />
                  <div className="text-center font-bold text-white">
                    Web App
                  </div>
                </label>
                <label className={`
                  flex-1 p-4 rounded-lg border cursor-pointer transition-all
                  ${formData.platform === 'Mobile' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'}
                `}>
                  <input type="radio" className="hidden" checked={formData.platform === 'Mobile'} onChange={() => updateForm('platform', 'Mobile')} />
                  <div className="text-center font-bold text-white">
                    Mobile App
                  </div>
                </label>
              </div>
            </div>

            {formData.platform === 'Web' ? <Input label="Website URL" placeholder="https://example.com" value={formData.websiteUrl} onChange={e => updateForm('websiteUrl', e.target.value)} /> : <>
                <Input label="App Store Link (Optional)" placeholder="https://apps.apple.com/..." value={formData.appStoreUrl} onChange={e => updateForm('appStoreUrl', e.target.value)} />
                <Input label="Play Store Link (Optional)" placeholder="https://play.google.com/..." value={formData.playStoreUrl} onChange={e => updateForm('playStoreUrl', e.target.value)} />
              </>}
          </div>}

        {/* Step 3: Media Upload */}
        {step === 3 && <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Media Upload</h2>

            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-4" />
              <p className="text-white font-medium">
                Click to upload thumbnail
              </p>
              <p className="text-sm text-gray-500 mt-1">1280x720 recommended</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <div key={i} className="aspect-video bg-[#1a1f35] rounded-lg border border-gray-700 flex items-center justify-center">
                  <span className="text-gray-600 text-xs">Screenshot {i}</span>
                </div>)}
            </div>
          </div>}

        {/* Step 4: Marketplace Settings */}
        {step === 4 && <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">
              Marketplace Settings
            </h2>

            <div className="flex items-center justify-between p-4 bg-[#1a1f35] rounded-lg border border-gray-700">
              <div>
                <h3 className="text-white font-medium">List for Sale?</h3>
                <p className="text-sm text-gray-400">
                  Allow others to buy this project or source code
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.isForSale} onChange={e => updateForm('isForSale', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {formData.isForSale && <div className="space-y-4 pt-4 border-t border-gray-800">
                <Input label="Price (USD)" type="number" placeholder="29.99" value={formData.price} onChange={e => updateForm('price', e.target.value)} />
                <Input label="Contact Email" type="email" placeholder="sales@example.com" value={formData.contactEmail} onChange={e => updateForm('contactEmail', e.target.value)} />
                <Input label="WhatsApp Number (Optional)" placeholder="+1 234 567 8900" value={formData.whatsapp} onChange={e => updateForm('whatsapp', e.target.value)} />
              </div>}
          </div>}

        {/* Step 5: Review */}
        {step === 5 && <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">
              Review & Submit
            </h2>

            <div className="bg-[#1a1f35] rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">
                {formData.title || 'Untitled Project'}
              </h3>
              <p className="text-gray-400 mb-4">
                {formData.description || 'No description provided.'}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="text-white ml-2">{formData.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Platform:</span>
                  <span className="text-white ml-2">{formData.platform}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="text-yellow-500 ml-2">Pending Review</span>
                </div>
                {formData.isForSale && <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="text-green-400 ml-2 font-bold">
                      ${formData.price}
                    </span>
                  </div>}
              </div>
            </div>
          </div>}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1} className={step === 1 ? 'invisible' : ''}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 5 ? <Button onClick={handleNext}>
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button> : <Button onClick={handleSubmit} isLoading={loading} className="bg-green-600 hover:bg-green-500">
              Submit Project
              <Check className="w-4 h-4 ml-2" />
            </Button>}
        </div>
      </Card>
    </div>;
}