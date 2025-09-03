
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TextScramble } from '@/components/text-scramble';
import { StackSimulation } from '@/components/stack-simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDrive, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [activeContent, setActiveContent] = useState<'main' | 'cv'>('main');
  const [showGif, setShowGif] = useState(false);
  const [showCvAvatar, setShowCvAvatar] = useState(false);
  const [chinaTime, setChinaTime] = useState('');
  const [executing, setExecuting] = useState<string | null>(null);
  const [executingService, setExecutingService] = useState<string | null>(null);

  const handleNavClick = (content: 'main' | 'cv') => {
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
    { name: 'Боты', fileType: '.EXE', description: 'Разработка Telegram-ботов любой сложности.' },
    { name: 'Автоматизация', fileType: '.SYS', description: 'Автоматизация бизнес-процессов и рутинных задач.' },
    { name: 'Сайты', fileType: '.COM', description: 'Создание современных и быстрых веб-сайтов и приложений.' },
    { name: 'Программы', fileType: '.APP', description: 'Разработка десктопных и серверных приложений.' },
    { name: 'Графика', fileType: '.DLL', description: 'Создание графических материалов и интерфейсов.' },
    { name: 'UI/UX', fileType: '.CFG', description: 'Проектирование интуитивно понятных пользовательских интерфейсов.' },
  ];
  
  const cvContent = (
    <div className="text-sm font-mono text-gray-800 bg-gray-100 p-4 sm:p-6 rounded-lg relative z-[2001]">
      <header className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-300 pb-4 mb-4">
        <h1 className="text-4xl font-bold col-span-1 md:col-span-2 text-black">Vitaliy Petrov</h1>
        <div className="text-left text-black text-xs sm:text-sm">
            <p>My time: {chinaTime}</p>
            <a href="https://t.me/yofox" target="_blank" rel="noopener noreferrer" className="text-blue-600 block hover:underline">telegram: @yofox</a>
            <p className="text-blue-600">terakot2022@gmail.com</p>
        </div>
      </header>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <section className="mb-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Objective</h2>
            <p className="text-black" dangerouslySetInnerHTML={{ __html: "Мой боевой опыт позволяет самостоятельно закрывать полный цикл разработки проекта от&nbsp;создания архитектуры до&nbsp;финального развертывания и&nbsp;поддержки. У&nbsp;вас в&nbsp;распоряжении есть мощная единица и&nbsp;гибкий выбор технологий. Мои знания позволяют быстро адаптироваться к&nbsp;новым задачам." }} />
          </section>
  
          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Experience</h2>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-black">Full-Stack Developer</h3>
              <p className="mt-2 text-black"><span className="font-bold">Project description:</span> Разработка широкого спектра IT-решений, включая внутренние бизнес-системы, клиентские веб-приложения и&nbsp;API. Основное внимание уделяется созданию масштабируемых, высокопроизводительных и&nbsp;безопасных приложений.</p>
              <p className="mt-2 text-black"><span className="font-bold">Responsibilities:</span> Полный цикл разработки: от&nbsp;сбора требований и&nbsp;проектирования архитектуры до&nbsp;реализации, тестирования, развертывания и&nbsp;последующей поддержки. Интеграция со&nbsp;сторонними сервисами и&nbsp;API.</p>
              <p className="mt-2 text-black"><span className="font-bold">Expertise in Telegram:</span> Боты на&nbsp;Aiogram (асинхронные, FSM, вебхуки), Мини-приложения (Web Apps), Платежи (Telegram), Высоконагруженные системы (Redis, кеш, очереди).</p>
            </div>
          </section>
        </div>
  
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-2">Skills</h2>
          <ul className="list-none space-y-1 text-black">
            <li>Go</li>
            <li>Node.js</li>
            <li>Python (Flask, FastAPI, Aiogram)</li>
            <li>PHP</li>
            <li>Next.js</li>
            <li>Tailwind CSS</li>
            <li>PostgreSQL</li>
            <li>GraphQL</li>
            <li>MySQL</li>
            <li>MSSQL</li>
            <li>Supabase</li>
            <li>Telegram API</li>
            <li>Instagram API</li>
            <li>Parsers</li>
            <li>OpenAI API</li>
            <li>Redis</li>
            <li>Docker</li>
            <li>UX/UI</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const navButton = (label: string, content: 'main' | 'cv') => {
    const command = `C:\\> ${label}`;
    return (
      <Button 
        variant="outline" 
        className="justify-start h-full text-base border-primary hover:bg-accent" 
        onClick={() => label === 'CV' ? handleNavClick(content) : label === '..' ? handleNavClick('main') : toast({ title: 'C:\\> ' + label, description: 'Раздел в разработке.'})}
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
            className="col-span-1 aspect-square flex items-center justify-center text-center p-2 border-primary cursor-pointer"
            onClick={() => !showGif && setShowGif(true)}
          >
            <CardHeader className="p-0">
              {showGif ? (
                 <Image 
                    src="https://i.pinimg.com/originals/5a/d1/12/5ad1129aac65a79357551cd652a484e3.gif" 
                    alt="matrix gif"
                    width={100}
                    height={100}
                    unoptimized
                    className="grayscale"
                    onLoadingComplete={() => setTimeout(() => setShowGif(false), 3000)}
                 />
              ) : showCvAvatar ? (
                <Image 
                    src="https://picsum.photos/100/100" 
                    alt="Vitaliy Petrov"
                    width={100}
                    height={100}
                    data-ai-hint="man portrait"
                    className="grayscale"
                    style={{imageRendering: 'pixelated'}}
                 />
              ) : (
                <CardTitle className="text-xl leading-tight">
                  <TextScramble text="RUN" />
                </CardTitle>
              )}
            </CardHeader>
          </Card>
          <nav className="col-span-2 flex flex-col gap-2">
            {activeContent === 'cv' ? navButton('..', 'main') : navButton('CV', 'cv')}
            {navButton('PROJECTS', 'main')}
            {navButton('CONTACT', 'main')}
          </nav>
        </header>
        
        {activeContent === 'cv' && (
          <section>
            {cvContent}
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
                          disabled={!!executingService}
                        >
                          <div className="flex flex-col">
                              <span>{service.name}</span>
                              <span className="text-xs text-muted-foreground">{service.fileType}</span>
                          </div>
                          {executingService === service.name ? <Loader2 className="animate-spin" size={16} /> : <span className="text-2xl leading-none">→</span>}
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
        
        <section>
          <Card className="w-full p-4 border-green-500 bg-green-500/20 text-foreground">
            <CardContent className="p-0 font-mono text-sm">
              <p className="font-bold">*** STOP: 0x00000000 BUSINESS_SUCCESS ***</p>
              <p>VITALIY.DEV - SYSTEM HALTED FOR PROFIT OPTIMIZATION</p>
              <br />
              <p>SITE BUILT WITH: Next.js, React, Tailwind CSS, ShadCN, Genkit AI, Matter.js</p>
              <br />
              <p>PRESS ANY KEY TO CONTINUE... OR CONTACT FOR SERVICES <span className="cursor-blink">_</span></p>
            </CardContent>
          </Card>
        </section>

      </div>
    </main>
  );
}

    