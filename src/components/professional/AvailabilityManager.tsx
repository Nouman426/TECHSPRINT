import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Globe } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { AvailabilitySchedule } from '../../types';

interface AvailabilityManagerProps {
  professionalUid: string;
}

export const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ professionalUid }) => {
  const { availabilities } = useDatabase();
  const currentAvail = availabilities.find(a => a.professionalUid === professionalUid);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [schedule, setSchedule] = useState<AvailabilitySchedule>(
    currentAvail?.weeklySchedule || {
      'Monday': ['10:00 AM', '02:00 PM'],
      'Wednesday': ['10:00 AM', '04:00 PM'],
      'Friday': ['02:00 PM']
    }
  );

  const [timeZone, setTimeZone] = useState(currentAvail?.timeZone || 'Asia/Kolkata');
  const [newSlotTime, setNewSlotTime] = useState('10:00 AM');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const addSlot = () => {
    if (!newSlotTime) return;
    setSchedule(prev => {
      const existing = prev[selectedDay] || [];
      if (existing.includes(newSlotTime)) return prev;
      return {
        ...prev,
        [selectedDay]: [...existing, newSlotTime]
      };
    });
  };

  const removeSlot = (day: string, slotToRemove: string) => {
    setSchedule(prev => {
      const existing = prev[day] || [];
      const updated = existing.filter(s => s !== slotToRemove);
      const copy = { ...prev };
      if (updated.length === 0) {
        delete copy[day];
      } else {
        copy[day] = updated;
      }
      return copy;
    });
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Weekly Availability & Time Zone</h3>
          <p className="text-xs text-slate-500">Define your preferred consulting slots for clients.</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <Globe className="w-4 h-4 text-teal-600" />
          <span>{timeZone}</span>
        </div>
      </div>

      {/* Add Slot Control */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Day</label>
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
          >
            {days.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time Slot</label>
          <select
            value={newSlotTime}
            onChange={e => setNewSlotTime(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
          >
            {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-auto pt-4 sm:pt-0">
          <button
            type="button"
            onClick={addSlot}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Schedule Display Grid */}
      <div className="space-y-3">
        {days.map(day => {
          const slots = schedule[day] || [];
          return (
            <div key={day} className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
              <span className="font-bold text-xs text-slate-900 w-24 shrink-0">{day}</span>
              
              <div className="flex flex-wrap gap-1.5 flex-1">
                {slots.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No available slots</span>
                ) : (
                  slots.map(slot => (
                    <span
                      key={slot}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold"
                    >
                      <Clock className="w-3 h-3 text-teal-600" />
                      <span>{slot}</span>
                      <button
                        onClick={() => removeSlot(day, slot)}
                        className="text-teal-600 hover:text-red-600 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
