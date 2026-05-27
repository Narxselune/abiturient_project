// js/cabinet.js
const { useState, useEffect } = React;

// База вопросов и ответов для трех профориентационных тестов
const quizDatabases = {
    // ----------------------------------------------------
    // ТЕСТ 1: БАЗА 9 КЛАССОВ — ССО (7 специальностей)
    // ----------------------------------------------------
    sso9: [
        {
            question: "1. Если бы тебе предложили поучаствовать в создании компьютерной игры, какую роль ты бы выбрал?",
            options: [
                { text: "Разрабатывать дизайн сайтов, интерфейсы меню и веб-страницы", scores: { web: 1 } },
                { text: "Искать ошибки, баги и проверять игру на прочность", scores: { po: 1 } },
                { text: "Настраивать сетевой код, серверы и стабильное подключение игроков", scores: { telecom: 1 } },
                { text: "Подключать и калибровать звуковое сопровождение, колонки и микрофоны", scores: { multi: 1 } }
            ]
        },
        {
            question: "2. Какое занятие в свободное время кажется тебе наиболее интересным?",
            options: [
                { text: "Разбираться, как устроена домашняя электроника, роутеры или кабели", scores: { cable: 1, telecom: 1 } },
                { text: "Изучать красивые интерфейсы, монтировать простые видео или пробовать верстать", scores: { web: 1, multi: 1 } },
                { text: "Искать несостыковки в правилах игр или находить скрытые баги в программах", scores: { po: 1 } },
                { text: "Организовывать процессы, распределять задачи или координировать доставку вещей", scores: { post: 1 } }
            ]
        },
        {
            question: "3. Представь, что в твоем доме пропал интернет. Твои действия?",
            options: [
                { text: "Попробую проверить физический кабель в подъезде, обжимку проводов и коннекторы", scores: { cable: 1 } },
                { text: "Зайду в настройки роутера через браузер, проверю IP-адрес и сетевой шлюз", scores: { telecom: 1 } },
                { text: "Попробую поймать мобильный 4G/5G signal или настроить спутниковую тарелку", scores: { radio: 1 } },
                { text: "Спокойно позвоню в техподдержку и скоординирую их действия по моей заявке", scores: { post: 1 } }
            ]
        },
        {
            question: "4. Какая сфера технологий привлекает тебя больше всего при просмотре новостей?",
            options: [
                { text: "Стриминг, концертный звук, акустика, студийная запись и VR", scores: { multi: 1 } },
                { text: "Мобильная связь нового поколения, беспроводные рации и спутниковое ТВ", scores: { radio: 1 } },
                { text: "Веб-разработка, создание крутых интернет-магазинов и веб-приложений", scores: { web: 1 } },
                { text: "ИТ-безопасность, облачные серверы и администрирование сетей", scores: { telecom: 1 } }
            ]
        },
        {
            question: "5. Какое ликое качество описывает тебя лучше всего?",
            options: [
                { text: "Внимательный к деталям, дотошный, люблю докапываться до сути вещей", scores: { po: 1 } },
                { text: "Творческий, аккуратный, ценю красивый визуальный стиль", scores: { web: 1 } },
                { text: "Практичный, люблю работать руками и копаться в оборудовании", scores: { cable: 1, radio: 1 } },
                { text: "Организованный, собранный, умею работать с документами и логистикой", scores: { post: 1 } }
            ]
        }
    ],

    // ----------------------------------------------------
    // ТЕСТ 2: БАЗА 11 КЛАССОВ — ССО (4 специальности)
    // ----------------------------------------------------
    sso11: [
        {
            question: "1. Какая практическая ИТ-задача привлекает тебя больше всего?",
            options: [
                { text: "Быстрое освоение контроля качества софта (QA) и автоматизации тестирования", scores: { po: 1 } },
                { text: "Администрирование маршрутизаторов, настройка IP-адресации и коммутации", scores: { telecom: 1 } },
                { text: "Проектирование беспроводных каналов передачи данных и работа со спутниками", scores: { radio: 1 } },
                { text: "Управление логистическими потоками грузов и автоматизированными складами", scores: { post: 1 } }
            ]
        },
        {
            question: "2. Какой формат работы для тебя наиболее комфортен?",
            options: [
                { text: "Офисная работа за компьютером, требующая предельной концентрации и поиска ошибок", scores: { po: 1 } },
                { text: "Работа с сетевым оборудованием в серверных комнатах, настройка \"железа\"", scores: { telecom: 1 } },
                { text: "Работа на радиорелейных или телевизионных станциях с высокочастотными приборами", scores: { radio: 1 } },
                { text: "Работа, связанная с общением с людьми, планированием маршрутов и контролем отправлений", scores: { post: 1 } }
            ]
        },
        {
            question: "3. С какой технической проблемой ты бы хотел научиться справляться профессионально?",
            options: [
                { text: "Находить уязвимости в кодовой базе и предотвращать сбои в работе программ", scores: { po: 1 } },
                { text: "Устранять неполадки в работе локальных и глобальных оптоволоконных сетей", scores: { telecom: 1 } },
                { text: "Настраивать передатчики сигналов сотовой связи и устранять радиопомехи", scores: { radio: 1 } },
                { text: "Организовывать оптимальные маршруты экспресс-доставки почтовых отправлений", scores: { post: 1 } }
            ]
        },
        {
            question: "4. Если бы ты открывал свой стартап, чем бы он занимался?",
            options: [
                { text: "Разработкой инструментов для автоматического тестирования мобильных приложений", scores: { po: 1 } },
                { text: "Облачным хостингом и предоставлением защищенных каналов связи для бизнеса", scores: { telecom: 1 } },
                { text: "Созданием нового стандарта спутникового интернета для труднодоступных мест", scores: { radio: 1 } },
                { text: "Умной службой доставки посылок с использованием дронов и беспилотников", scores: { post: 1 } }
            ]
        }
    ],

    // ----------------------------------------------------
    // ТЕСТ 3: БАЗА 11 КЛАССОВ — ВО (5 специальностей)
    // ----------------------------------------------------
    vo11: [
        {
            question: "1. Какая роль в крупной технологической компании кажется тебе наиболее привлекательной?",
            options: [
                { text: "Lead Software Engineer — проектировать архитектуру сложных программных платформ", scores: { info: 1 } },
                { text: "Robotics Engineer — программировать роботов, датчики и автоматические линии на заводах", scores: { auto: 1 } },
                { text: "Telecom Network Architect — планировать масштабные оптоволоконные и 5G/6G сети", scores: { networks: 1 } },
                { text: "Product / Marketing Manager — исследовать рынки связи, продвигать бренд и запускать рекламу", scores: { market: 1 } },
                { text: "Logistics Director — разрабатывать цифровые системы слежения и распределения грузов", scores: { post_logistics: 1 } }
            ]
        },
        {
            question: "2. Какая тема курсового или дипломного проекта тебя бы заинтересовала?",
            options: [
                { text: "Разработка нейросети для распознавания лиц или сложного веб-сервиса на Python", scores: { info: 1 } },
                { text: "Создание системы управления «Умным домом» на базе микроконтроллеров", scores: { auto: 1 } },
                { text: "Моделирование распространения радиоволн в плотной городской застройке", scores: { networks: 1 } },
                { text: "Исследование стратегий продвижения ИТ-продуктов в социальных сетях", scores: { market: 1 } },
                { text: "Оптимизация транспортных потоков крупного логистического хаба", scores: { post_logistics: 1 } }
            ]
        },
        {
            question: "3. Какими инструментами или концепциями тебе было бы интересно овладеть в первую очередь?",
            options: [
                { text: "Языками программирования (C++, C#, Java, JavaScript, базы данных SQL)", scores: { info: 1 } },
                { text: "Средами разработки для промышленных контроллеров (ПЛК, SCADA-системы)", scores: { auto: 1 } },
                { text: "Конфигурированием промышленного сетевого оборудования (Cisco, Huawei)", scores: { networks: 1 } },
                { text: "Методами веб-аналитики, контекстной рекламы и маркетинговых исследований", scores: { market: 1 } },
                { text: "Алгоритмами управления запасами, CRM-платформами и трекерами поставок", scores: { post_logistics: 1 } }
            ]
        },
        {
            question: "4. Какая научно-популярная статья привлекла бы твое внимание?",
            options: [
                { text: "«Как устроен квантовый интернет и магистральные каналы связи»", scores: { networks: 1 } },
                { text: "«Эволюция языков программирования: от компиляторов до ИИ-кодинга»", scores: { info: 1 } },
                { text: "«Полная автоматизация гигафабрик: как роботы собирают электромобили»", scores: { auto: 1 } },
                { text: "«Умная логистика: как посылки находят путь к получателю за секунды»", scores: { post_logistics: 1 } },
                { text: "«Психология потребителя: как бренды заставляют нас покупать технологии»", scores: { market: 1 } }
            ]
        }
    ]
};

