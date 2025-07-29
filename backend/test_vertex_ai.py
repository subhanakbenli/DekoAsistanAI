"""
Test script for Vertex AI Imagen integration
"""
import os
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_vertex_ai_imagen():
    """Test Vertex AI Imagen connection and image generation"""
    
    print("🧪 Testing Vertex AI Imagen Integration")
    print("=" * 50)
    
    try:
        # Check environment variables
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT_ID")
        credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        
        print(f"📋 Project ID: {project_id}")
        print(f"🔑 Credentials: {credentials_path}")
        print(f"🔍 Credentials file exists: {os.path.exists(credentials_path) if credentials_path else False}")
        print()
        
        # Test imports
        print("📦 Testing imports...")
        try:
            from google.cloud import aiplatform
            print("✅ google.cloud.aiplatform imported successfully")
            
            from vertexai.preview.vision_models import ImageGenerationModel
            print("✅ vertexai.preview.vision_models imported successfully")
            
            import vertexai
            print("✅ vertexai imported successfully")
            
        except ImportError as e:
            print(f"❌ Import error: {str(e)}")
            return
        
        print()
        
        # Initialize Vertex AI
        print("🚀 Initializing Vertex AI...")
        try:
            vertexai.init(
                project=project_id,
                location="us-central1"
            )
            print("✅ Vertex AI initialized successfully")
        except Exception as e:
            print(f"❌ Vertex AI initialization error: {str(e)}")
            return
        
        print()
        
        # Test model loading
        print("🤖 Loading Imagen model...")
        try:
            model = ImageGenerationModel.from_pretrained("imagegeneration@006")
            print("✅ Imagen model loaded successfully")
        except Exception as e:
            print(f"❌ Model loading error: {str(e)}")
            return
        
        print()
        
        # Test image generation
        print("🎨 Testing image generation...")
        try:
            test_prompt = "Modern living room interior design mood board, minimalist style, clean composition"
            print(f"🎯 Prompt: {test_prompt}")
            
            def generate_sync():
                return model.generate_images(
                    prompt=test_prompt,
                    number_of_images=1,
                    aspect_ratio="1:1",
                    safety_filter_level="block_some",
                    person_generation="dont_allow"
                )
            
            # Run generation
            loop = asyncio.get_event_loop()
            images = await loop.run_in_executor(None, generate_sync)
            
            if images and hasattr(images, 'images') and len(images.images) > 0:
                print(f"✅ Successfully generated {len(images.images)} image(s)")
                
                # Test image conversion
                import io
                import base64
                
                image = images.images[0]  # Get first image from images list
                image_bytes = io.BytesIO()
                image._pil_image.save(image_bytes, format='PNG')
                image_bytes.seek(0)
                
                base64_string = base64.b64encode(image_bytes.getvalue()).decode('utf-8')
                print(f"✅ Image converted to base64 (length: {len(base64_string)} chars)")
                
                # Save test image
                test_image_path = "test_generated_mood_board.png"
                with open(test_image_path, 'wb') as f:
                    f.write(image_bytes.getvalue())
                print(f"✅ Test image saved as: {test_image_path}")
                
            else:
                print("❌ No images generated")
                
        except Exception as e:
            print(f"❌ Image generation error: {str(e)}")
            return
        
        print()
        print("🎉 All tests passed! Vertex AI Imagen is working correctly.")
        
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_vertex_ai_imagen())
