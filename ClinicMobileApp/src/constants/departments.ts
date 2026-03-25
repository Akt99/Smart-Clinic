import {DepartmentInfo} from '../types/app';

export const DEPARTMENTS: DepartmentInfo[] = [
  {
    name: 'Psychiatry',
    description: 'Mental wellness, mood support, and emotional health guidance.',
    doctors: ['Dr. Sam Michael', 'Dr. Robin Ahmed'],
    imageUri: 'https://i.pinimg.com/1200x/95/50/7b/95507ba220ef508566c715ed9a6e13b1.jpg',
  },
  {
    name: 'Gynaecology',
    description: "Women's reproductive health, cycle care, and pregnancy support.",
    doctors: ['Dr. Tom Alter', 'Dr. Vikash Parekh'],
    imageUri: 'https://i.pinimg.com/1200x/04/44/ca/0444ca029f95209bba4f9c0dee1f82f5.jpg',
  },
  {
    name: 'Orthopaedics',
    description: 'Bone, joint, spine, and muscle-related treatment and recovery.',
    doctors: ['Dr. Ram Vilas', 'Dr. Amar Govind'],
    imageUri: 'https://i.pinimg.com/1200x/f0/7d/6c/f07d6c3299d53f64b121d4370d70a470.jpg',
  },
];
