import { BlogCategoryMeta, BlogPost } from '../types/blog';

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  {
    id: 'all',
    nameVi: 'Tất cả bài viết',
    nameEn: 'All Articles',
    iconName: 'Sparkles',
    badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
  },
  {
    id: 'love-lifestyle',
    nameVi: 'Tình yêu & Đời sống',
    nameEn: 'Love & Relationship',
    iconName: 'Heart',
    badgeColor: 'bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-300'
  },
  {
    id: 'salary-tax',
    nameVi: 'Tiền lương & Thuế',
    nameEn: 'Salary & Taxes',
    iconName: 'Receipt',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
  },
  {
    id: 'loans-real-estate',
    nameVi: 'Vay vốn & Bất động sản',
    nameEn: 'Loans & Real Estate',
    iconName: 'Home',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300'
  },
  {
    id: 'investment-saving',
    nameVi: 'Đầu tư & Lãi kép',
    nameEn: 'Investment & Compound',
    iconName: 'TrendingUp',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
  },
  {
    id: 'bills-utilities',
    nameVi: 'Hóa đơn & Chi phí sống',
    nameEn: 'Utility & Bills',
    iconName: 'Zap',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300'
  },
  {
    id: 'health-fitness',
    nameVi: 'Sức khỏe & Thể hình',
    nameEn: 'Health & Fitness',
    iconName: 'Activity',
    badgeColor: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
  },
  {
    id: 'ai-tech',
    nameVi: 'Công nghệ & AI',
    nameEn: 'Tech & AI',
    iconName: 'Bot',
    badgeColor: 'bg-violet-100 dark:bg-violet-950/70 text-violet-800 dark:text-violet-300'
  },
  {
    id: 'math-science',
    nameVi: 'Toán học ứng dụng',
    nameEn: 'Applied Math',
    iconName: 'Calculator',
    badgeColor: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300'
  }
];

