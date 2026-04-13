/**
 * 自社製品レコメンド設定（factory専用）
 *
 * 記事テーマに応じてアステックペイントの具体的な製品名を
 * 執筆プロンプトに注入し、自然な形で製品紹介を行う。
 */

// 製品情報の型定義
interface ProductInfo {
  /** 製品正式名称 */
  name: string;
  /** 製品の簡潔な説明（1文） */
  description: string;
  /** 製品詳細ページURL */
  url: string;
  /** 対応部位（屋根/外壁/内壁など） */
  target: string;
  /** 主な性能スペック（記事に使える具体数値） */
  specs: string[];
  /** 期待耐用年数 */
  lifespan: string;
}

// テーマ別製品マッピングの型定義
interface ThemeProductMapping {
  /** テーマ名（ログ出力用） */
  themeName: string;
  /** このテーマに該当するキーワードパターン */
  keywords: string[];
  /** 推薦する製品リスト（優先度順） */
  products: ProductInfo[];
  /** このテーマ固有の執筆補足指示（任意） */
  writingNote?: string;
}

// ===== 製品マスタ =====

const PRODUCT_SHANETSU_TOP_ONE: ProductInfo = {
  name: "シャネツトップワンSi-JY",
  description: "下塗り不要の6役一体型（遮熱・耐候・防錆・密着・下塗り・上塗り）金属屋根用遮熱塗料",
  url: "https://astecpaints.jp/products/detail/36",
  target: "折板屋根・金属屋根（カラー鋼板、ガルバリウム鋼板）",
  specs: [
    "屋根表面温度を最大17.2℃低減",
    "JIS K 5674 塩水噴霧試験60サイクルで膨れ・錆なし",
    "下塗り不要で工期短縮（上塗り2回で完工）",
    "施工単価：約1,400円/m2〜",
  ],
  lifespan: "13〜16年",
};

const PRODUCT_EC_100PCM: ProductInfo = {
  name: "EC-100PCM",
  description: "約600%の伸縮率で雨漏りを防ぎながら遮熱もできる、スレート屋根対応の防水遮熱塗料",
  url: "https://astecpaints.jp/products/detail/37",
  target: "波形スレート屋根・金属屋根（カラー鋼板、ガルバリウム鋼板）",
  specs: [
    "屋根表面温度を最大20℃低減、室内温度を最大5℃低減",
    "塗膜伸び率約600%でひび割れに追従し雨漏りを防止",
    "フッ素塗料と同等の高い耐候性",
  ],
  lifespan: "15年以上",
};

const PRODUCT_REFINE_500MF_IR: ProductInfo = {
  name: "超低汚染リファイン500MF-IR",
  description: "無機成分配合で汚れにくく遮熱効果が長期持続する屋根用最高グレード塗料",
  url: "https://astecpaints.jp/products/detail/41",
  target: "屋根全般（カラー鋼板、スレート、セメント瓦、ガルバリウム鋼板）",
  specs: [
    "親水性セルフクリーニングで汚れを雨水が洗い流す",
    "遮熱効果が汚れで低下しにくい（遮熱保持性）",
    "防カビ・防藻性でJIS Z 2911試験合格",
    "69色展開",
  ],
  lifespan: "20〜24年",
};

const PRODUCT_REFINE_500SI_IR: ProductInfo = {
  name: "超低汚染リファイン500Si-IR",
  description: "コストパフォーマンスに優れた屋根用低汚染遮熱シリコン塗料",
  url: "https://astecpaints.jp/products/detail/408",
  target: "屋根全般（カラー鋼板、スレート、セメント瓦、ガルバリウム鋼板）",
  specs: [
    "近赤外線を反射し屋根表面温度上昇を抑制",
    "ラジカル制御技術による長期耐候性",
    "防カビ・防藻性",
  ],
  lifespan: "13〜16年",
};

const PRODUCT_SILICON_REVO500_IR: ProductInfo = {
  name: "シリコンREVO500-IR",
  description: "革命的な高耐候性と遮熱性を両立した次世代屋根用塗料",
  url: "https://astecpaints.jp/products/detail/408",
  target: "屋根全般（金属屋根、スレート、セメント瓦）",
  specs: [
    "近赤外線を反射し室内温度上昇を抑制",
    "紫外線劣化に強いシリコン成分を豊富に配合",
  ],
  lifespan: "13〜16年",
};

