/**
 * 自社製品レコメンド設定（factory専用）
 *
 * 記事テーマに応じてアステックペイントの具体的な製品名を
 * 執筆プロンプトに注入し、自然な形で製品紹介を行う。
 */

import { getCurrentFacilityCategoryId, type FacilityCategoryId } from "./facilityCategoryConfig";

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
  /** 施設カテゴリ固有の補足（複数テーマにマッチしても1回だけ出力） */
  categoryNote?: string;
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

const PRODUCT_SHANETSU_TECH_II: ProductInfo = {
  name: "シャネツテックⅡSi-JY",
  description: "コストと遮熱・耐候性のバランスに優れた弱溶剤形二液屋根用遮熱シリコン塗料（低コスト志向の店舗・多店舗一括発注で採用が多い）",
  url: "https://astecpaints.jp/products/detail/54",
  target: "カラー鋼板・ガルバリウム鋼板・ステンレス・アルミなど金属屋根、波形スレート、カラーベスト、セメント瓦",
  specs: [
    "遮熱顔料＋熱放射セラミックで近赤外線を反射し屋根温度上昇を抑制",
    "16色がJIS K 5675 日射反射率試験に合格（屋根専用20色）",
    "ラジカル制御型白色顔料＋HALSで紫外線劣化を抑制、促進耐候性試験で16〜20年相当",
    "汎用シリコン塗料と同等の施工性で低コスト",
  ],
  lifespan: "13〜16年",
};