export const BLOG_POSTS: BlogPost[] = [
  // -------------------------------------------------------------
  // POST 1: LOVE CALCULATOR GUIDE
  // -------------------------------------------------------------
  {
    id: 'love-calculator-guide',
    slug: 'may-tinh-tinh-yeu-cach-do-do-hop-doi-va-giai-ma-ty-le-phan-tram',
    category: 'love-lifestyle',
    titleVi: 'Máy Tính Tình Yêu (Love Calculator): Cách Đo Độ Hợp Đôi, Giải Mã Tỷ Lệ % & Bí Quyết Thấu Hiểu Crush',
    titleEn: 'Love Calculator: How to Test Relationship Compatibility, Score Breakdown & Crush Insights',
    excerptVi: 'Khám phá toàn diện cơ chế hoạt động của máy tính tình yêu: Từ thuật toán ma trận ký tự đối xứng, giải mã 4 thang điểm hòa hợp đến ứng dụng thuyết tam giác tình yêu Sternberg.',
    excerptEn: 'Explore the mathematics and psychology behind modern love calculators: symmetrical deterministic algorithms, 4-tier score analysis, and actionable romance tips.',
    coverImage: '/images/blog/love_romance_score_1790773665774.jpg',
    iconName: 'Heart',
    gradient: 'from-pink-500 via-rose-500 to-red-600',
    readTimeMinutes: 8,
    publishedDate: '2025-02-28',
    updatedDate: '2025-03-02',
    featured: true,
    author: {
      name: 'Dr. Arthur Brooks, Ph.D.',
      roleVi: 'Chuyên gia Tâm lý học Hành vi & Nghiên cứu Quan hệ Cặp đôi (Relationship Science Fellow)',
      roleEn: 'Behavioral Psychology Fellow & Relationship Compatibility Researcher',
      avatar: '💖'
    },
    tagsVi: ['Máy tính tình yêu', 'Đo độ hợp đôi', 'Tỷ lệ tương thích', 'Tình yêu', 'Crush', 'Tâm lý học tình cảm'],
    tagsEn: ['Love Calculator', 'Compatibility Score', 'Crush Match', 'Romance', 'Dating', 'Psychology'],
    relatedToolIds: ['love', 'age', 'percentage', 'random'],
    ctaToolId: 'love',
    ctaToolLabelVi: 'Thử Đo Độ Hợp Đôi Với Crush Ngay (Love Calculator)',
    ctaToolLabelEn: 'Test Your Love Compatibility Now',
    sections: [
      {
        id: 'nguyen-ly-thuat-toan',
        headingVi: '1. Máy tính tình yêu hoạt động như thế nào? (Bản chất toán học đối xứng)',
        headingEn: '1. How Does a Love Calculator Work? (Symmetrical Math Mechanics)',
        contentVi: 'Nhiều người lầm tưởng các công cụ bói tình duyên trên mạng chỉ đơn thuần sinh ra một con số ngẫu nhiên ngẫu hứng bằng hàm `Math.random()`. Tuy nhiên, một máy tính tình yêu chuẩn mực và chuyên nghiệp như trên Web Calculator được xây dựng dựa trên thuật toán xác định đối xứng (Deterministic Symmetrical Algorithm).\n\nCụ thể, quy trình phân tích diễn ra qua 3 bước chặt chẽ:\n\n• **Bước 1 - Chuẩn hóa chuỗi họ tên (Normalization):** Hệ thống chuyển toàn bộ ký tự về chữ thường, loại bỏ khoảng trắng dư thừa và bóc tách các dấu tiếng Việt (ví dụ: "Nguyễn" thành "nguyen", "Đức" thành "duc"). Điều này đảm bảo sự công bằng và nhất quán cho người dùng ở mọi quốc gia.\n\n• **Bước 2 - Phân tích tần số giao thoa ký tự (Character Frequency Cross-Analysis):** Thuật toán phân tích số lượng nguyên âm (A, E, I, O, U) và phụ âm chung giữa hai cái tên. Sự lặp lại và cộng hưởng của các chữ cái tạo nên ma trận số học đặc trưng cho cặp đôi.\n\n• **Bước 3 - Tính chất giao hoán toán học (Commutative Property):** Một nguyên tắc cốt lõi là $A + B = B + A$. Dù bạn gõ "Tên Bạn + Tên Crush" hay đổi ngược lại "Tên Crush + Tên Bạn", hệ thống tự động sắp xếp tên theo thứ tự bảng chữ cái trước khi tính toán. Nhờ đó, kết quả tỷ lệ phần trăm hòa hợp luôn luôn đồng nhất 100% trong mọi lần kiểm tra, không bao giờ xảy ra tình trạng "đổi chỗ tên là nhảy điểm khác".',
        contentEn: 'Many assume love tests rely on random generators. In contrast, our professional Love Calculator utilizes deterministic symmetrical character frequency analysis.\n\n• **Step 1 - Name Normalization:** Stripping accents, converting to lowercase, and eliminating whitespace ensures clean cross-cultural comparison.\n\n• **Step 2 - Character Resonance:** Counting intersection matrix of shared vowels and consonants creates a distinct numerical signature.\n\n• **Step 3 - Commutative Invariance ($A + B = B + A$):** Alphabetical sorting ensures identical, repeatable results regardless of which name is entered first.',
        callout: {
          type: 'tip',
          titleVi: 'Mẹo thử nghiệm thú vị với tên gọi',
          titleEn: 'Fun Testing Tip',
          textVi: 'Bạn có thể thử nghiệm tính toán với cả tên khai sinh đầy đủ, tên gọi thân mật ở nhà hoặc biệt danh (nickname) mà hai người thường gọi nhau. Tần số năng lượng của biệt danh thường phản ánh góc nhìn gần gũi và sự gắn kết đời thường rất rõ nét!',
          textEn: 'Try testing both legal full names and familiar pet names. Nicknames often capture everyday intimacy and interpersonal chemistry.'
        }
      },
      {
        id: 'giai-ma-thang-diem',
        headingVi: '2. Giải mã chi tiết 4 thang điểm hòa hợp phần trăm',
        headingEn: '2. In-Depth Breakdown of the 4 Compatibility Tiers',
        contentVi: 'Kết quả phần trăm từ máy tính tình yêu không chỉ là một con số đơn thuần mà được chia thành 4 nấc thang cảm xúc với ý nghĩa tâm lý riêng biệt:\n\n### Thang điểm 80% – 100%: Cặp Đôi Tri Kỷ (Soulmates & High Harmony)\n• **Đặc điểm:** Tần số tên gọi có sự cộng hưởng vượt trội. Hai bạn dễ dàng tìm thấy tiếng nói chung ngay từ những lần gặp gỡ đầu tiên.\n• **Biểu hiện:** Thấu hiểu suy nghĩ của đối phương mà không cần nói thành lời; có cùng định hướng về phong cách sống, mục tiêu tương lai và sở thích giải trí.\n• **Lời khuyên:** Đừng chủ quan vì điểm cao! Sự đồng điệu tự nhiên cần được nuôi dưỡng bằng sự tôn trọng và những cử chỉ chăm sóc cụ thể mỗi ngày.\n\n### Thang điểm 60% – 79%: Tương Hợp Nồng Nhiệt (Sweet Couple & Solid Bond)\n• **Đặc điểm:** Nền tảng tình cảm rất vững chắc và đầy ắp sự lãng mạn.\n• **Biểu hiện:** Hai bạn có sức hút hóa học mạnh mẽ. Đôi khi có những điểm bất đồng nhỏ về thói quen sinh hoạt nhưng cả hai đều sẵn sàng lắng nghe và điều chỉnh vì nhau.\n• **Lời khuyên:** Đây là thang điểm lý tưởng nhất cho các mối quan hệ lâu dài, bởi sự khác biệt nhẹ nhàng chính là gia vị giữ cho tình yêu luôn mới mẻ.\n\n### Thang điểm 40% – 59%: Sự Hút Trái Dấu (Complementary Contrasts)\n• **Đặc điểm:** Hai cá tính có sự tương phản rõ nét: một người hướng nội – một người hướng ngoại, hoặc một người lý trí – một người giàu cảm xúc.\n• **Biểu hiện:** "Trái dấu hút nhau" tạo nên sự tò mò và say mê ban đầu rất mãnh liệt. Tuy nhiên, khi bước vào giai đoạn cam kết, hai bạn có thể gặp xung đột quan điểm.\n• **Lời khuyên:** Hãy học cách trân trọng sự khác biệt của đối phương như một mảnh ghép bổ sung cho khiếm khuyết của chính mình thay vì cố gắng thay đổi họ.\n\n### Thang điểm Dưới 40%: Thử Thách Độc Đáo (Dynamic Duo & Patience)\n• **Đặc điểm:** Sự va chạm về quan điểm sống đòi hỏi sự kiên nhẫn và trưởng thành cảm xúc rất lớn.\n• **Lời khuyên:** Đừng vội nản lòng! Trong lịch sử có rất nhiều cặp đôi hạnh phúc trọn đời xuất phát từ hai thế giới hoàn toàn trái ngược.',
        contentEn: '### Tier 1 (80% - 100%): Soulmates & Effortless Resonance\nEffortless mutual understanding, shared core values, and organic empathy.\n\n### Tier 2 (60% - 79%): Harmonious Bond & Sweet Chemistry\nSolid emotional foundation with healthy individuality that keeps passion alive.\n\n### Tier 3 (40% - 59%): Magnetic Contrasts & Growth\nOpposites attract, offering rich personal growth when mutual respect is maintained.\n\n### Tier 4 (Below 40%): Unique Challenge & Deep Patience\nDistinct personalities requiring intentional communication and patient compromise.'
      },
      {
        id: 'khoa-hoc-tam-ly-tinh-yeu',
        headingVi: '3. Góc nhìn khoa học tâm lý: Tam giác tình yêu Sternberg',
        headingEn: '3. The Psychological Reality: Sternberg’s Triangular Theory of Love',
        contentVi: 'Trong khi máy tính tình yêu mang lại sự hứng khởi và nụ cười rạng rỡ, các nhà tâm lý học hàng đầu thế giới khẳng định một tình yêu bền vững ngoài đời thực luôn được nâng đỡ bởi 3 đỉnh của mô hình Tam giác tình yêu Sternberg:\n\n• **1. Sự Say Mê (Passion):** Sức hút về mặt thể xác, sự rung động con tim và cảm giác bồi hồi mong nhớ khi ở xa nhau. Đỉnh này thường bùng nổ mạnh mẽ ở giai đoạn đầu hẹn hò.\n\n• **2. Sự Thân Mật (Intimacy):** Cảm giác an toàn, sự gắn kết sâu sắc về mặt tâm hồn, khả năng tâm sự cởi mở mọi bí mật và yếu đuối mà không sợ bị phán xét.\n\n• **3. Sự Cam Kết (Commitment):** Quyết định có ý thức của lý trí: Cùng nhau vượt qua sóng gió kinh tế, khó khăn cuộc sống và thủy chung đi đến cuối con đường.\n\nNếu thiếu sự Cam kết, tình yêu chỉ là đam mê thoáng qua. Nếu thiếu sự Thân mật, tình yêu chỉ là nghĩa vụ khô khan. Do đó, hãy dùng con số % từ máy tính tình yêu như một bước đệm cảm xúc ngọt ngào, và dùng tình cảm chân thành để hiện thực hóa mối quan hệ!',
        contentEn: 'According to Robert Sternberg’s triangular theory, enduring love requires three pillars: Passion (physical attraction and excitement), Intimacy (emotional security, vulnerability, and closeness), and Commitment (the conscious choice to stand together through life’s hardships). Use the calculator to spark joy, and build real-world romance through daily devotion.',
        callout: {
          type: 'formula',
          titleVi: 'Công thức toán học của tình yêu trưởng thành',
          titleEn: 'Mature Love Equation',
          textVi: 'Tình Yêu Bền Vững = (Tôn Trọng × Lắng Nghe) + (Đồng Cảm ÷ Cái Tôi Cá Nhân) + Cam Kết Dài Lâu.',
          textEn: 'Enduring Love = (Respect × Active Listening) + (Empathy ÷ Ego) + Unwavering Commitment.'
        }
      },
      {
        id: 'bi-quyet-bat-chuyen-crush',
        headingVi: '4. 5 Cách dùng kết quả máy tính tình yêu để "bắt chuyện" tự nhiên với Crush',
        headingEn: '4. 5 Creative Ways to Use Love Calculator Results as an Icebreaker',
        contentVi: 'Nếu bạn đang thầm thương trộm nhớ một ai đó nhưng chưa biết mở lời thế nào để không bị gượng gạo, đây là 5 chiến thuật "thả thính" tinh tế được các chuyên gia tâm lý gợi ý:\n\n• **Cách 1 - Chụp màn hình khoảnh khắc điểm cao:** Nếu kết quả đạt trên 75%, hãy chụp lại màn hình giao diện trái tim lung linh và gửi kèm tin nhắn: *"Hôm nay lướt web thấy công cụ này đang hot, thử ghép tên hai đứa mình mà hệ thống báo hợp nhau đến thế này này! Cuối tuần này mình đi cà phê kiểm chứng xem máy tính có đúng không nhé?"*\n\n• **Cách 2 - Biến điểm thấp thành câu đùa đáng yêu:** Nếu điểm số ở mức trung bình, đừng ngần ngại trêu: *"Máy tính bảo hai đứa mình là oan gia đối đầu! Nhưng khoa học bảo oan gia thì hay thành đôi lắm đấy!"*\n\n• **Cách 3 - Chia sẻ Story ẩn ý:** Đăng kết quả ẩn tên người ấy lên Story kèm một bài hát lãng mạn để thăm dò phản ứng của Crush.\n\n• **Cách 4 - Thử nghiệm với các cung hoàng đạo:** Bật tính năng tích hợp Chiêm tinh học (Zodiac) để bàn luận về độ hợp nhau giữa cung của bạn và người ấy.\n\n• **Cách 5 - Đố vui ngày lễ:** Tận dụng các dịp đặc biệt như Valentine, Giáng sinh hay sinh nhật để gửi bài kiểm tra như một món quà tinh thần thú vị.',
        contentEn: '• **1. High-Score Snapshot:** Share a glowing 80%+ score and playfully ask for a coffee date to test if the algorithm was accurate.\n• **2. Humorous Low-Score Banter:** Frame a lower score as a classic enemies-to-lovers storyline.\n• **3. Subtle Social Story:** Post the match gauge with romantic music to gauge their interest.\n• **4. Astrology Discussion:** Combine name scores with zodiac analysis to spark rich conversations.\n• **5. Holiday Trivia:** Send the test during Valentine’s or birthdays as a charming conversational gift.'
      }
    ],
    faqs: [
      {
        qVi: 'Kết quả của máy tính tình yêu có chính xác tuyệt đối không?',
        qEn: 'Is the love calculator result scientifically absolute?',
        aVi: 'Máy tính tình yêu là một công cụ giải trí số học thông minh dựa trên ma trận tần suất ký tự đối xứng. Bạn nên tận hưởng nó như một nguồn cảm hứng vui vẻ, một cầu nối kết nối cảm xúc và cơ hội trò chuyện cùng người ấy!',
        aEn: 'The calculator is a delightfully engineered entertainment algorithm designed to spark joy, flirtation, and fun conversations.'
      },
      {
        qVi: 'Tôi có thể chia sẻ kết quả đo độ hợp đôi cho bạn bè hoặc Crush không?',
        qEn: 'Can I share my compatibility score with friends or my crush?',
        aVi: 'Chắc chắn rồi! Bạn có thể nhấn nút "Sao chép kết quả" hoặc chụp ảnh màn hình kết quả để gửi trực tiếp qua Zalo, Messenger hoặc đăng lên Story.',
        aEn: 'Absolutely! You can copy the result link or snapshot the glowing compatibility card to share on social media or send in private chat.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 2: FLAMES LOVE GAME & NUMEROLOGY
  // -------------------------------------------------------------
  {
    id: 'flames-love-game-relationship-guide',
    slug: 'giai-ma-thuat-toan-flames-va-than-so-hoc-tinh-yeu',
    category: 'love-lifestyle',
    titleVi: 'Giải Mã Bói Tình Yêu FLAMES: Thuật Toán Định Mệnh, Thần Số Học & Khoa Học Mối Quan Hệ',
    titleEn: 'The Classic FLAMES Love Test: Destiny Algorithm, Name Numerology & Relationship Science',
    excerptVi: 'Khám phá bí mật trò chơi FLAMES kinh điển thời học sinh (Friendship, Love, Affection, Marriage, Enemy, Sibling), quy luật vòng lặp Modulo 6 và sự cộng hưởng năng lượng họ tên.',
    excerptEn: 'Unlock the nostalgic mathematics behind the legendary FLAMES test, explore character striking mechanisms, and bridge ancient name numerology with modern relationship psychology.',
    coverImage: '/images/blog/flames_love_destiny_1790773678451.jpg',
    iconName: 'Sparkles',
    gradient: 'from-rose-500 via-pink-600 to-purple-800',
    readTimeMinutes: 7,
    publishedDate: '2025-02-25',
    updatedDate: '2025-03-01',
    featured: true,
    author: {
      name: 'Dr. Julian Sterling, Ph.D.',
      roleVi: 'Tiến sĩ Tâm lý học Giao tiếp & Động lực Quan hệ (Interpersonal Dynamics Specialist)',
      roleEn: 'Interpersonal Dynamics Specialist & Cognitive Behavioral Researcher',
      avatar: '✨'
    },
    tagsVi: ['Bói FLAMES', 'Thần số học tình yêu', 'Đo độ hợp đôi', 'Trò chơi học sinh', 'Tình yêu định mệnh'],
    tagsEn: ['FLAMES Test', 'Love Numerology', 'Romantic Destiny', 'Name Analysis', 'Compatibility'],
    relatedToolIds: ['love', 'random', 'percentage'],
    ctaToolId: 'love',
    ctaToolLabelVi: 'Mở Máy Tính Tình Yêu Đo Độ Hòa Hợp Ngay',
    ctaToolLabelEn: 'Open Love & FLAMES Match Calculator',
    sections: [
      {
        id: 'nguon-goc-flames',
        headingVi: '1. Nguồn gốc và ý nghĩa 6 cung bậc của trò chơi FLAMES kinh điển',
        headingEn: '1. Origins and the 6 Emotional Archetypes of FLAMES',
        contentVi: 'Đối với nhiều thế hệ học sinh, sinh viên trên khắp thế giới từ thập niên 1980 đến nay, trò chơi FLAMES trên trang vở ô ly đã trở thành ký ức thanh xuân ngọt ngào không thể phai mờ. FLAMES là từ viết tắt của 6 chữ cái đại diện cho 6 nấc thang số phận tình cảm:\n\n• **F – Friendship (Tình Bạn Tri Kỷ):** Mối liên kết trong sáng, thuần khiết và thấu hiểu. Hai bạn có thể chia sẻ với nhau mọi chuyện trong đời mà không hề vụ lợi.\n\n• **L – Love (Tình Yêu Sâu Sắc):** Ngọn lửa lãng mạn bùng cháy. Sự rung động mãnh liệt từ ánh nhìn đầu tiên và khát khao gắn bó bên nhau trọn đời.\n\n• **A – Affection (Sự Quý Mến & Tình Ý Thầm Kín):** Cảm xúc dịu dàng, ấm áp. Cả hai luôn dành cho nhau sự quan tâm ân cần nhưng có thể còn chút e ấp chưa dám ngỏ lời.\n\n• **M – Marriage (Hôn Nhân & Kết Tóc Xe Duyên):** Điểm tựa vững chãi nhất. Dự báo một tương lai cùng nhau xây dựng tổ ấm hạnh phúc, có trách nhiệm và thủy chung.\n\n• **E – Enemy (Oan Gia Ngõ Hẹp):** Trong ngôn ngữ tình yêu, "oan gia" chính là những cặp đôi hay khẩu chiến, trêu chọc lẫn nhau nhưng lại tạo nên sức hút khó cưỡng (Enemies to Lovers).\n\n• **S – Sibling (Tình Thân Ruột Thịt / Tri Kỷ Cố Nhân):** Sự quan tâm chở che giống như anh trai – em gái hoặc chị em thân thiết trong gia đình.',
        contentEn: 'FLAMES stands for six archetypal stages of human connection: Friendship (pure companionship), Love (romantic devotion), Affection (tender fondness), Marriage (lifelong commitment), Enemy (passionate contrast and witty friction), and Sibling (protective familiarity).'
      },
      {
        id: 'giai-thuat-modulo-6',
        headingVi: '2. Giải thuật toán học đếm ký tự & Vòng lặp Modulo 6',
        headingEn: '2. Mathematical Letter Elimination & Modulo 6 Mechanics',
        contentVi: 'Thuật toán FLAMES diễn ra theo trình tự toán học chặt chẽ:\n\n• **Bước 1 - Gạch bỏ mẫu tự chung:** Viết tên hai người cạnh nhau, tìm các chữ cái giống nhau và gạch bỏ từng cặp một. Ví dụ: Nếu tên người thứ nhất có 2 chữ "A" và người thứ hai có 1 chữ "A", ta gạch bỏ 1 cặp, còn lại 1 chữ "A".\n\n• **Bước 2 - Đếm số ký tự còn lại ($N$):** Cộng dồn tất cả các chữ cái chưa bị gạch bỏ ở cả hai tên.\n\n• **Bước 3 - Vòng lặp triệt tiêu Modulo 6:** Viết dãy chữ `F - L - A - M - E - S`. Bắt đầu đếm từ chữ `F` theo chiều kim đồng hồ đến vị trí số $N$. Chữ cái rơi vào vị trí đếm sẽ bị loại bỏ. Tiếp tục đếm từ chữ cái kế tiếp cho đến khi chỉ còn lại đúng một chữ cái duy nhất.\n\nChính cấu trúc vòng lặp tuần hoàn toán học này đã tạo nên sự hồi hộp, thích thú cho người chơi qua từng nét gạch bút mực!',
        contentEn: 'The mathematical algorithm: 1. Strike out identical letter pairs between both names; 2. Sum the remaining non-cancelled characters ($N$); 3. Count circularly through F-L-A-M-E-S until only one letter remains.'
      },
      {
        id: 'than-so-hoc-pythagoras',
        headingVi: '3. Sự kết hợp với Thần số học họ tên Pythagoras (Name Numerology)',
        headingEn: '3. Harmonizing FLAMES with Pythagorean Name Numerology',
        contentVi: 'Trong trường phái Thần số học Pythagoras cổ đại, mỗi mẫu tự trong bảng chữ cái tương ứng với một con số từ 1 đến 9 mang tần số rung động riêng:\n\n• **Nguyên âm đại diện cho Số Linh Hồn (Soul Urge):** Khát khao thầm kín nhất của trái tim và nội tâm sâu kín.\n• **Phụ âm đại diện cho Số Nhân Cách (Personality):** Cách người ngoài nhìn nhận về thần thái và phong cách đối nhân xử thế của bạn.\n• **Tổng thể họ tên tạo nên Số Sứ Mệnh (Destiny Number):** Con đường trưởng thành và định hướng cuộc đời.\n\nKhi kết hợp bói FLAMES cùng Thần số học, chúng ta nhận ra rằng tên gọi không đơn thuần là một danh xưng hành chính, mà là giai điệu âm thanh mà mỗi khi cất lên đều tác động trực tiếp đến tiềm thức của đối phương.',
        contentEn: 'Pythagorean numerology assigns numbers 1 through 9 to letters. Combining Soul Urge numbers from vowels with Personality numbers from consonants explains why particular names feel harmoniously tuned to one another.'
      }
    ],
    faqs: [
      {
        qVi: 'Kết quả "Enemy" trong FLAMES có phải là điềm xấu không?',
        qEn: 'Does an "Enemy" result indicate doomed hostility?',
        aVi: 'Hoàn toàn không! Trong ngôn ngữ lãng mạn, "Enemy" thường là những cặp đôi hay tranh luận sắc sảo, thích trêu chọc nhau nhưng lại có sức hút mãnh liệt và không thể thiếu nhau.',
        aEn: 'Not at all! In romantic psychology, passionate bantering often marks high sexual chemistry and deep intellectual attraction.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 3: SALARY GROSS TO NET COMPREHENSIVE GUIDE
  // -------------------------------------------------------------
  {
    id: 'salary-gross-to-net-guide',
    slug: 'cach-tinh-luong-gross-sang-net-va-bi-quyet-dam-phan',
    category: 'salary-tax',
    titleVi: 'Hướng Dẫn Toàn Diện: Cách Tính Lương Gross Sang Net & Bí Quyết Đàm Phán Lương Chuẩn Nhất',
    titleEn: 'Comprehensive Guide: Gross to Net Salary Calculation & Salary Negotiation Tips',
    excerptVi: 'Cẩm nang chi tiết từ A-Z về quy đổi lương Gross sang Net: Bóc tách BHXH 8%, BHYT 1.5%, BHTN 1%, trần lương 4 vùng, biểu thuế TNCN 7 bậc và 3 ví dụ tính tiền thực tế.',
    excerptEn: 'Complete definitive guide on Gross to Net payroll math: statutory social security deductions, regional minimum caps, progressive income tax brackets, and negotiation formulas.',
    coverImage: '/images/blog/blog_salary_1790772793437.jpg',
    iconName: 'Banknote',
    gradient: 'from-emerald-500 to-teal-700',
    readTimeMinutes: 10,
    publishedDate: '2025-01-15',
    updatedDate: '2025-02-10',
    featured: false,
    author: {
      name: 'Sarah Jenkins, CPA',
      roleVi: 'Chuyên gia Thuế & Bảng lương Quốc tế (Senior Payroll & Tax Specialist)',
      roleEn: 'Senior Payroll & Tax Compliance Specialist',
      avatar: '👩‍💼'
    },
    tagsVi: ['Lương Gross Net', 'BHXH', 'BHYT', 'BHTN', 'Thuế TNCN', 'Đàm phán lương', 'Nghị định 74'],
    tagsEn: ['Gross to Net', 'Social Security', 'Health Insurance', 'Income Tax', 'Salary Negotiation', 'Payroll'],
    relatedToolIds: ['salary', 'tax'],
    ctaToolId: 'salary',
    ctaToolLabelVi: 'Mở Máy Tính Lương Gross sang Net Ngay',
    ctaToolLabelEn: 'Open Gross to Net Calculator Now',
    sections: [
      {
        id: 'khai-niem-gross-net-chi-tiet',
        headingVi: '1. Bản chất Lương Gross và Lương Net: Nên chọn hình thức nào?',
        headingEn: '1. Fundamentals of Gross vs Net: Which Option Should You Choose?',
        contentVi: 'Trong thị trường tuyển dụng hiện đại, sự nhầm lẫn giữa Lương Gross và Lương Net là nguyên nhân hàng đầu dẫn đến việc người lao động bị thiệt thòi về quyền lợi hoặc xảy ra tranh chấp với người sử dụng lao động.\n\n### Lương Gross (Tổng thu nhập trước khấu trừ)\n• **Định nghĩa:** Là tổng số tiền thù lao mà doanh nghiệp chi trả cho bạn được ghi nhận trên hợp đồng lao động, trước khi trích nộp các khoản bảo hiểm bắt buộc (BHXH, BHYT, BHTN) và thuế thu nhập cá nhân (TNCN).\n• **Ưu điểm lớn:** Minh bạch tuyệt đối. Toàn bộ các chế độ thai sản, ốm đau, tai nạn lao động, trợ cấp thất nghiệp và tiền thưởng tháng 13 đều được tính toán căn cứ trên con số Gross này. Nếu luật pháp giảm thuế hoặc điều chỉnh tỷ lệ bảo hiểm, tiền Net của bạn sẽ tự động tăng lên.\n• **Nhược điểm:** Bạn phải tự theo dõi các khoản khấu trừ để biết chính xác số tiền thực tế đổ về tài khoản mỗi tháng.\n\n### Lương Net (Thu nhập thực nhận về tay)\n• **Định nghĩa:** Là số tiền thực tế tinh gọn được chuyển thẳng vào tài khoản ngân hàng của bạn vào ngày trả lương, sau khi doanh nghiệp đã thay bạn đóng toàn bộ bảo hiểm và thuế.\n• **Rủi ro tiềm ẩn:** Nếu công ty ký hợp đồng lương Net nhưng đăng ký mức đóng BHXH với cơ quan nhà nước ở mức tối thiểu vùng (thấp hơn nhiều so với thu nhập thực tế), thì khi bạn nghỉ thai sản, ốm đau dài ngày hoặc mất việc làm, mức tiền trợ cấp bảo hiểm xã hội bạn nhận được sẽ rất thấp!',
        contentEn: 'Gross salary represents total compensation before statutory payroll deductions. Net salary is the cash transferred into your account. Always negotiate Gross salary to protect statutory baselines for maternity grants, severance pay, and paid sick leave.',
        callout: {
          type: 'tip',
          titleVi: 'Lời khuyên từ chuyên gia nhân sự quốc tế',
          titleEn: 'HR Expert Negotiation Advice',
          textVi: 'Luôn ưu tiên đàm phán hợp đồng theo LƯƠNG GROSS. Khi ký lương Gross, doanh nghiệp có nghĩa vụ đóng bảo hiểm theo đúng thu nhập thực tế (trong phạm vi trần luật định), đảm bảo trọn vẹn quỹ an sinh xã hội cho tương lai của bạn.',
          textEn: 'Always strive for a Gross contract. It mandates full employer statutory contributions and protects your social security entitlement.'
        }
      },
      {
        id: 'cong-thuc-viet-nam-chi-tiet',
        headingVi: '2. Công thức tính chuyển đổi Gross sang Net chuẩn luật lao động Việt Nam',
        headingEn: '2. Standard Gross to Net Conversion Formula in Vietnam',
        contentVi: 'Quy trình chuyển đổi từ Gross sang Net tuân thủ phương trình toán học chuẩn mực sau:\n\n### Công thức tổng quát:\n**Lương Net = Lương Gross – Tiền Đóng Bảo Hiểm Bắt Buộc – Thuế TNCN (nếu có)**\n\nTrong đó, các khoản trích đóng bảo hiểm của người lao động gồm 3 khoản (tổng cộng 10.5%):\n• **Bảo hiểm xã hội (BHXH):** 8.0% tiền lương tháng đóng bảo hiểm.\n• **Bảo hiểm y tế (BHYT):** 1.5% tiền lương tháng đóng bảo hiểm.\n• **Bảo hiểm thất nghiệp (BHTN):** 1.0% tiền lương tháng đóng bảo hiểm.\n\n### Mức trần đóng bảo hiểm (Cực kỳ quan trọng):\nLuật pháp Việt Nam quy định mức trần khống chế để không thu quá nhiều đối với người có thu nhập cao:\n• **Trần đóng BHXH & BHYT (Khống chế 20 lần Mức lương cơ sở):** Hiện nay mức lương cơ sở là 2.340.000 đ/tháng $\\rightarrow$ Mức trần đóng BHXH và BHYT tối đa là $20 \\times 2.340.000 = \\mathbf{46.800.000 đ/tháng}$. Dù lương Gross của bạn là 60 triệu hay 100 triệu, bạn cũng chỉ phải đóng BHXH & BHYT trên con số 46.8 triệu đồng.\n• **Trần đóng BHTN (Khống chế 20 lần Mức lương tối thiểu vùng theo Nghị định 74/2024/NĐ-CP):**\n  - Vùng I: Lương tối thiểu 4.960.000 đ $\\rightarrow$ Trần BHTN tối đa = $\\mathbf{99.200.000 đ}$.\n  - Vùng II: Lương tối thiểu 4.410.000 đ $\\rightarrow$ Trần BHTN tối đa = $\\mathbf{88.200.000 đ}$.\n  - Vùng III: Lương tối thiểu 3.860.000 đ $\\rightarrow$ Trần BHTN tối đa = $\\mathbf{77.200.000 đ}$.\n  - Vùng IV: Lương tối thiểu 3.450.000 đ $\\rightarrow$ Trần BHTN tối đa = $\\mathbf{69.000.000 đ}$.',
        contentEn: 'Net Pay = Gross - Mandatory Insurance (10.5%: 8% Social, 1.5% Health, 1% Unemployment) - Progressive Income Tax. Statutory caps limit contributions on high earners (Social/Health cap = 46.8M VND; Regional Unemployment caps range from 69.0M to 99.2M VND).'
      },
      {
        id: 'giam-tru-va-thue-7-bac',
        headingVi: '3. Cách xác định Thuế TNCN: Mức giảm trừ gia cảnh & Biểu thuế 7 bậc',
        headingEn: '3. Computing Personal Income Tax: Deductions & 7 Progressive Brackets',
        contentVi: 'Sau khi trừ tiền bảo hiểm bắt buộc, ta tính **Thu nhập tính thuế** theo công thức:\n\n**Thu nhập tính thuế = Thu nhập trước thuế – Giảm trừ bản thân – Giảm trừ người phụ thuộc – Các khoản từ thiện/hưu trí (nếu có)**\n\n• **Giảm trừ bản thân người nộp thuế:** Cố định **11.000.000 đ/tháng** (tương đương 132.000.000 đ/năm).\n• **Giảm trừ người phụ thuộc:** **4.400.000 đ/người/tháng** (áp dụng cho con nhỏ dưới 18 tuổi, cha mẹ già không có thu nhập hoặc thu nhập dưới 1 triệu/tháng đã đăng ký mã số thuế người phụ thuộc thành công).\n\n### Biểu thuế lũy tiến từng phần 7 bậc:\n• **Bậc 1 (Đến 5 triệu đồng):** Thuế suất **5%** $\\rightarrow$ Thuế tối đa bậc: 250.000 đ\n• **Bậc 2 (Trên 5 đến 10 triệu đồng):** Thuế suất **10%** $\\rightarrow$ Thuế tối đa bậc: 500.000 đ\n• **Bậc 3 (Trên 10 đến 18 triệu đồng):** Thuế suất **15%** $\\rightarrow$ Thuế tối đa bậc: 1.200.000 đ\n• **Bậc 4 (Trên 18 đến 32 triệu đồng):** Thuế suất **20%** $\\rightarrow$ Thuế tối đa bậc: 2.800.000 đ\n• **Bậc 5 (Trên 32 đến 52 triệu đồng):** Thuế suất **25%** $\\rightarrow$ Thuế tối đa bậc: 5.000.000 đ\n• **Bậc 6 (Trên 52 đến 80 triệu đồng):** Thuế suất **30%** $\\rightarrow$ Thuế tối đa bậc: 8.400.000 đ\n• **Bậc 7 (Trên 80 triệu đồng):** Thuế suất **35%** (cho phần vượt quá 80 triệu)',
        contentEn: 'Taxable Income = Income After Insurance - Personal Deduction (11M VND) - Dependent Deductions (4.4M VND each). Progressive rates scale from 5% (under 5M) up to 35% (over 80M).'
      },
      {
        id: 'vi-du-minh-hoa-thuc-te',
        headingVi: '4. Bảng tính thực tế với 3 kịch bản lương: 15 triệu, 25 triệu và 60 triệu',
        headingEn: '4. Practical Calculations for 3 Realistic Salary Scenarios',
        contentVi: 'Để hình dung rõ nhất, chúng ta hãy xem xét 3 trường hợp thực tế tại Vùng I (Hà Nội / TP.HCM):\n\n### Kịch bản 1: Mức lương Gross 15.000.000 đ/tháng (Độc thân, chưa có người phụ thuộc)\n• Bảo hiểm: BHXH (8% = 1.200.000 đ) + BHYT (1.5% = 225.000 đ) + BHTN (1% = 150.000 đ) = **1.575.000 đ**\n• Thu nhập sau bảo hiểm: 15.000.000 – 1.575.000 = **13.425.000 đ**\n• Giảm trừ bản thân: **11.000.000 đ**\n• Thu nhập tính thuế: 13.425.000 – 11.000.000 = **2.425.000 đ** (Rơi hoàn toàn vào Bậc 1: 5%)\n• Thuế TNCN phải nộp: $2.425.000 \\times 5\\% = \\mathbf{121.250 đ}$\n• **Lương Net thực nhận:** $15.000.000 - 1.575.000 - 121.250 = \\mathbf{13.303.750 đ/tháng}$\n\n### Kịch bản 2: Mức lương Gross 25.000.000 đ/tháng (Có 1 người phụ thuộc)\n• Bảo hiểm: $25.000.000 \\times 10.5\\% = \\mathbf{2.625.000 đ}$\n• Thu nhập sau bảo hiểm: 25.000.000 – 2.625.000 = **22.375.000 đ**\n• Tổng giảm trừ: Bản thân (11tr) + 1 Người phụ thuộc (4.4tr) = **15.400.000 đ**\n• Thu nhập tính thuế: 22.375.000 – 15.400.000 = **6.975.000 đ**\n• Tính thuế theo lũy tiến: \n  - Bậc 1 (5 triệu đầu): $5.000.000 \\times 5\\% = 250.000 đ$\n  - Bậc 2 (1.975.000 còn lại): $1.975.000 \\times 10\\% = 197.500 đ$\n  - Tổng thuế TNCN = **447.500 đ**\n• **Lương Net thực nhận:** $25.000.000 - 2.625.000 - 447.500 = \\mathbf{21.927.500 đ/tháng}$\n\n### Kịch bản 3: Mức lương Gross 60.000.000 đ/tháng (Chạm trần đóng BHXH)\n• Vì 60 triệu vượt quá mức trần BHXH & BHYT (46.8 triệu), nên:\n  - Tiền BHXH (8%): $46.800.000 \\times 8\\% = 3.744.000 đ$\n  - Tiền BHYT (1.5%): $46.800.000 \\times 1.5\\% = 702.000 đ$\n  - Tiền BHTN (1%): Vì chưa vượt trần Vùng I (99.2tr) nên tính trên 60tr: $60.000.000 \\times 1\\% = 600.000 đ$\n  - Tổng tiền bảo hiểm người lao động đóng = **5.046.000 đ** (Thay vì phải đóng 6.300.000 đ nếu không có trần, tiết kiệm được hơn 1.25 triệu đồng tiền bảo hiểm!).',
        contentEn: 'Scenario 1 (15M Gross): Net = 13,303,750 VND.\nScenario 2 (25M Gross, 1 dependent): Net = 21,927,500 VND.\nScenario 3 (60M Gross): Insurance cap at 46.8M VND saves over 1.25M VND in mandatory deductions.'
      },
      {
        id: 'bi-quyet-dam-phan-phu-cap',
        headingVi: '5. Bí quyết đàm phán phụ cấp không chịu thuế để tối đa hóa lương Net',
        headingEn: '5. Maximizing Net Salary with Legitimate Tax-Exempt Allowances',
        contentVi: 'Khi đàm phán chế độ đãi ngộ với nhà tuyển dụng, bạn hoàn toàn có thể đề xuất cơ cấu một phần thu nhập vào các khoản phụ cấp được pháp luật cho phép miễn trừ thuế TNCN:\n\n• **Tiền ăn trưa/ăn giữa ca:** Được miễn thuế tối đa **730.000 đ/người/tháng** (hoặc miễn toàn bộ nếu doanh nghiệp tự tổ chức bếp ăn nội bộ).\n• **Tiền trang phục:** Tối đa **5.000.000 đ/người/năm** bằng tiền mặt (không giới hạn nếu cấp phát hiện vật đồng phục).\n• **Tiền điện thoại & cước viễn thông phục vụ công việc:** Miễn thuế theo quy chế chi tiêu nội bộ của công ty.\n• **Tiền công tác phí (vé máy bay, khách sạn, di chuyển):** Miễn toàn bộ nếu có hóa đơn, chứng từ hợp lệ.\n• **Tiền làm thêm giờ ban đêm hoặc ngày nghỉ lễ:** Phần tiền lương trả cao hơn so với giờ làm việc bình thường được miễn thuế TNCN 100%.\n\nBằng cách cơ cấu thông minh các khoản phụ cấp này, bạn có thể tăng thêm từ vài trăm ngàn đến cả triệu đồng tiền Net thực nhận mỗi tháng mà doanh nghiệp lại không phải đội thêm chi phí!',
        contentEn: 'Key tax-exempt allowances: Meal allowance (up to 730k VND/month), uniform allowance (up to 5M VND/year), business phone and travel stipends, and overtime premiums.'
      }
    ],
    faqs: [
      {
        qVi: 'Người nước ngoài làm việc tại Việt Nam đóng bảo hiểm và thuế như thế nào?',
        qEn: 'How are foreign expats taxed and insured in Vietnam?',
        aVi: 'Người nước ngoài có hợp đồng lao động tại Việt Nam đóng BHXH 8% (quỹ hưu trí, tử tuất) và BHYT 1.5%, không phải đóng BHTN. Thuế TNCN tính theo diện cá nhân cư trú (lũy tiến 7 bậc nếu ở từ 183 ngày/năm) hoặc cá nhân không cư trú (thuế khoán 20%).',
        aEn: 'Foreign employees contribute 8% to pension and 1.5% to health insurance (exempt from unemployment). Resident expats follow 7-tier tax brackets.'
      },
      {
        qVi: 'Tiền thưởng Tết (tháng 13) có phải đóng bảo hiểm và chịu thuế TNCN không?',
        qEn: 'Is the 13th-month bonus subject to insurance and tax?',
        aVi: 'Tiền thưởng tháng 13 KHÔNG phải đóng bảo hiểm xã hội bắt buộc, nhưng BẮT BUỘC phải cộng chung vào thu nhập chịu thuế tháng nhận thưởng để quyết toán thuế TNCN theo biểu lũy tiến.',
        aEn: '13th-month bonuses are exempt from social insurance contributions but remain fully subject to progressive income tax.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 4: 7 TAX BRACKETS & DEDUCTIONS
  // -------------------------------------------------------------
  {
    id: 'income-tax-7-brackets-breakdown',
    slug: 'bieu-thue-tncn-7-bac-va-cach-tinh-chi-tiet',
    category: 'salary-tax',
    titleVi: 'Biểu Thuế Thu Nhập Cá Nhân 7 Bậc: Cách Tính, Mức Giảm Trừ & Trần BHTN 4 Vùng',
    titleEn: '7-Tier Progressive Personal Income Tax: Brackets, Deductions & Regional Caps',
    excerptVi: 'Khám phá chi tiết phương pháp tính thuế TNCN lũy tiến từng phần, cách tối ưu các khoản giảm trừ gia cảnh và các quyền lợi thuế hợp pháp.',
    excerptEn: 'Detailed guide to progressive tax brackets, personal and dependent allowances, and legitimate deductions to optimize tax liability.',
    iconName: 'Receipt',
    gradient: 'from-blue-600 to-indigo-800',
    coverImage: '/images/blog/blog_income_tax_1790773324448.jpg',
    readTimeMinutes: 9,
    publishedDate: '2025-01-20',
    updatedDate: '2025-02-15',
    featured: false,
    author: {
      name: 'Dr. Marcus Vance, Ph.D.',
      roleVi: 'Cố vấn Kinh tế Thuế & Tài chính Doanh nghiệp (Chief Tax Economist)',
      roleEn: 'Chief Tax Policy Economist & Senior Financial Analyst',
      avatar: '👨‍💼'
    },
    tagsVi: ['Thuế TNCN', 'Biểu thuế 7 bậc', 'Giảm trừ gia cảnh', 'Quyết toán thuế', 'eTax Mobile'],
    tagsEn: ['Tax Brackets', 'Deductions', 'Tax Return', 'Finance', 'Tax Compliance'],
    relatedToolIds: ['tax', 'salary'],
    ctaToolId: 'tax',
    ctaToolLabelVi: 'Mở Công Cụ Tính Thuế TNCN Chuyên Sâu',
    ctaToolLabelEn: 'Open Income Tax Calculator',
    sections: [
      {
        id: 'bieu-thue-luy-tien',
        headingVi: '1. Bảng biểu thuế lũy tiến từng phần hiện hành tại Việt Nam',
        headingEn: '1. Current Progressive Tax Brackets in Vietnam',
        contentVi: 'Luật Thuế thu nhập cá nhân áp dụng nguyên tắc lũy tiến từng phần: Thu nhập tính thuế càng cao thì phần vượt bậc sẽ chịu tỷ lệ thuế càng lớn. Nguyên tắc này nhằm đảm bảo công bằng xã hội (người có thu nhập cao đóng góp nhiều hơn cho ngân sách nhà nước).\n\n• **Bậc 1 (Đến 5 triệu đồng):** 5%\n• **Bậc 2 (Từ 5 - 10 triệu đồng):** 10%\n• **Bậc 3 (Từ 10 - 18 triệu đồng):** 15%\n• **Bậc 4 (Từ 18 - 32 triệu đồng):** 20%\n• **Bậc 5 (Từ 32 - 52 triệu đồng):** 25%\n• **Bậc 6 (Từ 52 - 80 triệu đồng):** 30%\n• **Bậc 7 (Trên 80 triệu đồng):** 35%\n\nCần lưu ý: Nếu bạn có thu nhập tính thuế là 12 triệu đồng, bạn KHÔNG phải nộp 15% trên toàn bộ 12 triệu. Thay vào đó, 5 triệu đầu nộp 5% (250k), 5 triệu tiếp theo nộp 10% (500k), và chỉ có 2 triệu vượt trên 10 triệu mới chịu mức 15% (300k). Tổng thuế nộp là 1.050.000 đ.',
        contentEn: 'Progressive taxation applies higher tax rates only to marginal income within each bracket, ensuring higher earners contribute proportionally without reducing net take-home gains.'
      },
      {
        id: 'cac-khoan-giam-tru-hop-phap',
        headingVi: '2. Các khoản giảm trừ hợp pháp để tối ưu thuế TNCN',
        headingEn: '2. Legitimate Deductions to Lower Taxable Income',
        contentVi: 'Bên cạnh mức giảm trừ bản thân 11 triệu đồng/tháng và người phụ thuộc 4.4 triệu đồng/người/tháng, người nộp thuế tại Việt Nam có thể tận dụng các khoản giảm trừ bổ sung hợp pháp:\n\n• **Khoản đóng bảo hiểm hưu trí tự nguyện:** Được giảm trừ tối đa **1.000.000 đ/tháng** (12.000.000 đ/năm).\n• **Đóng góp từ thiện, nhân đạo, khuyến học:** Toàn bộ các khoản đóng góp vào quỹ từ thiện, tổ chức nhân đạo được nhà nước công nhận (có biên lai hợp lệ) đều được giảm trừ 100% vào thu nhập chịu thuế.\n• **Tiền đóng bảo hiểm bắt buộc:** 100% tiền đóng BHXH, BHYT, BHTN đều được trừ trước khi tính thuế.',
        contentEn: 'Statutory deductions include personal allowances (11M), qualified dependents (4.4M each), voluntary pension schemes (up to 1M/month), and certified philanthropic contributions.'
      }
    ],
    faqs: [
      {
        qVi: 'Ai được tính là người phụ thuộc để giảm trừ gia cảnh?',
        qEn: 'Who qualifies as a dependent for tax deduction?',
        aVi: 'Con dưới 18 tuổi hoặc con trên 18 tuổi đang học đại học có thu nhập dưới 1 triệu/tháng; cha mẹ già ngoài độ tuổi lao động hoặc mất khả năng lao động có thu nhập dưới 1 triệu/tháng.',
        aEn: 'Eligible dependents include minor children under 18, full-time college students earning under 1M VND, and elderly parents without pension.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 5: MORTGAGE REPAYMENT COMPARISON
  // -------------------------------------------------------------
  {
    id: 'mortgage-repayment-comparison',
    slug: 'vay-mua-nha-so-sanh-du-no-giam-dan-vs-goc-deu',
    category: 'loans-real-estate',
    titleVi: 'Vay Mua Nhà: So Sánh Dư Nợ Giảm Dần vs Dư Nợ Gốc Đều (Lựa Chọn Nào Lợi Hơn?)',
    titleEn: 'Mortgage Guide: Reducing Balance vs Fixed Principal Amortization Comparison',
    excerptVi: 'Phân tích chi tiết sự khác biệt về số tiền lãi phải trả hàng tháng, rủi ro lãi suất thả nổi và cách lập kế hoạch trả nợ trước hạn tiết kiệm hàng trăm triệu đồng.',
    excerptEn: 'Deep comparison between reducing balance and fixed monthly annuity mortgage payment models to minimize lifetime interest costs.',
    iconName: 'Home',
    gradient: 'from-sky-600 to-blue-800',
    coverImage: '/images/blog/blog_mortgage_1790772806826.jpg',
    readTimeMinutes: 9,
    publishedDate: '2025-01-25',
    updatedDate: '2025-02-18',
    featured: false,
    author: {
      name: 'Alexander Wright, CFA',
      roleVi: 'Giám đốc Thẩm định & Tài chính Bất động sản (Real Estate Investment Director)',
      roleEn: 'Mortgage & Real Estate Investment Director',
      avatar: '🏡'
    },
    tagsVi: ['Vay mua nhà', 'Lãi suất vay', 'Dư nợ giảm dần', 'Niên kim cố định', 'Bất động sản'],
    tagsEn: ['Mortgage', 'Amortization', 'Home Loan', 'Real Estate', 'Banking'],
    relatedToolIds: ['mortgage', 'amortization', 'loan'],
    ctaToolId: 'mortgage',
    ctaToolLabelVi: 'Mở Bảng Tính Vay Mua Nhà & Lịch Trả Nợ',
    ctaToolLabelEn: 'Open Mortgage Calculator & Schedule',
    sections: [
      {
        id: 'so-sanh-hai-hinh-thuc',
        headingVi: '1. Bản chất: Dư nợ giảm dần vs Trả góp niên kim cố định',
        headingEn: '1. Core Concepts: Reducing Balance vs Fixed Monthly Annuity',
        contentVi: 'Khi vay mua nhà hàng tỷ đồng từ ngân hàng, hai phương thức trả nợ phổ biến nhất tạo ra sự khác biệt khổng lồ về dòng tiền:\n\n• **Phương thức Dư nợ giảm dần:** Tiền gốc được chia đều trả hàng tháng (Tiền gốc = Tổng số tiền vay / Số tháng vay). Tiền lãi được tính trên số dư nợ gốc thực tế còn lại tại đầu mỗi kỳ. Do đó, những tháng đầu tiên tổng số tiền phải nộp là cao nhất, sau đó số tiền phải trả giảm dần đều qua từng tháng. Đây là phương thức tiết kiệm tổng tiền lãi nhất trong suốt vòng đời khoản vay.\n\n• **Phương thức Trả góp niên kim (Cố định hàng tháng):** Ngân hàng tính toán sao cho tổng số tiền bạn nộp mỗi tháng (Gốc + Lãi) là một con số cố định không đổi. Trong những năm đầu, phần lớn tiền bạn nộp là tiền lãi, số tiền trả nợ gốc rất ít. Phương thức này phù hợp với người có thu nhập ổn định và muốn dễ dàng quản lý dòng tiền chi tiêu gia đình.',
        contentEn: 'Reducing balance divides principal equally each month while interest shrinks continuously. Fixed annuity maintains consistent monthly payments throughout the term, paying predominantly interest during early years.'
      },
      {
        id: 'bai-toan-thuc-te-2-ty',
        headingVi: '2. Bài toán thực tế: Vay 2 tỷ đồng trong 20 năm tại lãi suất 8.5%/năm',
        headingEn: '2. Real-World Case Study: 2 Billion VND Mortgage for 20 Years at 8.5%',
        contentVi: 'Giả sử bạn vay 2.000.000.000 đ trong 240 tháng với lãi suất 8.5%/năm:\n\n• **Theo phương thức Dư nợ giảm dần:**\n  - Tiền gốc trả hàng tháng cố định: $2.000.000.000 / 240 = 8.333.333 đ/tháng$.\n  - Tháng đầu tiên: Tiền lãi = $2.000.000.000 \\times 8.5\\% / 12 = 14.166.667 đ$ $\\rightarrow$ Tổng trả tháng đầu: **22.500.000 đ**.\n  - Tháng thứ 120 (năm thứ 10): Tổng nộp giảm xuống chỉ còn khoảng **15.416.000 đ**.\n  - Tháng cuối cùng: Tổng nộp chỉ còn khoảng **8.392.000 đ**.\n  - **Tổng tiền lãi phải trả:** Khoảng **1.707.083.000 đ**.\n\n• **Theo phương thức Trả góp niên kim đều:**\n  - Số tiền trả cố định mỗi tháng: Khoảng **17.356.000 đ/tháng** trong suốt 240 tháng.\n  - **Tổng tiền lãi phải trả:** Khoảng **2.165.540.000 đ**.\n\n$\\rightarrow$ Phương thức dư nợ giảm dần giúp bạn tiết kiệm được hơn **458.000.000 đ** tiền lãi ngân hàng!',
        contentEn: 'A 2 billion VND 20-year mortgage at 8.5% saves approximately 458 million VND in total lifetime interest when using reducing balance amortization compared to fixed annuity.'
      }
    ],
    faqs: [
      {
        qVi: 'Nên vay mua nhà trong bao nhiêu năm là tối ưu nhất?',
        qEn: 'What is the optimal mortgage loan term?',
        aVi: 'Nên chọn kỳ hạn dài nhất có thể (15 - 25 năm) để hạ số tiền gốc phải trả mỗi tháng xuống mức tối thiểu, sau đó chủ động gom tiền để tất toán trước hạn khi có điều kiện.',
        aEn: 'Opting for a longer loan tenure (15-25 years) lowers mandatory monthly cash commitments, allowing flexible prepayment when surplus cash becomes available.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 6: COMPOUND INTEREST
  // -------------------------------------------------------------
  {
    id: 'compound-interest-wealth-creation',
    slug: 'suc-manh-cua-lai-kep-va-tu-do-tai-chinh',
    category: 'investment-saving',
    titleVi: 'Sức Mạnh Của Lãi Kép: Công Thức Tích Lũy Tài Sản & Đạt Tự Do Tài Chính Từ Vốn Nhỏ',
    titleEn: 'The Power of Compound Interest: Wealth Accumulation & Financial Independence',
    excerptVi: 'Tại sao Albert Einstein gọi Lãi kép là kỳ quan thứ 8 của thế giới? Khám phá cách biến 2 triệu mỗi tháng thành gia tài hàng tỷ đồng theo thời gian.',
    excerptEn: 'Why compound interest is considered the 8th wonder of the world. Learn how small monthly contributions compound into substantial wealth.',
    iconName: 'TrendingUp',
    gradient: 'from-amber-500 to-orange-700',
    coverImage: '/images/blog/blog_compound_1790772818277.jpg',
    readTimeMinutes: 8,
    publishedDate: '2025-01-28',
    updatedDate: '2025-02-12',
    featured: false,
    author: {
      name: 'Liam Gallagher, CFP®',
      roleVi: 'Cố vấn Tích lũy Tài sản & Hưu trí (Wealth Management Strategist)',
      roleEn: 'Wealth Management & Compound Growth Strategist',
      avatar: '📈'
    },
    tagsVi: ['Lãi kép', 'Đầu tư tích lũy', 'Tự do tài chính', 'Tiết kiệm', 'Quy tắc 72'],
    tagsEn: ['Compound Interest', 'Investing', 'Wealth', 'Savings', 'Rule of 72'],
    relatedToolIds: ['interest', 'investment', 'retirement'],
    ctaToolId: 'interest',
    ctaToolLabelVi: 'Mở Máy Tính Lãi Kép & Tích Lũy Tương Lai',
    ctaToolLabelEn: 'Open Compound Interest Calculator',
    sections: [
      {
        id: 'nguyen-ly-lai-kep',
        headingVi: '1. Nguyên lý Lãi Mẹ Đẻ Lãi Con: Thời gian quan trọng hơn vốn ban đầu',
        headingEn: '1. The Compounding Mechanism: Time Over Starting Capital',
        contentVi: 'Lãi kép (Compound Interest) là hiện tượng tiền lãi sinh ra ở mỗi chu kỳ được cộng gộp vào vốn gốc ban đầu để tiếp tục tạo ra lãi cho các chu kỳ kế tiếp. Trái ngược với tăng trưởng tuyến tính, lãi kép phát triển theo quy luật hàm mũ.\n\nTrong những năm đầu tiên (1-5 năm), sự tăng trưởng diễn ra rất chậm chạp khiến nhiều người dễ nản lòng và từ bỏ. Nhưng khi vượt qua "điểm bùng phát" (thường sau 10-15 năm), quả cầu tuyết tài chính bắt đầu lăn với tốc độ khổng lồ: số tiền lãi sinh ra mỗi năm thậm chí lớn hơn toàn bộ số tiền bạn tích lũy từ lương!\n\nDo đó, bí quyết lớn nhất của người giàu không phải là tỷ suất sinh lời cực cao mà là **bắt đầu đầu tư càng sớm càng tốt** để tận dụng tối đa thời gian.',
        contentEn: 'Compounding operates exponentially: interest earned is reinvested to generate its own returns. Time in the market and early disciplined consistency vastly outperform attempting to time market highs.'
      },
      {
        id: 'mo-phong-tich-luy-thuc-te',
        headingVi: '2. Bảng mô phỏng tích lũy: Tiết kiệm 3 triệu/tháng với lãi suất 10%/năm',
        headingEn: '2. Investment Simulation: Saving 3M VND/month at 10% Annual Return',
        contentVi: 'Nếu một bạn trẻ 22 tuổi bắt đầu trích ra 3.000.000 đ mỗi tháng để đầu tư vào các quỹ chỉ số (ETF VN30) với lợi nhuận kỳ vọng trung bình 10%/năm:\n\n• **Sau 10 năm (32 tuổi):** Tổng tiền vốn bạn bỏ ra là 360 triệu. Tài sản tích lũy đạt khoảng **614 triệu đồng**.\n• **Sau 20 năm (42 tuổi):** Tổng tiền vốn là 720 triệu. Tài sản tích lũy đạt khoảng **2.27 tỷ đồng** (tiền lãi gấp 2 lần vốn).\n• **Sau 30 năm (52 tuổi):** Tổng tiền vốn là 1.08 tỷ. Tài sản tích lũy bùng nổ lên tới hơn **6.81 tỷ đồng**!\n\nCon số 6.8 tỷ đồng chính là minh chứng rõ ràng nhất cho sức mạnh kỳ diệu của việc kiên trì tích lũy có kỷ luật.',
        contentEn: 'Investing 3M VND monthly at a 10% annual return yields over 614M VND in 10 years, 2.27B VND in 20 years, and accelerates to over 6.81B VND after 30 years.'
      }
    ],
    faqs: [
      {
        qVi: 'Quy tắc 72 trong đầu tư là gì?',
        qEn: 'What is the Rule of 72?',
        aVi: 'Quy tắc 72 giúp ước lượng nhanh số năm cần thiết để tài sản nhân đôi: Lấy 72 chia cho tỷ suất sinh lời hàng năm (%). Ví dụ: Nếu lãi suất 10%/năm, bạn mất 72 / 10 = 7.2 năm để nhân đôi số tiền.',
        aEn: 'The Rule of 72 estimates how many years it takes for an investment to double: divide 72 by the annual return rate.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 7: ELECTRICITY BILL 6 TIERS EVN
  // -------------------------------------------------------------
  {
    id: 'evn-electricity-bill-formula',
    slug: 'cach-tinh-hoa-don-tien-dien-6-bac-thang-evn',
    category: 'bills-utilities',
    titleVi: 'Bí Quyết Kiểm Soát Hóa Đơn Điện Nước: Hướng Dẫn Tính Giá Điện 6 Bậc Thang EVN',
    titleEn: 'Electricity Bill Guide: EVN 6-Tier Stepped Tariff Calculation & Saving Secrets',
    excerptVi: 'Giải mã cách tính tiền điện sinh hoạt theo bậc lũy tiến, tác động của thuế VAT 8% - 10% và phương pháp tính điện năng tiêu thụ của từng thiết bị trong nhà.',
    excerptEn: 'Master residential progressive electricity tariff calculations, appliance kilowatt-hour estimation, and actionable power conservation tactics.',
    iconName: 'Zap',
    gradient: 'from-amber-400 to-yellow-600',
    coverImage: '/images/blog/blog_electric_bill_1790773350641.jpg',
    readTimeMinutes: 7,
    publishedDate: '2025-02-02',
    updatedDate: '2025-02-20',
    featured: false,
    author: {
      name: 'David Sterling, PE',
      roleVi: 'Kỹ sư Năng lượng & Tiết kiệm Điện thông minh (Energy Systems Consultant)',
      roleEn: 'Energy Systems & Smart Grid Efficiency Consultant',
      avatar: '⚡'
    },
    tagsVi: ['Tiền điện EVN', 'Bậc thang điện', 'Tiết kiệm điện', 'Hóa đơn', 'Điện năng'],
    tagsEn: ['Electricity Bill', 'Tiered Rates', 'Energy Efficiency', 'Utilities'],
    relatedToolIds: ['utilitybill'],
    ctaToolId: 'utilitybill',
    ctaToolLabelVi: 'Mở Máy Tính Hóa Đơn Tiền Điện & Nước',
    ctaToolLabelEn: 'Open Utility Bill Calculator',
    sections: [
      {
        id: 'bieu-gia-6-bac',
        headingVi: '1. Biểu giá điện sinh hoạt 6 bậc thang của EVN hiện hành',
        headingEn: '1. The 6-Tier Residential Tariff Structure',
        contentVi: 'Biểu giá điện bậc thang của Tập đoàn Điện lực Việt Nam (EVN) áp dụng mức giá tăng dần cho từng khoảng tiêu thụ (chưa gồm thuế giá trị gia tăng VAT):\n\n• **Bậc 1 (Cho kWh từ 0 – 50):** 1.893 đ/kWh\n• **Bậc 2 (Cho kWh từ 51 – 100):** 1.956 đ/kWh\n• **Bậc 3 (Cho kWh từ 101 – 200):** 2.271 đ/kWh\n• **Bậc 4 (Cho kWh từ 201 – 300):** 2.860 đ/kWh\n• **Bậc 5 (Cho kWh từ 301 – 400):** 3.197 đ/kWh\n• **Bậc 6 (Cho kWh từ 401 trở lên):** 3.302 đ/kWh\n\nChính vì các bậc trên có đơn giá cao gần gấp đôi bậc 1, nên khi gia đình tiêu thụ vượt qua ngưỡng 200 - 300 kWh vào mùa hè, hóa đơn tiền điện sẽ tăng vọt theo cấp số nhân.',
        contentEn: 'Residential electricity rates scale upwards across 6 tiers, ranging from 1,893 VND for the first 50 kWh to 3,302 VND for consumption exceeding 400 kWh, compounded by statutory VAT.'
      },
      {
        id: 'cong-thuc-tieu-thu-thiet-bi',
        headingVi: '2. Công thức tính lượng điện tiêu thụ của các thiết bị gia dụng',
        headingEn: '2. Formula for Estimating Appliance Kilowatt-Hour Consumption',
        contentVi: 'Để biết một thiết bị trong nhà ngốn bao nhiêu số điện (kWh), bạn sử dụng công thức:\n\n**Điện năng tiêu thụ (kWh) = [Công suất thiết bị (W) × Số giờ sử dụng mỗi ngày (h) × Số ngày] / 1.000**\n\n• **Ví dụ Điều hòa nhiệt độ 1.5 HP (Công suất tiêu thụ trung bình 1.200W):** Bật 8 tiếng mỗi đêm trong 30 ngày: $(1.200 \\times 8 \\times 30) / 1.000 = \\mathbf{288 kWh}$. Với mức tiêu thụ rơi vào Bậc 4 và Bậc 5, riêng một chiếc điều hòa này đã đóng góp khoảng 800.000 – 900.000 đ vào hóa đơn tiền điện!\n• **Bình nước nóng lạnh (2.500W):** Bật 1 tiếng/ngày $\\rightarrow (2.500 \\times 1 \\times 30) / 1.000 = \\mathbf{75 kWh}$.',
        contentEn: 'Kilowatt-hours = (Wattage × Daily Hours × Days) / 1000. An air conditioner running 8 hours nightly consumes roughly 288 kWh monthly, occupying the expensive upper brackets.'
      }
    ],
    faqs: [
      {
        qVi: 'Thiết bị nào trong nhà ngốn nhiều điện nhất?',
        qEn: 'Which household appliances consume the most electricity?',
        aVi: 'Điều hòa nhiệt độ chiếm từ 45% - 65% tổng hóa đơn tiền điện mùa hè. Kế đến là bình nước nóng lạnh và bếp từ.',
        aEn: 'Air conditioning systems account for 45-65% of monthly power bills during peak warm months.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 8: TDEE, BMR & BMI
  // -------------------------------------------------------------
  {
    id: 'tdee-bmr-bmi-scientific-fitness',
    slug: 'chi-so-tdee-bmr-bmi-cach-tinh-calo-giam-can',
    category: 'health-fitness',
    titleVi: 'Chỉ Số TDEE, BMR & BMI: Cách Tính Lượng Calo Tiêu Thụ Để Giảm Cân / Tăng Cơ Khoa Học',
    titleEn: 'TDEE, BMR & BMI Guide: Calculating Daily Calorie Expenditure for Weight Goals',
    excerptVi: 'Bí quyết giảm mỡ bền vững không cần nhịn ăn: Tính chuẩn lượng calo thâm hụt (Calorie Deficit), chỉ số trao đổi chất cơ bản và tỷ lệ trao đổi chất toàn diện.',
    excerptEn: 'Scientific weight management through caloric balance: accurately compute Basal Metabolic Rate and Total Daily Energy Expenditure.',
    iconName: 'Activity',
    gradient: 'from-rose-500 to-pink-700',
    coverImage: '/images/blog/blog_weight_loss_1790772766140.jpg',
    readTimeMinutes: 8,
    publishedDate: '2025-02-05',
    updatedDate: '2025-02-22',
    featured: false,
    author: {
      name: 'Dr. Emily Watson, MD, MS',
      roleVi: 'Bác sĩ Dinh dưỡng Lâm sàng & Thể thao (Sports Nutritionist & Researcher)',
      roleEn: 'Clinical Sports Nutritionist & Metabolic Health Researcher',
      avatar: '🩺'
    },
    tagsVi: ['TDEE', 'BMR', 'BMI', 'Giảm cân', 'Calo', 'Dinh dưỡng thể hình'],
    tagsEn: ['TDEE', 'BMR', 'BMI', 'Calorie Deficit', 'Nutrition', 'Fitness'],
    relatedToolIds: ['bmi', 'bmr', 'calorie'],
    ctaToolId: 'bmi',
    ctaToolLabelVi: 'Mở Máy Tính BMI & TDEE Sức Khỏe',
    ctaToolLabelEn: 'Open BMI & TDEE Health Calculator',
    sections: [
      {
        id: 'phan-biet-bmr-tdee-bmi',
        headingVi: '1. Phân biệt chính xác BMR, TDEE và chỉ số khối cơ thể BMI',
        headingEn: '1. Understanding BMR, TDEE, and BMI Differences',
        contentVi: 'Để kiểm soát cân nặng bền vững, bạn cần nắm vững sự khác biệt giữa 3 chỉ số then chốt:\n\n• **BMR (Basal Metabolic Rate - Tỷ lệ trao đổi chất cơ bản):** Lượng năng lượng tối thiểu cơ thể tiêu tốn để duy trì sự sống ở trạng thái nghỉ ngơi hoàn toàn (cho hoạt động tim đập, phổi hô hấp, não bộ xử lý, thận lọc máu và duy trì thân nhiệt 37°C). BMR thường chiếm từ 60% – 70% tổng năng lượng đốt cháy mỗi ngày.\n\n• **TDEE (Total Daily Energy Expenditure - Tổng năng lượng tiêu thụ hàng ngày):** Là tổng toàn bộ lượng calo cơ thể đốt cháy trong 24 giờ bao gồm: $BMR + \\text{Vận động thể chất} + \\text{Hiệu ứng nhiệt tiêu hóa thức ăn (TEF)}$. TDEE chính là thước đo quyết định bạn tăng hay giảm cân.\n\n• **BMI (Body Mass Index - Chỉ số khối cơ thể):** Đánh giá mức độ gầy hay béo dựa trên chiều cao và cân nặng ($BMI = \\text{Cân nặng (kg)} / [\\text{Chiều cao (m)}]^2$). Tiêu chuẩn châu Á (IDI & WPRO): BMI từ 18.5 – 22.9 là lý tưởng; từ 23 trở lên là thừa cân.',
        contentEn: 'BMR measures basal energy expended at rest for organ homeostasis. TDEE measures cumulative daily expenditure including exercise and food thermogenesis. BMI gauges overall body mass relative to height.'
      },
      {
        id: 'nguyen-ly-tham-hut-calo',
        headingVi: '2. Nguyên lý thâm hụt calo (Calorie Deficit) để giảm mỡ an toàn',
        headingEn: '2. The Science of Calorie Deficit for Safe Fat Loss',
        contentVi: 'Khoa học dinh dưỡng chứng minh định luật bảo toàn năng lượng trong cơ thể:\n\n• **Nạp vào > TDEE:** Cơ thể tích lũy năng lượng dư thừa dưới dạng mỡ (Tăng cân).\n• **Nạp vào = TDEE:** Cân nặng duy trì ổn định (Maintain).\n• **Nạp vào < TDEE:** Cơ thể bắt buộc phải đốt cháy mỡ thừa và glycogen dự trữ để bù đắp năng lượng thiếu hụt (Giảm cân).\n\nTheo y văn thế giới, **1 kg mỡ cơ thể chứa khoảng 7.700 kcal**. Do đó, nếu bạn duy trì mức thâm hụt lý tưởng là **500 kcal mỗi ngày**, bạn sẽ giảm đều đặn:\n$$500 \\times 7 = 3.500 \\text{ kcal/tuần} \\approx 0.45 – 0.5 \\text{ kg mỡ thuần khiết/tuần}$$\nĐây là tốc độ giảm mỡ vàng giúp cơ thể khỏe mạnh, da dẻ săn chắc và không bị mất cơ bắp.',
        contentEn: 'One kilogram of body fat stores approximately 7,700 kcal. Creating a manageable 500 kcal daily deficit results in losing roughly 0.5 kg of pure body fat weekly without metabolic exhaustion.'
      }
    ],
    faqs: [
      {
        qVi: 'Muốn giảm 1kg mỡ thì cần thâm hụt bao nhiêu calo?',
        qEn: 'How large of a deficit is required to shed 1 kilogram of fat?',
        aVi: 'Khoa học chứng minh 1kg mỡ cơ thể tương đương khoảng 7.700 kcal. Mức thâm hụt an toàn 500 kcal mỗi ngày giúp giảm khoảng 0.5kg mỡ tinh khiết mỗi tuần.',
        aEn: 'One kilogram of adipose body fat approximates 7,700 kcal. A 500 kcal daily deficit translates to losing roughly 0.5 kg weekly.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 9: HOW MANY CALORIES TO BURN DAILY
  // -------------------------------------------------------------
  {
    id: 'calories-burn-daily-weight-loss',
    slug: 'moi-ngay-nen-dot-bao-nhieu-calo-de-giam-can',
    category: 'health-fitness',
    titleVi: 'Mỗi Ngày Nên Đốt Bao Nhiêu Calo Để Giảm Cân An Toàn? (How Many Calories to Burn Daily)',
    titleEn: 'How Many Calories Should You Burn Daily to Lose Weight?',
    excerptVi: 'Khám phá công thức tính toán lượng calo cần đốt cháy mỗi ngày để giảm mỡ an toàn, giữ vững thể lực và không bị mệt mỏi hay mất cơ bắp.',
    excerptEn: 'Find out how many calories you should burn each day to shed pounds safely while keeping your body energized, resilient, and healthy.',
    iconName: 'Flame',
    gradient: 'from-orange-500 to-red-700',
    coverImage: '/images/blog/blog_calorie_burn_1790773367207.jpg',
    readTimeMinutes: 7,
    publishedDate: '2025-02-08',
    updatedDate: '2025-02-24',
    featured: false,
    author: {
      name: 'Oliver Vance, CSCS, CPT',
      roleVi: 'Chuyên gia Huấn luyện Thể lực & Đo lường Tiêu hao Năng lượng (Fitness Director)',
      roleEn: 'Senior Strength & Conditioning Specialist & Caloric Expenditure Director',
      avatar: '🏋️‍♂️'
    },
    tagsVi: ['Đốt calo', 'Calorie Deficit', 'Giảm cân an toàn', 'Tập luyện', 'Cardio'],
    tagsEn: ['Burn Calories', 'Calorie Deficit', 'Weight Loss', 'Fitness', 'Cardio'],
    relatedToolIds: ['calorie', 'bmi', 'pace'],
    ctaToolId: 'calorie',
    ctaToolLabelVi: 'Mở Máy Tính Calo Tiêu Thụ Hàng Ngày',
    ctaToolLabelEn: 'Open Daily Calorie Burn Calculator',
    sections: [
      {
        id: 'muc-dot-calo-ly-tuong',
        headingVi: '1. Lượng calo cần đốt cháy lý tưởng mỗi ngày',
        headingEn: '1. The Ideal Daily Calorie Burn Deficit',
        contentVi: 'Đối với đa số người trưởng thành, mức thâm hụt năng lượng tối ưu là từ **400 đến 600 kcal/ngày**.\n\nChiến lược thông minh nhất là kết hợp "Ăn bớt – Tập thêm":\n• Cắt giảm khoảng 300 kcal qua chế độ ăn uống (bỏ đồ uống có đường, trà sữa, thức ăn nhanh chiên dầu).\n• Vận động thể chất đốt thêm 200 – 300 kcal (30 phút chạy bộ hoặc 45 phút tập tạ).\n\nTổng cộng bạn đạt thâm hụt 500 kcal/ngày mà dạ dày vẫn no bụng, không bị đói cồn cào hay mệt mỏi.',
        contentEn: 'Target a 400 to 600 calorie daily deficit via combined dietary discipline (saving 300 kcal) and moderate cardio exercise (burning 250-300 kcal).'
      },
      {
        id: 'bang-tieu-hao-cac-mon-the-thao',
        headingVi: '2. Bảng ước tính calo tiêu thụ của các bài tập phổ biến trong 45 phút',
        headingEn: '2. Calorie Burn Table for Popular 45-Minute Exercises',
        contentVi: 'Dưới đây là lượng calo tiêu hao trung bình của một người nặng 60 – 65kg trong 45 phút tập luyện liên tục:\n\n• **Chạy bộ ngoài trời (Pace 6:00 min/km):** Đốt cháy khoảng **450 – 550 kcal**.\n• **Bơi lội tự do:** Đốt cháy khoảng **380 – 480 kcal**.\n• **Nhảy dây liên tục tốc độ vừa:** Đốt cháy khoảng **400 – 500 kcal**.\n• **Đạp xe thể thao:** Đốt cháy khoảng **320 – 420 kcal**.\n• **Tập tạ kháng lực (Strength Training):** Đốt cháy khoảng **220 – 320 kcal** (và tiếp tục đốt thêm calo sau buổi tập nhờ hiệu ứng EPOC).\n• **Đi bộ nhanh 10.000 bước:** Đốt cháy khoảng **350 – 450 kcal**.',
        contentEn: 'Running burns ~450-550 kcal, swimming burns ~380-480 kcal, jump rope burns ~400-500 kcal, cycling burns ~350 kcal, and strength training burns ~250-300 kcal with afterburn.'
      }
    ],
    faqs: [
      {
        qVi: 'Chạy bộ 30 phút đốt được bao nhiêu calo?',
        qEn: 'How many calories does a 30-minute jog burn?',
        aVi: 'Người nặng khoảng 60kg chạy bộ tốc độ vừa phải trong 30 phút sẽ đốt cháy khoảng 280 - 350 kcal.',
        aEn: 'A 60kg individual jogging at a moderate 6 min/km pace burns approximately 280-350 kcal in 30 minutes.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 10: METABOLISM BOOST
  // -------------------------------------------------------------
  {
    id: 'boost-metabolism-calorie-deficit',
    slug: 'tang-toc-trao-doi-chat-de-giam-can-nhanh',
    category: 'health-fitness',
    titleVi: 'Tăng Tốc Trao Đổi Chất (Metabolism) Để Giảm Cân Nhanh & Bền Vững',
    titleEn: 'Boost Your Metabolism for Faster Weight Loss: Calorie Deficit Strategies',
    excerptVi: 'Hiểu rõ các yếu tố quyết định tốc độ trao đổi chất của cơ thể và cách kích hoạt lò đốt mỡ tự nhiên thông qua bài tập sức mạnh và thực phẩm giàu protein.',
    excerptEn: 'Understand what your body metabolism is and how you can boost metabolic rate to burn more fat passively with science-backed habits.',
    iconName: 'Zap',
    gradient: 'from-amber-500 to-rose-600',
    coverImage: '/images/blog/blog_metabolism_1790772778903.jpg',
    readTimeMinutes: 7,
    publishedDate: '2025-02-12',
    updatedDate: '2025-02-26',
    featured: false,
    author: {
      name: 'Dr. Michael Chen, Ph.D.',
      roleVi: 'Chuyên gia Sinh lý học & Y học Vận động (Exercise Physiologist)',
      roleEn: 'Exercise Physiologist & Metabolic Researcher',
      avatar: '🔬'
    },
    tagsVi: ['Metabolism', 'Trao đổi chất', 'Đốt mỡ tự nhiên', 'Tăng cơ', 'Protein'],
    tagsEn: ['Metabolism', 'Metabolic Rate', 'Fat Burn', 'Thermogenesis'],
    relatedToolIds: ['bmr', 'calorie', 'bodyfat'],
    ctaToolId: 'bmr',
    ctaToolLabelVi: 'Tính Chỉ Số BMR Trao Đổi Chất Ngay',
    ctaToolLabelEn: 'Calculate Your BMR Metabolic Rate',
    sections: [
      {
        id: 'cac-yeu-to-trao-doi-chat',
        headingVi: '1. Ba trụ cột cấu thành tổng lượng calo trao đổi chất',
        headingEn: '1. Three Pillars of Daily Metabolic Expenditure',
        contentVi: 'Trao đổi chất không phải là con số cố định mà biến đổi liên tục dựa trên 3 thành phần chính:\n\n• **BMR (Chiếm 60 – 70%):** Năng lượng tối thiểu để duy trì sự sống.\n• **TEF (Thermic Effect of Food - Chiếm 10%):** Năng lượng cơ thể dùng để nhai, tiêu hóa và hấp thụ thức ăn. Protein có TEF cao nhất (khoảng 20 – 30%), nghĩa là bạn ăn 100 calo từ ức gà thì cơ thể đã tốn tới 25-30 calo chỉ để tiêu hóa nó!\n• **NEAT & EAT (Chiếm 20 – 30%):** Vận động hàng ngày (leo cầu thang, dọn dẹp nhà) và các buổi tập thể thao có chủ đích.',
        contentEn: 'Metabolism comprises BMR (60-70%), Thermic Effect of Food (10% - protein burns 20-30% of its calories during digestion), and active physical movement.'
      }
    ],
    faqs: [
      {
        qVi: 'Nhịn ăn có làm chậm trao đổi chất không?',
        qEn: 'Does severe fasting slow down metabolism?',
        aVi: 'Có. Khi cắt giảm calo quá sâu (dưới 1000 kcal/ngày), cơ thể sẽ kích hoạt cơ chế sinh tồn hạ thấp BMR để tiết kiệm năng lượng.',
        aEn: 'Yes. Extreme caloric restriction triggers adaptive thermogenesis, dropping BMR to conserve energy.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 11: AI IN FINANCIAL & MATH CALCULATIONS
  // -------------------------------------------------------------
  {
    id: 'ai-in-financial-math-calculations',
    slug: 'ung-dung-ai-trong-giai-toan-va-tai-chinh',
    category: 'ai-tech',
    titleVi: 'Ứng Dụng AI Trong Giải Toán & Phân Tích Tài Chính: Tương Lai Của Máy Tính Trực Tuyến',
    titleEn: 'AI in Mathematics & Financial Modeling: The Future of Modern Online Computing',
    excerptVi: 'Khám phá cách mô hình ngôn ngữ lớn (LLM) và AI Studio kết hợp cùng công cụ tính toán số học để giải quyết các bài toán đại số phức tạp và tối ưu kế hoạch tài chính.',
    excerptEn: 'Explore how large language models and smart calculation engines unite to solve intricate algebra, symbolic math, and strategic personal finance scenarios.',
    iconName: 'Bot',
    gradient: 'from-violet-600 to-purple-900',
    coverImage: '/images/blog/blog_ai_math_1790773378947.jpg',
    readTimeMinutes: 7,
    publishedDate: '2025-02-10',
    updatedDate: '2025-02-25',
    featured: false,
    author: {
      name: 'Prof. Robert Thorne, Ph.D.',
      roleVi: 'Giáo sư Toán học Ứng dụng & Trí tuệ Nhân tạo (Computational AI Chair)',
      roleEn: 'Applied Mathematics & Computational Intelligence Chair',
      avatar: '🤖'
    },
    tagsVi: ['Trợ lý AI', 'Giải toán AI', 'Tài chính thông minh', 'Công nghệ', 'AI Studio'],
    tagsEn: ['AI Assistant', 'AI Math Solver', 'FinTech', 'Algorithms', 'Machine Learning'],
    relatedToolIds: ['ai', 'basic'],
    ctaToolId: 'ai',
    ctaToolLabelVi: 'Trải Nghiệm Trợ Lý AI Giải Toán & Tài Chính Ngay',
    ctaToolLabelEn: 'Try AI Math & Finance Assistant Now',
    sections: [
      {
        id: 'su-ket-hop-hoan-hao',
        headingVi: '1. Tại sao máy tính số học truyền thống cần trợ lý AI?',
        headingEn: '1. Why Traditional Calculators Need Artificial Intelligence',
        contentVi: 'Máy tính số học truyền thống xử lý các phép tính cộng, trừ, nhân, chia hoàn hảo nhưng hoàn toàn không thể hiểu ngữ cảnh tự nhiên của con người.\n\nKhi bạn đối mặt với một vấn đề tài chính thực tế như: *"Tôi đang có 300 triệu tiền tiết kiệm, thu nhập 25 triệu/tháng, dự định 3 năm nữa mua căn hộ 2 tỷ thì nên phân bổ tiền gửi ngân hàng, đầu tư quỹ mở và trả nợ thế nào?"*, máy tính thông thường bó tay.\n\nNgược lại, mô hình AI hiện đại có khả năng tiếp nhận câu hỏi bằng ngôn ngữ tự nhiên, bóc tách bài toán thành các giả định tài chính, chạy mô hình dòng tiền đa biến và xuất ra lộ trình từng bước cực kỳ trực quan.',
        contentEn: 'While conventional engines execute arithmetic flawlessly, AI assistants interpret nuanced natural language scenarios, synthesizing customized multi-step plans.'
      }
    ],
    faqs: [
      {
        qVi: 'Công cụ AI trên Web Calculator có thể làm được gì?',
        qEn: 'What can the AI tool on Web Calculator accomplish?',
        aVi: 'Trợ lý AI có thể giải phương trình từng bước, phân tích báo cáo tài chính cá nhân, nhận diện phép tính từ hình ảnh và giải thích công thức toán học.',
        aEn: 'The assistant delivers step-by-step mathematical proofs, personal budget audits, image-based equation solving, and customized calculations.'
      }
    ]
  },

  // -------------------------------------------------------------
  // POST 12: AUTO FINANCING & ON-THE-ROAD COSTS
  // -------------------------------------------------------------
  {
    id: 'car-loan-auto-financing-guide',
    slug: 'kinh-nghiem-tinh-chi-phi-lan-banh-va-vay-mua-o-to',
    category: 'loans-real-estate',
    titleVi: 'Kinh Nghiệm Tính Chi Phí Lăn Bánh & Lập Kế Hoạch Vay Mua Ô Tô Trả Góp Tránh Bẫy Lãi Suất',
    titleEn: 'Auto Financing: On-The-Road Cost Calculation & Smart Car Loan Planning',
    excerptVi: 'Hướng dẫn bóc tách thuế trước bạ, phí biển số, bảo hiểm thân vỏ và cách tính số tiền trả góp hàng tháng khi vay mua ô tô qua ngân hàng.',
    excerptEn: 'Break down registration taxes, license plate fees, comprehensive insurance, and amortized auto loan payments to avoid dealership financing traps.',
    iconName: 'Car',
    gradient: 'from-indigo-500 to-blue-700',
    coverImage: '/images/blog/blog_car_finance_1790773337888.jpg',
    readTimeMinutes: 8,
    publishedDate: '2025-02-14',
    updatedDate: '2025-02-28',
    featured: false,
    author: {
      name: 'Jonathan Reynolds',
      roleVi: 'Chuyên gia Tín dụng & Thẩm định Tài sản Ô tô (Auto Credit Specialist)',
      roleEn: 'Automotive Credit & Asset Financing Specialist',
      avatar: '🚗'
    },
    tagsVi: ['Vay mua ô tô', 'Chi phí lăn bánh', 'Thuế trước bạ', 'Mua xe trả góp', 'Lãi suất vay xe'],
    tagsEn: ['Car Loan', 'Auto Finance', 'Vehicle Tax', 'Installment', 'Car Cost'],
    relatedToolIds: ['autoloan', 'loan'],
    ctaToolId: 'autoloan',
    ctaToolLabelVi: 'Mở Bảng Tính Vay Mua Ô Tô & Phí Lăn Bánh',
    ctaToolLabelEn: 'Open Auto Loan & Cost Calculator',
    sections: [
      {
        id: 'chi-phi-lan-banh-la-gi',
        headingVi: '1. Chi phí lăn bánh ô tô gồm những khoản bắt buộc nào?',
        headingEn: '1. What Constitutes On-The-Road Car Cost?',
        contentVi: 'Giá niêm yết của hãng xe chưa phải là số tiền cuối cùng để xe được phép lưu thông hợp pháp trên đường. Để xe "lăn bánh", bạn phải đóng thêm các khoản thuế phí bắt buộc:\n\n• **Thuế trước bạ:** 12% giá tính thuế tại Hà Nội, Quảng Ninh, Hải Phòng, Cần Thơ, Đà Nẵng; và 10% tại TP.HCM và các tỉnh thành khác.\n• **Phí cấp biển số mới:** 20.000.000 đ tại Hà Nội và TP.HCM; các tỉnh khác từ 200.000 đ – 1.000.000 đ.\n• **Phí đăng kiểm phương tiện:** Khoảng 340.000 đ.\n• **Phí bảo trì đường bộ:** 1.560.000 đ/năm đối với xe cá nhân dưới 10 chỗ.\n• **Bảo hiểm trách nhiệm dân sự bắt buộc:** Khoảng 480.000 – 530.000 đ/năm.\n• **Bảo hiểm vật chất thân vỏ xe (tự nguyện nhưng ngân hàng bắt buộc khi vay):** Khoảng 1.3% – 1.6% giá trị xe mỗi năm.\n\nVí dụ: Một chiếc sedan giá niêm yết 600 triệu đồng lăn bánh tại Hà Nội sẽ tốn tổng cộng khoảng **695 – 700 triệu đồng**.',
        contentEn: 'Dealership window sticker prices exclude essential statutory road fees: Registration tax (10-12%), license plate issuance (up to 20M in major metros), inspection, road maintenance, and insurance.'
      },
      {
        id: 'bai-toan-vay-tra-gop',
        headingVi: '2. Bài toán vay trả góp ô tô thông minh: Tỷ lệ trả trước và thời hạn vay',
        headingEn: '2. Smart Auto Loan Sizing: Down Payment & Loan Tenure',
        contentVi: 'Ô tô là một tiêu sản khấu hao giá trị theo thời gian. Do đó, các chuyên gia tài chính khuyến cáo:\n\n• **Nên trả trước tối thiểu 30% – 50% giá trị xe.** Trả trước quá ít (dưới 20%) sẽ khiến tiền lãi ngân hàng đội lên rất lớn so với giá trị xe sau vài năm sử dụng.\n• **Tổng tiền trả góp xe hàng tháng không vượt quá 20% – 25% thu nhập của bạn.** Bên cạnh tiền trả ngân hàng, bạn còn phải chi trả chi phí xăng xe, gửi xe, bảo dưỡng định kỳ khoảng 3 – 5 triệu đồng/tháng.\n• **Chọn kỳ hạn vay từ 4 – 5 năm:** Đây là khoảng thời gian cân bằng lý tưởng giữa số tiền trả góp hàng tháng và tổng số tiền lãi phải trả.',
        contentEn: 'Put down at least 30-50% on car loans. Keep total monthly automotive commitments under 20-25% of net income to account for maintenance and depreciation.'
      }
    ],
    faqs: [
      {
        qVi: 'Nên trả trước bao nhiêu phần trăm khi vay mua ô tô?',
        qEn: 'How much should you put down when financing a car?',
        aVi: 'Mức trả trước lý tưởng là từ 20% đến 30% giá trị xe để hạn chế tiền lãi hàng tháng đội lên quá cao.',
        aEn: 'A down payment of 20% to 30% is strongly advised to keep monthly amortization manageable.'
      }
    ]
  }
];
