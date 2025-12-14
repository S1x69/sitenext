'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, User, Building, CheckCircle, Clock, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    empresa: '',
    assunto: '',
    mensagem: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Mensagem enviada com sucesso! Responderemos em breve.');
    setFormData({
      nome: '',
      email: '',
      empresa: '',
      assunto: '',
      mensagem: '',
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@boca.com.br',
      link: 'mailto:contato@boca.com.br',
      color: 'blue',
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: '(99) 98201-1541',
      link: 'tel:+5599982011541',
      color: 'green',
    },
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'São Paulo, SP - Brasil',
      link: null,
      color: 'purple',
    },
    {
      icon: Clock,
      title: 'Horário',
      content: 'Seg-Sex: 9h às 18h',
      link: null,
      color: 'orange',
    },
  ];

  const departments = [
    {
      title: 'Redação',
      email: 'redacao@boca.com.br',
      description: 'Envio de releases, sugestões de pautas e parcerias editoriais',
    },
    {
      title: 'Comercial',
      email: 'comercial@boca.com.br',
      description: 'Publicidade, patrocínios e oportunidades de negócios',
    },
    {
      title: 'Suporte',
      email: 'suporte@boca.com.br',
      description: 'Problemas técnicos, bugs e dúvidas sobre o site',
    },
  ];

  const socialMedia = [
    { icon: Facebook, name: 'Facebook', link: '#', color: 'bg-blue-600' },
    { icon: Instagram, name: 'Instagram', link: '#', color: 'bg-pink-600' },
    { icon: Twitter, name: 'Twitter', link: '#', color: 'bg-sky-500' },
    { icon: Linkedin, name: 'LinkedIn', link: '#', color: 'bg-blue-700' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <MessageSquare className="w-5 h-5" />
              <span className="font-semibold">Fale Conosco</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Vamos Conversar?
            </h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Estamos aqui para ouvir você. Entre em contato e responderemos o mais breve possível.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  info.color === 'blue' ? 'bg-blue-100 dark:bg-blue-950' :
                  info.color === 'green' ? 'bg-green-100 dark:bg-green-950' :
                  info.color === 'purple' ? 'bg-purple-100 dark:bg-purple-950' :
                  'bg-orange-100 dark:bg-orange-950'
                }`}>
                  <info.icon className={`w-6 h-6 ${
                    info.color === 'blue' ? 'text-blue-600' :
                    info.color === 'green' ? 'text-green-600' :
                    info.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
                <h3 className="font-bold mb-2">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    {info.content}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{info.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">Envie sua Mensagem</h2>
                <p className="text-muted-foreground">
                  Preencha o formulário abaixo e entraremos em contato em até 24 horas.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nome" className="block font-medium mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block font-medium mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="empresa" className="block font-medium mb-2">
                    Empresa (Opcional)
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="assunto" className="block font-medium mb-2">
                    Assunto *
                  </label>
                  <select
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="geral">Dúvida Geral</option>
                    <option value="redacao">Sugestão de Pauta</option>
                    <option value="comercial">Publicidade</option>
                    <option value="suporte">Suporte Técnico</option>
                    <option value="parceria">Parceria</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensagem" className="block font-medium mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-secondary border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-8">
              {/* Departments */}
              <div className="bg-card rounded-2xl p-8 border shadow-sm">
                <h3 className="text-2xl font-bold mb-6">Departamentos</h3>
                <div className="space-y-6">
                  {departments.map((dept, index) => (
                    <div key={index} className="pb-6 border-b last:border-b-0 last:pb-0">
                      <h4 className="font-bold mb-2">{dept.title}</h4>
                      <a href={`mailto:${dept.email}`} className="text-blue-600 hover:underline text-sm block mb-2">
                        {dept.email}
                      </a>
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 border">
                <h3 className="text-2xl font-bold mb-6">Siga-nos nas Redes Sociais</h3>
                <p className="text-muted-foreground mb-6">
                  Fique por dentro das últimas notícias e novidades em tempo real.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      className={`${social.color} text-white p-4 rounded-xl hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-3 font-semibold shadow-lg`}
                    >
                      <social.icon className="w-5 h-5" />
                      {social.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Response */}
              <div className="bg-green-50 dark:bg-green-950/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold mb-2 text-green-900 dark:text-green-100">Resposta Rápida</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Comprometemo-nos a responder todas as mensagens em até 24 horas úteis. 
                      Para urgências, utilize nosso WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-muted-foreground">
              Talvez sua dúvida já tenha sido respondida
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Como posso sugerir uma pauta?',
                a: 'Envie um email para redacao@boca.com.br com o assunto "Sugestão de Pauta" e descreva sua ideia.',
              },
              {
                q: 'Vocês aceitam artigos de colaboradores?',
                a: 'Sim! Entre em contato através do formulário acima selecionando "Parceria" como assunto.',
              },
              {
                q: 'Como anunciar no BocaNoticias?',
                a: 'Acesse nossa página de publicidade ou entre em contato com comercial@boca.com.br.',
              },
              {
                q: 'Qual o horário de atendimento?',
                a: 'Nosso atendimento é de segunda a sexta, das 9h às 18h (horário de Brasília).',
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-all group"
              >
                <summary className="font-bold cursor-pointer flex items-center justify-between">
                  {faq.q}
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Voltar para Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
