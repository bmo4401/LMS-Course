import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.routes';
import env from './utils/env';
/* body parser */
app.use(express.json({ limit: '50mb' }));

/* cookie parser */
app.use(cookieParser());
/* cors */
app.use(
  cors({
    origin: env.ORIGIN,
  }),
);

/* routes */
app.use('/api/v1', userRouter);

/* testing api */
app.get('/text', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'Api working',
  });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);