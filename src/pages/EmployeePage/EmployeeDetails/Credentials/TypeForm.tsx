import { MyInput } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { URLS } from 'constants/url';
import { useImageCropContext } from 'context/ImageCropProvider';
import { readFile } from 'helpers/cropImage';
import { Download, Upload } from 'lucide-react';
import ImageCropModalContent from 'pages/EmployeePage/Create/_components/ImageCropModalContent';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { request } from 'services/request';
import { QRCodeCanvas } from "qrcode.react";


const TypeForm = ({ selectedTypeName, setValue, setImageKey, cardNumber, setCardNumber, carNumber, setCarNumber, setPersonalCode, personalCode, code, setCode }: any) => {
    const { t } = useTranslation()
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);
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

            const response = await request.post(URLS.employeeCredentialFileUpload, formData, {
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
        if (!file) return;

        setSelectedFile(file); // <-- MUHIM

        const imageDataUrl = await readFile(file);
        setImage(imageDataUrl);

        setOpenModal(true);
    };

    useEffect(() => {
        if (!selectedFile) return;

        const url = URL.createObjectURL(selectedFile);
        return () => URL.revokeObjectURL(url);
    }, [selectedFile]);

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setIsDragging(true);
    };



    function handleGenerate() {
        const random = Math.floor(100000 + Math.random() * 900000);
        const newCode = `QR-${random}`;

        setCode(newCode);
    }

    const renderTypeSpecificField = () => {
        switch (selectedTypeName) {
            case 'PHOTO':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-title-dark mb-2">
                            {t('Upload image')}
                        </label>
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${isDragging
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
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
                                        className="mx-auto max-h-36 rounded-lg mb-3"
                                    />
                                    <p className="text-sm text-gray-600 dark:text-text-title-dark">{selectedFile.name}</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                        className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                    >
                                        {t('Remove')}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-text-title-dark mb-3" />
                                    <p className="text-sm text-gray-600 dark:text-text-title-dark mb-1">
                                        {t('Drag & Drop your files or Browse')}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-text-subtle">{t('PNG, JPG up to 10MB')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'CARD':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-title-dark mb-2">
                            {t('Card Number')}
                        </label>
                        <MyInput
                            value={cardNumber}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setCardNumber(value);
                            }}
                            placeholder={t('Enter 10-digit card number')}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            maxLength={10}
                        />
                        <p className="text-xs text-gray-500 dark:text-text-subtle mt-1">
                            {cardNumber.length}/10 {t('digits')}
                        </p>
                    </div>
                );

            case 'CAR':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-title-dark mb-2">
                            {t('Car Number')}
                        </label>
                        <MyInput
                            value={carNumber}
                            onChange={(e) => setCarNumber(e.target.value.toUpperCase())}
                            placeholder="01A001AA"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-lg"
                        />
                    </div>
                );

            case 'QR':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-title-dark mb-2">
                            {t('Generated QR Code')}
                        </label>
                        <div className="flex flex-col items-center">
                            <QRCodeCanvas
                                value={code}
                                size={180}
                                includeMargin
                            />
                            <MyButton variant='secondary'
                                onClick={handleGenerate}
                                startIcon={<Download className="h-4 w-4" />}>
                                {t('Generate QR Code')}
                            </MyButton>
                        </div>
                    </div>
                );

            case 'PERSONAL_CODE':
                return (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-text-title-dark mb-2">
                            {t('Personal Code')}
                        </label>
                        <MyInput
                            type="text"
                            value={personalCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setPersonalCode(value);
                            }}
                            placeholder={t('Enter 10-digit personal code')}
                            maxLength={10}
                        />
                        <p className="text-xs text-gray-500 dark:text-text-subtle mt-1">
                            {personalCode.length}/10 {t('digits')}
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

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
                    children: <h2 className="text-gray-800 dark:text-text-title-dark">{t('Profile picture')}</h2>
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
