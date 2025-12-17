import { MyInput } from 'components/Atoms/Form';
import MyModal from 'components/Atoms/MyModal';
import { URLS } from 'constants/url';
import { useImageCropContext } from 'context/ImageCropProvider';
import { readFile } from 'helpers/cropImage';
import { Download, Upload } from 'lucide-react';
import ImageCropModalContent from 'pages/EmployeePage/Create/_components/ImageCropModalContent';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { request } from 'services/request';

const TypeForm = ({ selectedTypeName, setValue, setImageKey, cardNumber, qrGuid, setCardNumber, carNumber, setCarNumber, setPersonalCode, personalCode }: any) => {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openModal, setOpenModal] = useState(false);
    // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);
    const qrCanvasRef = useRef(null);
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const { getProcessedImage, resetStates, setImage }: any = useImageCropContext();
    const handleDone = async (): Promise<void> => {
        const avatar = await getProcessedImage();
        if (!avatar) {
            console.error('Processed image is not available.');
            setOpenModal(false);
            return;
        }

        if (!(avatar instanceof Blob)) {
            console.error('Processed image is not a valid Blob.');
            setOpenModal(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', avatar);

            const response = await request.post(URLS.uploadPhotoByEmployee, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const key = response?.data?.key;
            if (key) {
                setImageKey(key);
                // additionalDetails ga avtomatik yozamiz
                setValue('additionalDetails', key);
                toast.success(t('Photo uploaded successfully!'));
            }

            resetStates();
            setOpenModal(false);
        } catch (error: any) {
            console.error('❌ Error uploading avatar:', error);
            toast.error(t('Failed to upload photo'));
            setOpenModal(false);
        }
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
        }
    };

    const handleFileChange = async ({ target: { files } }: any) => {
        const file = files && files[0];
        const imageDataUrl = await readFile(file);
        setImage(imageDataUrl);
        if (file) {
            setOpenModal(true);
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

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const renderTypeSpecificField = () => {
        switch (selectedTypeName) {
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
                                type="file"
                                ref={fileInputRef}
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
                        <MyInput
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
                        <MyInput
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
                        <MyInput
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

    // const generateGuid = () => {
    //     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    //         const r = Math.random() * 16 | 0;
    //         const v = c === 'x' ? r : (r & 0x3 | 0x8);
    //         return v.toString(16);
    //     });
    // };

    // const generateQRCode = (text: any) => {
    //     const canvas: any = qrCanvasRef.current;
    //     if (!canvas) return;

    //     const ctx = canvas.getContext('2d');
    //     const size = 200;
    //     canvas.width = size;
    //     canvas.height = size;

    //     // Simple QR code visualization
    //     ctx.fillStyle = '#ffffff';
    //     ctx.fillRect(0, 0, size, size);

    //     ctx.fillStyle = '#000000';
    //     const moduleSize = 4;
    //     const modules = Math.floor(size / moduleSize);

    //     // Generate random pattern based on GUID
    //     for (let i = 0; i < modules; i++) {
    //         for (let j = 0; j < modules; j++) {
    //             const hash = text.charCodeAt(i % text.length) + text.charCodeAt(j % text.length);
    //             if (hash % 2 === 0) {
    //                 ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
    //             }
    //         }
    //     }
    // };

    // const handleTypeSelect = (type: any) => {
    //     setSelectedType(type);
    //     setIsDropdownOpen(false);

    //     // Generate GUID and QR code if QR type is selected
    //     if (type === 'QR') {
    //         const guid = generateGuid();
    //         setQrGuid(guid);
    //         setTimeout(() => generateQRCode(guid), 100);
    //     }
    // };
    return (
        <>
            {renderTypeSpecificField()}

            <MyModal
                modalProps={{
                    show: Boolean(openModal),
                    onClose: () => setOpenModal(false),
                    size: 'md'
                }}
                headerProps={{
                    children: <h2 className="text-gray-800">{t('Profile picture')}</h2>
                }}
                bodyProps={{
                    children: (
                        <>
                            <ImageCropModalContent
                                handleDone={handleDone}
                                handleClose={() => setOpenModal(false)}
                            />
                        </>
                    )
                }}
            />
        </>
    );
}

export default TypeForm;
