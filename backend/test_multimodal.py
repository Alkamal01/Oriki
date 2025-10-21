"""
Test script for multi-modal endpoints
"""
import requests
import os

API_URL = "http://localhost:8000"

def test_health():
    """Test if server is running"""
    try:
        response = requests.get(f"{API_URL}/health")
        print("✅ Server is running")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Server not running: {e}")
        return False

def test_multimodal_ingest():
    """Test multi-modal ingestion with text only"""
    try:
        data = {
            "text": "Test proverb: Unity is strength",
            "culture": "Test Culture",
            "category": "proverb",
            "source": "Test",
            "language": "en"
        }
        
        response = requests.post(f"{API_URL}/multimodal/ingest", data=data)
        
        if response.status_code == 200:
            print("✅ Multi-modal ingest endpoint working")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"❌ Multi-modal ingest failed: {response.status_code}")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing multi-modal ingest: {e}")
        return False

def test_process_audio():
    """Test audio processing endpoint"""
    try:
        # Create a dummy audio file for testing
        files = {
            'file': ('test.wav', b'dummy audio data', 'audio/wav')
        }
        data = {
            'language': 'en'
        }
        
        response = requests.post(f"{API_URL}/multimodal/process-audio", files=files, data=data)
        
        if response.status_code == 200:
            print("✅ Audio processing endpoint working")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"⚠️  Audio processing returned: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing audio processing: {e}")
        return False

def test_process_image():
    """Test image processing endpoint"""
    try:
        # Create a dummy image file for testing
        files = {
            'file': ('test.jpg', b'dummy image data', 'image/jpeg')
        }
        
        response = requests.post(f"{API_URL}/multimodal/process-image", files=files)
        
        if response.status_code == 200:
            print("✅ Image processing endpoint working")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"⚠️  Image processing returned: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing image processing: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Multi-Modal Endpoints\n")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing server health...")
    if not test_health():
        print("\n❌ Server is not running. Start it with: python main.py")
        exit(1)
    
    # Test 2: Multi-modal ingest
    print("\n2. Testing multi-modal ingest...")
    test_multimodal_ingest()
    
    # Test 3: Audio processing
    print("\n3. Testing audio processing...")
    test_process_audio()
    
    # Test 4: Image processing
    print("\n4. Testing image processing...")
    test_process_image()
    
    print("\n" + "=" * 50)
    print("✅ Testing complete!")
    print("\nNote: Audio and image processing require OPENAI_API_KEY to be set")
    print("If you see errors, make sure to:")
    print("1. Restart the backend server (python main.py)")
    print("2. Set OPENAI_API_KEY in your .env file")