function PersonalCabinet({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('checklist');

    // Состояние фильтров документов
    const [level, setLevel] = useState(() => {
        const saved = localStorage.getItem('chk_level');
        if (saved === 'vo') return 'vo_full';
        return saved || 'sso';
    });
    const [isMinor, setIsMinor] = useState(() => localStorage.getItem('chk_is_minor') || 'no');
    const [form, setForm] = useState(() => localStorage.getItem('chk_form') || 'dnev');

    // Состояние отмеченных документов
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('chk_checked_items');
        return saved ? JSON.parse(saved) : {};
    });

    // --- Состояния Теста-Навигатора ---
    const [quizStep, setQuizStep] = useState(1);
    const [targetLevel, setTargetLevel] = useState(''); // sso, vo
    const [targetForm, setTargetForm] = useState('dnev'); // dnev, zaoch

    // Интерактивный скоринг
    const [currentTestKey, setCurrentTestKey] = useState(null); // 'sso9', 'sso11', 'vo11'
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizScores, setQuizScores] = useState({});
    const [answersHistory, setAnswersHistory] = useState([]); // Очередь добавленных баллов для отката шагов

    // Эффект для синхронизации фильтров в localStorage и корректировки формы обучения
    useEffect(() => {
        let currentForm = form;
        // Если выбрана вышка (полный срок), заочной формы нет — принудительно ставим "дневная"
        if (level === 'vo_full') {
            currentForm = 'dnev';
            setForm('dnev');
        }
        localStorage.setItem('chk_level', level);
        localStorage.setItem('chk_is_minor', isMinor);
        localStorage.setItem('chk_form', currentForm);
    }, [level, isMinor, form]);

    useEffect(() => {
        localStorage.setItem('chk_checked_items', JSON.stringify(checkedItems));
    }, [checkedItems]);

    if (!isOpen) return null;

    const handleCheckboxChange = (id) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const resetQuiz = () => {
        setQuizStep(1);
        setTargetLevel('');
        setTargetForm('dnev');
        setCurrentTestKey(null);
        setCurrentQuestionIndex(0);
        setQuizScores({});
        setAnswersHistory([]);
    };

    const handleAnswerSelect = (scores) => {
        setQuizScores(prev => {
            const newScores = { ...prev };
            Object.keys(scores).forEach(key => {
                newScores[key] = (newScores[key] || 0) + scores[key];
            });
            return newScores;
        });
        setAnswersHistory(prev => [...prev, scores]);

        const activeTest = quizDatabases[currentTestKey];
        if (currentQuestionIndex < activeTest.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Если вопросы закончились, для теста 11 классов ССО предлагаем выбрать форму обучения
            if (currentTestKey === 'sso11') {
                setQuizStep(5);
            } else {
                setQuizStep(6); // Для 9 классов ССО и 11 классов ВО выводим результат сразу
            }
        }
    };

    // Логика перехода назад в тесте
    const handleQuizBack = () => {
        if (quizStep === 2) {
            setQuizStep(1);
            setTargetLevel('');
        } else if (quizStep === 4) {
            if (currentQuestionIndex > 0) {
                // Откатываем баллы за последний ответ
                const lastAddedScores = answersHistory[answersHistory.length - 1];
                if (lastAddedScores) {
                    setQuizScores(prev => {
                        const newScores = { ...prev };
                        Object.keys(lastAddedScores).forEach(key => {
                            newScores[key] = Math.max(0, (newScores[key] || 0) - lastAddedScores[key]);
                        });
                        return newScores;
                    });
                    setAnswersHistory(prev => prev.slice(0, -1));
                }
                setCurrentQuestionIndex(prev => prev - 1);
            } else {
                // Возврат из первого вопроса к меню выбора базы
                if (currentTestKey === 'vo11') {
                    setQuizStep(1);
                    setCurrentTestKey(null);
                } else {
                    setQuizStep(2);
                    setCurrentTestKey(null);
                }
                setQuizScores({});
                setAnswersHistory([]);
            }
        } else if (quizStep === 5) {
            // Шаг ССО 11 выбора формы обучения -> возвращаемся к последнему вопросу
            const activeTest = quizDatabases[currentTestKey];
            const lastIndex = activeTest.length - 1;

            const lastAddedScores = answersHistory[answersHistory.length - 1];
            if (lastAddedScores) {
                setQuizScores(prev => {
                    const newScores = { ...prev };
                    Object.keys(lastAddedScores).forEach(key => {
                        newScores[key] = Math.max(0, (newScores[key] || 0) - lastAddedScores[key]);
                    });
                    return newScores;
                });
                setAnswersHistory(prev => prev.slice(0, -1));
            }

            setCurrentQuestionIndex(lastIndex);
            setQuizStep(4);
        } else if (quizStep === 6) {
            // Шаг результатов -> возвращаемся на форму обучения (для ССО 11) либо на последний вопрос
            if (currentTestKey === 'sso11') {
                setQuizStep(5);
            } else {
                const activeTest = quizDatabases[currentTestKey];
                const lastIndex = activeTest.length - 1;

                const lastAddedScores = answersHistory[answersHistory.length - 1];
                if (lastAddedScores) {
                    setQuizScores(prev => {
                        const newScores = { ...prev };
                        Object.keys(lastAddedScores).forEach(key => {
                            newScores[key] = Math.max(0, (newScores[key] || 0) - lastAddedScores[key]);
                        });
                        return newScores;
                    });
                    setAnswersHistory(prev => prev.slice(0, -1));
                }

                setCurrentQuestionIndex(lastIndex);
                setQuizStep(4);
            }
        }
    };

    const getRequiredDocuments = () => {
        const docs = [
            { id: 'photos', text: '6 цветных фотографий размером 3х4 см' },
            { id: 'edu_docs', text: 'ОРИГИНАЛЫ и копии всех документов об образовании и приложения к ним (свидетельство о базовом образовании, аттестат, диплом с приложением)' },
            { id: 'medical', text: 'Медицинская справка о состоянии здоровья по форме, установленной Министерством здравоохранения, с указанием годности к выбранным специальностям (указывается полное наименование специальностей)' },
            { id: 'benefits', text: 'Документы, подтверждающие право абитуриента на льготы (при их наличии) (оригинал и копия)' },
            { id: 'vkk_mrek', text: 'Заключение ВКК или МРЭК об отсутствии противопоказаний для обучения по выбранной специальности (для детей-инвалидов до 18 лет, инвалидов I, II и III группы)' },
            { id: 'marriage', text: 'Копия свидетельства о браке (если документ об образовании и паспорт на разные фамилии)' },
            { id: 'passport', text: 'Паспорт или заменяющий его документ (предъявляется абитуриентом лично приемной комиссии)' }
        ];

        if (level === 'sso') {
            if (form === 'zaoch') {
                docs.push({ id: 'work_book_sso', text: 'Выписка (копия) из трудовой книжки, заверенная администрацией (для поступающих на заочную форму обучения)' });
            }
        } else if (level === 'vo_full') {
            docs.push({ id: 'ce_ct_vo', text: 'Оригиналы и копии сертификатов централизованного экзамена (ЦЭ) / централизованного тестирования (ЦТ)' });
            docs.push({ id: 'med_group_vo', text: 'В медицинской справке при поступлении на группу специальностей указываются все специальности группы' });
            docs.push({ id: 'char_vo', text: 'Характеристика (необходима тем, кто окончил учреждение образования в год поступления)' });
        } else if (level === 'vo_short') {
            docs.push({ id: 'char_vo_short', text: 'Характеристика (необходима тем, кто окончил учреждение образования в год поступления)' });
            if (form === 'zaoch') {
                docs.push({ id: 'work_book_vo_short', text: 'Выписка (копия) из трудовой книжки, заверенная администрацией (для поступающих на заочную форму обучения)' });
            }
        }

        if (isMinor === 'yes') {
            docs.push({ id: 'parent_presence', text: 'Подача документов в присутствии законного представителя (родителя) с его паспортом (для несовершеннолетних абитуриентов)' });
        }

        return docs;
    };

    const getWinnerKey = () => {
        let winner = null;
        let maxVal = -1;
        Object.keys(quizScores).forEach(key => {
            if (quizScores[key] > maxVal) {
                maxVal = quizScores[key];
                winner = key;
            }
        });
        return winner;
    };

    const calculateRecommendation = () => {
        const winner = getWinnerKey();

        // --- ТЕСТ 1: БАЗА 9 КЛАССОВ (ССО) ---
        if (currentTestKey === 'sso9') {
            if (winner === 'web') return {
                name: "Разработка и сопровождение веб-ресурсов",
                desc: "Проектирование веб-интерфейсов, верстка шаблонов сайтов и написание клиентского кода на JavaScript.",
                url: "pages/monitoring/mon_sso_9_spec1.html"
            };
            if (winner === 'po') return {
                name: "Тестирование программного обеспечения",
                desc: "Контроль качества программных продуктов, автоматизация тестов, составление баг-репортов и аудит QA.",
                url: "pages/monitoring/mon_sso_9_spec7.html"
            };
            if (winner === 'cable') return {
                name: "Информационные кабельные сети",
                desc: "Монтаж и обслуживание волоконно-оптических (ВОЛС) и локальных проводных инфокоммуникационных линий связи.",
                url: "pages/monitoring/mon_sso_9_spec3.html"
            };
            if (winner === 'radio') return {
                name: "Техническая эксплуатация систем радиосвязи, вещания и телевидения",
                desc: "Обеспечение стабильной работы радиовещательных станций, спутниковых систем и цифрового ТВ.",
                url: "pages/monitoring/mon_sso_9_spec4.html"
            };
            if (winner === 'multi') return {
                name: "Техническая эксплуатация мультимедийных систем",
                desc: "Профессиональная настройка студийного, концертного звука, акустических платформ и мультимедиа-экранов.",
                url: "pages/monitoring/mon_sso_9_spec5.html"
            };
            if (winner === 'post') return {
                name: "Почтовая деятельность (9 кл.)",
                desc: "Логистическое управление распределением отправлений, координация доставок и автоматизированный клиентский сервис.",
                url: "pages/monitoring/mon_sso_9_spec6.html"
            };
            return {
                name: "Техническая эксплуатация систем и сетей телекоммуникаций",
                desc: "Администрирование серверов связи, маршрутизация потоков данных и конфигурирование АТС.",
                url: "pages/monitoring/mon_sso_9_spec2.html"
            };
        }

        // --- ТЕСТ 2: БАЗА 11 КЛАССОВ (ССО) ---
        if (currentTestKey === 'sso11') {
            if (winner === 'po') return {
                name: "Тестирование программного обеспечения (11 кл., Дневное)",
                desc: "Быстрый вход в ИТ-индустрию через практическое освоение ручного и автоматического тестирования ПО за 2 года.",
                url: "pages/monitoring/mon_sso_11_dnev_spec4.html"
            };
            if (winner === 'radio') {
                return targetForm === 'zaoch' ? {
                    name: "Радиосвязь и ТВ (Заочное)",
                    desc: "Заочное обучение эксплуатации радиоэлектронного оборудования связи и систем вещания.",
                    url: "pages/monitoring/mon_sso_11_zaoch_spec6.html"
                } : {
                    name: "Радиосвязь и ТВ (Дневное)",
                    desc: "Очное обучение построению радиолиний, спутниковых сетей вещания и мобильной телефонии.",
                    url: "pages/monitoring/mon_sso_11_dnev_spec2.html"
                };
            }
            if (winner === 'post') {
                return targetForm === 'zaoch' ? {
                    name: "Почтовая деятельность (Заочное)",
                    desc: "Заочный курс менеджмента почтово-транспортных сетей и систем складского распределения.",
                    url: "pages/monitoring/mon_sso_11_zaoch_spec7.html"
                } : {
                    name: "Почтовая деятельность (Дневное)",
                    desc: "Очное обучение цифровой транспортной логистике, управлению потоками отправлений и сервисам обслуживания.",
                    url: "pages/monitoring/mon_sso_11_dnev_spec3.html"
                };
            }
            return targetForm === 'zaoch' ? {
                name: "Телекоммуникации (Заочное)",
                desc: "Заочное освоение сетевого администрирования и эксплуатации современных систем связи.",
                url: "pages/monitoring/mon_sso_11_zaoch_spec5.html"
            } : {
                name: "Телекоммуникации (Дневное)",
                desc: "Очное освоение монтажа оптических трасс, настройки маршрутизаторов и серверов связи.",
                url: "pages/monitoring/mon_sso_11_dnev_spec1.html"
            };
        }

        // --- ТЕСТ 3: БАЗА 11 КЛАССОВ (ВО) ---
        if (currentTestKey === 'vo11') {
            if (winner === 'info') return {
                name: "Прикладная информатика (ВО)",
                desc: "Комплексная инженерно-математическая подготовка full-stack разработчиков и архитекторов ИС.",
                url: "pages/monitoring/mon_vo_11_spec3.html"
            };
            if (winner === 'auto') return {
                name: "Автоматизация технологических процессов и производств",
                desc: "Программирование микроконтроллеров и промышленных ПЛК, робототехнические комплексы и индустрия 4.0.",
                url: "pages/monitoring/mon_vo_11_spec1.html"
            };
            if (winner === 'market') return {
                name: "Маркетинг (ВО)",
                desc: "Анализ отраслевых рынков услуг связи, разработка веб-рекламы, продуктовый менеджмент и PR.",
                url: "pages/monitoring/mon_vo_11_spec5.html"
            };
            if (winner === 'post_logistics') return {
                name: "Цифровые клиентские сервисы и почтово-логистические системы",
                desc: "Почтово-логистические хабы, программирование логистических цепочек и интеграция баз данных доставок.",
                url: "pages/monitoring/mon_vo_11_spec4.html"
            };
            return {
                name: "Системы и сети инфокоммуникаций (11 кл.)",
                desc: "Магистральное проектирование оптоволоконных, космических и сотовых инфраструктур передачи информации.",
                url: "pages/monitoring/mon_vo_11_spec2.html"
            };
        }
    };

    const startSelectedTest = (testKey) => {
        setCurrentTestKey(testKey);
        setCurrentQuestionIndex(0);
        setQuizScores({});
        setAnswersHistory([]);
        setQuizStep(4);
    };

    return (
        <div className="cabinet-window">
            <div className="cabinet-header">
                <div className="cabinet-header-title">
                     Личный кабинет абитуриента
                </div>
                <button className="ai-close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="cabinet-tabs">
                <button
                    className={`cabinet-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checklist')}
                >
                    Чек-лист
                </button>
                <button
                    className={`cabinet-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    Выбор специальности
                </button>
            </div>

            <div className="cabinet-body">
                {activeTab === 'checklist' && (
                    <div>
                        <div className="cab-checklist-filters">
                            <div className="cab-filter-row">
                                <label>Куда поступаю:</label>
                                <select className="cab-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                                    <option value="sso">В колледж (ССО)</option>
                                    <option value="vo_full">В университет (ВО, полный срок)</option>
                                    <option value="vo_short">В университет (ВО, сокращенный срок)</option>
                                </select>
                            </div>
                            <div className="cab-filter-row">
                                <label>Форма обучения:</label>
                                {level === 'vo_full' ? (
                                    <select className="cab-select" value="dnev" disabled style={{ cursor: 'not-allowed', opacity: 0.8 }}>
                                        <option value="dnev">Дневная</option>
                                    </select>
                                ) : (
                                    <select className="cab-select" value={form} onChange={(e) => setForm(e.target.value)}>
                                        <option value="dnev">Дневная</option>
                                        <option value="zaoch">Заочная</option>
                                    </select>
                                )}
                            </div>
                            <div className="cab-filter-row">
                                <label>Мне меньше 18 лет:</label>
                                <select className="cab-select" value={isMinor} onChange={(e) => setIsMinor(e.target.value)}>
                                    <option value="no">Нет</option>
                                    <option value="yes">Да</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                            {getRequiredDocuments().map((doc) => {
                                const isChecked = !!checkedItems[doc.id];
                                return (
                                    <label
                                        key={doc.id}
                                        className={`cab-checklist-item ${isChecked ? 'completed' : ''}`}
                                        style={{ textAlign: 'left', display: 'flex', alignItems: 'flex-start' }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => handleCheckboxChange(doc.id)}
                                            style={{ flexShrink: 0, marginTop: '4px' }}
                                        />
                                        <span style={{ marginLeft: '8px' }}>{doc.text}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                )}

                {activeTab === 'quiz' && (
                    <div>
                        {/* Кнопка "Назад" для всех шагов кроме первого */}
                        {quizStep > 1 && (
                            <button
                                className="cab-quiz-back-btn"
                                onClick={handleQuizBack}
                            >
                                ← Назад
                            </button>
                        )}

                        {/* ШАГ 1: Выбор траектории поступления */}
                        {quizStep === 1 && (
                            <div>
                                <p className="cab-quiz-question">Какой уровень образования тебя интересует?</p>
                                <div className="cab-quiz-options">
                                    <button className="cab-quiz-btn" onClick={() => { setTargetLevel('sso'); setQuizStep(2); }}>Поступление в Колледж (ССО)</button>
                                    <button className="cab-quiz-btn" onClick={() => { setTargetLevel('vo'); startSelectedTest('vo11'); }}>Поступление в Академию (ВО, 11 кл.)</button>
                                </div>
                            </div>
                        )}

                        {/* ШАГ 2: База образования для Колледжа */}
                        {quizStep === 2 && (
                            <div>
                                <p className="cab-quiz-question">Какая база образования у тебя на момент поступления?</p>
                                <div className="cab-quiz-options">
                                    <button className="cab-quiz-btn" onClick={() => startSelectedTest('sso9')}>На базе 9 классов (ССО)</button>
                                    <button className="cab-quiz-btn" onClick={() => startSelectedTest('sso11')}>На базе 11 классов (ССО)</button>
                                </div>
                            </div>
                        )}

                        {/* ШАГ 4: Прохождение вопросов активного теста */}
                        {quizStep === 4 && currentTestKey && (
                            <div>
                                <p className="cab-quiz-question" style={{ color: '#007bff', fontSize: '13px', marginBottom: '5px' }}>
                                    Вопрос {currentQuestionIndex + 1} из {quizDatabases[currentTestKey].length}
                                </p>
                                <p className="cab-quiz-question">
                                    {quizDatabases[currentTestKey][currentQuestionIndex].question}
                                </p>
                                <div className="cab-quiz-options">
                                    {quizDatabases[currentTestKey][currentQuestionIndex].options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            className="cab-quiz-btn"
                                            onClick={() => handleAnswerSelect(opt.scores)}
                                        >
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ШАГ 5: Выбор формы обучения (для 11 кл. ССО) */}
                        {quizStep === 5 && (
                            <div>
                                <p className="cab-quiz-question">Какой формат обучения тебе предпочтительнее?</p>
                                <div className="cab-quiz-options">
                                    <button className="cab-quiz-btn" onClick={() => { setTargetForm('dnev'); setQuizStep(6); }}>Дневная форма получения образования</button>
                                    <button className="cab-quiz-btn" onClick={() => { setTargetForm('zaoch'); setQuizStep(6); }}>Заочная форма получения образования</button>
                                </div>
                            </div>
                        )}

                        {/* ШАГ 6: Вывод результатов тестирования */}
                        {quizStep === 6 && (
                            <div className="quiz-result-box">
                                <p style={{ fontWeight: 'bold', color: '#007bff', fontSize: '15px', marginBottom: '8px' }}>Результат тестирования:</p>
                                <div style={{ padding: '12px', backgroundColor: '#F0F7FF', borderRadius: '10px', marginBottom: '15px', borderLeft: '3px solid #007bff' }}>
                                    <strong style={{ display: 'block', fontSize: '15px', marginBottom: '4px', color: '#1A202C' }}>{calculateRecommendation().name}</strong>
                                    <span style={{ fontSize: '12px', color: '#4A5568', lineHeight: '1.4', display: 'block' }}>{calculateRecommendation().desc}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a href={calculateRecommendation().url} className="btn-arrow" style={{ textDecoration: 'none', padding: '8px 12px', fontSize: '12px' }}>Смотреть конкурс</a>
                                    <button className="btn-arrow" style={{ backgroundColor: '#A0AEC0', padding: '8px 12px', fontSize: '12px' }} onClick={resetQuiz}>Пройти заново</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}