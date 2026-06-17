const express = require('express');
const router = express.Router();

// 2 aylıq tam tədris planı - Azərbaycana uyğunlaşdırılmış
const curriculum = {
  title: { az: "2 Aylıq Məktəbəqədər Hazırlıq Proqramı", ru: "2-Месячная Программа Подготовки к Школе", en: "2-Month School Preparation Program" },
  ageGroup: "5-6",
  totalWeeks: 8,
  weeks: [
    {
      week: 1,
      theme: { az: "Tanışlıq və Məktəb", ru: "Знакомство и Школа", en: "Getting to Know School" },
      days: [
        { day: 1, lessons: [
          { subject: "language", title: { az: "Səsləri öyrənək - A, B, C", ru: "Учим звуки", en: "Learn Sounds" }, duration: 25, activities: ["Hərfləri göstər", "Səslə"], image: "📝" },
          { subject: "math", title: { az: "Rəqəmlər 1-5", ru: "Цифры 1-5", en: "Numbers 1-5" }, duration: 20, activities: ["Barmaqla say", "Rəsm çək"], image: "🔢" },
          { subject: "drawing", title: { az: "Məktəb çantası çək", ru: "Рисуем школьный портфель", en: "Draw a school bag" }, duration: 20, activities: ["Boyalar", "Nümunəyə bax"], image: "🎨" }
        ]},
        { day: 2, lessons: [
          { subject: "language", title: { az: "D, E, Ə hərfləri", ru: "Буквы Д, Е", en: "Letters D, E" }, duration: 25 },
          { subject: "logic", title: { az: "Fiqurları tanıyaq", ru: "Фигуры", en: "Shapes" }, duration: 20 },
          { subject: "physical", title: { az: "Barmaq oyunları", ru: "Пальчиковые игры", en: "Finger games" }, duration: 15 }
        ]},
        { day: 3, lessons: [
          { subject: "language", title: { az: "F, G, Ğ hərfləri", ru: "Буквы", en: "Letters" }, duration: 25 },
          { subject: "math", title: { az: "Rəqəmlər 6-10", ru: "Цифры 6-10", en: "Numbers 6-10" }, duration: 20 },
          { subject: "music", title: { az: "Uşaq mahnıları", ru: "Детские песни", en: "Children songs" }, duration: 15 }
        ]},
        { day: 4, lessons: [
          { subject: "reading", title: { az: "Nağıl: Üç dovşan", ru: "Сказка: Три зайца", en: "Story: Three rabbits" }, duration: 25 },
          { subject: "drawing", title: { az: "Günəş və ağac", ru: "Солнце и дерево", en: "Sun and tree" }, duration: 20 },
          { subject: "nature", title: { az: "Fəsillər", ru: "Времена года", en: "Seasons" }, duration: 15 }
        ]},
        { day: 5, lessons: [
          { subject: "logic", title: { az: "Böyük-Kiçik anlayışı", ru: "Большой-Маленький", en: "Big-Small concept" }, duration: 25 },
          { subject: "creativity", title: { az: "Plastilin - meyvələr", ru: "Пластилин - фрукты", en: "Plasticine - fruits" }, duration: 25 },
          { subject: "physical", title: { az: "Hərəkət oyunları", ru: "Подвижные игры", en: "Movement games" }, duration: 15 }
        ]}
      ]
    },
    {
      week: 2,
      theme: { az: "Ailə və Sevgi", ru: "Семья и Любовь", en: "Family and Love" },
      days: [
        { day: 1, lessons: [
          { subject: "language", title: { az: "H, X, I hərfləri + ailə sözləri", ru: "Семья", en: "Family words" }, duration: 25 },
          { subject: "math", title: { az: "Toplama 1-5", ru: "Сложение 1-5", en: "Addition 1-5" }, duration: 20 },
          { subject: "drawing", title: { az: "Ailəmi çəkiyorum", ru: "Рисую свою семью", en: "Drawing my family" }, duration: 20 }
        ]},
        { day: 2, lessons: [
          { subject: "reading", title: { az: "Nağıl: Ana sevgisi", ru: "Сказка: Любовь мамы", en: "Story: Mother's love" }, duration: 25 },
          { subject: "logic", title: { az: "Rəng tanıma", ru: "Цвета", en: "Colors" }, duration: 20 },
          { subject: "music", title: { az: "Ana haqqında mahnı", ru: "Песня о маме", en: "Song about mom" }, duration: 15 }
        ]},
        { day: 3, lessons: [
          { subject: "language", title: { az: "K, Q, L hərfləri", ru: "Буквы", en: "Letters" }, duration: 25 },
          { subject: "math", title: { az: "Çıxma 1-5", ru: "Вычитание 1-5", en: "Subtraction 1-5" }, duration: 20 },
          { subject: "nature", title: { az: "Heyvanlar - ev heyvanları", ru: "Домашние животные", en: "Domestic animals" }, duration: 20 }
        ]},
        { day: 4, lessons: [
          { subject: "creativity", title: { az: "Ailə foto çərçivəsi - kağız", ru: "Фоторамка", en: "Photo frame" }, duration: 30 },
          { subject: "logic", title: { az: "Məntiqi ardıcıllıq", ru: "Логические последовательности", en: "Logical sequences" }, duration: 20 }
        ]},
        { day: 5, lessons: [
          { subject: "language", title: { az: "Həftənin sözləri - ailə üzvləri", ru: "Члены семьи", en: "Family members" }, duration: 25 },
          { subject: "math", title: { az: "Həftə sonu nəticə", ru: "Итог недели", en: "Week review" }, duration: 20 },
          { subject: "physical", title: { az: "Ailə oyunları", ru: "Семейные игры", en: "Family games" }, duration: 20 }
        ]}
      ]
    },
    {
      week: 3,
      theme: { az: "Təbiət və Heyvanlar", ru: "Природа и Животные", en: "Nature and Animals" },
      days: [
        { day: 1, lessons: [
          { subject: "nature", title: { az: "Meşə heyvanları", ru: "Лесные животные", en: "Forest animals" }, duration: 25 },
          { subject: "language", title: { az: "M, N, O hərfləri", ru: "Буквы М, Н, О", en: "Letters M, N, O" }, duration: 20 },
          { subject: "drawing", title: { az: "Meşə mənzərəsi", ru: "Лесной пейзаж", en: "Forest scene" }, duration: 20 }
        ]},
        { day: 2, lessons: [
          { subject: "math", title: { az: "Toplama 6-10", ru: "Сложение 6-10", en: "Addition 6-10" }, duration: 25 },
          { subject: "reading", title: { az: "Nağıl: Dələ", ru: "Сказка: Белка", en: "Story: Squirrel" }, duration: 20 },
          { subject: "music", title: { az: "Heyvan səsləri oyunu", ru: "Звуки животных", en: "Animal sounds game" }, duration: 15 }
        ]},
        { day: 3, lessons: [
          { subject: "language", title: { az: "P, R, S hərfləri", ru: "Буквы П, Р, С", en: "Letters P, R, S" }, duration: 25 },
          { subject: "nature", title: { az: "Bitkilər - ağaclar, çiçəklər", ru: "Растения - деревья, цветы", en: "Plants - trees, flowers" }, duration: 20 },
          { subject: "creativity", title: { az: "Kağızdan heyvan", ru: "Животное из бумаги", en: "Paper animal" }, duration: 20 }
        ]},
        { day: 4, lessons: [
          { subject: "logic", title: { az: "Kimin izi? - oyun", ru: "Чьи следы?", en: "Whose tracks?" }, duration: 25 },
          { subject: "math", title: { az: "Çıxma 6-10", ru: "Вычитание 6-10", en: "Subtraction 6-10" }, duration: 20 },
          { subject: "physical", title: { az: "Heyvanları təqlid et", ru: "Подражание животным", en: "Imitate animals" }, duration: 15 }
        ]},
        { day: 5, lessons: [
          { subject: "reading", title: { az: "Nağıl: Üç donuz balası", ru: "Три поросенка", en: "Three little pigs" }, duration: 25 },
          { subject: "drawing", title: { az: "Sevimli heyvanım", ru: "Мой любимый зверь", en: "My favorite animal" }, duration: 25 }
        ]}
      ]
    },
    {
      week: 4,
      theme: { az: "Rənglər və Fiqurlar", ru: "Цвета и Фигуры", en: "Colors and Shapes" },
      days: [
        { day: 1, lessons: [
          { subject: "logic", title: { az: "Həndəsi fiqurlar", ru: "Геометрические фигуры", en: "Geometric shapes" }, duration: 25 },
          { subject: "language", title: { az: "Ş, T, U hərfləri", ru: "Буквы", en: "Letters" }, duration: 20 },
          { subject: "drawing", title: { az: "Fiqurlardan şəkil", ru: "Рисунок из фигур", en: "Drawing from shapes" }, duration: 20 }
        ]},
        { day: 2, lessons: [
          { subject: "math", title: { az: "Saymaq - 1-20", ru: "Счет 1-20", en: "Counting 1-20" }, duration: 25 },
          { subject: "nature", title: { az: "Göy, torpaq, su", ru: "Небо, земля, вода", en: "Sky, earth, water" }, duration: 20 },
          { subject: "creativity", title: { az: "Rəngli kağız kollaj", ru: "Цветной коллаж", en: "Colorful collage" }, duration: 20 }
        ]},
        { day: 3, lessons: [
          { subject: "language", title: { az: "V, Y, Z hərfləri", ru: "Буквы", en: "Letters" }, duration: 25 },
          { subject: "logic", title: { az: "Çeşidləmə - rəng, forma", ru: "Сортировка", en: "Sorting" }, duration: 20 },
          { subject: "music", title: { az: "Rənglər mahnısı", ru: "Песня о цветах", en: "Colors song" }, duration: 15 }
        ]},
        { day: 4, lessons: [
          { subject: "math", title: { az: "Artıq / Az / Bərabər", ru: "Больше / Меньше / Равно", en: "More / Less / Equal" }, duration: 25 },
          { subject: "reading", title: { az: "Nağıl: Göy qurşağı", ru: "Радуга", en: "Rainbow" }, duration: 20 },
          { subject: "physical", title: { az: "Rəng oyunları", ru: "Игры с цветами", en: "Color games" }, duration: 15 }
        ]},
        { day: 5, lessons: [
          { subject: "logic", title: { az: "Birinci ay nəticəsi", ru: "Итог первого месяца", en: "First month review" }, duration: 30 },
          { subject: "creativity", title: { az: "Ay sonu sərgi", ru: "Выставка работ", en: "Month-end exhibition" }, duration: 25 }
        ]}
      ]
    },
    {
      week: 5,
      theme: { az: "Azərbaycan - Vətənimiz", ru: "Азербайджан - наша Родина", en: "Azerbaijan - Our Homeland" },
      days: [
        { day: 1, lessons: [
          { subject: "language", title: { az: "Azərbaycan sözləri", ru: "Слова об Азербайджане", en: "Words about Azerbaijan" }, duration: 25 },
          { subject: "nature", title: { az: "Azərbaycanın təbiəti", ru: "Природа Азербайджана", en: "Azerbaijan's nature" }, duration: 20 },
          { subject: "drawing", title: { az: "Bayrağımız", ru: "Наш флаг", en: "Our flag" }, duration: 20 }
        ]},
        { day: 2, lessons: [
          { subject: "music", title: { az: "Azərbaycan mahnıları", ru: "Азербайджанские песни", en: "Azerbaijani songs" }, duration: 25 },
          { subject: "math", title: { az: "Rəqəmləri yaz 1-20", ru: "Пишем цифры 1-20", en: "Write numbers 1-20" }, duration: 20 },
          { subject: "reading", title: { az: "Bakı haqqında", ru: "О Баку", en: "About Baku" }, duration: 15 }
        ]},
        { day: 3, lessons: [
          { subject: "language", title: { az: "Hərfləri yazaq - böyük hərflər", ru: "Пишем буквы", en: "Writing letters" }, duration: 25 },
          { subject: "logic", title: { az: "Xəritə ilə tanışlıq", ru: "Знакомство с картой", en: "Map introduction" }, duration: 20 },
          { subject: "creativity", title: { az: "Xalça naxışları", ru: "Ковровые узоры", en: "Carpet patterns" }, duration: 20 }
        ]},
        { day: 4, lessons: [
          { subject: "nature", title: { az: "Azərbaycan meyvələri", ru: "Азербайджанские фрукты", en: "Azerbaijani fruits" }, duration: 25 },
          { subject: "math", title: { az: "Problemlər həll et", ru: "Решаем задачи", en: "Solve problems" }, duration: 20 },
          { subject: "physical", title: { az: "Milli oyunlar", ru: "Национальные игры", en: "National games" }, duration: 20 }
        ]},
        { day: 5, lessons: [
          { subject: "language", title: { az: "Şeir: Vətən sevgisi", ru: "Стихи о Родине", en: "Poem about homeland" }, duration: 25 },
          { subject: "drawing", title: { az: "Bakı qalası", ru: "Бакинская крепость", en: "Baku fortress" }, duration: 25 }
        ]}
      ]
    },
    {
      week: 6,
      theme: { az: "Peşələr", ru: "Профессии", en: "Professions" },
      days: [
        { day: 1, lessons: [
          { subject: "language", title: { az: "Peşə sözləri", ru: "Слова о профессиях", en: "Profession words" }, duration: 25 },
          { subject: "drawing", title: { az: "Həkim, müəllim, aşpaz", ru: "Врач, учитель, повар", en: "Doctor, teacher, chef" }, duration: 20 },
          { subject: "logic", title: { az: "Kim nə istifadə edir?", ru: "Кто что использует?", en: "Who uses what?" }, duration: 20 }
        ]},
        { day: 2, lessons: [
          { subject: "math", title: { az: "Sadə məsələlər", ru: "Простые задачи", en: "Simple word problems" }, duration: 25 },
          { subject: "reading", title: { az: "Nağıl: Cəfər müəllim", ru: "Сказка: Учитель Джафар", en: "Story: Teacher Jafar" }, duration: 20 },
          { subject: "music", title: { az: "Mahnı: Böyüyəndə kim olacam", ru: "Кем я стану", en: "What I'll be when I grow up" }, duration: 15 }
        ]},
        { day: 3, lessons: [
          { subject: "language", title: { az: "Cümlə qurma - peşələr", ru: "Составляем предложения", en: "Building sentences" }, duration: 25 },
          { subject: "creativity", title: { az: "Forma geyimi hazırla", ru: "Делаем форму", en: "Make a uniform" }, duration: 25 },
          { subject: "physical", title: { az: "Peşə oyunları", ru: "Ролевые игры", en: "Role play games" }, duration: 20 }
        ]},
        { day: 4, lessons: [
          { subject: "nature", title: { az: "Fermər peşəsi", ru: "Профессия фермера", en: "Farmer profession" }, duration: 25 },
          { subject: "math", title: { az: "Pul ilə tanışlıq", ru: "Знакомство с деньгами", en: "Money introduction" }, duration: 20 }
        ]},
        { day: 5, lessons: [
          { subject: "language", title: { az: "Həftə sonu təkrar", ru: "Повторение", en: "Week review" }, duration: 25 },
          { subject: "drawing", title: { az: "Gələcəkdə kim olacam?", ru: "Кем я стану?", en: "Who will I be?" }, duration: 25 }
        ]}
      ]
    },
    {
      week: 7,
      theme: { az: "Riyaziyyat Dünyası", ru: "Мир Математики", en: "World of Mathematics" },
      days: [
        { day: 1, lessons: [
          { subject: "math", title: { az: "Onluqlar - 10, 20, 30", ru: "Десятки", en: "Tens" }, duration: 25 },
          { subject: "language", title: { az: "Hekayə oxumaq", ru: "Читаем рассказ", en: "Reading a story" }, duration: 20 },
          { subject: "logic", title: { az: "Sxem və cədvəllər", ru: "Схемы и таблицы", en: "Schemes and tables" }, duration: 20 }
        ]},
        { day: 2, lessons: [
          { subject: "math", title: { az: "Ölçmə - uzun/qısa", ru: "Измерение - длинный/короткий", en: "Measurement - long/short" }, duration: 25 },
          { subject: "nature", title: { az: "Vaxt - saat", ru: "Время - часы", en: "Time - clock" }, duration: 20 },
          { subject: "drawing", title: { az: "Saat çək", ru: "Рисуем часы", en: "Draw a clock" }, duration: 15 }
        ]},
        { day: 3, lessons: [
          { subject: "math", title: { az: "Toplama-çıxma oyunu", ru: "Игра на сложение-вычитание", en: "Addition-subtraction game" }, duration: 30 },
          { subject: "logic", title: { az: "Zəka sualları", ru: "Загадки на логику", en: "Logic riddles" }, duration: 20 },
          { subject: "creativity", title: { az: "Rəqəmli kollaj", ru: "Числовой коллаж", en: "Number collage" }, duration: 15 }
        ]},
        { day: 4, lessons: [
          { subject: "math", title: { az: "Həndəsə - sahə anlayışı", ru: "Площадь", en: "Area concept" }, duration: 25 },
          { subject: "physical", title: { az: "Say oyunları", ru: "Считалки", en: "Counting games" }, duration: 20 },
          { subject: "music", title: { az: "Ritmik saymaq", ru: "Ритмический счет", en: "Rhythmic counting" }, duration: 15 }
        ]},
        { day: 5, lessons: [
          { subject: "math", title: { az: "Həftə sonu riyaziyyat yarışı", ru: "Математическое соревнование", en: "Math competition" }, duration: 30 },
          { subject: "drawing", title: { az: "Rəqəm rəsmi", ru: "Числовой рисунок", en: "Number drawing" }, duration: 25 }
        ]}
      ]
    },
    {
      week: 8,
      theme: { az: "Məktəbə Hazırlıq - Yekun", ru: "Готовы к школе - Итог", en: "Ready for School - Final" },
      days: [
        { day: 1, lessons: [
          { subject: "language", title: { az: "Bütün hərflər - təkrar", ru: "Все буквы - повторение", en: "All letters - review" }, duration: 30 },
          { subject: "math", title: { az: "1-20 arası bütün əməliyyatlar", ru: "Все операции 1-20", en: "All operations 1-20" }, duration: 25 }
        ]},
        { day: 2, lessons: [
          { subject: "reading", title: { az: "Heca ilə oxumaq", ru: "Чтение по слогам", en: "Reading by syllables" }, duration: 30 },
          { subject: "logic", title: { az: "Məntiqi düşünmə yekun", ru: "Итог логического мышления", en: "Logic thinking final" }, duration: 25 }
        ]},
        { day: 3, lessons: [
          { subject: "creativity", title: { az: "Portfolionu hazırla", ru: "Готовим портфолио", en: "Prepare your portfolio" }, duration: 30 },
          { subject: "drawing", title: { az: "Məktəbimi xəyal edirəm", ru: "Мечтаю о школе", en: "I dream of school" }, duration: 25 }
        ]},
        { day: 4, lessons: [
          { subject: "language", title: { az: "Qısa hekayə yaz", ru: "Пишем мини-рассказ", en: "Write a short story" }, duration: 25 },
          { subject: "math", title: { az: "Final test - riyaziyyat", ru: "Финальный тест", en: "Final math test" }, duration: 25 },
          { subject: "nature", title: { az: "Dünya haqqında bildiklərim", ru: "Что я знаю о мире", en: "What I know about the world" }, duration: 15 }
        ]},
        { day: 5, lessons: [
          { subject: "creativity", title: { az: "Məzuniyyət - bayram günü! 🎉", ru: "Выпускной праздник! 🎉", en: "Graduation day! 🎉" }, duration: 60 }
        ]}
      ]
    }
  ]
};

router.get('/', (req, res) => res.json(curriculum));
router.get('/week/:week', (req, res) => {
  const week = curriculum.weeks.find(w => w.week === parseInt(req.params.week));
  if (!week) return res.status(404).json({ message: 'Həftə tapılmadı' });
  res.json(week);
});

module.exports = router;
