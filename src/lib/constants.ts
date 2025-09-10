import { Platform, Category, Gender } from './types';

export const PLATFORMS: Platform[] = ['99 Pop', 'Uber', 'Abas'];
export const CATEGORIES: Category[] = ['Carro', 'Moto'];
export const GENDERS: Gender[] = ['Masculino', 'Feminino'];

export const PRICING = {
  photoFile: 25.00,
  textFile: 15.00,
  total: 40.00
};

export const SIMILARITY_THRESHOLD = 75; // Porcentagem mínima de similaridade

// Dados simulados para demonstração
export const MOCK_DATABASE = [
  {
    id: '1',
    name: 'João Silva Santos',
    cpf: '123.456.789-01',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    platform: '99 Pop' as Platform,
    category: 'Carro' as Category,
    gender: 'Masculino' as Gender,
    hasRegistration: false
  },
  {
    id: '2',
    name: 'Maria Oliveira Costa',
    cpf: '987.654.321-09',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
    platform: 'Uber' as Platform,
    category: 'Carro' as Category,
    gender: 'Feminino' as Gender,
    hasRegistration: false
  },
  {
    id: '3',
    name: 'Carlos Eduardo Lima',
    cpf: '456.789.123-45',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    platform: 'Abas' as Platform,
    category: 'Moto' as Category,
    gender: 'Masculino' as Gender,
    hasRegistration: true
  },
  {
    id: '4',
    name: 'Ana Paula Ferreira',
    cpf: '789.123.456-78',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    platform: '99 Pop' as Platform,
    category: 'Moto' as Category,
    gender: 'Feminino' as Gender,
    hasRegistration: false
  },
  {
    id: '5',
    name: 'Roberto Almeida Souza',
    cpf: '321.654.987-12',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    platform: 'Uber' as Platform,
    category: 'Carro' as Category,
    gender: 'Masculino' as Gender,
    hasRegistration: false
  }
];