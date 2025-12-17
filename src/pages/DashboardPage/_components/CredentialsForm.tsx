import React, { useState, useRef } from 'react';
import { X, Upload, Download, QrCode } from 'lucide-react';

const CredentialsForm = () => {
    const [selectedType, setSelectedType] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [personalCode, setPersonalCode] = useState('');
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [qrGuid, setQrGuid] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<any>(null);
    const qrCanvasRef = useRef(null);

    const types = [
        { value: 'PHOTO', label: 'Photo' },
        { value: 'CARD', label: 'Card' },
        { value: 'CAR', label: 'Car' },
        { value: 'QR', label: 'QR Code' },
        { value: 'PERSONAL_CODE', label: 'Personal Code' }
    ];

    const generateGuid = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    const generateQRCode = (text: any) => {
        const canvas: any = qrCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const size = 200;
        canvas.width = size;
        canvas.height = size;

        // Simple QR code visualization
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#000000';
        const moduleSize = 4;
        const modules = Math.floor(size / moduleSize);

        // Generate random pattern based on GUID
        for (let i = 0; i < modules; i++) {
            for (let j = 0; j < modules; j++) {
                const hash = text.charCodeAt(i % text.length) + text.charCodeAt(j % text.length);
                if (hash % 2 === 0) {
                    ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
                }
            }
        }
    };

    const handleTypeSelect = (type: any) => {
        setSelectedType(type);
        setIsDropdownOpen(false);

        // Generate GUID and QR code if QR type is selected
        if (type === 'QR') {
            const guid = generateGuid();
            setQrGuid(guid);
            setTimeout(() => generateQRCode(guid), 100);
        }
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
        }
    };

    const downloadQRCode = () => {
        const canvas: any = qrCanvasRef.current;
        if (!canvas) return;

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qr-${qrGuid}.png`;
        link.href = url;
        link.click();
    };

    const handleSubmit = () => {
        const data = {
            type: selectedType,
            value: selectedType === 'CARD' ? cardNumber :
                selectedType === 'CAR' ? carNumber :
                    selectedType === 'PERSONAL_CODE' ? personalCode :
                        selectedType === 'QR' ? qrGuid :
                            selectedType === 'PHOTO' ? selectedFile : null
        };
        console.log('Submitting:', data);
        alert('Form submitted! Check console for data.');
    };

    const renderTypeSpecificField = () => {
        switch (selectedType) {
            case 'PHOTO':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Photo
                        </label>
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef?.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {selectedFile ? (
                                <div>
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="Preview"
                                        className="mx-auto max-h-48 rounded-lg mb-3"
                                    />
                                    <p className="text-sm text-gray-600">{selectedFile.name}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                    <p className="text-sm text-gray-600 mb-1">
                                        Drag & drop your photo here, or click to select
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'CARD':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                        </label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setCardNumber(value);
                            }}
                            placeholder="Enter 10-digit card number"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            maxLength={10}
                        />
                        <p className="text-xs text-gray-500 mt-1">{cardNumber.length}/10 digits</p>
                    </div>
                );

            case 'CAR':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Car Number
                        </label>
                        <input
                            type="text"
                            value={carNumber}
                            onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
                            placeholder="01A001AA"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-lg"
                        />
                    </div>
                );

            case 'QR':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Generated QR Code
                        </label>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center">
                            <canvas ref={qrCanvasRef} className="mx-auto mb-4 rounded-lg shadow-md" />
                            <div className="bg-white rounded-lg p-3 mb-4 border border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">GUID</p>
                                <p className="text-sm font-mono text-gray-700 break-all">{qrGuid}</p>
                            </div>
                            <button
                                onClick={downloadQRCode}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Download QR Code
                            </button>
                        </div>
                    </div>
                );

            case 'PERSONAL_CODE':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Personal Code
                        </label>
                        <input
                            type="text"
                            value={personalCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setPersonalCode(value);
                            }}
                            placeholder="Enter 10-digit personal code"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            maxLength={10}
                        />
                        <p className="text-xs text-gray-500 mt-1">{personalCode.length}/10 digits</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 flex items-center justify-center">
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Create new type
                    </h2>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Type Selector */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Credential Type
                        </label>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full px-4 py-3 bg-white rounded-lg border-2 border-orange-500 text-left flex items-center justify-between hover:border-orange-600 transition-colors"
                        >
                            <span className={selectedType ? 'text-gray-900' : 'text-gray-400'}>
                                {selectedType ? types.find(t => t.value === selectedType)?.label : 'Select type...'}
                            </span>
                            <svg
                                className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                                {types.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => handleTypeSelect(type.value)}
                                        className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all text-gray-700 hover:text-gray-900"
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dynamic Field */}
                    {renderTypeSpecificField()}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedType}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Submit
                        </button>
                        <button className="px-6 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all font-medium">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CredentialsForm;