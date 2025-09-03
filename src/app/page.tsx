
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { TextScramble } from '@/components/text-scramble';
import { StackSimulation } from '@/components/stack-simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, HardDrive } from 'lucide-react';

export default function Home() {
  const [activeContent, setActiveContent] = useState<'main' | 'about'>('main');
  const [showGif, setShowGif] = useState(false);

  const services = [
    { name: 'Боты', fileType: '.EXE' },
    { name: 'Автоматизация', fileType: '.SYS' },
    { name: 'Сайты', fileType: '.COM' },
    { name: 'Программы', fileType: '.APP' },
    { name: 'Графика', fileType: '.DLL' },
    { name: 'UI/UX', fileType: '.CFG' },
  ];
  
  const aboutContent = (
    <div className="text-sm">
      <p className="font-bold">Стек:</p>
      <p><span className="font-bold">Backend:</span> Go, Node.js, Python (Flask, FastAPI, Aiogram), PHP</p>
      <p><span className="font-bold">Frontend:</span> Next.js, Tailwind CSS, ShadCN, MUI</p>
      <p><span className="font-bold">DB:</span> PostgreSQL, GraphQL, MySQL, MSSQL, Supabase (другие реляционные не реляционные СУБД)</p>
      <p><span className="font-bold">Tools:</span> Telegram API, Instagram API, парсеры, OpenAI API, Redis, Docker, UX/UI</p>
      <br />
      <p className="font-bold">Экспертиза в Telegram:</p>
      <p>Боты на Aiogram (асинхронные, FSM, вебхуки)</p>
      <p>Мини-приложения (Web Apps)</p>
      <p>Платежи (Telegram)</p>
      <p>Высоконагруженные системы (Redis, кеш, очереди)</p>
      <br />
      <p>Мой боевой опыт позволяет самостоятельно закрывать полный цикл разработки проекта от создания архитектуры до финального развертывания и поддержки.</p>
      <br />
      <p>У вас в распоряжении есть мощная единица и гибкий выбор технологий. Мои знания позволяют быстро адаптироваться к новым задачам.</p>
    </div>
  );

  return (
    <main className="flex flex-col items-center min-h-screen p-2 sm:p-4">
      <div className="w-full max-w-md mx-auto space-y-2">
        
        <header className="grid grid-cols-3 gap-2">
          <Card 
            className="col-span-1 aspect-square flex items-center justify-center text-center p-2 border-primary cursor-pointer"
            onClick={() => setShowGif(true)}
          >
            <CardHeader className="p-0">
              {showGif ? (
                 <Image 
                    src="https://i.pinimg.com/originals/5a/d1/12/5ad1129aac65a79357551cd652a484e3.gif" 
                    alt="matrix gif"
                    width={100}
                    height={100}
                    unoptimized
                    onLoadingComplete={() => setTimeout(() => setShowGif(false), 3000)}
                 />
              ) : (
                <CardTitle className="text-xl leading-tight">
                  <TextScramble text="Vitaliy" />
                </CardTitle>
              )}
            </CardHeader>
          </Card>
          <nav className="col-span-2 flex flex-col gap-2">
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent" onClick={() => setActiveContent('about')}>C:\&gt; ABOUT</Button>
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent">C:\&gt; PROJECTS</Button>
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent">C:\&gt; CONTACT</Button>
          </nav>
        </header>
        
        {activeContent === 'about' && (
          <section>
            <Card className="w-full p-4 border-2 border-blue-500 bg-blue-900/80 text-white">
              <CardContent className="p-0 font-mono">
                {aboutContent}
              </CardContent>
            </Card>
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
                        <Button key={service.name} variant="ghost" className="justify-between w-full h-auto text-left p-2 hover:bg-accent">
                          <div className="flex flex-col">
                              <span>{service.name}</span>
                              <span className="text-xs text-muted-foreground">{service.fileType}</span>
                          </div>
                          <ChevronDown size={16} />
                        </Button>
                      ))}
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
          <Card className="w-full p-4 border-2 border-blue-500 bg-blue-900/80 text-white">
            <CardContent className="p-0 font-mono">
              <p className="font-bold">*** STOP: 0x00000000 BUSINESS_SUCCESS ***</p>
              <p>VITALIY.DEV - SYSTEM HALTED FOR PROFIT OPTIMIZATION</p>
              <br />
              <p>PRESS ANY KEY TO CONTINUE... OR CONTACT FOR SERVICES <span className="cursor-blink">_</span></p>
            </CardContent>
          </Card>
        </section>

      </div>
    </main>
  );
}