const PRODUCT_FLUORINE_REVO500_IR: ProductInfo = {
  name: "フッ素REVO500-IR",
  description: "完全交互結合型フッ素樹脂で最高クラスの耐候性と遮熱性を実現した屋根用塗料",
  url: "https://astecpaints.jp/products/detail/407",
  target: "屋根全般（金属屋根、スレート、セメント瓦）",
  specs: [
    "完全交互結合型フッ素樹脂で紫外線に強い",
    "特殊遮熱無機顔料で近赤外線を効果的に反射",
    "ラジカル制御型白色顔料＋HALS（光安定剤）で劣化を抑制",
  ],
  lifespan: "16〜20年",
};

const PRODUCT_KETSURO_NINE: ProductInfo = {
  name: "ケツロナイン",
  description: "塗膜が結露水を吸収・放湿する調湿型結露防止塗料（30年以上の実績）",
  url: "https://astec-factory.com/info/2024/10/07/download0_ketsuronain/",
  target: "折板屋根裏面・鉄骨柱・内壁（工場・倉庫の結露発生箇所）",
  specs: [
    "塗膜厚1mmで1m2あたり最大600ml吸水",
    "高湿度時に吸水、低湿度時に放湿する調湿機能",
    "塗膜自体が防カビ性を保有（添加剤方式でない）",
    "不燃性",
  ],
  lifespan: "30年以上の実績",
};

const PRODUCT_ASTEC_PLUS_SW: ProductInfo = {
  name: "アステック・プラスSW",
  description: "約2,000種の菌・1,000種のカビ・200種の藻に対応する水性塗料用防カビ・防藻添加剤",
  url: "https://astec-factory.com/mold.html",
  target: "各種水性塗料に添加して使用",
  specs: [
    "約2,000種の菌類、1,000種のカビ、200種の藻に対応",
    "食塩やカフェインよりも安全な成分",
    "複合合成剤のため耐性菌にも対応",
  ],
  lifespan: "塗料の耐用年数に準ずる",
};

const PRODUCT_REFINE_1000SI_IR: ProductInfo = {
  name: "超低汚染リファイン1000Si-IR",
  description: "低汚染・防カビ・遮熱を兼ね備えた外壁用シリコン塗料",
  url: "https://astec-factory.com/mold.html",
  target: "工場・倉庫の外壁（コンクリート、モルタル、ALC、窯業系サイディング）",
  specs: [
    "緻密な塗膜がカビ・藻の発生を抑制",
    "JIS Z 2911 かび抵抗性試験・藻抵抗性試験に合格",
    "遮熱性能を併せ持つ",
  ],
  lifespan: "15〜18年",
};

const PRODUCT_REFINE_1000MF_IR: ProductInfo = {
  name: "超低汚染リファイン1000MF-IR",
  description: "最高グレードの低汚染・防カビ・遮熱を兼ね備えた外壁用無機フッ素塗料",
  url: "https://astec-factory.com/mold.html",
  target: "工場・倉庫の外壁（コンクリート、モルタル、ALC、窯業系サイディング）",
  specs: [
    "緻密な無機フッ素塗膜がカビ・藻の発生を長期抑制",
    "JIS Z 2911 かび抵抗性試験・藻抵抗性試験に合格",
    "遮熱性能を併せ持つ",
  ],
  lifespan: "20〜24年",
};

const PRODUCT_MUKI_REVO1000_IR: ProductInfo = {
  name: "無機REVO1000-IR",
  description: "有機無機ハイブリッド樹脂で最高クラスの耐候性・低汚染性・遮熱性を実現した外壁用塗料",
  url: "https://astecpaints.jp/products/detail/409",
  target: "工場・倉庫の外壁（コンクリート、モルタル、ALC、金属、スレート）",
  specs: [
    "有機無機ハイブリッド樹脂で緻密かつ強靭な塗膜",
    "低汚染性＋遮熱性＋防カビ防藻性の三拍子",
    "69色展開（艶有/3分艶/艶消）",
  ],
  lifespan: "20〜22年",
};

const PRODUCT_RAS_TREINT: ProductInfo = {
  name: "ラス・トレイント",
  description: "カプセル化技術でサビを封じ込め再発を防止する防錆下塗材",
  url: "https://astec-factory.com/rust.html",
  target: "折板屋根・鉄骨・金属部材のサビ発生箇所",
  specs: [
    "複数の防錆油がサビ内部まで浸透し水と酸素を遮断",
    "塩水噴霧試験120サイクル合格",
    "施工5年経過後もサビ再発なしの実績",
  ],
  lifespan: "上塗材の耐用年数に準ずる",
};

// ===== テーマ別マッピング =====

