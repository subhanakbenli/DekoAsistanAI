import React from 'react';
import { DesignResultSection } from '../sections';

const DesignDetailContent = ({ design }) => {
  // StudioResultPanel'deki result objesi ile uyumlu hale getir
  const result = {
    design_id: design.design_id,
    design_title: design.design_title || design.title,
    design_description: design.design_description || design.description,
    room_type: design.room_type,
    design_style: design.design_style,
    hashtags: design.hashtags,
    product_suggestion: design.product_suggestion,
    products: design.products,
    // Studio'da olmayan ama detayda olan alanlar
    notes: design.notes,
    width: design.width,
    length: design.length,
    height: design.height,
  };

  // Mood board verisi, detay sayfasında olmadığı için mock veya null
  const moodBoard = design.image ? {
    image_data: `http://localhost:8000${design.image.image_url}`,
    prompt: design.design_title,
  } : null;

  return (
    <div className="mt-8">
      <DesignResultSection 
        result={result}
        moodBoard={moodBoard}
        progress={{}} // Detayda progress yok
        isMoodBoardLoading={false} // Detayda yükleme yok
      />
    </div>
  );
};

export default DesignDetailContent;
