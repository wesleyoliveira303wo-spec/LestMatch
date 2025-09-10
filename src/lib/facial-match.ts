import { UserSelection, MatchResult } from './types';
import { MOCK_DATABASE, SIMILARITY_THRESHOLD } from './constants';

// Simula API de comparação facial
export async function findFacialMatches(
  uploadedImage: File,
  selection: UserSelection
): Promise<MatchResult[]> {
  // Simula processamento da API
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Filtra dados baseado na seleção do usuário
  const filteredData = MOCK_DATABASE.filter(person => 
    person.platform === selection.platform &&
    person.category === selection.category &&
    person.gender === selection.gender
  );
  
  // Simula porcentagens de similaridade
  const matches: MatchResult[] = filteredData.map(person => ({
    ...person,
    similarity: Math.floor(Math.random() * (95 - SIMILARITY_THRESHOLD) + SIMILARITY_THRESHOLD)
  }));
  
  // Ordena por maior similaridade
  return matches.sort((a, b) => b.similarity - a.similarity);
}

// Verifica se CPF tem cadastro na plataforma
export async function checkPlatformRegistration(
  cpf: string, 
  platform: string
): Promise<boolean> {
  // Simula verificação na API da plataforma
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Retorna resultado simulado
  return Math.random() > 0.7; // 30% chance de ter cadastro
}

// Mascara dados sensíveis
export function maskSensitiveData(name: string, cpf: string) {
  const maskedName = name.split(' ').map((part, index) => {
    if (index === 0) return part; // Primeiro nome completo
    return part.charAt(0) + '*'.repeat(part.length - 1);
  }).join(' ');
  
  const maskedCpf = cpf.replace(/(\d{3})\.\d{3}\.\d{3}-(\d{2})/, '$1.***.***-$2');
  
  return { name: maskedName, cpf: maskedCpf };
}