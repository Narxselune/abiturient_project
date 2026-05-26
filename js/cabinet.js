// js/cabinet.js
const { useState, useEffect } = React;

// ==========================================================================
// КОМПОНЕНТ ЛИЧНОГО КАБИНЕТА С ЧЕК-ЛИСТОМ И РАСШИРЕННЫМ ТЕСТОМ
// ==========================================================================
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

    // Шаги теста-навигатора
    const [quizStep, setQuizStep] = useState(1);
    const [targetLevel, setTargetLevel] = useState('');     // sso, vo
    const [targetBase, setTargetBase] = useState('');       // 9, 11, pto, sso_short
    const [targetInterests, setTargetInterests] = useState(''); // code, hardware, manage
    const [targetSubInterests, setTargetSubInterests] = useState(''); // web, qa, radio, cable, multi, telecom, auto, networks, market, post_logistics
    const [targetForm, setTargetForm] = useState('dnev');   // dnev, zaoch

    useEffect(() => {
        localStorage.setItem('chk_level', level);
        localStorage.setItem('chk_is_minor', isMinor);
        localStorage.setItem('chk_form', form);
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
        setTargetBase('');
        setTargetInterests('');
        setTargetSubInterests('');
        setTargetForm('dnev');
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

    const calculateRecommendation = () => {
        if (targetBase === 'pto') {
            return {
                name: "Почтовая деятельность (на базе ПТО)",
                desc: "Специализированная траектория ССО для выпускников учреждений профессионально-технического образования.",
                url: "pages/monitoring/mon_sso_pto_spec1.html"
            };
        }

        if (targetLevel === 'sso') {
            if (targetBase === '9') {
                if (targetInterests === 'code') {
                    return targetSubInterests === 'web' ? {
                        name: "Разработка и сопровождение веб-ресурсов",
                        desc: "Проектирование веб-интерфейсов, верстка шаблонов сайтов и написание клиентского кода на JavaScript.",
                        url: "pages/monitoring/mon_sso_9_spec1.html"
                    } : {
                        name: "Тестирование программного обеспечения",
                        desc: "Контроль качества программных продуктов, автоматизация тестов, составление баг-репортов и аудит QA.",
                        url: "pages/monitoring/mon_sso_9_spec7.html"
                    };
                } else if (targetInterests === 'hardware') {
                    if (targetSubInterests === 'cable') {
                        return {
                            name: "Информационные кабельные сети",
                            desc: "Монтаж и обслуживание волоконно-оптических (ВОЛС) и локальных проводных инфокоммуникационных линий связи.",
                            url: "pages/monitoring/mon_sso_9_spec3.html"
                        };
                    } else if (targetSubInterests === 'radio') {
                        return {
                            name: "Техническая эксплуатация систем радиосвязи, вещания и телевидения",
                            desc: "Обеспечение стабильной работы радиовещательных станций, спутниковых систем и цифрового ТВ.",
                            url: "pages/monitoring/mon_sso_9_spec4.html"
                        };
                    } else if (targetSubInterests === 'multi') {
                        return {
                            name: "Техническая эксплуатация мультимедийных систем",
                            desc: "Профессиональная настройка студийного, концертного звука, акустических платформ и мультимедиа-экранов.",
                            url: "pages/monitoring/mon_sso_9_spec5.html"
                        };
                    } else {
                        return {
                            name: "Техническая эксплуатация систем и сетей телекоммуникаций",
                            desc: "Администрирование серверов связи, маршрутизация потоков данных и конфигурирование АТС.",
                            url: "pages/monitoring/mon_sso_9_spec2.html"
                        };
                    }
                } else {
                    return {
                        name: "Почтовая деятельность (9 кл.)",
                        desc: "Логистическое управление распределением отправлений, координация доставок и автоматизированный клиентский сервис.",
                        url: "pages/monitoring/mon_sso_9_spec6.html"
                    };
                }
            } else if (targetBase === '11') {
                if (targetInterests === 'code') {
                    return {
                        name: "Тестирование программного обеспечения (11 кл., Дневное)",
                        desc: "Быстрый вход в ИТ-индустрию через практическое освоение ручного и автоматического тестирования ПО за 2 года.",
                        url: "pages/monitoring/mon_sso_11_dnev_spec4.html"
                    };
                } else if (targetInterests === 'hardware') {
                    const isRadio = targetSubInterests === 'radio';
                    if (targetForm === 'zaoch') {
                        return isRadio ? {
                            name: "Радиосвязь и ТВ (Заочное)",
                            desc: "Заочное обучение эксплуатации радиоэлектронного оборудования связи и систем вещания.",
                            url: "pages/monitoring/mon_sso_11_zaoch_spec6.html"
                        } : {
                            name: "Телекоммуникации (Заочное)",
                            desc: "Заочное освоение сетевого администрирования и эксплуатации современных систем связи.",
                            url: "pages/monitoring/mon_sso_11_zaoch_spec5.html"
                        };
                    } else {
                        return isRadio ? {
                            name: "Радиосвязь и ТВ (Дневное)",
                            desc: "Очное обучение построению радиолиний, спутниковых сетей вещания и мобильной телефонии.",
                            url: "pages/monitoring/mon_sso_11_dnev_spec2.html"
                        } : {
                            name: "Телекоммуникации (Дневное)",
                            desc: "Очное освоение монтажа оптических трасс, настройки маршрутизаторов и серверов связи.",
                            url: "pages/monitoring/mon_sso_11_dnev_spec1.html"
                        };
                    }
                } else {
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
            }
        } else {
            if (targetBase === '11') {
                if (targetInterests === 'code') {
                    return {
                        name: "Прикладная информатика (ВО)",
                        desc: "Комплексная инженерно-математическая подготовка full-stack разработчиков и архитекторов ИС.",
                        url: "pages/monitoring/mon_vo_11_spec3.html"
                    };
                } else if (targetInterests === 'hardware') {
                    return targetSubInterests === 'auto' ? {
                        name: "Автоматизация технологических процессов и производств",
                        desc: "Программирование микроконтроллеров и промышленных ПЛК, робототехнические комплексы и индустрия 4.0.",
                        url: "pages/monitoring/mon_vo_11_spec1.html"
                    } : {
                        name: "Системы и сети инфокоммуникаций (11 кл.)",
                        desc: "Магистральное проектирование оптоволоконных, космических и сотовых инфраструктур передачи информации.",
                        url: "pages/monitoring/mon_vo_11_spec2.html"
                    };
                } else {
                    return targetSubInterests === 'market' ? {
                        name: "Маркетинг (ВО)",
                        desc: "Анализ отраслевых рынков услуг связи, разработка веб-рекламы, продуктовый менеджмент и PR.",
                        url: "pages/monitoring/mon_vo_11_spec5.html"
                    } : {
                        name: "Цифровые клиентские сервисы и почтово-логистические системы",
                        desc: "Почтово-логистические хабы, программирование логистических цепочек и интеграция баз данных доставок.",
                        url: "pages/monitoring/mon_vo_11_spec4.html"
                    };
                }
            } else {
                if (targetInterests === 'code') {
                    return {
                        name: "Прикладная информатика (Дневное сокращенное)",
                        desc: "Ускоренный университетский ИТ-курс (2,5 года) для выпускников ИТ-специальностей колледжей.",
                        url: "pages/monitoring/mon_vo_sso_dnev_spec2.html"
                    };
                } else if (targetInterests === 'hardware') {
                    return targetForm === 'zaoch' ? {
                        name: "Системы и сети инфокоммуникаций (Заочное сокращенное)",
                        desc: "Заочное инженерное высшее образование в ускоренной форме (3 года) для специалистов со средним специальным образованием.",
                        url: "pages/monitoring/mon_vo_sso_zaoch_spec4.html"
                    } : {
                        name: "Системы и сети инфокоммуникаций (Дневное сокращенное)",
                        desc: "Очное углубление знаний в области магистральной связи и инфокоммуникаций по сжатой программе (2,5 года).",
                        url: "pages/monitoring/mon_vo_sso_dnev_spec1.html"
                    };
                } else {
                    return targetForm === 'zaoch' ? {
                        name: "Почтовая связь (Заочное сокращенное)",
                        desc: "Высшее образование для логистов и связистов в ускоренной заочной форме (3,5 года) на базе ССО.",
                        url: "pages/monitoring/mon_vo_sso_zaoch_spec6.html"
                    } : {
                        name: "Почтовая связь (Дневное сокращенное)",
                        desc: "Интегрированный курс ИТ-управления почтово-логистическими хабами в очной сокращенной форме (3 года).",
                        url: "pages/monitoring/mon_vo_sso_dnev_spec3.html"
                    };
                }
            }
        }
    };

    return (
        <div className="cabinet-window">
            <div className="cabinet-header">
                <div className="cabinet-header-title">
                    👤 Личный кабинет абитуриента
                </div>
                <button className="ai-close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="cabinet-tabs">
                <button
                    className={`cabinet-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('checklist')}
                >
                    📋 Чек-лист
                </button>
                <button
                    className={`cabinet-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                    onClick={() => setActiveTab('quiz')}
                >
                    🧭 Выбор специальности
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
                                <select className="cab-select" value={form} onChange={(e) => setForm(e.target.value)}>
                                    <option value="dnev">Дневная</option>
                                    <option value="zaoch">Заочная</option>
                                </select>
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
                        {quizStep === 1 && (
                            <div>
                                <p className="cab-quiz-question">1. Какой уровень образования тебя интересует?</p>
                                <div className="cab-quiz-options">
                                    <button className="cab-quiz-btn" onClick={() => { setTargetLevel('sso'); setQuizStep(2); }}>🎓 Среднее специальное (Колледж)</button>
                                    <button className="cab-quiz-btn" onClick={() => { setTargetLevel('vo'); setQuizStep(2); }}>🏫 Высшее образование (ВО)</button>
                                </div>
                            </div>
                        )}

                        {quizStep === 2 && (
                            <div>
                                <p className="cab-quiz-question">2. Какая база образования у тебя на момент поступления?</p>
                                <div className="cab-quiz-options">
                                    {targetLevel === 'sso' ? (
                                        <React.Fragment>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetBase('9'); setQuizStep(3); }}>📄 На базе 9 классов</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetBase('11'); setQuizStep(3); }}>📄 На базе 11 классов</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetBase('pto'); setQuizStep(6); }}>⚙️ На базе ПТО (Профессионально-техническое)</button>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetBase('11'); setQuizStep(3); }}>📄 На базе 11 классов</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetBase('sso_short'); setQuizStep(3); }}>🎓 После колледжа (сокращенно ССО)</button>
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>
                        )}

                        {quizStep === 3 && (
                            <div>
                                <p className="cab-quiz-question">3. Какое направление деятельности тебе ближе?</p>
                                <div className="cab-quiz-options">
                                    <button className="cab-quiz-btn" onClick={() => {
                                        setTargetInterests('code');
                                        if (targetLevel === 'sso' && targetBase === '9') {
                                            setQuizStep(4);
                                        } else if (targetLevel === 'sso' && targetBase === '11') {
                                            setQuizStep(6);
                                        } else if (targetLevel === 'vo' && targetBase === '11') {
                                            setQuizStep(6);
                                        } else if (targetLevel === 'vo' && targetBase === 'sso_short') {
                                            setQuizStep(6);
                                        }
                                    }}>💻 Программирование и ИТ (написание кода, веб-сайты, тестирование)</button>

                                    <button className="cab-quiz-btn" onClick={() => {
                                        setTargetInterests('hardware');
                                        setQuizStep(4);
                                    }}>🔌 Сетевое оборудование, радиоэлектроника и автоматизация</button>

                                    <button className="cab-quiz-btn" onClick={() => {
                                        setTargetInterests('manage');
                                        if (targetLevel === 'vo' && targetBase === '11') {
                                            setQuizStep(4);
                                        } else if (targetLevel === 'sso' && targetBase === '9') {
                                            setQuizStep(6);
                                        } else if (targetLevel === 'sso' && targetBase === '11') {
                                            setQuizStep(5);
                                        } else if (targetLevel === 'vo' && targetBase === 'sso_short') {
                                            setQuizStep(5);
                                        }
                                    }}>📦 Бизнес-анализ, маркетинг, логистика и клиентский сервис</button>
                                </div>
                            </div>
                        )}

                        {quizStep === 4 && (
                            <div>
                                <p className="cab-quiz-question">4. Выберите более узкую специализацию:</p>
                                <div className="cab-quiz-options">
                                    {targetLevel === 'sso' && targetBase === '9' && targetInterests === 'code' && (
                                        <React.Fragment>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('web'); setQuizStep(6); }}>🌐  Веб-программирование, верстка интерфейсов и веб-дизайн</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('qa'); setQuizStep(6); }}>🐛 Тестирование ПО, автотесты и контроль качества</button>
                                        </React.Fragment>
                                    )}

                                    {targetLevel === 'sso' && targetBase === '9' && targetInterests === 'hardware' && (
                                        <React.Fragment>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('cable'); setQuizStep(6); }}>🛠️ Монтаж и проектирование оптического волокна (ВОЛС)</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('radio'); setQuizStep(6); }}>📡 Радиосвязь, спутниковые системы и телевидение</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('multi'); setQuizStep(6); }}>🎚️ Звуковое оборудование и мультимедийные системы</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('telecom'); setQuizStep(6); }}>🖥️ Настройка серверов, АТС и глобальное сетевое администрирование</button>
                                        </React.Fragment>
                                    )}

                                    {targetLevel === 'sso' && targetBase === '11' && targetInterests === 'hardware' && (
                                        <React.Fragment>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('radio'); setQuizStep(5); }}>📡 Спутниковая связь, радиовещание и телевидение</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('telecom'); setQuizStep(5); }}>🖥️ Системное администрирование и проводные цифровые сети</button>
                                        </React.Fragment>
                                    )}

                                    {targetLevel === 'vo' && targetBase === '11' && targetInterests === 'hardware' && (
                                        <React.Fragment>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('auto'); setQuizStep(6); }}>🤖 Автоматика, программирование ПЛК и промышленных роботов</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('networks'); setQuizStep(6); }}>🖥️ Магистральные сети связи, оптические и мобильные системы</button>
                                        </React.Fragment>
                                    )}

                                    {targetLevel === 'vo' && targetBase === '11' && targetInterests === 'manage' && (
                                        <React.Fragment>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('market'); setQuizStep(6); }}>📈 Маркетинговые исследования, бренд-менеджмент и реклама</button>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('post_logistics'); setQuizStep(6); }}>📦 Цифровая почтовая логистика и управление цепочками поставок</button>
                                        </React.Fragment>
                                    )}

                                    {targetLevel === 'vo' && targetBase === 'sso_short' && targetInterests === 'hardware' && (
                                        <React.Fragment>
                                            <button className="cab-quiz-btn" onClick={() => { setTargetSubInterests('networks'); setQuizStep(5); }}>⏩ Начать выбор формы обучения (дневная/заочная)</button>
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>
                        )}

                        {quizStep === 5 && (
                            <div>
                                <p className="cab-quiz-question">5. Какая форма обучения предпочтительнее?</p>
                                <div className="cab-quiz-options">
                                    <button className="cab-quiz-btn" onClick={() => { setTargetForm('dnev'); setQuizStep(6); }}>☀️ Дневная (очная, классическое студенчество)</button>
                                    <button className="cab-quiz-btn" onClick={() => { setTargetForm('zaoch'); setQuizStep(6); }}>🌙 Заочная (дистанционная с сессиями, без отрыва от работы)</button>
                                </div>
                            </div>
                        )}

                        {quizStep === 6 && (
                            <div className="quiz-result-box">
                                <p style={{ fontWeight: 'bold', color: '#007bff', fontSize: '15px', marginBottom: '8px' }}>Подобрана специальность:</p>
                                <div style={{ padding: '12px', backgroundColor: '#F0F7FF', borderRadius: '10px', marginBottom: '15px', borderLeft: '3px solid #007bff' }}>
                                    <strong style={{ display: 'block', fontSize: '15px', marginBottom: '4px', color: '#1A202C' }}>{calculateRecommendation().name}</strong>
                                    <span style={{ fontSize: '12px', color: '#4A5568', lineHeight: '1.4', display: 'block' }}>{calculateRecommendation().desc}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a href={calculateRecommendation().url} className="btn-arrow" style={{ textDecoration: 'none', padding: '8px 12px', fontSize: '12px' }}>Смотреть конкурс</a>
                                    <button className="btn-arrow" style={{ backgroundColor: '#A0AEC0', padding: '8px 12px', fontSize: '12px' }} onClick={resetQuiz}>Сбросить</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}