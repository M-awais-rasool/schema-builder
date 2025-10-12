import React from 'react';
import { Bell, Shield, Palette, Globe, Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your application preferences and settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <nav className="space-y-2">
              {[
                { icon: Bell, label: 'Notifications', active: true },
                { icon: Shield, label: 'Security', active: false },
                { icon: Palette, label: 'Appearance', active: false },
                { icon: Globe, label: 'Language', active: false },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      item.active
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <Bell className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Schema updates', description: 'Get notified when schemas are modified', enabled: true },
                    { label: 'Project invitations', description: 'Receive invites to collaborate on projects', enabled: true },
                    { label: 'System maintenance', description: 'Important system updates and maintenance', enabled: false },
                    { label: 'Weekly digest', description: 'Summary of your weekly activity', enabled: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          defaultChecked={item.enabled}
                          className="sr-only"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${item.enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'} mt-1`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Real-time collaboration', description: 'Live updates when team members make changes', enabled: true },
                    { label: 'Export completed', description: 'When your schema exports are ready', enabled: true },
                    { label: 'Error alerts', description: 'Critical errors and system issues', enabled: true },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          defaultChecked={item.enabled}
                          className="sr-only"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${item.enabled ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'} mt-1`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200">
                <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;