"""
Simple test script to verify Mistral 7B is working with Ollama
"""
import requests
import json

def test_mistral():
    """Test Mistral 7B via Ollama API"""
    url = "http://localhost:11434/api/generate"
    
    payload = {
        "model": "mistral:latest",
        "prompt": "What documents do I need for an F1 visa? Please provide a brief answer.",
        "stream": False
    }
    
    print("Testing Mistral 7B via Ollama...")
    print(f"Prompt: {payload['prompt']}\n")
    
    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        answer = result.get("response", "")
        
        print("Response from Mistral:")
        print("-" * 50)
        print(answer)
        print("-" * 50)
        print("\n✓ Mistral 7B is working correctly!")
        
        return True
    except requests.exceptions.ConnectionError:
        print("✗ Error: Could not connect to Ollama. Is it running?")
        print("Start Ollama with: ollama serve")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    test_mistral()
