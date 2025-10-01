import html2canvas from "html2canvas";

export const generateInstagramStory = async (
  elementId: string
): Promise<Blob | null> => {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return null;
  }

  console.log(`Capturing element "${elementId}"`, element);

  try {
    // Wait a bit for fonts to load
    await document.fonts.ready;

    // Generate canvas from element at its natural size first
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure proper text rendering in cloned document
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.letterSpacing = '0.01em';
          clonedElement.style.wordSpacing = '0.1em';
        }
      }
    });

    // Create a new canvas with Instagram Story dimensions (1080x1920)
    const storyCanvas = document.createElement('canvas');
    storyCanvas.width = 1080;
    storyCanvas.height = 1920;
    const ctx = storyCanvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Fill with a dark background for Instagram Stories
    ctx.fillStyle = '#1a0b2e'; // Dark purple background
    ctx.fillRect(0, 0, 1080, 1920);

    // Calculate scaling to fit width, prioritizing width over height
    const scaleX = 1080 / canvas.width;
    const scaleY = 1920 / canvas.height;
    const scale = Math.min(scaleX, scaleY, 1.2); // Cap at 1.2x to avoid over-scaling

    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;

    // Center horizontally, position near top vertically
    const x = (1080 - scaledWidth) / 2;
    const y = Math.min(100, (1920 - scaledHeight) / 2); // Start near top with max 100px padding

    // Draw the captured content onto the story canvas
    ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);

    // Convert canvas to blob
    return new Promise((resolve) => {
      storyCanvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/png",
        1.0
      );
    });
  } catch (error) {
    console.error("Error generating Instagram story:", error);
    return null;
  }
};

export const shareToInstagram = async (blob: Blob, filename: string) => {
  // Check if Web Share API is available
  if (navigator.share && navigator.canShare) {
    const file = new File([blob], filename, { type: "image/png" });

    // Check if sharing files is supported
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "My Cosmic Birthday",
          text: "Check out my life in numbers!",
        });
        return { success: true, method: "share" };
      } catch (error) {
        // User cancelled or sharing failed
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }
  }

  // Fallback: Download the image
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { success: true, method: "download" };
};

export const shareStoryToInstagram = async (
  elementId: string,
  filename: string
) => {
  const blob = await generateInstagramStory(elementId);

  if (!blob) {
    return { success: false, error: "Failed to generate image" };
  }

  return await shareToInstagram(blob, filename);
};