const THEME_PRODUCT_MAPPINGS: ThemeProductMapping[] = [
  {
    themeName: "折板屋根の遮熱・塗装",
    keywords: ["折板", "折半", "金属屋根 遮熱", "金属屋根 塗装", "折板屋根", "トタン屋根"],
    products: [PRODUCT_SHANETSU_TOP_ONE, PRODUCT_FLUORINE_REVO500_IR, PRODUCT_REFINE_500MF_IR],
    writingNote: "折板屋根にはシャネツトップワンSi-JYが最適。下塗り不要で工期・コスト面の優位性を強調。",
  },
  {
    themeName: "スレート屋根の遮熱・防水・塗装",
    keywords: ["スレート", "波形スレート", "スレート屋根", "大波スレート", "小波スレート"],
    products: [PRODUCT_EC_100PCM, PRODUCT_REFINE_500MF_IR, PRODUCT_REFINE_500SI_IR],
    writingNote: "スレート屋根にはEC-100PCMが最適。防水と遮熱を1つの塗料で実現できる点を強調。ひび割れの多いスレートに600%伸縮率が有効。",
  },
  {
    themeName: "屋根の遮熱塗装（一般）",
    keywords: ["遮熱塗装", "遮熱塗料", "屋根 遮熱", "屋根 暑さ", "屋根 温度"],
    products: [PRODUCT_SHANETSU_TOP_ONE, PRODUCT_EC_100PCM, PRODUCT_REFINE_500MF_IR],
    writingNote: "屋根材に応じた最適製品を提案：折板→シャネツトップワン、スレート→EC-100PCM、長寿命重視→リファイン500MF-IR。",
  },
  {
    themeName: "暑さ対策・熱中症対策",
    keywords: ["暑さ対策", "熱中症", "暑熱", "猛暑", "工場 暑い", "倉庫 暑い", "室温 下げる", "冷房効率"],
    products: [PRODUCT_SHANETSU_TOP_ONE, PRODUCT_EC_100PCM],
    writingNote: "暑さの根本原因は屋根からの輻射熱。遮熱塗装による表面温度15〜20℃低減→室内温度2〜5℃低下→空調コスト削減の流れで説明。",
  },
  {
    themeName: "雨漏り・防水対策",
    keywords: ["雨漏り", "防水", "漏水", "雨漏", "シーリング", "コーキング", "屋根 ひび"],
    products: [PRODUCT_EC_100PCM, PRODUCT_REFINE_500MF_IR],
    writingNote: "EC-100PCMの600%伸縮率による防水性能を強調。雨漏り対策と遮熱が同時にできるコストメリットに言及。",
  },
  {
    themeName: "結露対策",
    keywords: ["結露", "結露防止", "結露対策", "天井 水滴", "屋根裏 結露"],
    products: [PRODUCT_KETSURO_NINE],
    writingNote: "ケツロナインの調湿メカニズム（吸水→放湿サイクル）を具体的に説明。30年以上の実績と不燃性を信頼性の根拠として言及。",
  },
  {
    themeName: "サビ・腐食対策",
    keywords: ["サビ", "錆", "さび", "腐食", "防錆", "錆止め", "鉄骨 劣化"],
    products: [PRODUCT_RAS_TREINT, PRODUCT_SHANETSU_TOP_ONE],
    writingNote: "ラス・トレイントのカプセル化技術でサビを封じ込める仕組みを説明。シャネツトップワンはJIS K 5674防錆性能を有し遮熱と防錆を両立。",
  },
  {
    themeName: "カビ・藻対策",
    keywords: ["カビ", "防カビ", "藻", "苔", "コケ", "汚れ", "黒ずみ"],
    products: [PRODUCT_ASTEC_PLUS_SW, PRODUCT_REFINE_1000MF_IR, PRODUCT_REFINE_1000SI_IR],
    writingNote: "アステック・プラスSWの圧倒的な対応菌種数（約2,000種）を独自性として訴求。低汚染リファインとの併用で長期的な美観維持を提案。",
  },
  {
    themeName: "外壁塗装（工場・倉庫）",
    keywords: ["外壁塗装", "外壁 塗り替え", "工場 外壁", "倉庫 外壁", "外壁 劣化"],
    products: [PRODUCT_MUKI_REVO1000_IR, PRODUCT_REFINE_1000MF_IR, PRODUCT_REFINE_1000SI_IR],
    writingNote: "工場外壁には遮熱＋低汚染の無機REVO1000-IRまたはリファイン1000シリーズを推薦。長期メンテナンスコスト削減の観点で訴求。",
  },
  {
    themeName: "屋根塗装（一般・改修）",
    keywords: ["屋根塗装", "屋根 塗り替え", "屋根 改修", "塗装 工場", "塗装 倉庫", "塗り替え 時期"],
    products: [PRODUCT_SHANETSU_TOP_ONE, PRODUCT_REFINE_500MF_IR, PRODUCT_FLUORINE_REVO500_IR],
    writingNote: "屋根材と予算に応じた製品選定の判断基準を示す：コスト重視→シャネツトップワン、長寿命→リファイン500MF-IR/フッ素REVO500-IR。",
  },
  {
    themeName: "省エネ・コスト削減",
    keywords: ["省エネ", "電気代", "光熱費", "空調 コスト", "エネルギー", "CO2削減", "脱炭素"],
    products: [PRODUCT_SHANETSU_TOP_ONE, PRODUCT_EC_100PCM],
    writingNote: "遮熱塗装による空調コスト年間10〜30%削減の試算データを活用。初期投資の回収年数にも言及。",
  },
  {
    themeName: "予算消化・修繕費用",
    keywords: ["予算消化", "修繕費", "営繕", "年度末", "予算", "稟議"],
    products: [PRODUCT_SHANETSU_TOP_ONE],
    writingNote: "シャネツトップワンの下塗り不要による低コスト性（約1,400円/m2〜）と短工期（1,000m2で10〜12日）を予算消化の文脈で訴求。",
  },
];

