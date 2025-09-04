

'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TextScramble } from '@/components/text-scramble';
import { StackSimulation } from '@/components/stack-simulation';
import { Typewriter } from '@/components/typewriter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HardDrive, Eye, ArrowLeft, Bot, Workflow, Code, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { EyeTrackingModal } from '@/components/eye-tracking-modal';
import { ProjectCard } from '@/components/project-card';

const uiUxHtmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Skilty - Найди своего инструктора</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .tab-active { background-color: #111827; color: white; }
        .scroll-container::-webkit-scrollbar { display: none; }
        .scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
</head>
<body class="bg-gray-100">

    <div class="max-w-md mx-auto bg-white shadow-lg min-h-screen overflow-hidden relative">

        <!-- === ЭКРАН 1: СПИСОК ИНСТРУКТОРОВ === -->
        <div id="screen-list" class="flex flex-col h-full">
            <div class="p-4 pb-2 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <header class="flex justify-between items-center mb-4">
                    <button id="burger-btn" class="p-2 rounded-full hover:bg-gray-100"><svg class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg></button>
                    <div class="text-2xl font-bold text-gray-900">Skilty</div>
                    <button id="user-profile-btn" class="p-2 rounded-full hover:bg-gray-100"><svg class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></button>
                </header>
                
                <div class="mb-2">
                    <div class="flex space-x-2 overflow-x-auto pb-2 scroll-container">
                        <button class="category-tab px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap tab-active">Все</button>
                        <button class="category-tab px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">Сёрфинг</button>
                        <button class="category-tab px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">Йога</button>
                        <button class="category-tab px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">Дайвинг</button>
                        <button class="category-tab px-4 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 hover:bg-gray-200">Фитнес</button>
                    </div>
                </div>
                 <div class="flex justify-end pt-2 border-t border-gray-100">
                    <button id="filter-btn" class="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        <span>Фильтр</span>
                    </button>
                </div>
            </div>

            <!-- СПИСОК ИНСТРУКТОРОВ (заполняется JS) -->
            <div id="instructor-list-container" class="space-y-3 px-4 pb-20 overflow-y-auto"></div>
        </div>

        <!-- === ЭКРАН 2: ПРОФИЛЬ ИНСТРУКТОРА (Шаблон) === -->
        <div id="screen-profile" class="absolute inset-0 bg-gray-100 z-20 transform translate-y-full transition-transform duration-300 ease-in-out"></div>
        
        <!-- === Оверлей для всех попапов === -->
        <div id="overlay" class="fixed inset-0 bg-black bg-opacity-50 z-30 hidden"></div>

        <!-- === Боковое меню === -->
        <div id="burger-menu" class="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white z-40 transform -translate-x-full transition-transform duration-300 ease-in-out p-5 flex flex-col">
            <h2 class="text-2xl font-bold mb-6">Меню</h2>
            <nav class="flex flex-col space-y-2 flex-grow"><a href="#" class="p-3 hover:bg-gray-700 rounded-lg">Стать инструктором</a><a href="#" class="p-3 hover:bg-gray-700 rounded-lg">Новости проекта</a><a href="#" class="p-3 hover:bg-gray-700 rounded-lg">Контакты</a></nav>
            <div class="mt-6 border-t border-gray-700 pt-4"><h3 class="font-semibold text-gray-400 text-sm mb-2">Партнерка</h3><p class="text-xs text-gray-500">Заработано вами:</p><p class="text-2xl font-bold text-green-400">$1,234</p></div>
        </div>

        <!-- === Экран профиля пользователя === -->
        <div id="user-profile-screen" class="fixed top-0 right-0 w-full max-w-md h-full bg-white z-50 transform translate-x-full transition-transform duration-300 ease-in-out p-4 flex flex-col">
            <div class="flex justify-between items-center mb-6"><h2 class="text-2xl font-bold">Ваш профиль</h2><button id="close-user-profile-btn" class="p-2 hover:bg-gray-100 rounded-full"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            <div class="space-y-4 flex-grow"><div><label for="user-name" class="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label><input type="text" id="user-name" value="Иван Петров" class="w-full p-2 bg-gray-100 rounded-lg"></div><div><label class="block text-sm font-medium text-gray-700 mb-2">Ваша локация</label><div class="grid grid-cols-2 gap-2"><div><input type="radio" name="location" id="bali" value="bali" class="hidden peer" checked><label for="bali" class="block text-center p-3 bg-gray-100 rounded-lg cursor-pointer peer-checked:bg-gray-900 peer-checked:text-white">Бали</label></div><div><input type="radio" name="location" id="lanka" value="lanka" class="hidden peer"><label for="lanka" class="block text-center p-3 bg-gray-100 rounded-lg cursor-pointer peer-checked:bg-gray-900 peer-checked:text-white">Шри-Ланка</label></div></div></div></div>
            <button class="w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-xl">Сохранить изменения</button>
        </div>
        
        <!-- === Модальное окно фильтра === -->
        <div id="filter-modal" class="fixed inset-0 z-40 flex items-end justify-center hidden">
            <div class="bg-white rounded-t-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 class="text-xl font-bold text-gray-900 mb-5">Фильтр по языку</h3>
                <div class="space-y-4">
                    <label class="flex items-center justify-between cursor-pointer"><span class="text-gray-800 font-medium">Русский</span><div class="relative inline-flex items-center"><input type="checkbox" class="sr-only peer"><div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-800"></div><div class="absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full border transition-transform peer-checked:translate-x-full"></div></div></label>
                    <label class="flex items-center justify-between cursor-pointer"><span class="text-gray-800 font-medium">Английский</span><div class="relative inline-flex items-center"><input type="checkbox" class="sr-only peer"><div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-800"></div><div class="absolute top-0.5 left-[2px] w-5 h-5 bg-white rounded-full border transition-transform peer-checked:translate-x-full"></div></div></label>
                </div>
                <button id="apply-filter-btn" class="mt-8 w-full bg-gray-900 text-white font-bold py-3 px-4 rounded-xl">Применить</button>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // --- База данных ---
            const instructors = [
                { name: 'Тимур', school: 'Серф-школа "Surf Joint"', rating: 5.0, reviews: 42, specialty: 'Сёрфинг', experience: '10 лет', languages: ['ru', 'en'], instagram: '@timur_surf', img_small: 'https://placehold.co/80x80/e0e7ff/4338ca?text=Т', img_big: 'https://placehold.co/600x400/93C5FD/FFFFFF?text=Surf', description: 'Профессиональный тренер с 10-летним стажем. Гарантирую, что вы встанете на доску и поймаете свою первую волну уже на первом занятии.'},
                { name: 'Анна', school: 'Фотограф Анна', rating: 4.9, reviews: 18, specialty: 'Photographer', experience: '5 лет', languages: ['ru', 'en'], instagram: '@anna_photo_lanka', img_small: 'https://placehold.co/80x80/fee2e2/b91c1c?text=А', img_big: 'https://placehold.co/600x400/fecaca/991b1b?text=Photo', description: 'Сохраню лучшие моменты вашего отдыха в ярких и живых фотографиях. Работаю с естественным светом, чтобы передать атмосферу.'},
                { name: 'Елена', school: 'Йога-центр "Прана"', rating: 4.9, reviews: 35, specialty: 'Йога', experience: '8 лет', languages: ['en'], instagram: '@elena_yoga_bali', img_small: 'https://placehold.co/80x80/dcfce7/166534?text=Е', img_big: 'https://placehold.co/600x400/bbf7d0/166534?text=Yoga', description: 'Найдите гармонию тела и духа на моих утренних практиках с видом на океан. Подходит для всех уровней подготовки.'},
                { name: 'Михаил', school: 'Дайв-клуб "Бездна"', rating: 5.0, reviews: 51, specialty: 'Дайвинг', experience: '12 лет', languages: ['en'], instagram: '@mike_dive_master', img_small: 'https://placehold.co/80x80/cffafe/0e7490?text=М', img_big: 'https://placehold.co/600x400/67e8f9/0e7490?text=Dive', description: 'Покажу вам захватывающий подводный мир Бали. Сертифицированный инструктор PADI, безопасность на первом месте.'},
                { name: 'Ольга', school: 'Фитнес-тренер Ольга', rating: 4.8, reviews: 29, specialty: 'Фитнес', experience: '6 лет', languages: ['ru'], instagram: '@olga_fit_pro', img_small: 'https://placehold.co/80x80/fce7f3/831843?text=О', img_big: 'https://placehold.co/600x400/f9a8d4/831843?text=Fitness', description: 'Индивидуальные программы тренировок для ваших целей. Помогу достичь результата без вреда для здоровья.'}
            ];
            const langAbbr = { ru: 'RUS', en: 'ENG' };

            const overlay = document.getElementById('overlay');
            const burgerBtn = document.getElementById('burger-btn');
            const burgerMenu = document.getElementById('burger-menu');
            const userProfileBtn = document.getElementById('user-profile-btn');
            const userProfileScreen = document.getElementById('user-profile-screen');
            const closeUserProfileBtn = document.getElementById('close-user-profile-btn');
            const filterBtn = document.getElementById('filter-btn');
            const filterModal = document.getElementById('filter-modal');
            const applyFilterBtn = document.getElementById('apply-filter-btn');
            const categoryTabs = document.querySelectorAll('.category-tab');
            const instructorListContainer = document.getElementById('instructor-list-container');
            const profileScreen = document.getElementById('screen-profile');
            
            function renderInstructors() {
                instructorListContainer.innerHTML = '';
                instructors.forEach(inst => {
                    const languagesHTML = inst.languages.map(lang => langAbbr[lang] || '').join(', ');
                    const cardElement = document.createElement('div');
                    cardElement.className = 'instructor-card bg-white p-3 rounded-xl border flex space-x-3 items-center hover:border-gray-800 cursor-pointer';
                    cardElement.innerHTML = '<img src="' + inst.img_small + '" alt="' + inst.name + '" class="w-16 h-16 rounded-lg object-cover flex-shrink-0"><div class="flex-1 min-w-0"><h3 class="font-semibold text-gray-900 truncate">' + inst.name + '</h3><p class="text-sm text-gray-500">' + inst.specialty + '</p><p class="text-xs text-gray-500 mt-1">Опыт: ' + inst.experience + '</p></div><div class="text-right flex-shrink-0"><div class="flex items-center justify-end space-x-1"><svg class="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><span class="font-semibold text-sm">' + inst.rating + '</span></div><div class="text-xs font-semibold text-blue-600 mt-1">' + languagesHTML + '</div></div>';
                    Object.keys(inst).forEach(key => { cardElement.dataset[key] = Array.isArray(inst[key]) ? inst[key].join(',') : inst[key]; });
                    cardElement.addEventListener('click', openProfile);
                    instructorListContainer.appendChild(cardElement);
                });
            }

            const openProfile = (event) => {
                const data = event.currentTarget.dataset;
                const languagesText = data.languages.split(',').map(lang => lang === 'ru' ? 'Русский' : 'Английский').join(', ');
                profileScreen.innerHTML = '<div class="h-full overflow-y-auto pb-40"><div class="h-52 bg-cover bg-center" style="background-image: url(\'' + data.img_big + '\')"></div><div class="bg-white rounded-t-2xl -mt-4 relative"><div class="p-4"><div class="flex justify-between items-start"><h1 class="text-2xl font-bold text-gray-900">' + data.school + '</h1><div class="text-right flex-shrink-0 ml-4"><div class="flex items-center justify-end space-x-1"><svg class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg><span class="font-bold text-gray-800 text-lg">' + data.rating + '</span></div><a href="#" class="text-xs text-gray-500 underline whitespace-nowrap">(' + data.reviews + ' отзыва)</a></div></div><p class="mt-4 text-sm text-gray-700 leading-relaxed">' + data.description + '</p><div class="mt-4 space-y-3 text-sm border-t pt-4"><div class="flex items-center text-gray-700">Опыт: ' + data.experience + '</div><div class="flex items-center text-gray-700">Языки: ' + languagesText + '</div><a href="#" class="flex items-center text-blue-600 hover:underline">' + data.instagram + '</a></div></div><div class="p-4 border-t"><h2 class="text-lg font-bold text-gray-900 mb-3">Услуги и цены</h2><ul class="text-sm space-y-2"><li class="flex justify-between text-gray-800"><span>Групповой урок (3 часа)</span><span class="font-semibold">$60</span></li><li class="flex justify-between text-gray-800"><span>Индивидуальный урок (3 часа)</span><span class="font-semibold">$150</span></li></ul></div><div class="p-4 border-t"><h2 class="text-lg font-bold text-gray-900 mb-3">Оставить отзыв</h2><div class="flex items-center space-x-1 mb-4" id="rating-stars">' + [1,2,3,4,5].map(v => '<svg data-value="' + v + '" class="w-8 h-8 text-gray-300 cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>').join('') + '</div><div class="relative"><textarea class="w-full p-2 pr-10 bg-gray-100 rounded-lg text-sm border border-transparent focus:ring-2 focus:ring-gray-300 focus:outline-none transition" rows="3" placeholder="Поделитесь вашими впечатлениями..."></textarea><button class="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-gray-800"><svg class="w-6 h-6 -rotate-45" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg></button></div></div></div></div><div class="absolute bottom-0 left-0 right-0 w-full p-3 bg-white/80 backdrop-blur-sm border-t"><button class="w-full max-w-md mx-auto bg-gray-900 text-white font-bold py-3 px-4 rounded-xl">Связаться</button></div><button id="fab-back-btn" class="fixed bottom-24 right-4 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center z-30"><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg></button>';
                profileScreen.querySelector('#fab-back-btn').addEventListener('click', closeProfile);
                
                const stars = profileScreen.querySelectorAll('#rating-stars svg');
                let currentRating = 0;
                stars.forEach(star => {
                    star.addEventListener('mouseover', () => { stars.forEach(s => s.classList.toggle('text-yellow-400', s.dataset.value <= star.dataset.value)); });
                    star.addEventListener('mouseout', () => { stars.forEach(s => s.classList.toggle('text-yellow-400', s.dataset.value <= currentRating)); });
                    star.addEventListener('click', () => { currentRating = star.dataset.value; });
                });

                profileScreen.classList.remove('translate-y-full');
            };
            const closeProfile = () => profileScreen.classList.add('translate-y-full');

            const openPopup = (popup) => {
                if (popup.id === 'filter-modal') {
                  popup.classList.remove('hidden');
                } else {
                  popup.classList.remove('-translate-x-full', 'translate-x-full');
                }
                overlay.classList.remove('hidden');
            };
            const closeAllPopups = () => {
                burgerMenu.classList.add('-translate-x-full');
                userProfileScreen.classList.add('translate-x-full');
                filterModal.classList.add('hidden');
                overlay.classList.add('hidden');
            };

            burgerBtn.addEventListener('click', () => openPopup(burgerMenu));
            userProfileBtn.addEventListener('click', () => openPopup(userProfileScreen));
            filterBtn.addEventListener('click', () => openPopup(filterModal));
            closeUserProfileBtn.addEventListener('click', closeAllPopups);
            applyFilterBtn.addEventListener('click', closeAllPopups);
            overlay.addEventListener('click', closeAllPopups);
            
            categoryTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    categoryTabs.forEach(t => { t.classList.remove('tab-active'); t.classList.add('bg-gray-100', 'text-gray-700'); });
                    this.classList.add('tab-active'); this.classList.remove('bg-gray-100', 'text-gray-700');
                });
            });

            renderInstructors();
        });
    </script>
