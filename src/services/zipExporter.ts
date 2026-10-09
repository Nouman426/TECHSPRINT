import JSZip from 'jszip';

export async function exportProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Create standard file package representation
  const rootFiles: Record<string, string> = {
    'README.md': `# VETEREN — Experience Never Retires

Connect Experience With Opportunity. VETEREN is a specialized marketplace connecting retired professionals and experienced experts with clients for consulting, mentoring, teaching, and advisory services.

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Firebase Authentication, Firestore, Storage
- AI Features: Gemini 1.5 Flash API
- Deployment Ready: Modern SPA with role-based routing

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`
`,
    'package.json': JSON.stringify({
      name: "veteren-app",
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview"
      }
    }, null, 2),
    'firestore.rules': `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /professionalProfiles/{profileId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == profileId;
    }
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}`
  };

  Object.entries(rootFiles).forEach(([fileName, content]) => {
    zip.file(fileName, content);
  });

  return zip.generateAsync({ type: 'blob' });
}

export function triggerDownload(blob: Blob, filename = 'veteren-source-code.zip') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
