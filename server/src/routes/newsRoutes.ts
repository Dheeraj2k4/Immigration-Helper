import { Router, Request, Response, NextFunction } from 'express';
import { newsService } from '../services/newsService';
import { Country, NewsCategory } from '../types/news';

const router = Router();

// GET /api/news/immigration
router.get('/immigration', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const page = _req.query.page as string | undefined;
    const pageSize = _req.query.pageSize ? Math.min(parseInt(_req.query.pageSize as string), 100) : 20;
    const country = _req.query.country as Country | undefined;
    const category = _req.query.category as NewsCategory | undefined;

    const articles = await newsService.getImmigrationNews({ 
      page, 
      pageSize,
      country,
      category
    });

    res.json({
      status: 'success',
      data: { totalResults: articles.length, articles }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/news/search
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = req.query.q as string;
    
    if (!q) {
      res.status(400).json({ status: 'error', message: 'Search query (q) is required' });
      return;
    }

    const page = req.query.page as string | undefined;
    const pageSize = req.query.pageSize ? Math.min(parseInt(req.query.pageSize as string), 100) : 20;
    const country = req.query.country as Country | undefined;
    const category = req.query.category as NewsCategory | undefined;

    const articles = await newsService.searchImmigrationNews(q, { 
      page, 
      pageSize,
      country,
      category
    });

    res.json({
      status: 'success',
      data: { query: q, totalResults: articles.length, articles }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/news/top-headlines
router.get('/top-headlines', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const pageSize = _req.query.pageSize ? Math.min(parseInt(_req.query.pageSize as string), 100) : 10;
    const country = _req.query.country as Country | undefined;
    const category = _req.query.category as NewsCategory | undefined;

    const articles = await newsService.getTopImmigrationHeadlines({ 
      pageSize,
      country,
      category
    });

    res.json({
      status: 'success',
      data: { totalResults: articles.length, articles }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
