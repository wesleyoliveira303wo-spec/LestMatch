"use client"

import { useState } from 'react'
import { Upload, Download, Check, X, CreditCard, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

interface MatchResult {
  id: string
  name: string
  cpf: string
  similarity: number
  photo: string
  hasRegistration: boolean
  platforms: string[]
}

interface PaymentData {
  pixCode: string
  amount: number
  orderId: string
}

export default function FacialMatchApp() {
  const [platform, setPlatform] = useState('')
  const [category, setCategory] = useState('')
  const [gender, setGender] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [matchResults, setMatchResults] = useState<MatchResult[]>([])
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      
      // Criar URL para preview da imagem
      const imageUrl = URL.createObjectURL(file)
      setUploadedImageUrl(imageUrl)
    }
  }

  const maskCPF = (cpf: string) => {
    return showSensitiveData ? cpf : `***.***.***-${cpf.slice(-2)}`
  }

  const maskName = (name: string) => {
    if (showSensitiveData) return name
    const parts = name.split(' ')
    return parts.length > 1 
      ? `${parts[0]} ${'*'.repeat(parts[1].length)}`
      : `${name.slice(0, 2)}${'*'.repeat(name.length - 2)}`
  }

  const processImage = async () => {
    if (!uploadedFile || !platform || !category || !gender) return

    setIsProcessing(true)
    
    // Simular processamento de IA
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Resultados simulados
    const mockResults: MatchResult[] = [
      {
        id: '1',
        name: 'João Silva Santos',
        cpf: '123.456.789-01',
        similarity: 94.5,
        photo: '/api/placeholder/150/150',
        hasRegistration: platform === 'uber',
        platforms: platform === 'uber' ? ['uber'] : []
      },
      {
        id: '2',
        name: 'Carlos Eduardo Lima',
        cpf: '987.654.321-02',
        similarity: 89.2,
        photo: '/api/placeholder/150/150',
        hasRegistration: false,
        platforms: []
      },
      {
        id: '3',
        name: 'Roberto Alves Costa',
        cpf: '456.789.123-03',
        similarity: 85.7,
        photo: '/api/placeholder/150/150',
        hasRegistration: platform === '99pop',
        platforms: platform === '99pop' ? ['99pop'] : []
      }
    ]

    setMatchResults(mockResults)
    setIsProcessing(false)
  }

  const selectMatch = (match: MatchResult) => {
    setSelectedMatch(match)
    
    // Gerar PIX simulado
    const payment: PaymentData = {
      pixCode: `00020126580014BR.GOV.BCB.PIX0136${Math.random().toString(36).substr(2, 32)}5204000053039865802BR5925FACIAL MATCH SYSTEM6009SAO PAULO62070503***6304${Math.random().toString(4).substr(2, 4)}`,
      amount: 49.90,
      orderId: `FM${Date.now()}`
    }
    setPaymentData(payment)
  }

  const simulatePayment = () => {
    setTimeout(() => {
      setIsPaid(true)
    }, 2000)
  }

  const downloadFiles = () => {
    // Simular download dos arquivos SEM nome e CPF
    const photoBlob = new Blob(['Arquivo de foto simulado'], { type: 'image/jpeg' })
    const textBlob = new Blob([`Dados do arquivo:
Similaridade: ${selectedMatch!.similarity}%
Plataforma: ${platform}
Categoria: ${category}
Gênero: ${gender}
Data da análise: ${new Date().toLocaleString()}
ID do arquivo: ${selectedMatch!.id}
Status: ${selectedMatch!.hasRegistration ? 'Cadastrado' : 'Disponível'}`], { type: 'text/plain' })
    
    const photoUrl = URL.createObjectURL(photoBlob)
    const textUrl = URL.createObjectURL(textBlob)
    
    const photoLink = document.createElement('a')
    photoLink.href = photoUrl
    photoLink.download = `foto_${selectedMatch!.id}.jpg`
    photoLink.click()
    
    const textLink = document.createElement('a')
    textLink.href = textUrl
    textLink.download = `dados_${selectedMatch!.id}.txt`
    textLink.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header com Logo */}
      <header className="border-b border-orange-500/20 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/c198f448-d048-4077-8563-2f6145ccadf9.jpg" 
              alt="Logo" 
              className="h-12 w-auto rounded-lg shadow-lg shadow-orange-500/20"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                Facial Match System
              </h1>
              <p className="text-sm text-gray-400">Sistema de Comparação Facial para Motoristas</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Configurações Iniciais */}
        <Card className="mb-8 bg-gray-800/50 border-orange-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-orange-400">Configurações do Perfil</CardTitle>
            <CardDescription className="text-gray-300">
              Selecione suas preferências para encontrar o melhor match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Plataforma */}
              <div className="space-y-3">
                <Label className="text-orange-300 font-medium">Plataforma</Label>
                <RadioGroup value={platform} onValueChange={setPlatform}>
                  {['99pop', 'uber'].map((p) => (
                    <div key={p} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={p} 
                        id={p} 
                        className="border-orange-400 text-orange-400"
                      />
                      <Label htmlFor={p} className="capitalize text-gray-200 cursor-pointer">
                        {p === '99pop' ? '99 Pop' : p.charAt(0).toUpperCase() + p.slice(1)}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Categoria */}
              <div className="space-y-3">
                <Label className="text-red-300 font-medium">Categoria</Label>
                <RadioGroup value={category} onValueChange={setCategory}>
                  {['carro', 'moto'].map((c) => (
                    <div key={c} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={c} 
                        id={c} 
                        className="border-red-400 text-red-400"
                      />
                      <Label htmlFor={c} className="capitalize text-gray-200 cursor-pointer">
                        {c}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Gênero */}
              <div className="space-y-3">
                <Label className="text-purple-300 font-medium">Gênero</Label>
                <RadioGroup value={gender} onValueChange={setGender}>
                  {['masculino', 'feminino'].map((g) => (
                    <div key={g} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={g} 
                        id={g} 
                        className="border-purple-400 text-purple-400"
                      />
                      <Label htmlFor={g} className="capitalize text-gray-200 cursor-pointer">
                        {g}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload de Foto */}
        <Card className="mb-8 bg-gray-800/50 border-orange-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-orange-400">Upload da Foto</CardTitle>
            <CardDescription className="text-gray-300">
              Envie uma foto clara do rosto para comparação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                {/* Botão de Upload Redondo */}
                <div className="relative">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-orange-500/30 hover:border-orange-500/50 transition-colors flex items-center justify-center bg-gray-900/30 overflow-hidden">
                      {uploadedImageUrl ? (
                        <img 
                          src={uploadedImageUrl} 
                          alt="Foto enviada" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto h-8 w-8 text-orange-400 mb-2" />
                          <span className="text-xs text-orange-300 font-medium">
                            Clique para enviar
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </Label>
                </div>
                
                <p className="text-sm text-gray-400 text-center">
                  PNG, JPG até 10MB
                </p>
              </div>
              
              {uploadedFile && (
                <Alert className="bg-green-900/20 border-green-500/30">
                  <Check className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-300">
                    Arquivo carregado: {uploadedFile.name}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={processImage}
                disabled={!uploadedFile || !platform || !category || !gender || isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  'Iniciar Comparação'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {matchResults.length > 0 && (
          <Card className="mb-8 bg-gray-800/50 border-orange-500/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-orange-400">Resultados da Comparação</CardTitle>
                <CardDescription className="text-gray-300">
                  Encontramos {matchResults.length} possíveis matches
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSensitiveData(!showSensitiveData)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {matchResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="border border-gray-700 rounded-lg p-4 hover:border-orange-500/50 transition-colors cursor-pointer"
                    onClick={() => selectMatch(result)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">👤</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{maskName(result.name)}</h3>
                          <p className="text-sm text-gray-400">CPF: {maskCPF(result.cpf)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={result.similarity} className="w-24 h-2" />
                            <span className="text-sm font-medium text-orange-400">
                              {result.similarity}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {result.hasRegistration ? (
                          <Badge variant="destructive" className="bg-red-900/50 text-red-300 border-red-500/30">
                            Cadastrado
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-500/30">
                            Disponível
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagamento */}
        {selectedMatch && paymentData && !isPaid && (
          <Card className="mb-8 bg-gray-800/50 border-orange-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-orange-400">Pagamento PIX</CardTitle>
              <CardDescription className="text-gray-300">
                Complete o pagamento para receber os arquivos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Arquivo selecionado:</span>
                  <span className="text-white font-medium">{maskName(selectedMatch.name)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Similaridade:</span>
                  <span className="text-orange-400 font-medium">{selectedMatch.similarity}%</span>
                </div>
                <Separator className="my-3 bg-gray-700" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Valor:</span>
                  <span className="text-2xl font-bold text-green-400">R$ {paymentData.amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Código PIX:</p>
                <code className="text-xs bg-gray-800 p-2 rounded block break-all text-gray-300">
                  {paymentData.pixCode}
                </code>
              </div>

              <Button 
                onClick={simulatePayment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Simular Pagamento
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Download */}
        {isPaid && selectedMatch && (
          <Card className="bg-gray-800/50 border-green-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-green-400">Pagamento Confirmado!</CardTitle>
              <CardDescription className="text-gray-300">
                Seus arquivos estão prontos para download
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 bg-green-900/20 border-green-500/30">
                <Check className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-300">
                  Pagamento processado com sucesso. Pedido: {paymentData?.orderId}
                </AlertDescription>
              </Alert>

              <div className="bg-gray-900/50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-white mb-2">Arquivos inclusos:</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Foto de alta qualidade (JPG)</li>
                  <li>• Arquivo de texto com dados técnicos</li>
                  <li>• Certificado de similaridade</li>
                </ul>
              </div>

              <Button 
                onClick={downloadFiles}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Arquivos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}