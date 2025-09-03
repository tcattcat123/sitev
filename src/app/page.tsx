import { TextScramble } from '@/components/text-scramble';
import { StackSimulation } from '@/components/stack-simulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, HardDrive } from 'lucide-react';

export default function Home() {
  const services = [
    { name: 'Боты', fileType: '.EXE' },
    { name: 'Автоматизация', fileType: '.SYS' },
    { name: 'Сайты', fileType: '.COM' },
    { name: 'Программы', fileType: '.APP' },
    { name: 'Графика', fileType: '.DLL' },
    { name: 'UI/UX', fileType: '.CFG' },
  ];

  return (
    <main className="flex flex-col items-center min-h-screen p-2 sm:p-4">
      <div className="w-full max-w-md mx-auto space-y-2">
        
        <header className="grid grid-cols-3 gap-2">
          <Card className="col-span-1 aspect-square flex items-center justify-center text-center p-2 border-primary">
            <CardHeader className="p-0">
              <CardTitle className="text-xl leading-tight">
                <TextScramble text="Vitaliy" />
              </CardTitle>
            </CardHeader>
          </Card>
          <nav className="col-span-2 flex flex-col gap-2">
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent">C:\&gt; ABOUT</Button>
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent">C:\&gt; PROJECTS</Button>
            <Button variant="outline" className="justify-start h-full text-base border-primary hover:bg-accent">C:\&gt; CONTACT</Button>
          </nav>
        </header>

        <section>
          <Card className="w-full p-4 border-2 border-blue-500 bg-blue-800 text-white">
            <CardContent className="p-0 font-mono">
              <p className="font-bold">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
              <br />
              <p>Увеличение вашей прибыли за счет IT - решений. Делаем ваш бизнес удобным, с доступом управления из любой точки мира.</p>
              <br />
              <p>* Press any key to terminate the current application.</p>
              <p>* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
              <div className="text-center mt-4">
                 Press any key to continue <span className="cursor-blink">_</span>
              </div>
            </CardContent>
          </Card>
        </section>

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

      </div>
    </main>
  );
}
