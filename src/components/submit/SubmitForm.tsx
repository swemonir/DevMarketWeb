import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Select } from '../shared/Select';
import { Card } from '../shared/Card';
import { Modal } from '../shared/Modal';
import { Upload, Check, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService, API_BASE_URL } from '../../services/api';

export function SubmitForm() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'web-development',
    tags: '',
    platform: 'Web',
    websiteUrl: '',
    appStoreUrl: '',
    playStoreUrl: '',
    thumbnail: null as string | null, // URL from backend
    screenshots: [] as string[], // URLs from backend
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

  const calculateCompletion = () => {
    let completed = 0;
    const totalFields = 8;

    if (formData.title.length >= 3) completed++;
    if (formData.description.length >= 10) completed++;
    if (formData.category) completed++;
    if (formData.platform) completed++;
    if (formData.platform === 'Web' ? formData.websiteUrl : (formData.appStoreUrl || formData.playStoreUrl)) completed++;
    if (formData.tags.split(',').filter(t => t.trim()).length > 0) completed++;
    if (formData.thumbnail || formData.screenshots.length > 0) completed++;
    if (!formData.isForSale || (formData.price && formData.contactEmail)) completed++;

    return Math.round((completed / totalFields) * 100);
  };

  const isComplete = calculateCompletion() === 100;

  const saveProjectData = async () => {
    const payload = {
      basicInfo: {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      },
      platform: {
        type: formData.platform,
        urls: {
          website: formData.websiteUrl || undefined,
          appStore: formData.appStoreUrl || undefined,
          playStore: formData.playStoreUrl || undefined,
        }
      },
      marketplace: {
        isForSale: formData.isForSale,
        price: formData.isForSale ? parseFloat(formData.price) : 0,
        contact: {
          email: formData.contactEmail,
          whatsapp: formData.whatsapp || undefined
        }
      },
      media: {
        thumbnail: formData.thumbnail,
        screenshots: formData.screenshots
      }
    };

    try {
      if (projectId) {
        await projectService.updateProject(projectId, payload);
      } else {
        const response = await projectService.createProject(payload);
        if (response.data?._id) {
          setProjectId(response.data._id);
        }
      }
    } catch (error: any) {
      console.error('Failed to save project progress:', error);
      toast.error('Failed to save progress. Please check your network.');
      throw error;
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (formData.title.length < 3) return toast.error('Title too short');
      if (formData.description.length < 10) return toast.error('Description too short');
    }

    if (step === 2) {
      setLoading(true);
      try {
        await saveProjectData();
      } catch (e) {
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;

    setLoading(true);
    try {
      const response = await projectService.uploadMedia(projectId, [file]);
      if (response.success) {
        // Assuming the backend returns the updated media object or list of files
        // For simplicity, we'll use the first one as thumbnail if uploaded from thumbnail field
        const newPath = response.data.newFiles[0];
        updateForm('thumbnail', newPath);
        toast.success('Thumbnail uploaded!');
      }
    } catch (error) {
      toast.error('Failed to upload thumbnail');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !projectId) return;

    setLoading(true);
    try {
      const response = await projectService.uploadMedia(projectId, files);
      if (response.success) {
        updateForm('screenshots', [...formData.screenshots, ...response.data.newFiles]);
        toast.success(`${files.length} screenshots uploaded!`);
      }
    } catch (error) {
      toast.error('Failed to upload screenshots');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      await saveProjectData(); // Final save
      await projectService.submitProject(projectId);
      toast.success('Project submitted for review!');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to submit for review');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const handleCancelSubmit = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      await saveProjectData(); // Save as draft/pending
      toast.success('Project saved as draft');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  const steps = [
    { id: 1, name: 'Basic Info' },
    { id: 2, name: 'Platform' },
    { id: 3, name: 'Media' },
    { id: 4, name: 'Marketplace' },
    { id: 5, name: 'Review' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map(s => (
            <div key={s.id} className={`text-xs font-medium ${step >= s.id ? 'text-blue-400' : 'text-gray-600'}`}>
              {s.name}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-300 ease-out" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
      </div>

      <Card className="p-8">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
            <Input
              label="Project Title"
              placeholder="e.g. DevNexus Dashboard"
              value={formData.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('title', e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
              <textarea
                className="w-full bg-[#1a1f35] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 p-3 h-32"
                placeholder="Describe your project (min 10 chars)..."
                value={formData.description}
                onChange={e => updateForm('description', e.target.value)}
              />
            </div>

            <Select
              label="Category"
              value={formData.category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => updateForm('category', e.target.value)}
              options={[
                { value: 'web-development', label: 'Web Development' },
                { value: 'mobile-development', label: 'Mobile Development' },
                { value: 'ai-tools', label: 'AI Tools' },
                { value: 'design', label: 'Design' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'data-science', label: 'Data Science' },
                { value: 'writing', label: 'Writing' },
                { value: 'other', label: 'Other' }
              ]}
            />

            <Input
              label="Tags (comma separated)"
              placeholder="react, typescript, dashboard"
              value={formData.tags}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('tags', e.target.value)}
            />
          </div>
        )}

        {/* Step 2: Platform Details */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Platform Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Platform Type</label>
              <div className="flex gap-4">
                {['Web', 'Mobile'].map(type => (
                  <label key={type} className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all ${formData.platform === type ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-500'}`}>
                    <input type="radio" className="hidden" checked={formData.platform === type} onChange={() => updateForm('platform', type)} />
                    <div className="text-center font-bold text-white">{type} App</div>
                  </label>
                ))}
              </div>
            </div>

            {formData.platform === 'Web' ? (
              <Input label="Website URL" placeholder="https://example.com" value={formData.websiteUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('websiteUrl', e.target.value)} />
            ) : (
              <>
                <Input label="App Store Link (Optional)" placeholder="https://apps.apple.com/..." value={formData.appStoreUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('appStoreUrl', e.target.value)} />
                <Input label="Play Store Link (Optional)" placeholder="https://play.google.com/..." value={formData.playStoreUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('playStoreUrl', e.target.value)} />
              </>
            )}
          </div>
        )}

        {/* Step 3: Media Upload */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Media Upload</h2>

            <input type="file" className="hidden" ref={fileInputRef} onChange={handleThumbnailUpload} accept="image/*" />
            <input type="file" className="hidden" ref={screenshotInputRef} onChange={handleScreenshotUpload} accept="image/*" multiple />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer group"
            >
              {formData.thumbnail ? (
                <div className="relative aspect-video max-w-sm mx-auto overflow-hidden rounded-lg">
                  <img src={formData.thumbnail.startsWith('/uploads') ? `${API_BASE_URL}${formData.thumbnail}` : formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-500 mx-auto mb-4" />
                  <p className="text-white font-medium">Click to upload thumbnail</p>
                  <p className="text-sm text-gray-500 mt-1">1280x720 recommended</p>
                </>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Screenshots</h3>
                <Button variant="outline" size="sm" onClick={() => screenshotInputRef.current?.click()}>
                  Add Screenshots
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {formData.screenshots.map((url, i) => (
                  <div key={i} className="aspect-video bg-[#1a1f35] rounded-lg border border-gray-700 overflow-hidden">
                    <img src={url.startsWith('/uploads') ? `${API_BASE_URL}${url}` : url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {formData.screenshots.length === 0 && (
                  <div className="aspect-video bg-[#1a1f35] rounded-lg border border-gray-700 flex items-center justify-center border-dashed">
                    <span className="text-gray-600 text-xs text-center px-1">No screenshots uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Marketplace Settings */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Marketplace Settings</h2>
            <div className="flex items-center justify-between p-4 bg-[#1a1f35] rounded-lg border border-gray-700">
              <div>
                <h3 className="text-white font-medium">List for Sale?</h3>
                <p className="text-sm text-gray-400">Allow others to buy this project or source code</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={formData.isForSale} onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('isForSale', e.target.checked)} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {formData.isForSale && (
              <div className="space-y-4 pt-4 border-t border-gray-800">
                <Input label="Price (USD)" type="number" placeholder="29.99" value={formData.price} onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('price', e.target.value)} />
                <Input label="Contact Email" type="email" placeholder="sales@example.com" value={formData.contactEmail} onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('contactEmail', e.target.value)} />
                <Input label="WhatsApp Number (Optional)" placeholder="+1 234 567 8900" value={formData.whatsapp} onChange={(e: ChangeEvent<HTMLInputElement>) => updateForm('whatsapp', e.target.value)} />
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">Review & Submit</h2>

            <div className="flex items-center gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-blue-400">Project Completion</span>
                  <span className="text-sm font-bold text-blue-400">{calculateCompletion()}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${calculateCompletion()}%` }} />
                </div>
              </div>
              {calculateCompletion() < 100 && (
                <div className="text-gray-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="bg-[#1a1f35] rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">{formData.title || 'Untitled Project'}</h3>
              <p className="text-gray-400 mb-4">{formData.description || 'No description provided.'}</p>

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
                  <span className="text-gray-500">Media:</span>
                  <span className={`${formData.thumbnail ? 'text-green-400' : 'text-yellow-500'} ml-2`}>
                    {formData.thumbnail ? 'Uploaded' : 'Missing Thumbnail'}
                  </span>
                </div>
                {formData.isForSale && (
                  <div>
                    <span className="text-gray-500">Price:</span>
                    <span className="text-green-400 ml-2 font-bold">${formData.price}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1 || loading} className={step === 1 ? 'invisible' : ''}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 5 ? (
            <Button onClick={handleNext} isLoading={loading}>
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setShowConfirmModal(true)}
              isLoading={loading}
              disabled={!isComplete}
              className={`${isComplete ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-700 cursor-not-allowed'}`}
            >
              Done
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Finalize Project"
      >
        <div className="space-y-6">
          <p className="text-gray-300">
            Your project is 100% complete. Do you want to submit it for review now or save it to your projects list?
          </p>

          <div className="flex flex-col gap-3">
            <Button fullWidth onClick={handleConfirmSubmit} isLoading={loading}>
              Confirm & Submit for Review
            </Button>
            <Button fullWidth variant="outline" onClick={handleCancelSubmit} isLoading={loading}>
              Cancel (Save to My Projects)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}