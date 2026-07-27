/**
 * Helper utility to draw product photo + price details onto a single unified image canvas card,
 * ensuring details and image are combined in one image for WhatsApp sharing / downloading.
 */

async function createProductPriceCardImage(product, unitPrice, imageUrl) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Top Header Banner
    ctx.fillStyle = '#0f172a'; // Slate 900
    ctx.fillRect(0, 0, width, 100);
    ctx.fillStyle = '#38bdf8'; // Cyan 400 accent
    ctx.fillRect(0, 96, width, 4);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ADITYA ENTERPRISES', width / 2, 48);
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('WHOLESALE INDUSTRIAL & ARCHITECTURAL SUPPLIES', width / 2, 78);

    function drawTextAndFinish() {
      // Product Name
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      
      const words = (product.name || 'Product').split(' ');
      let line = '';
      let yPos = 640;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 720 && n > 0) {
          ctx.fillText(line.trim(), width / 2, yPos);
          line = words[n] + ' ';
          yPos += 42;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), width / 2, yPos);

      // SKU and Brand
      yPos += 40;
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#64748b';
      const brandText = product.brand?.name ? `Brand: ${product.brand.name.toUpperCase()}  |  ` : '';
      ctx.fillText(`${brandText}SKU: ${product.sku || '-'}`, width / 2, yPos);

      // Price Badge Box
      yPos += 30;
      const boxY = yPos;
      ctx.fillStyle = '#10b981'; // Emerald 500
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(50, boxY, 700, 130, 16);
        ctx.fill();
      } else {
        ctx.fillRect(50, boxY, 700, 130);
      }

      const netPrice = unitPrice * (1 + (product.gst_percent || 0) / 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(`Net Price: ₹${netPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} / unit`, width / 2, boxY + 54);

      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#d1fae5'; // Emerald 100
      ctx.fillText(`(Basic Rate: ₹${unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} + ${product.gst_percent || 0}% GST)`, width / 2, boxY + 95);

      // Footer
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, height - 60, width, 60);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('adityaent.online   •   Inquiries: +91 74835 52250', width / 2, height - 24);

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/jpeg', 0.92);
    }

    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const maxW = 700;
        const maxH = 450;
        let w = img.width;
        let h = img.height;
        const scale = Math.min(maxW / w, maxH / h);
        w = w * scale;
        h = h * scale;
        const x = (width - w) / 2;
        const y = 130 + (maxH - h) / 2;

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 120, 720, 470);
        ctx.drawImage(img, x, y, w, h);
        drawTextAndFinish();
      };
      img.onerror = () => {
        // Fallback: draw placeholder box if image load fails
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(40, 120, 720, 470);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '24px sans-serif';
        ctx.fillText('Product Image Available Online', width / 2, 355);
        drawTextAndFinish();
      };
      img.src = imageUrl;
    } else {
      drawTextAndFinish();
    }
  });
}

export async function shareProductWithImage(product, unitPrice) {
  const netPrice = unitPrice * (1 + (product.gst_percent || 0) / 100);
  const origin = window.location.origin;
  const productUrl = `${origin}/product/${product.slug}`;
  
  const shareText = `Check out this product from Aditya Enterprises!\n\n*${product.name}*\nSKU: ${product.sku || '-'}\nBasic Price: ₹${unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\nGST (${product.gst_percent || 0}%): +₹${(unitPrice * ((product.gst_percent || 0) / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\nNet Price: ₹${netPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} per unit\n\nProduct Link: ${productUrl}`;

  const imageUrl = product.images?.[0] || product.image_url;
  
  try {
    let imgSourceToDraw = imageUrl;
    let tempBlobUrl = null;

    // Try fetching first to create a local blob URL (guarantees no CORS canvas tainting)
    if (imageUrl) {
      try {
        const res = await fetch(imageUrl, { mode: 'cors' });
        if (res.ok) {
          const rawBlob = await res.blob();
          tempBlobUrl = URL.createObjectURL(rawBlob);
          imgSourceToDraw = tempBlobUrl;
        }
      } catch (e) {
        console.warn('Direct fetch failed, falling back to direct image URL for canvas:', e);
      }
    }

    // Generate single combined price card image (details + image in same image!)
    const cardBlob = await createProductPriceCardImage(product, unitPrice, imgSourceToDraw);
    if (tempBlobUrl) URL.revokeObjectURL(tempBlobUrl);

    const fileName = `${product.slug || 'product'}-price-card.jpg`;
    const file = new File([cardBlob], fileName, { type: 'image/jpeg' });

    // Copy caption text to clipboard automatically so user can paste into WhatsApp's "Add a caption..." box
    try {
      await navigator.clipboard.writeText(shareText);
    } catch (clipErr) {
      console.warn('Clipboard write failed:', clipErr);
    }

    // Try native file sharing (Mobile phones / Web Share API v2)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `${product.name} Price Card`,
        text: shareText
      });
      return;
    } else {
      // Desktop fallback: Download the combined card image and open WhatsApp!
      const cardBlobUrl = URL.createObjectURL(cardBlob);
      const a = document.createElement('a');
      a.href = cardBlobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(cardBlobUrl);

      alert('✅ Price Card Image downloaded & Details copied to clipboard!\n\nTo send TOGETHER as 1 single message in WhatsApp:\n1. Attach the downloaded image to your chat.\n2. PASTE (Ctrl+V) the copied details directly into the "Add a caption..." box at the bottom of the photo and click Send!');
      window.open('https://api.whatsapp.com/send', '_blank');
      return;
    }
  } catch (err) {
    console.error('Error generating combined share card, falling back to text share:', err);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  }
}
