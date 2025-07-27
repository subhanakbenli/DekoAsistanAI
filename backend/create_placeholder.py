"""
Create a better placeholder image for testing
"""
from PIL import Image, ImageDraw, ImageFont
import base64
import io
import random

def create_realistic_placeholder(prompt: str, width: int = 512, height: int = 512) -> str:
    """Create a realistic placeholder image based on prompt"""
    
    # Create image with random background color
    colors = [
        (240, 240, 240),  # Light gray
        (250, 250, 220),  # Light beige
        (245, 245, 255),  # Light blue
        (255, 250, 240),  # Light orange
        (240, 255, 240),  # Light green
    ]
    
    bg_color = random.choice(colors)
    image = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(image)
    
    # Add some geometric shapes for design feel
    for _ in range(5):
        x1, y1 = random.randint(0, width//2), random.randint(0, height//2)
        x2, y2 = x1 + random.randint(50, 150), y1 + random.randint(50, 150)
        
        shape_color = tuple(random.randint(100, 200) for _ in range(3))
        draw.rectangle([x1, y1, x2, y2], fill=shape_color, outline=None)
    
    # Add text
    try:
        # Try to use a system font
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        font = ImageFont.load_default()
    
    # Add prompt text
    text_lines = [
        "MOCK DESIGN",
        f"Prompt: {prompt[:30]}...",
        "Generated with Placeholder",
        f"Size: {width}x{height}",
        "Replace with real Imagen API"
    ]
    
    y_offset = 50
    for line in text_lines:
        draw.text((50, y_offset), line, fill=(60, 60, 60), font=font)
        y_offset += 40
    
    # Convert to base64
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    image_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return image_base64

if __name__ == "__main__":
    # Test the function
    test_prompt = "Modern living room with minimalist design"
    base64_data = create_realistic_placeholder(test_prompt)
    
    print(f"Generated base64 length: {len(base64_data)}")
    print(f"First 50 chars: {base64_data[:50]}")
    
    # Save test image
    with open("test_placeholder.png", "wb") as f:
        f.write(base64.b64decode(base64_data))
    
    print("Test image saved as 'test_placeholder.png'")
