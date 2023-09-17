import { NextFunction, Request, Response } from 'express';
import cloudinary from 'cloudinary';
import LayoutModel, { FaqItem, Layout } from '../models/layout.model';
import { LayoutType } from '../../@types/custom';
import { CatchAsyncError } from '../../middleware/catchAsyncError';
import ErrorHandler from '../../utils/ErrorHandler';
/* create layout */
interface ICreateLayout {
  type: LayoutType;
}
export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body as ICreateLayout;
      const isExitType = await LayoutModel.findOne({ type });
      if (isExitType) {
        return next(new ErrorHandler('Type already existing', 400));
      }
      if (type === 'Banner') {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: 'layout',
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.create({ type: 'Banner', banner });
      }
      if (type === 'FAQ') {
        const { faq } = req.body as { faq: FaqItem[] };
        await LayoutModel.create({ type: 'FAQ', faq });
      }
      if (type === 'Categories') {
        const { categories } = req.body;
        console.log(
          '❄️ ~ file: layout.controller.ts:40 ~ categories:',
          categories,
        );
        await LayoutModel.create({ type: 'Categories', categories });
      } else {
        return next(new ErrorHandler("Type don't existing", 400));
      }
      res.status(200).json({
        success: true,
        message: 'Layout created successfully',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* edit layout */
export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body as ICreateLayout;
      console.log('❄️ ~ file: layout.controller.ts:63 ~ type:', type);
      if (!type) {
        return next(new ErrorHandler('Missing parameter type', 400));
      }
      const isExistingType = await LayoutModel.findOne({ type });
      if (!isExistingType) {
        return next(new ErrorHandler(`Type ${type} not found`, 400));
      }

      if (type === 'Banner') {
        const { image, title, subTitle } = req.body;
        const bannerData = await LayoutModel.findOne({ type });
        await cloudinary.v2.uploader.destroy(
          bannerData?.banner.image.public_id!,
        );
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: 'layout',
        });
        const banner = {
          type: 'Banner',
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.findByIdAndUpdate(isExistingType._id, banner);
      }
      if (type === 'FAQ') {
        const { faq } = req.body as { faq: FaqItem[] };
        await LayoutModel.findByIdAndUpdate(isExistingType._id, {
          type: 'FAQ',
          faq,
        });
      }
      if (type === 'Categories') {
        const { categories } = req.body;

        await LayoutModel.findByIdAndUpdate(isExistingType._id, {
          type: 'Categories',
          categories,
        });
      }
      res.status(200).json({
        success: true,
        message: 'Layout updated successfully',
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

/* get layout by type */
export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const layout = await LayoutModel.findOne(req.body.type);
      res.status(201).json({
        success: true,
        layout,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
