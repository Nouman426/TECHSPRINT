import React, { useState } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2, DollarSign, Clock, Layers } from 'lucide-react';
import { Service, ServiceCategory, PricingType, WorkMode } from '../../types';
import { useDatabase } from '../../context/DatabaseContext';

interface ServiceManagerProps {
  professionalUid: string;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({ professionalUid }) => {
  const { getServicesByUid, addService, updateService, deleteService } = useDatabase();
  const services = getServicesByUid(professionalUid);

  const [isAdding, setIsAdding] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Finance');
  const [pricingType, setPricingType] = useState<PricingType>('hourly');
  const [rate, setRate] = useState<number>(2500);
  const [duration, setDuration] = useState('1 Hour Session');
  const [deliveryModes, setDeliveryModes] = useState<WorkMode[]>(['online']);

  const categories: ServiceCategory[] = [
    'Finance', 'Engineering', 'Technology', 'Teaching', 
    'Career Mentoring', 'Human Resources', 'Business Management', 'Project Advisory', 'Training'
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    if (editingServiceId) {
      updateService(editingServiceId, {
        title,
        description,
        category,
        pricingType,
        hourlyRate: pricingType === 'hourly' ? rate : undefined,
        fixedPrice: pricingType === 'fixed' ? rate : undefined,
        duration,
        deliveryModes
      });
      setEditingServiceId(null);
    } else {
      addService({
        professionalUid,
        title,
        description,
        category,
        pricingType,
        hourlyRate: pricingType === 'hourly' ? rate : undefined,
        fixedPrice: pricingType === 'fixed' ? rate : undefined,
        duration,
        deliveryModes,
        activeStatus: true
      });
      setIsAdding(false);
    }

    // Reset form
    setTitle('');
    setDescription('');
    setRate(2500);
  };

  const startEdit = (s: Service) => {
    setEditingServiceId(s.serviceId);
    setTitle(s.title);
    setDescription(s.description);
    setCategory(s.category);
    setPricingType(s.pricingType);
    setRate(s.hourlyRate || s.fixedPrice || 2500);
    setDuration(s.duration);
    setDeliveryModes(s.deliveryModes);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Manage Your Services</h3>
          <p className="text-xs text-slate-500">Create hourly consulting packages or fixed project offerings.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => { setIsAdding(true); setEditingServiceId(null); setTitle(''); setDescription(''); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-900">
            {editingServiceId ? 'Edit Service' : 'Create New Service Package'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Service Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. SME Cash Flow Audit"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Service Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detail what the client will receive during this session..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pricing Model</label>
              <select
                value={pricingType}
                onChange={e => setPricingType(e.target.value as PricingType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
              >
                <option value="hourly">Hourly Rate</option>
                <option value="fixed">Fixed Project Price</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rate / Price (INR ₹) *</label>
              <input
                type="number"
                required
                min="500"
                step="100"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Duration</label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 1 Hour Session"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setIsAdding(false); setEditingServiceId(null); }}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Save Service
            </button>
          </div>
        </form>
      )}

      {/* Services List */}
      <div className="space-y-3">
        {services.map(s => (
          <div key={s.serviceId} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{s.title}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  {s.category}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-1">{s.description}</p>
              <div className="text-[11px] text-slate-500 flex gap-3 pt-1">
                <span>Rate: <strong className="text-teal-700">₹{(s.hourlyRate || s.fixedPrice || 0).toLocaleString('en-IN')}</strong> ({s.pricingType})</span>
                <span>Duration: {s.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startEdit(s)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteService(s.serviceId)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
