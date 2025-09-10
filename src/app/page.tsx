'use client';

import { useState } from 'react';
import { Upload, Check, X, Download, CreditCard, Search, Shield, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserSelection, MatchResult, PaymentData, AppStep, Platform, Category, Gender } from '@/lib/types';
import { PLATFORMS, CATEGORIES, GENDERS, PRICING } from '@/lib/constants';
import { findFacialMatches, checkPlatformRegistration, maskSensitiveData } from '@/lib/facial-match';
import { generatePixCode, formatCurrency, generateId, downloadFile, cn } from '@/lib/utils';

export default function FacialMatchApp() {
  const [currentStep, setCurrentStep] = useState<AppStep>('selection');
  const [selection, setSelection] = useState<UserSelection>({
    platform: '99 Pop',
    category: 'Carro',
    gender: 'Masculino'
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
    }
  };

  const processImage = async () => {
    if (!uploadedFile) return;
    
    setCurrentStep('processing');
    setProcessing(true);
    setProgress(0);

    // Simula progresso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const results = await findFacialMatches(uploadedFile, selection);
      
      // Verifica cadastros nas plataformas
      for (const match of results) {
        match.hasRegistration = await checkPlatformRegistration(match.cpf, match.platform);
      }
      
      setMatches(results);
      setProgress(100);
      setTimeout(() => {
        setCurrentStep('results');
        setProcessing(false);
      }, 500);
    } catch (error) {
      console.error('Erro no processamento:', error);
      setProcessing(false);
    }
  };

  const selectMatch = (match: MatchResult) => {
    setSelectedMatch(match);
    
    // Gera dados de pagamento
    const payment: PaymentData = {
      pixCode: generatePixCode(),
      amount: PRICING.total,
      orderId: generateId(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
    };
    
    setPaymentData(payment);
    setCurrentStep('payment');
  };

  const confirmPayment = () => {
    setPaymentConfirmed(true);
    setTimeout(() => {
      setCurrentStep('download');
    }, 2000);
  };

  const downloadFiles = () => {
    if (!selectedMatch) return;

    const maskedData = maskSensitiveData(selectedMatch.name, selectedMatch.cpf);
    
    // Arquivo de texto com dados mascarados
    const textContent = `DADOS DO ARQUIVO
Nome: ${maskedData.name}
CPF: ${maskedData.cpf}
Plataforma: ${selectedMatch.platform}
Categoria: ${selectedMatch.category}
Similaridade: ${selectedMatch.similarity}%
Data: ${new Date().toLocaleDateString('pt-BR')}

IMPORTANTE: Este arquivo é confidencial e deve ser usado apenas para os fins acordados.`;

    // Download dos arquivos
    downloadFile(textContent, `dados_${selectedMatch.id}.txt`);
    
    // Simula download da foto (na prática seria o arquivo real)
    fetch(selectedMatch.photo)
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `foto_${selectedMatch.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  };

  const resetApp = () => {
    setCurrentStep('selection');
    setUploadedFile(null);
    setMatches([]);
    setSelectedMatch(null);
    setPaymentData(null);
    setPaymentConfirmed(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white dark:bg-blue-900 shadow-lg border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/c198f448-d048-4077-8563-2f6145ccadf9.jpg" 
                alt="Logo" 
                className="h-12 w-auto rounded-lg shadow-md" 
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  Sistema de Comparação Facial
                </h1>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Arquivos para motoristas de aplicativo
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              <Shield className="w-4 h-4 mr-1" />
              Dados Protegidos
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Etapa 1: Seleção de Opções */}
        {currentStep === 'selection' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Configure suas Preferências
              </h2>
              <p className="text-blue-700 dark:text-blue-300 max-w-2xl mx-auto">
                Selecione a plataforma, categoria e gênero desejados para encontrar o arquivo ideal
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Plataforma */}
              <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Plataforma
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setSelection(prev => ({ ...prev, platform }))}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 transition-all duration-300 text-left",
                        selection.platform === platform
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-800 text-blue-900 dark:text-blue-100"
                          : "border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600"
                      )}
                    >
                      {platform}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Categoria */}
              <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelection(prev => ({ ...prev, category }))}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 transition-all duration-300 text-left",
                        selection.category === category
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-800 text-blue-900 dark:text-blue-100"
                          : "border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600"
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Gênero */}
              <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Gênero
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {GENDERS.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelection(prev => ({ ...prev, gender }))}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 transition-all duration-300 text-left",
                        selection.gender === gender
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-800 text-blue-900 dark:text-blue-100"
                          : "border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600"
                      )}
                    >
                      {gender}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => setCurrentStep('upload')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Continuar para Upload
              </Button>
            </div>
          </div>
        )}

        {/* Etapa 2: Upload da Foto */}
        {currentStep === 'upload' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Envie sua Foto
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Faça upload de uma foto clara do rosto para comparação
              </p>
            </div>

            <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8">
                <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-8 text-center">
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden">
                        <img 
                          src={URL.createObjectURL(uploadedFile)} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-blue-900 dark:text-blue-100 font-medium">
                        {uploadedFile.name}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setUploadedFile(null)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        Trocar Foto
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-16 h-16 mx-auto text-blue-400" />
                      <div>
                        <p className="text-blue-900 dark:text-blue-100 font-medium mb-2">
                          Clique para selecionar uma foto
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Formatos aceitos: JPG, PNG (máx. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                          <span>Selecionar Foto</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {uploadedFile && (
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('selection')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={processImage}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  Processar Imagem
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Etapa 3: Processamento */}
        {currentStep === 'processing' && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Processando Imagem
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Comparando com nossa base de dados...
              </p>
            </div>

            <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {progress}% concluído
                  </p>
                </div>
                <p className="text-blue-700 dark:text-blue-300">
                  Analisando características faciais e buscando correspondências...
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Etapa 4: Resultados */}
        {currentStep === 'results' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Resultados Encontrados
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Encontramos {matches.length} correspondência(s) para suas preferências
              </p>
            </div>

            {matches.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match) => (
                  <Card key={match.id} className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="w-full h-48 rounded-lg overflow-hidden">
                          <img 
                            src={match.photo} 
                            alt="Correspondência" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge 
                              variant={match.similarity >= 90 ? "default" : "secondary"}
                              className="bg-blue-100 text-blue-800"
                            >
                              {match.similarity}% Similar
                            </Badge>
                            {!match.hasRegistration && (
                              <Badge variant="outline" className="text-green-600 border-green-300">
                                <Check className="w-3 h-3 mr-1" />
                                Disponível
                              </Badge>
                            )}
                            {match.hasRegistration && (
                              <Badge variant="destructive">
                                <X className="w-3 h-3 mr-1" />
                                Cadastrado
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                            <p><strong>Plataforma:</strong> {match.platform}</p>
                            <p><strong>Categoria:</strong> {match.category}</p>
                            <p><strong>Gênero:</strong> {match.gender}</p>
                          </div>
                        </div>

                        {!match.hasRegistration && (
                          <Button 
                            onClick={() => selectMatch(match)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Selecionar Arquivo
                          </Button>
                        )}
                        
                        {match.hasRegistration && (
                          <Button 
                            disabled
                            variant="outline"
                            className="w-full opacity-50 cursor-not-allowed"
                          >
                            Já Cadastrado na Plataforma
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8 text-center">
                  <X className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Nenhuma correspondência encontrada
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-6">
                    Não encontramos arquivos disponíveis para suas preferências
                  </p>
                  <Button 
                    onClick={() => setCurrentStep('selection')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Tentar Novamente
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('upload')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Voltar ao Upload
              </Button>
            </div>
          </div>
        )}

        {/* Etapa 5: Pagamento */}
        {currentStep === 'payment' && paymentData && selectedMatch && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Finalizar Pagamento
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Complete o pagamento para receber seus arquivos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Resumo do Pedido */}
              <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100">
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden mx-auto">
                    <img 
                      src={selectedMatch.photo} 
                      alt="Arquivo selecionado" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {selectedMatch.similarity}% Similar
                    </Badge>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      <p>{selectedMatch.platform} • {selectedMatch.category}</p>
                      <p>{selectedMatch.gender}</p>
                    </div>
                  </div>

                  <div className="border-t border-blue-200 dark:border-blue-700 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="flex items-center text-sm">
                        <ImageIcon className="w-4 h-4 mr-1" />
                        Arquivo de Foto
                      </span>
                      <span>{formatCurrency(PRICING.photoFile)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center text-sm">
                        <FileText className="w-4 h-4 mr-1" />
                        Arquivo de Texto
                      </span>
                      <span>{formatCurrency(PRICING.textFile)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-blue-200 dark:border-blue-700 pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(PRICING.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PIX */}
              <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100">
                    Pagamento PIX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!paymentConfirmed ? (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-800 p-4 rounded-lg">
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                          Código PIX:
                        </p>
                        <code className="text-xs bg-white dark:bg-blue-900 p-2 rounded block break-all">
                          {paymentData.pixCode}
                        </code>
                      </div>

                      <Alert>
                        <AlertDescription>
                          Escaneie o código QR ou copie o código PIX acima para realizar o pagamento
                        </AlertDescription>
                      </Alert>

                      <div className="text-center space-y-4">
                        <div className="w-48 h-48 bg-blue-100 dark:bg-blue-800 rounded-lg mx-auto flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-32 h-32 bg-white dark:bg-blue-900 rounded-lg mb-2 flex items-center justify-center">
                              <span className="text-xs text-blue-600">QR Code</span>
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Código simulado
                            </p>
                          </div>
                        </div>

                        <Button 
                          onClick={confirmPayment}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                          Simular Pagamento Confirmado
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-600 mb-2">
                          Pagamento Confirmado!
                        </h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          Redirecionando para download...
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Etapa 6: Download */}
        {currentStep === 'download' && selectedMatch && (
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                Download dos Arquivos
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Seus arquivos estão prontos para download
              </p>
            </div>

            <Card className="bg-white dark:bg-blue-900 border-blue-200 dark:border-blue-800">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Pagamento Aprovado!
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400">
                    Clique nos botões abaixo para baixar seus arquivos
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    onClick={downloadFiles}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-16"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Baixar Arquivos</div>
                      <div className="text-xs opacity-90">Foto + Dados</div>
                    </div>
                  </Button>

                  <Button 
                    variant="outline"
                    onClick={resetApp}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 h-16"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Nova Busca</div>
                      <div className="text-xs opacity-70">Buscar outros arquivos</div>
                    </div>
                  </Button>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Dados Protegidos:</strong> Os arquivos contêm informações mascaradas para sua segurança. 
                    Use apenas para os fins acordados.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-blue-900 border-t border-blue-200 dark:border-blue-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-blue-600 dark:text-blue-400">
            <p>© 2024 Sistema de Comparação Facial. Todos os direitos reservados.</p>
            <p className="mt-2">Dados protegidos com criptografia de ponta a ponta</p>
          </div>
        </div>
      </footer>
    </div>
  );
}