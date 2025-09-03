
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { TextScramble } from '@/components/text-scramble';
import { StackSimulation } from '@/components/stack-simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, HardDrive } from 'lucide-react';

export default function Home() {
  const [activeContent, setActiveContent] = useState<'main' | 'cv'>('main');
  const [showGif, setShowGif] = useState(false);

  const services = [
    { name: 'Боты', fileType: '.EXE' },
    { name: 'Автоматизация', fileType: '.SYS' },
    { name: 'Сайты', fileType: '.COM' },
    { name: 'Программы', fileType: '.APP' },
    { name: 'Графика', fileType: '.DLL' },
    { name: 'UI/UX', fileType: '.CFG' },
  ];
  
  const cvContent = (
    <div className="text-sm font-mono text-gray-800 bg-gray-100 p-6 rounded-lg">
      <header className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-300 pb-4 mb-4">
        <h1 className="text-4xl font-bold col-span-2 text-black">Alexander Balaban</h1>
        <div className="text-left md:text-right text-black">
          <p>Minsk</p>
          <p>+375(29)813-70-67</p>
          <p className="text-blue-600">balsas2908@gmail.com</p>
        </div>
      </header>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <section className="mb-6">
            <h2 className="text-xl font-bold text-blue-700 mb-2">Objective</h2>
            <ul className="list-none space-y-1 text-black">
              <li>Windows applications development,</li>
              <li>WEB applications development,</li>
              <li>Highly communicative and interpersonal skills,</li>
              <li>Self-motivated</li>
            </ul>
          </section>
  
          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-2">Experience</h2>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-black">Dubz, PHP(Laravel framework)</h3>
              <p className="text-sm text-gray-600">Jan 2025- now</p>
              <p className="mt-2 text-black"><span className="font-bold">Project description:</span> Delivery system development. Main feature of the system to create tasks for agents for baggage delivery (from/to airport). Develop a B2C project to make orders for baggage delivery for customers from different airports. The main goal of this project is to redevelop existing one project but make it for multiple airports with self administrators.</p>
              <p className="mt-2 text-black"><span className="font-bold">Responsibilities:</span> CRUD development, Swagger OA, take part in meetings to discuss tasks.</p>
              <p className="mt-2 text-black"><span className="font-bold">Technologies and Tools:</span> PHP, MySQL, Laravel, Composer, Docker, GIT.</p>
            </div>
          </section>
        </div>
  
        <div>
          <h2 className="text-xl font-bold text-blue-700 mb-2">Skills</h2>
          <ul className="list-none space-y-1 text-black">
            <li>PHP (7.5 y)</li>
            <li>Wordpress (6.5 y)</li>
            <li>Laravel (6.5 y)</li>
            <li>Symfony (4.5 y)</li>
            <li>React (1.5 y)</li>
            <li>Docker (4.5 y)</li>
            <li>Oxid (0.5 y )</li>
            <li>MySQL (7.5 y)</li>
            <li>PostgreSQL(4 y)</li>
            <li>.Net (1 y)</li>
            <li>Oracle db (1 y)</li>
            <li>Javascript (7.5 y)</li>
            <li>HTML (7.5 y)</li>
            <li>CSS (7.5 y)</li>
            <li>Git (7 y)</li>
            <li>Bitrix24 (4.5 y)</li>
            <li>Telegram bot API (4.5 y)</li>
            <li>Ubuntu (7 y)</li>
            <li>Flutter (1 y)</li>
            <li>Node.js (1 y)</li>
            <li>Composer (7.5 y)</li>
          </ul>
        </div>
      </div>
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
                    className="grayscale"
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
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent" onClick={() => setActiveContent(activeContent === 'cv' ? 'main' : 'cv')}>C:\&gt; CV</Button>
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent">C:\&gt; PROJECTS</Button>
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent">C:\&gt; CONTACT</Button>
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