</body>
</html>`;

export default function Home() {
  const { toast } = useToast()
  const [activeContent, setActiveContent] = useState<'main' | 'cv' | 'projects'>('main');
  const [showGif, setShowGif] = useState(false);
  const [showCvAvatar, setShowCvAvatar] = useState(false);
  const [chinaTime, setChinaTime] = useState<string | null>(null);
  const [showCvModal, setShowCvModal] = useState(false);
  const [showUiUxFullScreen, setShowUiUxFullScreen] = useState(false);

  const handleNavClick = (content: 'main' | 'cv' | 'projects') => {
    setActiveContent(content);
    setShowCvAvatar(content === 'cv');
  }

  const handleServiceClick = (serviceName: string, description: string, fileType: string) => {
    if (serviceName === 'CV') {
      setShowCvModal(true);
    } else if (serviceName === 'UI/UX') {
      setShowUiUxFullScreen(true);
    } else {
      toast({
        title: `C:\\> ${serviceName.toUpperCase()}${fileType}`,
        description: description,
      })
    }
  };
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getChinaTime = () => {
      const now = new Date();
      const utcOffset = now.getTimezoneOffset() * 60000;
      const chinaOffset = 8 * 3600000;
      const chinaDate = new Date(now.getTime() + utcOffset + chinaOffset);
      return chinaDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    const timer = setInterval(() => {
        const newTime = getChinaTime();
        if (newTime !== chinaTime) {
            setChinaTime(newTime);
        }
    }, 60000);
    
    setChinaTime(getChinaTime());

    return () => clearInterval(timer);
  }, [chinaTime]);

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
    telegram: 'yofox',
    objective: 'Мой опыт сосредоточен на работе с MVP и стартапами: от разработки интерфейса до финального развертывания. Обладаю навыками в решении комплексных задач и быстрой адаптации к новым технологиям. Активно использую инструменты ИИ для автоматизации.',
    experience: {
      title: 'Full-Stack Developer',
      project: 'Разработка широкого спектра IT-решений, включая внутренние бизнес-системы и клиентские веб-приложения. Основное внимание — быстрая реализация MVP.',
      responsibilities: 'Полный цикл разработки: от сбора требований и проектирования архитектуры до реализации, тестирования, развертывания и последующей поддержки. Интеграция со сторонними сервисами и API.',
      telegramExpertise: 'Боты на Aiogram (асинхронные, FSM, веб-хуки), мини-приложения (Web Apps), платежные системы (Telegram).'
    },
    skills: [
      "Go", "Node.js", "Python", "PHP",
      "React", "Next.js", "Tailwind",
      "PostgreSQL", "MySQL", "MongoDB",
      "Supabase", "OpenAI", "MediaPipe"
    ]
  };
  
  const cvContent = (
    <div className="text-sm font-mono text-foreground bg-card p-4 sm:p-6 rounded-lg relative overflow-hidden border border-border group">
        <div className="absolute inset-0 bg-black/10 glitch-overlay opacity-5 group-hover:opacity-20 transition-opacity duration-300"></div>
        <header className="flex flex-col md:flex-row justify-between md:items-start gap-4 md:gap-6 border-b border-border pb-4 mb-4">
            <div className="flex-grow">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{cvData.name}</h1>
                <p className="text-primary mt-1 text-sm sm:text-base"><Typewriter text={cvData.email} stopBlinkingOnEnd /></p>
            </div>
            <div className="font-mono text-xs sm:text-sm w-full md:w-auto md:max-w-xs shrink-0">
                <div className="bg-background/50 text-foreground p-3 rounded-lg border border-primary/20 w-full shadow-inner backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                        {chinaTime !== null ? <span className="text-foreground"><Typewriter text={`My TIME ${chinaTime}`} speed={50} stopBlinkingOnEnd /></span> : <div className="h-4" />}
                    </div>
                    
                    <a href={`https://t.me/${cvData.telegram}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        <Typewriter text={`@${cvData.telegram}`} speed={50} delay={800} stopBlinkingOnEnd />
                    </a>
                </div>
            </div>
        </header>

        <div className="flex flex-col sm:flex-row gap-6">
            <div className="sm:w-2/3">
                <section className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg sm:text-xl font-bold text-primary">Objective</h2>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary hover:bg-primary/20" onClick={() => setShowCvModal(true)}>
                            <Eye size={16} />
                        </Button>
                    </div>
                    <p className="text-foreground text-xs sm:text-sm"><Typewriter text={cvData.objective} stopBlinkingOnEnd /></p>
                </section>

                <section>
                    <h2 className="text-lg sm:text-xl font-bold text-primary mb-2">Experience</h2>
                    <div className="mb-4 space-y-2 text-foreground text-xs sm:text-sm">
                        <h3 className="text-base sm:text-lg font-bold">{cvData.experience.title}</h3>
                        <p><span className="font-bold">Project description:</span> <Typewriter text={cvData.experience.project} stopBlinkingOnEnd /></p>
                        <p><span className="font-bold">Responsibilities:</span> <Typewriter text={cvData.experience.responsibilities} stopBlinkingOnEnd /></p>
                        <p><span className="font-bold">Expertise in Telegram:</span> <Typewriter text={cvData.experience.telegramExpertise} stopBlinkingOnEnd /></p>
                    </div>
                </section>
            </div>
            <div className="sm:w-1/3">
                 <h2 className="text-lg sm:text-xl font-bold text-primary mb-2">Skills</h2>
                <ul className="list-none space-y-1 text-foreground text-xs sm:text-sm">
                    {cvData.skills.map((skill, index) => (
                        <li key={index}><Typewriter text={skill} delay={index * 50} stopBlinkingOnEnd /></li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );

  const projectsContent = (
    <div className="grid grid-cols-2 gap-2">
      <ProjectCard>
        <div className="flex flex-col items-center justify-center text-center gap-2">
            <Image src="https://i.pinimg.com/736x/21/f4/12/21f41282347a9c8134a464786ae287d.jpg" alt="CV Face" width={48} height={48} className="grayscale rounded-full"/>
            <h3 className="font-bold">CV</h3>
            <p className="text-xs text-muted-foreground">MediaPipe, OpenAI</p>
        </div>
      </ProjectCard>
      <ProjectCard>
        <div className="flex flex-col items-center gap-2 text-center">
            <Image src="https://i.imgur.com/3j3OQ3b.png" alt="Telegram Bots" width={48} height={48} className="grayscale" />
            <h3 className="font-bold">Telegram Bots</h3>
            <p className="text-xs text-muted-foreground">Aiogram, Web Apps</p>
        </div>
      </ProjectCard>
      <ProjectCard>
        <div className="flex flex-col items-center gap-2 text-center">
            <Code size={32}/>
            <h3 className="font-bold">Web Apps</h3>
            <p className="text-xs text-muted-foreground">Next.js, Go, Python</p>
        </div>
      </ProjectCard>
      <ProjectCard>
        <div className="flex flex-col items-center gap-2 text-center">
            <Database size={32}/>
            <h3 className="font-bold">Databases</h3>
            <p className="text-xs text-muted-foreground">PostgreSQL, MSSQL, Mongo</p>
        </div>
      </ProjectCard>
    </div>
  );

  const navButton = (label: string, content: 'main' | 'cv' | 'projects') => {
    const command = `C:\\> ${label}`;
    return (
      <Button 
        variant="outline" 
        className="justify-start h-full text-sm sm:text-base border-primary hover:bg-accent" 
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


  if (showUiUxFullScreen) {
    return (
      <main className="fixed inset-0 z-50 bg-background flex flex-col">
        <div className="flex-grow">
          <iframe
            srcDoc={uiUxHtmlContent}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="UI/UX Prototype"
          />
        </div>
        <div className="p-4 bg-background border-t border-primary">
          <Button 
            variant="outline"
            className="w-full border-primary"
            onClick={() => setShowUiUxFullScreen(false)}
          >
            <ArrowLeft size={16} className="mr-2"/>
            Вернуться на сайт
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-2 sm:p-4 min-h-screen flex flex-col relative">
       {showCvModal && <EyeTrackingModal onClose={() => setShowCvModal(false)} />}
      <div className="w-full max-w-xl mx-auto flex flex-col flex-grow">
        <Toaster />
        <header className="flex gap-2 mb-2">
          <Card 
            className="w-1/3 aspect-square flex items-center justify-center text-center p-2 border-primary cursor-pointer relative overflow-hidden"
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
                    src="https://i.pinimg.com/736x/21/f4/12/21f41282347a9c8134a464786ae287d.jpg"
                    alt="pixelated person"
                    fill
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
          <nav className="w-2/3 flex flex-col gap-2">
            {activeContent !== 'main' ? navButton('..', 'main') : navButton('CV', 'cv')}
            {activeContent === 'main' ? navButton('PROJECTS', 'projects') : activeContent === 'projects' ? null : navButton('PROJECTS', 'projects')}
            {activeContent !== 'projects' && navButton('CONTACT', 'main')}
          </nav>
        </header>
        
        <div className="flex flex-col flex-grow min-h-0">
          {activeContent === 'cv' && (
            <section className="overflow-y-auto flex-grow">
              {cvContent}
            </section>
          )}
          
          {activeContent === 'projects' && (
            <section className="overflow-y-auto flex-grow">
              {projectsContent}
            </section>
          )}

          {activeContent === 'main' && (
            <div className="space-y-2 flex flex-col flex-grow">
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
                            onClick={() => handleServiceClick(service.name, service.description, service.fileType)}
                          >
                            <div className="flex flex-col">
                                <span className="text-sm sm:text-base">{service.name}</span>
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
                  <CardContent className="p-0 font-mono text-xs sm:text-sm">
                    <p className="font-bold">*** STOP: 0x00000000 BUSINESS_SUCCESS ***</p>
                    <p>VITALIY.DEV - SYSTEM HALTED FOR PROFIT OPTIMIZATION</p>
                    <br />
                    <p>SITE BUILT WITH: Next.js, React, Tailwind CSS, ShadCN, Genkit AI, Matter.js, Framer Motion</p>
                    <br />
                    <div className="relative">
                       <p>PRESS ANY KEY TO CONTINUE...</p>
                    </div>
                    <p>OR CONTACT FOR SERVICES</p>
                  </CardContent>
                </Card>
              </section>

              <section className="flex-grow min-h-0">
                <Card className="w-full h-64 p-1 border-primary flex flex-col">
                  <CardHeader className="p-2 z-10">
                    <CardTitle className="text-xs text-muted-foreground">C:\&gt; LOAD STACK</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full w-full overflow-hidden flex-grow relative">
                    <StackSimulation />
                  </CardContent>
                </Card>
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

    






