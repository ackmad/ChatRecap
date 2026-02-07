import React, { useState, useRef } from 'react';
import { ChatData, AnalysisResult } from '../types';
import { PDFRingkasTemplate, PDFFullReportTemplate } from './PDFTemplates';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, Loader, CheckCircle, XCircle } from 'lucide-react';

interface PDFGeneratorProps {
    chatData: ChatData;
    analysis: AnalysisResult;
    onClose: () => void;
    theme?: string;
}

type PDFType = 'ringkas' | 'full';

export const PDFGenerator: React.FC<PDFGeneratorProps> = ({ chatData, analysis, onClose, theme = 'pastel' }) => {
    const [selectedType, setSelectedType] = useState<PDFType | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const pdfContainerRef = useRef<HTMLDivElement>(null);

    const participant1 = chatData.participants[0] || 'User1';
    const participant2 = chatData.participants[1] || 'User2';

    const generatePDF = async (type: PDFType) => {
        setIsGenerating(true);
        setProgress(0);
        setError(null);
        setSuccess(false);

        try {
            // Step 1: Render template
            setProgress(10);
            setSelectedType(type);

            // Wait for DOM to update
            await new Promise(resolve => setTimeout(resolve, 500));

            if (!pdfContainerRef.current) {
                throw new Error('PDF container not found');
            }

            setProgress(20);

            // Step 2: Get all pages
            const pages = pdfContainerRef.current.querySelectorAll('.pdf-page');
            if (pages.length === 0) {
                throw new Error('No pages found in PDF template');
            }

            setProgress(30);

            // Step 3: Create PDF document (A4 size)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const pdfWidth = 210; // A4 width in mm
            const pdfHeight = 297; // A4 height in mm

            // Step 4: Convert each page to canvas and add to PDF
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i] as HTMLElement;

                setProgress(30 + (i / pages.length) * 60);

                // Capture page as canvas with high quality
                const canvas = await html2canvas(page, {
                    scale: 3, // High quality
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    windowWidth: 794, // A4 width in pixels at 96 DPI
                    windowHeight: 1123, // A4 height in pixels at 96 DPI
                });

                // Convert canvas to image
                const imgData = canvas.toDataURL('image/jpeg', 0.98);

                // Add new page if not first page
                if (i > 0) {
                    pdf.addPage();
                }

                // Add image to PDF (full page)
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            }

            setProgress(95);

            // Step 5: Generate filename
            const safeP1 = participant1.replace(/[^a-zA-Z0-9]/g, '');
            const safeP2 = participant2.replace(/[^a-zA-Z0-9]/g, '');
            const dateStr = new Date().toISOString().split('T')[0];
            const typeStr = type === 'ringkas' ? 'Ringkas' : 'FullReport';
            const filename = `RecapChat_${safeP1}-${safeP2}_${dateStr}_${typeStr}.pdf`;

            // Step 6: Save PDF
            pdf.save(filename);

            setProgress(100);
            setSuccess(true);

            // Reset after 2 seconds
            setTimeout(() => {
                setIsGenerating(false);
                setSelectedType(null);
                setSuccess(false);
            }, 2000);

        } catch (err) {
            console.error('Error generating PDF:', err);
            setError(err instanceof Error ? err.message : 'Gagal membuat PDF');
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <FileText className="text-purple-500" size={28} />
                                Download Recap PDF
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Pilih jenis PDF yang ingin kamu download
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            disabled={isGenerating}
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {!isGenerating && !success && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* PDF Ringkas Option */}
                            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer group"
                                onClick={() => generatePDF('ringkas')}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                                        1-2 Halaman
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    PDF Ringkas
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                    Berisi cover, summary, statistik utama, dan highlight paling penting. Cocok untuk dibagikan cepat.
                                </p>
                                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Cover & Summary</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Statistik Utama</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Top Words & Emoji</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Quote Terbaik</span>
                                    </div>
                                </div>
                                <button className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <Download size={18} />
                                    Download Ringkas
                                </button>
                            </div>

                            {/* PDF Full Report Option */}
                            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-purple-500 dark:hover:border-purple-500 transition-all cursor-pointer group"
                                onClick={() => generatePDF('full')}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                                        5-7 Halaman
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Full Report
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                    Laporan lengkap dengan semua analisis, grafik, topik, quote, dan prediksi AI. Untuk kenangan detail.
                                </p>
                                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Semua dari Ringkas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Analisis Kata & Emoji Detail</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>Top Topics & Runner Ups</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-green-500" />
                                        <span>AI Insights & Prediksi 2026</span>
                                    </div>
                                </div>
                                <button className="mt-6 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <Download size={18} />
                                    Download Full Report
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Generating State */}
                    {isGenerating && !success && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
                                <Loader className="animate-spin text-purple-500" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Sedang membuat PDF...
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Jangan tutup halaman ini. Proses ini mungkin memakan waktu beberapa detik.
                            </p>
                            <div className="max-w-md mx-auto">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {progress}%
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success State */}
                    {success && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                                <CheckCircle className="text-green-500" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                PDF Berhasil Didownload! 🎉
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                File PDF sudah tersimpan di folder Downloads kamu.
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                                        Gagal Membuat PDF
                                    </h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview Info */}
                    {!isGenerating && !success && (
                        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <FileText className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
                                <div className="text-sm text-blue-900 dark:text-blue-200">
                                    <p className="font-semibold mb-1">Format PDF A4 Profesional</p>
                                    <p className="text-blue-700 dark:text-blue-300">
                                        PDF akan dihasilkan dalam ukuran A4 (210mm × 297mm) dengan layout rapi,
                                        font yang jelas, dan siap untuk dicetak atau dibagikan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Hidden PDF Container for Rendering */}
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                    <div ref={pdfContainerRef}>
                        {selectedType === 'ringkas' && (
                            <PDFRingkasTemplate chatData={chatData} analysis={analysis} theme={theme} />
                        )}
                        {selectedType === 'full' && (
                            <PDFFullReportTemplate chatData={chatData} analysis={analysis} theme={theme} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