const PRODUCT_EPITECH_FILLER: ProductInfo = {
  name: "エピテックフィラーAEⅡ",
  description: "RC造・モルタル・ALC外壁の改修に使う水性形一液エポキシ系可とう形（微弾性）下地調整材。ひび割れに追従し防水性を高める",
  url: "https://astecpaints.jp/products/detail/67",
  target: "RC造（コンクリート）・モルタル・ALC・窯業系サイディングの外壁（学校・病院・老健施設・宿泊施設の改修）",
  specs: [
    "エポキシ結合の強靭な塗膜で耐久性・防水性に優れる",
    "微弾性（可とう形）でヘアクラックに追従し、ひび割れの再発を抑える",
    "JIS A 6909（可とう形改修用仕上塗材）の全性能項目に合格",
    "劣化した旧塗膜への付着力・伸長性が高く改修用に適する",
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
  {
    themeName: "RC造外壁の改修・ひび割れ補修（施設）",
    keywords: ["rc造", "rc 外壁", "鉄筋コンクリート", "ひび割れ", "クラック", "爆裂", "外壁 補修", "下地補修", "長寿命化", "陸屋根", "学校 外壁", "病院 外壁", "老人ホーム 外壁"],
    products: [PRODUCT_EPITECH_FILLER, PRODUCT_MUKI_REVO1000_IR, PRODUCT_REFINE_1000MF_IR],
    writingNote: "RC造外壁は下地補修が仕上がりと寿命を決める。エピテックフィラーAEⅡ（微弾性下地調整材）でひび割れに追従させ、上塗りは足場代を無駄にしない高耐候の無機REVO1000-IR／リファイン1000MF-IRを推薦。陸屋根防水（ウレタン塗膜防水等）との同時計画にも言及。",
  },
];

// ===== 施設カテゴリ別の製品優先順位オーバーライド =====
// 店舗: 低コスト志向でシャネツテックⅡSi-JYの採用が多い（トップワンは店舗では非採用・Loopヒアリング）
// 畜舎: 牛舎記事（astec-factory.com/info/2026/03/10/gyusha-heat/）に合わせリファイン500Si-IR/500MF-IRを優先
// 施設: RC造・陸屋根が中心のため折板屋根用トップワンを外し、外壁高耐候＋エピテックフィラーを優先

// 屋根遮熱・暑さ系テーマ（カテゴリ固有の writingNote に差し替える対象）
const ROOF_HEAT_THEMES = [
  "折板屋根の遮熱・塗装",
  "屋根の遮熱塗装（一般）",
  "暑さ対策・熱中症対策",
  "省エネ・コスト削減",
  "屋根塗装（一般・改修）",
  "予算消化・修繕費用",
];

/** writingNote からトップワンに言及する文（。区切り）を取り除く */
function stripTopOneSentences(note: string | undefined): string {
  if (!note) return "";
  return note
    .split("。")
    .filter((sentence) => sentence.indexOf("トップワン") === -1 && sentence.indexOf("下塗り不要") === -1 && sentence.trim() !== "")
    .map((sentence) => sentence + "。")
    .join("");
}

/** 製品リスト内のトップワンを置換（replacement が null なら除去）し、重複を排除する */
function swapTopOne(products: ProductInfo[], replacement: ProductInfo | null): ProductInfo[] {
  const result: ProductInfo[] = [];
  const seen = new Set<string>();
  for (const p of products) {
    const candidate = p.name === PRODUCT_SHANETSU_TOP_ONE.name ? replacement : p;
    if (!candidate) continue;
    if (seen.has(candidate.name)) continue;
    seen.add(candidate.name);
    result.push(candidate);
  }
  return result;
}


function applyCategoryOverride(theme: ThemeProductMapping, categoryId: FacilityCategoryId): ThemeProductMapping {
  if (categoryId === "factory") return theme;
  const isRoofHeatTheme = ROOF_HEAT_THEMES.indexOf(theme.themeName) !== -1;

  if (categoryId === "store") {
    // 全テーマでトップワン→シャネツテックⅡに置換
    const products = swapTopOne(theme.products, PRODUCT_SHANETSU_TECH_II);
    if (!isRoofHeatTheme) {
      return { themeName: theme.themeName, keywords: theme.keywords, products, writingNote: stripTopOneSentences(theme.writingNote) || undefined };
    }
    // 屋根遮熱・暑さ系はシャネツテックⅡを先頭に
    const ordered = [PRODUCT_SHANETSU_TECH_II].concat(products.filter((p) => p.name !== PRODUCT_SHANETSU_TECH_II.name));
    return {
      themeName: theme.themeName,
      keywords: theme.keywords,
      products: ordered,
      categoryNote: "店舗（折板屋根1,000〜2,000㎡）ではコストバランスに優れるシャネツテックⅡSi-JYを第一候補として推薦。効果は室温ではなく空調電力コスト・CO2削減の投資回収として説明する。",
      writingNote: stripTopOneSentences(theme.writingNote) || undefined,
    };
  }

  if (categoryId === "livestock") {
    const products = swapTopOne(theme.products, PRODUCT_REFINE_500SI_IR);
    if (!isRoofHeatTheme) {
      return { themeName: theme.themeName, keywords: theme.keywords, products, writingNote: stripTopOneSentences(theme.writingNote) || undefined };
    }
    const rest = products.filter((p) => p.name !== PRODUCT_REFINE_500SI_IR.name && p.name !== PRODUCT_REFINE_500MF_IR.name);
    return {
      themeName: theme.themeName,
      keywords: theme.keywords,
      products: [PRODUCT_REFINE_500SI_IR, PRODUCT_REFINE_500MF_IR].concat(rest),
      categoryNote: "畜舎屋根には超低汚染リファイン500Si-IR（コスト重視）／500MF-IR（長寿命重視）を推薦。屋根表面温度 最大18.6℃・屋根裏6.1℃低減（自社試験）を家畜の暑熱ストレス軽減の文脈で説明する。",
      writingNote: stripTopOneSentences(theme.writingNote) || undefined,
    };
  }

  // facility
  if (theme.themeName === "外壁塗装（工場・倉庫）") {
    return {
      themeName: "外壁塗装（施設・RC造）",
      keywords: theme.keywords,
      products: [PRODUCT_EPITECH_FILLER, PRODUCT_MUKI_REVO1000_IR, PRODUCT_REFINE_1000MF_IR],
      writingNote: "RC造外壁はエピテックフィラーAEⅡで下地調整し、足場代を無駄にしない高耐候の無機REVO1000-IR／リファイン1000MF-IRで長寿命化する流れで説明する。",
    };
  }
  const products = swapTopOne(theme.products, null);
  if (!isRoofHeatTheme) {
    return {
      themeName: theme.themeName,
      keywords: theme.keywords,
      products: products.length > 0 ? products : [PRODUCT_RAS_TREINT],
      writingNote: stripTopOneSentences(theme.writingNote) || undefined,
    };
  }
  return {
    themeName: theme.themeName,
    keywords: theme.keywords,
    products: products.length > 0 ? products : [PRODUCT_REFINE_500MF_IR, PRODUCT_FLUORINE_REVO500_IR],
    categoryNote: "施設はRC造・陸屋根が中心のため、折板屋根前提の製品訴求は避ける。体育館（瓦棒屋根）や金属屋根部分に限って高耐候の遮熱塗料を提案し、陸屋根は防水改修と組み合わせて説明する。",
      writingNote: stripTopOneSentences(theme.writingNote) || undefined,
  };
}

function getThemeMappings(categoryId: FacilityCategoryId): ThemeProductMapping[] {
  return THEME_PRODUCT_MAPPINGS.map((t) => applyCategoryOverride(t, categoryId));
}

/**
 * キーワードと構成案からマッチするテーマを判定し、
 * 関連製品情報をプロンプト挿入用テキストとして返す
 */
export function buildProductRecommendationText(keyword: string, outline: string): string {
  const combinedText = (keyword + " " + outline).toLowerCase();
  const categoryId = getCurrentFacilityCategoryId();
  const themeMappings = getThemeMappings(categoryId);

  // マッチしたテーマを収集（スコア順）
  const matchedThemes: Array<{ theme: ThemeProductMapping; score: number }> = [];

  for (const theme of themeMappings) {
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

  let categoryNoteText = "";
  for (const { theme } of selectedThemes) {
    if (theme.categoryNote && !categoryNoteText) {
      categoryNoteText = "- " + theme.categoryNote;
    }
    if (theme.writingNote && writingNotes.indexOf("- " + theme.writingNote) === -1) {
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
  const firstProductName = selectedThemes[0].theme.products.length > 0 ? selectedThemes[0].theme.products[0].name : "シャネツトップワンSi-JY";
  const allNotes = (categoryNoteText ? [categoryNoteText] : []).concat(writingNotes);
  const writingNoteText = allNotes.length > 0
    ? "\n■ テーマ別の訴求ポイント:\n" + allNotes.join("\n")
    : "";

  return `
【自社製品の紹介指示（重要・独自性向上）】
この記事のテーマに関連するアステックペイントの製品があります。記事内で自然な形で具体的な製品名とスペックに言及し、競合記事にはない独自性を出してください。

■ 挿入ルール：
1. 製品名は正式名称で記載すること（例：「${firstProductName}」）
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
