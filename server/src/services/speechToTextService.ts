/**
 * Google Speech-to-Text Service
 * Converts audio files to text transcripts
 */

import { SpeechClient } from '@google-cloud/speech';
import { SpeechToTextResult } from '../types/interview';
import fs from 'fs';
import path from 'path';

class SpeechToTextService {
  private client: SpeechClient | null = null;

  private initialize() {
    if (!this.client) {
      // Initialize Speech-to-Text client
      // Credentials can be provided via:
      // 1. GOOGLE_APPLICATION_CREDENTIALS environment variable pointing to JSON key file
      // 2. Or explicitly pass credentials in the constructor
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      
      if (credentialsPath && fs.existsSync(credentialsPath)) {
        this.client = new SpeechClient({
          keyFilename: credentialsPath,
        });
      } else {
        // Try to initialize without explicit credentials (uses default application credentials)
        // This will fail when actually used if no credentials are configured
        this.client = new SpeechClient();
      }
    }
  }

  /**
   * Convert audio file to text using Google Speech-to-Text API
   * @param audioFilePath Path to the audio file
   * @returns Transcript and confidence score
   */
  async convertSpeechToText(audioFilePath: string): Promise<SpeechToTextResult> {
    this.initialize();
    if (!this.client) {
      throw new Error('Speech-to-Text client not initialized');
    }
    
    const client = this.client; // Store in local variable for TypeScript
    
    try {
      // Read the audio file
      const audioBytes = fs.readFileSync(audioFilePath).toString('base64');

      // Detect file extension to determine encoding
      const ext = path.extname(audioFilePath).toLowerCase();
      const encoding = this.getAudioEncoding(ext);

      // Configure recognition request
      const audio = {
        content: audioBytes,
      };

      const config = {
        encoding: encoding,
        sampleRateHertz: 16000, // Standard sample rate
        languageCode: 'en-US', // Can be made configurable
        enableAutomaticPunctuation: true,
        model: 'default', // Can use 'video' or 'phone_call' for specific use cases
      };

      const request = {
        audio: audio,
        config: config,
      };

      // Perform speech recognition
      const [response] = await client.recognize(request);
      
      if (!response.results || response.results.length === 0) {
        return {
          transcript: '',
          confidence: 0,
        };
      }

      // Get the first result (usually the best one)
      const transcription = response.results
        .map((result: any) => result.alternatives?.[0]?.transcript || '')
        .join('\n');

      const confidence =
        response.results[0]?.alternatives?.[0]?.confidence || 0;

      return {
        transcript: transcription,
        confidence: confidence,
      };
    } catch (error) {
      console.error('Error converting speech to text:', error);
      throw new Error('Failed to convert speech to text. Please ensure the audio file is valid.');
    }
  }

  /**
   * Convert audio file to text with streaming for large files
   * @param audioFilePath Path to the audio file
   * @returns Transcript and confidence score
   */
  async convertSpeechToTextStreaming(audioFilePath: string): Promise<SpeechToTextResult> {
    this.initialize();
    if (!this.client) {
      throw new Error('Speech-to-Text client not initialized');
    }
    
    const client = this.client; // Store in local variable for TypeScript
    
    try {
      const ext = path.extname(audioFilePath).toLowerCase();
      const encoding = this.getAudioEncoding(ext);

      const config = {
        encoding: encoding,
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
      };

      const recognizeStream = client
        .streamingRecognize({ config })
        .on('error', (error) => {
          throw error;
        });

      let transcript = '';
      let confidence = 0;

      return new Promise((resolve, reject) => {
        recognizeStream.on('data', (data) => {
          const result = data.results[0];
          if (result && result.alternatives && result.alternatives[0]) {
            transcript += result.alternatives[0].transcript;
            confidence = result.alternatives[0].confidence || 0;
          }
        });

        recognizeStream.on('end', () => {
          resolve({
            transcript: transcript,
            confidence: confidence,
          });
        });

        recognizeStream.on('error', (error) => {
          reject(error);
        });

        // Stream the audio file
        fs.createReadStream(audioFilePath).pipe(recognizeStream);
      });
    } catch (error) {
      console.error('Error in streaming speech to text:', error);
      throw new Error('Failed to convert speech to text using streaming.');
    }
  }

  /**
   * Determine audio encoding based on file extension
   * @param extension File extension
   * @returns Audio encoding type
   */
  private getAudioEncoding(extension: string): any {
    const encodingMap: { [key: string]: string } = {
      '.wav': 'LINEAR16',
      '.flac': 'FLAC',
      '.mp3': 'MP3',
      '.ogg': 'OGG_OPUS',
      '.webm': 'WEBM_OPUS',
    };

    return encodingMap[extension] || 'LINEAR16';
  }
}

// Export singleton instance
export default new SpeechToTextService();
