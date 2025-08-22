import React from 'react';

interface FileButtonProps {
  fileUrl: string | null;
  fileName: string;
  label?: string;
}

const DownloadViewButton: React.FC<FileButtonProps> = ({ 
  fileUrl, 
  fileName,
  label = "Télécharger" 
}) => {
  const handleDownload = () => {
    if (!fileUrl) return;

    try {
      // Solution pour les URLs backend
      if (fileUrl.startsWith('http')) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } 
      // Solution pour les File objects
      else {
        console.error("File objects need conversion to URL first");
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!fileUrl) {
    return <span className="text-gray-400">N/A</span>;
  }

  return (
    <div className="flex flex-col space-y-1">
      <button
        onClick={handleDownload}
        className="text-blue-600 hover:text-blue-800 underline text-sm"
      >
        {label}
      </button>
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline text-xs"
      >
      </a>
    </div>
  );
};

export default DownloadViewButton;
