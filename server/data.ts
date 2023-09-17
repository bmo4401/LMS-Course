import { ICourse } from './src/models/course.model';

export const courseData: ICourse = {
  name: 'MERN Stack',
  description: 'Welcome',
  price: 29,
  estimatedPrice: 80,
  tags: 'MERN',
  level: 'Intermediate',
  demoUrl: 'no',
  benefits: [{ title: 'You will be able to build MERN' }],
  prerequisites: [
    {
      title: 'No thing',
    },
  ],
  courseData: [
    {
      videoUrl: 'no',
      title: 'Project folder',
      videoSection: 'Planing',
      description: 'Welcome',
      videoLength: 12,
      links: [
        {
          title: 'source code',
          url: 'no',
        },
      ],
    },
  ],
};
