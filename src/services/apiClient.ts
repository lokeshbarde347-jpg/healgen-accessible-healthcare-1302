import { MedicalReportAnalysis, DiagnosticImageInsight, AuditLog, UserProfile } from '../types/medical.ts';

export const apiClient = {
  async getUsers(): Promise<UserProfile[]> {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error('Failed to load users');
    return res.json();
  },

  async getReports(patientId?: string): Promise<MedicalReportAnalysis[]> {
    const url = patientId ? `/api/reports?patientId=${encodeURIComponent(patientId)}` : '/api/reports';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load reports');
    return res.json();
  },

  async getReportById(id: string): Promise<MedicalReportAnalysis> {
    const res = await fetch(`/api/reports/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },

  async simplifyReport(payload: {
    text: string;
    title?: string;
    category?: string;
    patientName?: string;
    patientId?: string;
    language?: string;
    userRole?: string;
  }): Promise<MedicalReportAnalysis> {
    const res = await fetch('/api/reports/simplify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Simplification failed' }));
      throw new Error(err.error || 'Simplification failed');
    }
    return res.json();
  },

  async verifyReport(id: string, notes: string, role: string): Promise<MedicalReportAnalysis> {
    const res = await fetch(`/api/reports/${encodeURIComponent(id)}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicianNotes: notes, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Verification failed' }));
      throw new Error(err.error || 'Verification failed');
    }
    return res.json();
  },

  async deleteReport(id: string, userId?: string, role?: string): Promise<void> {
    const res = await fetch(`/api/reports/${encodeURIComponent(id)}?userId=${userId || ''}&role=${role || ''}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete report');
  },

  async analyzeDiagnosticImage(payload: {
    base64Data?: string;
    mimeType?: string;
    description?: string;
    imageType?: string;
    language?: string;
    userId?: string;
    userRole?: string;
  }): Promise<DiagnosticImageInsight> {
    const res = await fetch('/api/diagnostic-image/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Image analysis failed' }));
      throw new Error(err.error || 'Image analysis failed');
    }
    return res.json();
  },

  async chat(payload: {
    messages: { role: string; content: string }[];
    reportContext?: string;
    language?: string;
    userId?: string;
    userRole?: string;
  }): Promise<{ content: string; uncertaintyIndex?: number; suggestedQuestions?: string[] }> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Chat service unavailable');
    return res.json();
  },

  async synthesize(payload: {
    reportIds?: string[];
    language?: string;
    userId?: string;
    userRole?: string;
  }): Promise<any> {
    const res = await fetch('/api/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Synthesis failed');
    return res.json();
  },

  async getAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },
};
