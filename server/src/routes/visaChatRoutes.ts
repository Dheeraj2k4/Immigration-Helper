import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

// Configuration for RAG service
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

/**
 * @route   POST /api/visa-chat/query
 * @desc    Query the RAG chatbot for visa/immigration information
 * @access  Public
 */
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { query, session_id, language } = req.body;

    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Query is required and must be a non-empty string'
      });
    }

    if (query.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Query must be less than 1000 characters'
      });
    }

    // Validate language (allow only known codes, fallback to 'en')
    const allowedLanguages = ['en', 'es', 'hi', 'te'];
    const resolvedLanguage = allowedLanguages.includes(language) ? language : 'en';

    // Forward request to RAG service
    const response = await axios.post(
      `${RAG_SERVICE_URL}/api/v1/chat/query`,
      {
        query: query.trim(),
        session_id: session_id || undefined,
        language: resolvedLanguage,
      },
      {
        timeout: 120000, // 120 second timeout (Ollama LLM can be slow)
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Return successful response
    return res.json({
      success: true,
      message: 'Query processed successfully',
      data: response.data
    });
  } catch (error: any) {
    console.error('Error querying RAG service:', error.message);

    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          success: false,
          error: 'RAG service is currently unavailable. Please try again later.'
        });
      }

      if (error.response) {
        // RAG service returned an error
        return res.status(error.response.status).json({
          success: false,
          error: error.response.data?.error || 'Error processing query',
          details: error.response.data
        });
      }

      if (error.request) {
        // Request was made but no response received
        return res.status(504).json({
          success: false,
          error: 'RAG service request timeout'
        });
      }
    }

    // Generic error
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while processing your query'
    });
  }
});

/**
 * @route   GET /api/visa-chat/health
 * @desc    Check RAG service health
 * @access  Public
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(`${RAG_SERVICE_URL}/health`, {
      timeout: 5000,
    });

    return res.json({
      success: true,
      message: 'RAG service is healthy',
      data: {
        rag_service: response.data,
        integration: 'operational',
      }
    });
  } catch (error: any) {
    console.error('RAG service health check failed:', error.message);

    return res.status(503).json({
      success: false,
      error: 'RAG service is unavailable',
      details: {
        integration: 'degraded',
        error: error.message,
      }
    });
  }
});

/**
 * @route   POST /api/visa-chat/upload
 * @desc    Upload document to RAG service (admin only - add auth middleware as needed)
 * @access  Private/Admin
 * @note    Requires multer or similar file upload middleware to be configured
 */
// Commented out until file upload middleware is configured
// router.post('/upload', async (req: Request, res: Response) => {
//   try {
//     // TODO: Add authentication/authorization middleware
//     // TODO: Configure multer middleware for file uploads
//     
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         error: 'No file uploaded'
//       });
//     }
//
//     // Forward file to RAG service using FormData
//     const FormData = require('form-data');
//     const fs = require('fs');
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);
//
//     const response = await axios.post(
//       `${RAG_SERVICE_URL}/api/v1/documents/upload`,
//       formData,
//       {
//         headers: formData.getHeaders(),
//         timeout: 60000,
//       }
//     );
//
//     return res.json({
//       success: true,
//       message: 'Document uploaded successfully',
//       data: response.data
//     });
//   } catch (error: any) {
//     console.error('Error uploading document to RAG service:', error.message);
//
//     if (axios.isAxiosError(error) && error.response) {
//       return res.status(error.response.status).json({
//         success: false,
//         error: error.response.data?.message || 'Error uploading document',
//         details: error.response.data
//       });
//     }
//
//     return res.status(500).json({
//       success: false,
//       error: 'An unexpected error occurred while uploading document'
//     });
//   }
// });

export default router;
