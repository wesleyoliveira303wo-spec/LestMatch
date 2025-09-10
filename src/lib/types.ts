export interface UserSelection {
  platform: Platform;
  category: Category;
  gender: Gender;
}

export interface MatchResult {
  id: string;
  name: string;
  cpf: string;
  photo: string;
  similarity: number;
  hasRegistration: boolean;
  platform: Platform;
  category: Category;
  gender: Gender;
}

export interface PaymentData {
  pixCode: string;
  amount: number;
  orderId: string;
  expiresAt: Date;
}

export interface FileDownload {
  photoFile: string;
  textFile: string;
  maskedData: {
    name: string;
    cpf: string;
  };
}

export type Platform = '99 Pop' | 'Uber' | 'Abas';
export type Category = 'Carro' | 'Moto';
export type Gender = 'Masculino' | 'Feminino';

export type AppStep = 
  | 'selection' 
  | 'upload' 
  | 'processing' 
  | 'results' 
  | 'payment' 
  | 'download';