
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TextScramble } from '@/components/text-scramble';
import { StackSimulation } from '@/components/stack-simulation';
import { Typewriter } from '@/components/typewriter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDrive, Send } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [activeContent, setActiveContent] = useState<'main' | 'cv' | 'projects'>('main');
  const [showGif, setShowGif] = useState(false);
  const [showCvAvatar, setShowCvAvatar] = useState(false);
  const [chinaTime, setChinaTime] = useState('');

  const handleNavClick = (content: 'main' | 'cv' | 'projects') => {
    setActiveContent(content);
    setShowCvAvatar(content === 'cv');
  }

  const handleServiceClick = (serviceName: string, description: string) => {
    toast({
      title: `C:\\> ${serviceName.toUpperCase()}.EXE`,
      description: description,
    })
  };
  
  useEffect(() => {
    const getChinaTime = () => {
      const now = new Date();
      const utcOffset = now.getTimezoneOffset() * 60000;
      const chinaOffset = 8 * 3600000;
      const chinaDate = new Date(now.getTime() + utcOffset + chinaOffset);
      return chinaDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    setChinaTime(getChinaTime());
    const timer = setInterval(() => setChinaTime(getChinaTime()), 60000);

    return () => clearInterval(timer);
  }, []);

  const services = [
    { name: 'Боты', fileType: '.EXE', description: 'Разработка Telegram-ботов.' },
    { name: 'Автоматизация', fileType: '.SYS', description: 'Автоматизация бизнес-процессов и рутинных задач.' },
    { name: 'Сайты', fileType: '.COM', description: 'Создание современных и быстрых веб-сайтов и приложений.' },
    { name: 'Программы', fileType: '.APP', description: 'Разработка десктопных и серверных приложений.' },
    { name: 'CV', fileType: '.DLL', description: 'Реализация проектов с использованием компьютерного зрения (CV).' },
    { name: 'UI/UX', fileType: '.CFG', description: 'Проектирование интуитивно понятных пользовательских интерфейсов.' },
  ];
  
  const cvData = {
    name: 'Vitaliy Petrov',
    email: 'terakot2022@gmail.com',
    time: chinaTime,
    telegram: 'yofox',
    objective: 'Мой опыт сосредоточен на работе с MVP и стартапами. от разработки интерфейса проектов до финального развертывания. Обладаю навыками в решении комплексных задач и быстрой адаптации к новым технологиям. Активно использую инструменты ИИ для автоматизации процессов и ускорения разработки.',
    experience: {
      title: 'Full-Stack Developer',
      project: 'Разработка широкого спектра IT-решений, включая внутренние бизнес-системы и клиентские веб-приложения. Основное внимание — быстрая реализация MVP.',
      responsibilities: 'Полный цикл разработки: от сбора требований и проектирования архитектуры до реализации, тестирования, развертывания и последующей поддержки. Интеграция со сторонними сервисами и API.',
      telegramExpertise: 'Боты на Aiogram (асинхронные, FSM, вебхуки), Мини-приложения (Web Apps), Платежи (Telegram).'
    },
    skills: [
      'Backend: Go, Node.js, Python (Flask, FastAPI, Aiogram...), PHP',
      'Frontend: React, Next.js, Tailwind CSS, Flowbite, MUI',
      'DB: PostgreSQL, MySQL, MSSQL, Supabase, MongoDB',
      'CV/Tools: MediaPipe, OpenAI API, Telegram API, парсеры'
    ]
  };
  
  const projectsData = [
    { name: '</cv mediapipe bot>', image: 'https://i.imgur.com/o96pWfT.jpeg' },
    { name: '</site>', image: 'https://i.imgur.com/g833t9y.jpeg' },
    { name: '</name>' },
    { name: '</name>' },
  ];

  const cvContent = (
    <div className="text-sm font-mono text-foreground bg-card p-4 sm:p-6 rounded-lg relative overflow-hidden border border-border">
        <header className="flex flex-col md:flex-row justify-between md:items-start gap-6 border-b border-border pb-4 mb-4">
            <div className="flex-grow">
                <h1 className="text-4xl font-bold text-foreground">{cvData.name}</h1>
                <p className="text-primary mt-1"><Typewriter text={cvData.email} /></p>
            </div>
            <div className="font-mono text-xs sm:text-sm w-full md:w-auto md:max-w-xs shrink-0">
                <div className="bg-background/50 text-foreground p-3 rounded-lg border border-primary/20 w-full shadow-inner backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                        <span className="text-foreground"><Typewriter text={`My TIME ${cvData.time}`} speed={50} /></span>
                    </div>
                    
                    <a href={`https://t.me/${cvData.telegram}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
                        <Send size={12} className="inline-block" />
                        <Typewriter text={`@${cvData.telegram}`} speed={50} delay={800} />
                    </a>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <section className="mb-6">
                    <h2 className="text-xl font-bold text-primary mb-2">Objective</h2>
                    <p className="text-foreground"><Typewriter text={cvData.objective} /></p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-primary mb-2">Experience</h2>
                    <div className="mb-4 space-y-2 text-foreground">
                        <h3 className="text-lg font-bold">{cvData.experience.title}</h3>
                        <p><span className="font-bold">Project description:</span> <Typewriter text={cvData.experience.project} /></p>
                        <p><span className="font-bold">Responsibilities:</span> <Typewriter text={cvData.experience.responsibilities} /></p>
                        <p><span className="font-bold">Expertise in Telegram:</span> <Typewriter text={cvData.experience.telegramExpertise} /></p>
                    </div>
                </section>
            </div>

            <div>
                <h2 className="text-xl font-bold text-primary mb-2">Skills</h2>
                <ul className="list-none space-y-1 text-foreground">
                    {cvData.skills.map((skill, index) => (
                        <li key={index}><Typewriter text={skill} delay={index * 50} /></li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );
  
  const projectsContent = (
    <div className="grid grid-cols-2 gap-2">
      {projectsData.map((project, i) => (
        <div 
          key={i}
          className="aspect-square bg-card border border-primary flex items-center justify-center text-foreground font-mono text-lg transition-all duration-300 ease-in-out hover:rounded-full hover:bg-primary/20 cursor-pointer relative group overflow-hidden"
        >
          {project.image ? (
            <>
              <Image
                src={project.image}
                alt="Project image"
                layout="fill"
                objectFit="cover"
                className="grayscale opacity-50 group-hover:opacity-75 transition-opacity transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors" />
              <div className="glitch-overlay absolute inset-0 opacity-20 group-hover:opacity-10" />
            </>
          ) : null}
          <span className="relative z-10">{project.name}</span>
        </div>
      ))}
    </div>
  );

  const navButton = (label: string, content: 'main' | 'cv' | 'projects') => {
    const command = `C:\\> ${label}`;
    return (
      <Button 
        variant="outline" 
        className="justify-start h-full text-base border-primary hover:bg-accent" 
        onClick={() => {
          if (label === '..') handleNavClick('main')
          else if (content === 'projects' || content === 'cv') handleNavClick(content)
          else toast({ title: 'C:\\> ' + label, description: 'Раздел в разработке.'})
        }}
      >
        <span>{command}</span>
      </Button>
    )
  };


  return (
    <main className="flex flex-col items-center min-h-screen p-2 sm:p-4">
      <div className="w-full max-w-md mx-auto space-y-2">
        
        <header className="grid grid-cols-3 gap-2">
          <Card 
            className="col-span-1 aspect-square flex items-center justify-center text-center p-2 border-primary cursor-pointer relative overflow-hidden"
            onClick={() => !showGif && setShowGif(true)}
          >
              {showGif ? (
                 <Image 
                    src="https://i.pinimg.com/originals/5a/d1/12/5ad1129aac65a79357551cd652a484e3.gif" 
                    alt="matrix gif"
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                    className="grayscale"
                    onLoadingComplete={() => setTimeout(() => setShowGif(false), 3000)}
                 />
              ) : showCvAvatar ? (
                <Image 
                    src="https://i.pinimg.com/736x/21/f4/12/21f412812347a9c8134a464786ae287d.jpg"
                    alt="pixelated person"
                    layout="fill"
                    objectFit="cover"
                    className="grayscale"
                 />
              ) : (
                <CardHeader className="p-0">
                    <CardTitle className="text-xl leading-tight">
                    <TextScramble text="RUN" />
                    </CardTitle>
                </CardHeader>
              )}
          </Card>
          <nav className="col-span-2 flex flex-col gap-2">
            {activeContent !== 'main' ? navButton('..', 'main') : navButton('CV', 'cv')}
            {activeContent === 'main' ? navButton('PROJECTS', 'projects') : activeContent === 'projects' ? null : navButton('PROJECTS', 'projects')}
            {activeContent !== 'projects' && navButton('CONTACT', 'main')}
          </nav>
        </header>
        
        {activeContent === 'cv' && (
          <section>
            {cvContent}
          </section>
        )}
        
        {activeContent === 'projects' && (
          <section>
            {projectsContent}
          </section>
        )}

        {activeContent === 'main' && (
          <>
            <section>
                <Card className="w-full p-1 border-primary">
                    <CardHeader className="p-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <HardDrive size={16} />
                            <span>DIR C:\SERVICES\*.*</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 grid grid-cols-2 gap-2">
                      {services.map((service) => (
                        <Button 
                          key={service.name} 
                          variant="ghost" 
                          className="justify-between w-full h-auto text-left p-2 hover:bg-accent"
                          onClick={() => handleServiceClick(service.name, service.description)}
                        >
                          <div className="flex flex-col">
                              <span>{service.name}</span>
                              <span className="text-xs text-muted-foreground">{service.fileType}</span>
                          </div>
                          <span className="text-2xl leading-none">→</span>
                        </Button>
                      ))}
                    </CardContent>
                </Card>
            </section>
            
            <section>
              <Card className="w-full p-4 border-primary bg-primary/20 text-foreground">
                <CardContent className="p-0 font-mono text-sm">
                  <p>SYSTEM STATUS: OPERATIONAL<br />
                  &gt; PROFIT_INCREASE.EXE RUNNING...<br />
                  &gt; IT_SOLUTIONS.DLL LOADED<br />
                  &gt; BUSINESS_AUTOMATION READY<br />
                  &gt; REMOTE_ACCESS ENABLED<br />
                  &gt; GLOBAL_MANAGEMENT ACTIVE</p>
                  <br />
                  <p className="font-bold">*** STOP: 0x00000000 BUSINESS_SUCCESS ***</p>
                  <p>VITALIY.DEV - SYSTEM HALTED FOR PROFIT OPTIMIZATION</p>
                  <br />
                  <p>SITE BUILT WITH: Next.js, React, Tailwind CSS, ShadCN, Genkit AI, Matter.js</p>
                  <br />
                  <p>PRESS ANY KEY TO CONTINUE... OR CONTACT FOR SERVICES <span className="cursor-blink">_</span></p>
                </CardContent>
              </Card>
            </section>

            <section>
                <Card className="w-full h-72 p-1 border-primary">
                  <CardHeader className="absolute p-2 z-10">
                    <CardTitle className="text-xs text-muted-foreground">C:\&gt; LOAD STACK</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full w-full overflow-hidden">
                    <StackSimulation />
                  </CardContent>
                </Card>
            </section>
          </>
        )}
        
      </div>
    </main>
  );
}

    