import React, { useState } from 'react'
import { Settings, Shield, Database, Webhook, Mail, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { PluginConfig } from '../types'

interface AdminConfigTabProps {
  config: PluginConfig
  onConfigUpdate: (config: PluginConfig) => void
}

const AdminConfigTab: React.FC<AdminConfigTabProps> = ({ config, onConfigUpdate }) => {
  const [localConfig, setLocalConfig] = useState<PluginConfig>(config)
  const [hasChanges, setHasChanges] = useState(false)
  const [testingWebhook, setTestingWebhook] = useState(false)
  const [webhookStatus, setWebhookStatus] = useState<'success' | 'error' | null>(null)

  const handleConfigChange = (key: keyof PluginConfig, value: any) => {
    const newConfig = { ...localConfig, [key]: value }
    setLocalConfig(newConfig)
    setHasChanges(true)
  }

  const handleSave = () => {
    onConfigUpdate(localConfig)
    setHasChanges(false)
    alert('Configuration saved successfully!')
  }

  const handleReset = () => {
    setLocalConfig(config)
    setHasChanges(false)
  }

  const testWebhook = async () => {
    setTestingWebhook(true)
    setWebhookStatus(null)
    
    // Simulate webhook test
    setTimeout(() => {
      setTestingWebhook(false)
      setWebhookStatus(Math.random() > 0.3 ? 'success' : 'error')
    }, 2000)
  }

  const addAllowedIP = () => {
    const ip = prompt('Enter IP address to allow:')
    if (ip && ip.trim()) {
      handleConfigChange('allowedIPs', [...localConfig.allowedIPs, ip.trim()])
    }
  }

  const removeAllowedIP = (index: number) => {
    const newIPs = localConfig.allowedIPs.filter((_, i) => i !== index)
    handleConfigChange('allowedIPs', newIPs)
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={24} />
            Admin Configuration
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {hasChanges && (
              <button className="btn btn-secondary" onClick={handleReset}>
                Reset Changes
              </button>
            )}
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Save Configuration
            </button>
          </div>
        </div>

        {hasChanges && (
          <div className="alert alert-warning">
            <AlertTriangle size={16} />
            You have unsaved changes. Don't forget to save your configuration.
          </div>
        )}

        <div style={{ display: 'grid', gap: '30px' }}>
          
          {/* Data Retention Settings */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#007bff' }}>
              <Database size={20} />
              Data Retention
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div className="filter-group">
                <label>Data Retention Period (days)</label>
                <input
                  type="number"
                  min="30"
                  max="365"
                  value={localConfig.dataRetentionDays}
                  onChange={(e) => handleConfigChange('dataRetentionDays', parseInt(e.target.value))}
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  How long to keep session data (30-365 days)
                </small>
              </div>
            </div>
          </section>

          {/* Polling Settings */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#007bff' }}>
              <Settings size={20} />
              Polling Configuration
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div className="filter-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={localConfig.pollingEnabled}
                    onChange={(e) => handleConfigChange('pollingEnabled', e.target.checked)}
                  />
                  Enable Polling Fallback
                </label>
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Poll BBB API when webhooks fail
                </small>
              </div>
              <div className="filter-group">
                <label>Polling Interval (seconds)</label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={localConfig.pollingInterval}
                  onChange={(e) => handleConfigChange('pollingInterval', parseInt(e.target.value))}
                  disabled={!localConfig.pollingEnabled}
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  How often to poll BBB API (30-300 seconds)
                </small>
              </div>
            </div>
          </section>

          {/* Webhook Settings */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#007bff' }}>
              <Webhook size={20} />
              Webhook Configuration
            </h3>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div className="filter-group">
                <label>Webhook URL</label>
                <input
                  type="url"
                  value={localConfig.webhookUrl}
                  onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
                  placeholder="https://your-moodle.edu/blocks/bbb_monitor/webhook.php"
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  The endpoint where BBB will send webhook events
                </small>
              </div>
              <div className="filter-group">
                <label>Webhook Secret</label>
                <input
                  type="password"
                  value={localConfig.webhookSecret}
                  onChange={(e) => handleConfigChange('webhookSecret', e.target.value)}
                  placeholder="Enter a secure secret key"
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Used to validate webhook authenticity
                </small>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={testWebhook}
                  disabled={testingWebhook}
                >
                  {testingWebhook ? 'Testing...' : 'Test Webhook'}
                </button>
                {webhookStatus === 'success' && (
                  <span style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={16} />
                    Webhook test successful
                  </span>
                )}
                {webhookStatus === 'error' && (
                  <span style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={16} />
                    Webhook test failed
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Security Settings */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#007bff' }}>
              <Shield size={20} />
              Security Settings
            </h3>
            <div>
              <div className="filter-group" style={{ marginBottom: '16px' }}>
                <label>Allowed IP Addresses</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {localConfig.allowedIPs.map((ip, index) => (
                    <span 
                      key={index}
                      style={{ 
                        background: '#e9ecef', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {ip}
                      <button
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#dc3545', 
                          cursor: 'pointer',
                          padding: '0 2px'
                        }}
                        onClick={() => removeAllowedIP(index)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button className="btn btn-secondary" onClick={addAllowedIP}>
                  Add IP Address
                </button>
                <small style={{ color: '#6c757d', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                  Only these IPs can send webhook events (leave empty to allow all)
                </small>
              </div>
            </div>
          </section>

          {/* Alert Settings */}
          <section>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#007bff' }}>
              <Mail size={20} />
              Alert Configuration
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div className="filter-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={localConfig.emailAlerts}
                    onChange={(e) => handleConfigChange('emailAlerts', e.target.checked)}
                  />
                  Enable Email Alerts
                </label>
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Send email notifications for system events
                </small>
              </div>
              <div className="filter-group">
                <label>Alert Threshold (participants)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={localConfig.alertThreshold}
                  onChange={(e) => handleConfigChange('alertThreshold', parseInt(e.target.value))}
                  disabled={!localConfig.emailAlerts}
                />
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Send alert when session exceeds this many participants
                </small>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* System Health Status */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} />
          System Health
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <h4 style={{ color: '#28a745', marginBottom: '8px' }}>Webhook Status</h4>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Last Event:</strong> 2 minutes ago
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Success Rate:</strong> 98.5%
              </div>
              <div>
                <strong>Failed Deliveries:</strong> 3 (last 24h)
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#007bff', marginBottom: '8px' }}>Database Status</h4>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Total Records:</strong> 1,247
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>Storage Used:</strong> 45.2 MB
              </div>
              <div>
                <strong>Oldest Record:</strong> 89 days ago
              </div>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#ffc107', marginBottom: '8px' }}>Performance</h4>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '4px' }}>
                <strong>Avg Response Time:</strong> 245ms
              </div>
              <div style={{ marginBottom: '4px' }}>
                <strong>CPU Usage:</strong> 12%
              </div>
              <div>
                <strong>Memory Usage:</strong> 34 MB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminConfigTab
