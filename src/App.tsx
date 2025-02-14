import React, { useState, useCallback } from 'react';
import { FileUp, FileDown, FileText, FileImage, FileSpreadsheet, PresentationIcon as FilePresentationIcon, FileCode, Sun, Moon } from 'lucide-react';
import axios from 'axios';

type ConversionType = {
  from: string;
  to: string;
  icon: React.ReactNode;
};

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const conversionTypes: ConversionType[] = [
    { from: 'PDF', to: 'DOCX', icon: <FileText className="w-8 h-8" /> },
    { from: 'DOCX', to: 'PDF', icon: <FileText className="w-8 h-8" /> },
    { from: 'JPG', to: 'PNG', icon: <FileImage className="w-8 h-8" /> },
    { from: 'PNG', to: 'JPG', icon: <FileImage className="w-8 h-8" /> },
    { from: 'XLSX', to: 'CSV', icon: <FileSpreadsheet className="w-8 h-8" /> },
    { from: 'PPT', to: 'PDF', icon: <FilePresentationIcon className="w-8 h-8" /> },
    { from: 'TXT', to: 'DOCX', icon: <FileText className="w-8 h-8" /> },
    { from: 'DOCX', to: 'TXT', icon: <FileText className="w-8 h-8" /> },
    { from: 'HTML', to: 'PDF', icon: <FileCode className="w-8 h-8" /> },
    { from: 'PDF', to: 'HTML', icon: <FileCode className="w-8 h-8" /> },
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setError(null);
    }
  }, []);

  const handleConvert = async () => {
    if (!selectedFile || !conversionType) return;

    const [from, to] = conversionType.split(' para ');
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('from', from);
    formData.append('to', to);

    setIsConverting(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/convert', formData, {
        responseType: 'blob',
      });

      // Cria um URL para o arquivo convertido
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Cria um link temporário e clica nele para fazer o download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `converted.${to.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Limpa o URL criado
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro na conversão:', error);
      setError('Erro ao converter o arquivo. Por favor, tente novamente.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
      {/* Header */}
      <header className={`bg-white shadow-sm ${darkMode ? 'bg-gray-800' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileUp className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`} />
            <h1 className="text-2xl font-bold">ConvertePro</h1>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full">
            {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-900" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Converta seus arquivos facilmente
          </h2>
          <p className="text-xl">
            Conversão rápida e segura entre diversos formatos de arquivo
          </p>
        </div>

        {/* Conversion Options */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {conversionTypes.map((type, index) => (
            <button
              key={index}
              onClick={() => setConversionType(`${type.from} para ${type.to}`)}
              className={`p-6 rounded-lg border-2 transition-all ${
                conversionType === `${type.from} para ${type.to}`
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
              } ${darkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-500 hover:bg-gray-700' : ''}`}
            >
              <div className="flex flex-col items-center space-y-2">
                {type.icon}
                <span className="text-sm font-medium">
                  {type.from} para {type.to}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* File Upload Section */}
        <div className="max-w-xl mx-auto">
          <div className={`rounded-lg shadow-md p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="space-y-6">
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                } ${darkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-500' : ''}`}
              >
                <FileDown className={`w-12 h-12 mb-4 transition-colors ${
                  isDragging ? 'text-blue-600' : 'text-gray-400'
                } ${darkMode ? 'text-gray-500' : ''}`} />
                <label className="cursor-pointer text-center">
                  <span className="mt-2 block text-sm font-medium">
                    {selectedFile 
                      ? selectedFile.name 
                      : isDragging
                        ? 'Solte o arquivo aqui'
                        : 'Arraste e solte um arquivo ou clique para selecionar'
                    }
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.jpg,.png,.xlsx,.csv,.ppt,.txt,.html"
                  />
                </label>
                {selectedFile && (
                  <p className="mt-2 text-sm">
                    Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={!selectedFile || !conversionType || isConverting}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  selectedFile && conversionType && !isConverting
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                } ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
              >
                {isConverting ? 'Convertendo...' : 'Converter Arquivo'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm">
            © 2024 ConvertePro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;