/**
 * キーワードと構成案からマッチするテーマを判定し、
 * 関連製品情報をプロンプト挿入用テキストとして返す
 */
export function buildProductRecommendationText(keyword: string, outline: string): string {
  const combinedText = (keyword + " " + outline).toLowerCase();

  // マッチしたテーマを収集（スコア順）
  const matchedThemes: Array<{ theme: ThemeProductMapping; score: number }> = [];

  for (const theme of THEME_PRODUCT_MAPPINGS) {
    let score = 0;
    for (const kw of theme.keywords) {
      // スペース区切りのキーワードは全単語がテキストに含まれているかチェック
      if (kw.includes(" ")) {
        const parts = kw.split(" ");
        if (parts.every((part) => combinedText.includes(part))) {
          score += 2; // 複合キーワードは高スコア
        }
      } else if (combinedText.includes(kw)) {
        score++;
      }
    }
    if (score > 0) {
      matchedThemes.push({ theme, score });
    }
  }

  if (matchedThemes.length === 0) {
    console.log("ℹ️ 製品レコメンド: マッチするテーマなし（スキップ）");
    return "";
  }

  // スコア順にソート
  matchedThemes.sort((a, b) => b.score - a.score);

  // 上位2テーマまで採用
  const selectedThemes = matchedThemes.slice(0, 2);
  const themeNames = selectedThemes.map((t) => t.theme.themeName).join("、");
  console.log("✅ 製品レコメンド: テーマ「" + themeNames + "」にマッチ");

  // 重複排除しながら製品リストを構築（最大4製品）
  const seenProducts = new Set<string>();
  const productEntries: string[] = [];
  const writingNotes: string[] = [];

  for (const { theme } of selectedThemes) {
    if (theme.writingNote) {
      writingNotes.push("- " + theme.writingNote);
    }
    for (const product of theme.products) {
      if (seenProducts.has(product.name)) continue;
      seenProducts.add(product.name);
      if (productEntries.length >= 4) break;

      const specsText = product.specs.map((s) => "  - " + s).join("\n");
      productEntries.push(
        `■ ${product.name}\n` +
        `  概要: ${product.description}\n` +
        `  対象: ${product.target}\n` +
        `  耐用年数: ${product.lifespan}\n` +
        `  主なスペック:\n${specsText}\n` +
        `  詳細: ${product.url}`
      );
    }
  }

  const productListText = productEntries.join("\n\n");
  const writingNoteText = writingNotes.length > 0
    ? "\n■ テーマ別の訴求ポイント:\n" + writingNotes.join("\n")
    : "";

  return `
【自社製品の紹介指示（重要・独自性向上）】
この記事のテーマに関連するアステックペイントの製品があります。記事内で自然な形で具体的な製品名とスペックに言及し、競合記事にはない独自性を出してください。

■ 挿入ルール：
1. 製品名は正式名称で記載すること（例：「シャネツトップワンSi-JY」）
2. 性能スペック（温度低減値、耐用年数、伸縮率など）は具体的な数値で記載
3. 押し売り的にならないよう、読者の課題解決の文脈で自然に紹介する
4. 自社サービス訴求のH2セクションでは積極的に製品名を出してよい
5. それ以外のセクションでは「例えば〜のような製品もある」「〜という選択肢もある」など控えめな表現で1〜2回言及
6. 製品詳細ページURLへの内部リンクを <a href="URL" target="_blank" rel="noopener">製品名</a> 形式で挿入すること（自社サービス訴求セクション内で1〜2個）

■ 推薦製品一覧：

${productListText}
${writingNoteText}

重要：上記に記載のない製品名を勝手に創作しないこと。上記製品のみを使用すること。
`;
}
