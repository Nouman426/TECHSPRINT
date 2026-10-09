import React from 'react';
import { Bell, Check, Calendar, ShieldCheck, Star, Info } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead } = useDatabase();
  const { currentUser } = useAuth();

  if (!isOpen || !currentUser) return null;

  const userNotifs = notifications.filter(n => n.recipientUid === currentUser.uid);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'verification': return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'review': return <Star className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" />
          <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
        </div>
        <span className="text-xs bg-teal-100 text-teal-800 font-medium px-2 py-0.5 rounded-full">
          {userNotifs.filter(n => !n.readAt).length} Unread
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {userNotifs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No notifications yet
          </div>
        ) : (
          userNotifs.map((n) => (
            <div
              key={n.notificationId}
              onClick={() => markNotificationAsRead(n.notificationId)}
              className={`p-4 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                !n.readAt ? 'bg-teal-50/30' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 h-fit">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold text-xs text-slate-900">{n.title}</h5>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
        <button 
          onClick={onClose}
          className="text-xs text-teal-700 font-semibold hover:text-teal-800"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
