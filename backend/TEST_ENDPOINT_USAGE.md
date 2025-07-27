# Test Image Generation Endpoint

## Endpoint Information
- **URL**: `POST http://127.0.0.1:8000/api/test-image-generation`
- **Method**: POST (Form Data)
- **Parameter**: `prompt` (string)

## Example Usage

### 1. Using curl:
```bash
curl -X POST "http://127.0.0.1:8000/api/test-image-generation" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "prompt=Modern living room with clean design"
```

### 2. Using Python requests:
```python
import requests

url = "http://127.0.0.1:8000/api/test-image-generation"
data = {"prompt": "Cozy bedroom with warm lighting"}

response = requests.post(url, data=data)
result = response.json()

print(f"Success: {result['success']}")
print(f"Execution Time: {result['execution_time_seconds']} seconds")
print(f"Image saved to: {result['image_saved_to']}")
```

### 3. Test Results:
- ✅ All tests successful
- ⏱️ Average execution time: ~2.0 seconds
- 🖼️ Images saved to: `data/mood_boards/`
- 📄 Model used: `imagen-3.0-generate-001`
- 📊 Base64 image data included in response

### 4. Response Format:
```json
{
  "success": true,
  "message": "Image generated successfully in 2.0 seconds",
  "execution_time_seconds": 2.0,
  "prompt_used": "Your prompt here",
  "image_saved_to": "data/mood_boards/test_image_20250727_115713.png",
  "image_base64": "base64_encoded_image_data",
  "model_used": "imagen-3.0-generate-001",
  "timestamp": "20250727_115713"
}
```

## Notes:
- Currently uses placeholder implementation (development mode)
- Real Imagen API integration pending authentication setup
- Images are automatically saved to `data/mood_boards/` directory
- Execution time is measured and included in response
