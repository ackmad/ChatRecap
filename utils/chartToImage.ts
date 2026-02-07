import html2canvas from 'html2canvas';

/**
 * Convert a chart element to base64 image
 * @param elementId - ID of the chart element to convert
 * @param scale - Scale factor for image quality (default: 3)
 * @returns Promise<string> - Base64 image data URL
 */
export const chartToImage = async (elementId: string, scale: number = 3): Promise<string> => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id "${elementId}" not found`);
    }

    try {
        const canvas = await html2canvas(element, {
            scale,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: true,
        });

        return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
        console.error('Error converting chart to image:', error);
        throw error;
    }
};

/**
 * Convert multiple charts to images
 * @param elementIds - Array of element IDs to convert
 * @param scale - Scale factor for image quality
 * @returns Promise<Record<string, string>> - Object mapping element IDs to base64 images
 */
export const chartsToImages = async (
    elementIds: string[],
    scale: number = 3
): Promise<Record<string, string>> => {
    const images: Record<string, string> = {};

    for (const id of elementIds) {
        try {
            images[id] = await chartToImage(id, scale);
        } catch (error) {
            console.warn(`Failed to convert chart "${id}":`, error);
            images[id] = ''; // Empty string as fallback
        }
    }

    return images;
};

/**
 * Create a temporary chart element for PDF rendering
 * @param chartComponent - React component to render
 * @param containerId - ID for the temporary container
 * @returns Promise<string> - Base64 image data URL
 */
export const renderChartToImage = async (
    chartComponent: React.ReactElement,
    containerId: string = 'temp-chart-container'
): Promise<string> => {
    // This would need ReactDOM.render in a temporary div
    // For now, we'll rely on existing chart elements in the DOM
    return '';
};
