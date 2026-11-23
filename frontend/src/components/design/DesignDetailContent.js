import React from 'react';
import { DesignResultSection } from '../sections';

const DesignDetailContent = ({ design }) => {
  // Match the shape of the result object used in StudioResultPanel
  const result = {
    design_id: design.design_id,
    design_title: design.design_title || design.title,
    design_description: design.design_description || design.description,
    room_type: design.room_type,
    design_style: design.design_style,
    hashtags: design.hashtags,
    product_suggestion: design.product_suggestion,
    products: design.products,
    // Fields shown on the detail page but not in the studio - user inputs
    notes: design.notes,
    width: design.width,
    length: design.length,
    height: design.height,
    colorPalette: design.color_info, // Color palette info from the backend
    price: design.price, // Price limit from the backend
    productCategories: design.product_categories // Product categories from the backend
  };

  // No mood board data on the detail page, so mock or null
  const moodBoard = design.image ? {
    image_data: `http://localhost:8000${design.image.image_url}`,
    prompt: design.design_title,
  } : null;

  return (
    <div className="mt-8">
      <DesignResultSection 
        result={result}
        moodBoard={moodBoard}
        progress={{}} // No progress on the detail page
        isMoodBoardLoading={false} // No loading state on the detail page
      />
    </div>
  );
};

export default DesignDetailContent;
