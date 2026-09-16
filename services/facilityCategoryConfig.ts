/**
 * 施設カテゴリ設定（factory専用）
 *
 * 工場営繕サイト（astec-factory.com）の業種別LPに対応する4カテゴリを定義し、
 * 構成生成・執筆・修正・キーワード選定の各プロンプトに注入する
 * 「掲載メディアの文脈」「ターゲット読者」「訴求軸」「禁止表現」を切り替える。
 *
 * 出典: Loop「260703_業種別LPヒアリング」「260714_企画書｜業種別LP」、
 *       astec-factory.com/industry/{chikusha,store,facility}.html
 * 詳細メモ: docs/CATEGORY_PERSONAS.md
 *
 * 現在選択中のカテゴリはモジュール変数で保持し（App.tsx のタブで設定）、
 * 各サービスは引数省略時に getCurrentFacilityCategory() を参照する。
 * ※ 関数シグネチャを増やさないため（姉妹プロジェクトとの同期を壊さない）
 */

export type FacilityCategoryId = "factory" | "livestock" | "store" | "facility";

export interface FacilityCategory {
  id: FacilityCategoryId;
  /** タブ表示名 */
  label: string;
  /** 文中で使う短い呼称（例:「工場・倉庫」） */
  shortLabel: string;
  /** 施設種別の列挙（例:「牛舎・豚舎・鶏舎」） */
  facilityWords: string[];
  /** 掲載先メディアの説明 */
  mediaDescription: string;
  /** ターゲット読者（1行） */
  audience: string;
  /** 該当する業種別サービスページURL（内部リンク先） */
  servicePageUrl: string;
  /** 建物・工事特性 */
  buildingTraits: string[];
  /** ニーズ優先順（高い順） */
  needsPriority: string[];
  /** 意思決定プロセス */
  decisionProcess: string[];
  /** 響く訴求（構成・執筆で優先的に盛り込む） */
  keyAppeals: string[];
  /** 弱い／避ける訴求・文脈 */
  weakOrForbidden: string[];
  /** 使える導入事例（断定できる範囲） */
  cases: string[];
  /** キーワードに施設種別が無いときに補う語（例:「工場」「倉庫」） */
  defaultFacilityTerms: string[];
  /** キーワード選定タブの対象ドメイン文 */
  keywordDomain: string;
  /** 自社サービス訴求H2の例 */
  serviceH2Example: string;
  /** キーワード入力欄のプレースホルダー例 */
  keywordPlaceholder: string;
  /** キーワード選定タブのテーマ入力例 */
  themePlaceholder: string;
  /** 暑さ関連キーワード時の補足（カテゴリ別の暑さの意味づけ） */
  heatSteeringNote: string;
  /** タブの色（Tailwind クラス） */
  activeColorClass: string;
}

const COMMON_STRENGTHS = [
  "遮熱塗料シェアNo.1の塗料メーカー（直接施工はせず、全国約3,700社の認定施工店を紹介）",
  "年間3,000棟以上の採用実績",
  "塗装・板金・防水・雨漏り・塗床の一括対応",
  "調査報告書・見積書・稟議（決裁）資料の作成サポート",
];

const COMMON_FORBIDDEN = [
  "戸建て住宅・アパート・マンション・オフィスビル向けの表現（「マンションオーナー」「大規模修繕」「修繕積立金」「入居者」「管理組合」等）",
  "アステックペイントが直接施工するように読める表現（「アステックペイントが施工」「自社施工」「一貫施工」等）",
  "駐車場ライン引き・アスファルト舗装の訴求、無料テスト施工、工事中の安全対策、瑕疵保険・保証内容の記載",
];

export const FACILITY_CATEGORIES: Record<FacilityCategoryId, FacilityCategory> = {
  factory: {
    id: "factory",
    label: "工場・倉庫",
    shortLabel: "工場・倉庫",
    facilityWords: ["工場", "倉庫", "物流センター", "食品工場"],
    mediaDescription:
      "工場・倉庫の外壁塗装・屋根塗装・改修の専門メディア（アステックペイント運営・工場営繕サイト）",
    audience: "工場・倉庫のオーナー、設備・保全・営繕・総務担当者、経営者",
    servicePageUrl: "https://astec-factory.com/",
    buildingTraits: [
      "鉄骨造・折板屋根または波形スレート屋根が中心",
      "天井のない開放空間が多く、屋根からの輻射熱が室温に直結する",
    ],
    needsPriority: [
      "暑さ対策（作業員の熱中症・空調コスト）",
      "雨漏り・防水",
      "結露・サビ・老朽化",
      "予算消化・稟議のしやすさ",
    ],
    decisionProcess: ["設備・保全担当者が起案し、総務・経営層が決裁する"],
    keyAppeals: [
      "屋根遮熱塗装による表面温度15〜20℃低減・室温2〜5℃低下・空調コスト削減",
      "操業を止めない工事計画",
      "雨漏りと遮熱を同時に解決する防水遮熱塗装",
    ],
    weakOrForbidden: [],
    cases: [
      "住化ロジスティクス株式会社（倉庫屋根の遮熱塗装で最大6℃低下）",
      "A社・福岡県大川市（屋根遮熱防水塗装で雨漏り解消・熱中症対策）",
      "醤油工場（タンク防カビ塗装、3年9か月カビ再発なし）",
    ],
    defaultFacilityTerms: ["工場", "倉庫"],
    keywordDomain: "工場・倉庫の外壁塗装・屋根塗装・改修",
    serviceH2Example: "アステックペイントの工場向け遮熱塗装という選択肢",
    keywordPlaceholder: "例: 「工場 屋根 遮熱塗装 費用」",
    themePlaceholder: "例: 工場 遮熱塗装（記事にしたい大まかな領域を入力）",
    heatSteeringNote:
      "工場・倉庫では屋根からの輻射熱が作業環境と空調コストに直結する。作業員の熱中症対策と電力コスト削減の両面から遮熱塗装を根本対策として位置づける。",
    activeColorClass: "bg-slate-700 text-white shadow-md",
  },

  livestock: {
    id: "livestock",
    label: "畜舎",
    shortLabel: "畜舎",
    facilityWords: ["牛舎", "豚舎", "鶏舎", "畜舎", "飼料タンク"],
    mediaDescription:
      "畜舎（牛舎・豚舎・鶏舎・飼料タンク等）の暑熱対策・改修の専門メディア（アステックペイント運営・工場営繕サイト）",
    audience: "畜産農家・農業法人の経営者、畜舎の施設担当者",
    servicePageUrl: "https://astec-factory.com/industry/chikusha.html",
    buildingTraits: [
      "折板屋根・スレート屋根の平屋が中心。屋根表面温度は夏季に70℃を超える",
      "家畜がいるため防疫（バイオセキュリティ）を守りながら工事する必要がある",
      "飼料タンクの遮熱・防カビ需要もある",
    ],
    needsPriority: [
      "暑熱ストレスによる家畜の生産性低下（乳量・増体・産卵率・受胎率）",
      "屋根・外壁の老朽化と雨漏り",
      "結露・カビ・アンモニアによる腐食",
      "光熱費（換気・冷房）の削減",
    ],
    decisionProcess: ["経営者本人が判断することが多い。費用対効果と実測データを重視する"],
    keyAppeals: [
      "屋根遮熱塗装で屋根表面温度を最大18.6〜20℃、屋根裏温度を6℃以上低減（自社試験）",
      "温湿度指数（THI）と乳量・受胎率の関係など、公的研究機関のデータで裏付ける",
      "石灰塗布・屋根散水など低コスト対策との比較で、中長期の費用対効果を示す",
      "防疫に配慮した工事計画、結露防止塗装、タンク遮熱・防カビ塗装",
    ],
    weakOrForbidden: [
      "工場の生産ラインや作業員を主語にした記述（読者は畜産農家）",
    ],
    cases: [
      "K社・島根県・畜産業（2018年6月、折板屋根への遮熱塗装で暑熱対策）",
      "住化ロジスティクス株式会社（倉庫屋根の遮熱塗装で最大6℃低下）※他業種事例として引用",
    ],
    defaultFacilityTerms: ["畜舎", "牛舎"],
    keywordDomain: "畜舎（牛舎・豚舎・鶏舎）の暑熱対策・屋根遮熱塗装・外壁塗装・改修",
    serviceH2Example: "アステックペイントの畜舎向け屋根遮熱塗装という選択肢",
    keywordPlaceholder: "例: 「牛舎 暑熱対策 屋根」",
    themePlaceholder: "例: 牛舎 暑熱対策（記事にしたい大まかな領域を入力）",
    heatSteeringNote:
      "畜舎では暑さ＝家畜の暑熱ストレス（乳量・増体・産卵率・受胎率の低下、死亡リスク）として扱う。屋根遮熱を根本対策とし、送風機・散水・石灰塗布との併用・比較で説明する。",
    activeColorClass: "bg-green-700 text-white shadow-md",
  },

  store: {
    id: "store",
    label: "店舗",
    shortLabel: "店舗・量販店",
    facilityWords: [
      "店舗",
      "量販店",
      "ドラッグストア",
      "スーパー",
      "ディスカウントストア",
      "ホームセンター",
      "飲食店",
    ],
    mediaDescription:
      "店舗・量販店（ドラッグストア・スーパー・ディスカウントストア・ホームセンター・飲食チェーン）の修繕・改修の専門メディア（アステックペイント運営・工場営繕サイト）",
    audience:
      "複数店舗を展開する企業の本部設備・保全担当者（優先）、店舗責任者、単独オーナー店舗の経営者",
    servicePageUrl: "https://astec-factory.com/industry/store.html",
    buildingTraits: [
      "1,000〜2,000㎡の折板屋根がほとんど。自社所有8割・貸店舗2割",
      "全館空調・天井ありのため「暑さそのもの」は主訴にならない。屋根遮熱の価値は空調電力コスト削減に置き換えて伝える",
      "雨漏りは売上に直結するためすぐ対処されており、主訴になりにくい",
    ],
    needsPriority: [
      "空調電力コスト削減（大手はCN宣言・店舗CO2削減が会社目標）",
      "天井結露によるカビ対策",
      "美観・ブランドイメージ（集客・求人にも関係）",
      "多店舗の一括発注・業者選定の手間削減",
    ],
    decisionProcess: [
      "本社の設備・保全担当がニーズの大きい店舗から優先的に工事を計画（例: まいばすけっと・キリン堂・サイゼリヤ）",
      "店舗責任者が保全を担い、本社へ申請を上げるパターンもある",
      "悩みは「気になっているが後回し」になりがち。後回しのコスト（電気代・カビ再発）を示す",
    ],
    keyAppeals: [
      "遮熱塗装＝電気代・CO2削減の「投資回収」として説明（回収年数・年間削減率の試算）",
      "天井結露→カビの根本対策（結露防止塗装・防カビ塗装）",
      "多店舗一括発注によるディスカウント・工程調整（記載OK）",
      "稟議資料サポート、認定施工店ネットワークによる全国対応、塗装・板金・防水・塗床の一括対応",
      "低コスト志向に合う屋根用遮熱塗料（シャネツテックⅡSi-JY）",
    ],
    weakOrForbidden: [
      "「暑くて従業員がつらい」「雨漏りで困っている店舗」を主訴にする構成",
      "営業しながら施工できることの強調（当然視されるため訴求にならない）",
      "店舗での空調費削減実績を断定すること（実績は未保有。倉庫事例で代替し「店舗でも同様の効果が期待できる」に留める）",
    ],
    cases: [
      "住化ロジスティクス株式会社（倉庫屋根の遮熱塗装で最大6℃低下）※折板屋根の類似事例として引用",
      "醤油工場（タンク防カビ塗装、3年9か月カビ再発なし）※防カビの類似事例として引用",
    ],
    defaultFacilityTerms: ["店舗", "量販店"],
    keywordDomain: "店舗・量販店（ドラッグストア・スーパー・ホームセンター・飲食チェーン等）の屋根塗装・外壁塗装・結露カビ対策・改修",
    serviceH2Example: "アステックペイントの店舗向け遮熱塗装で電気代とCO2を削減する選択肢",
    keywordPlaceholder: "例: 「店舗 屋根 遮熱塗装 電気代」",
    themePlaceholder: "例: 店舗 空調 電気代 削減（記事にしたい大まかな領域を入力）",
    heatSteeringNote:
      "店舗は全館空調のため読者は「暑さ」ではなく「空調電力コスト」「CO2削減目標」で動く。遮熱塗装の効果は室温ではなく電気代削減・投資回収・CN対応として説明し、「暑くて困る」を主訴にしない。",
    activeColorClass: "bg-orange-600 text-white shadow-md",
  },

  facility: {
    id: "facility",
    label: "施設",
    shortLabel: "施設（私立学校・老健施設（老人ホーム）・病院・宿泊施設）",
    facilityWords: ["私立学校", "老健施設", "老人ホーム", "病院", "宿泊施設", "体育館"],
    mediaDescription:
      "施設（私立学校・老健施設（老人ホーム）・病院・宿泊施設）の修繕・改修の専門メディア（アステックペイント運営・工場営繕サイト）。公立学校・自治体の公共工事は対象外",
    audience:
      "私立学校・老健施設（老人ホーム）・病院・宿泊施設の決裁者（理事長・会長・院長・オーナー等）と施設管理・総務担当者",
    servicePageUrl: "https://astec-factory.com/industry/facility.html",
    buildingTraits: [
      "RC造（鉄筋コンクリート）メイン・陸屋根。体育館は瓦棒屋根",
      "外壁のひび割れ・爆裂・シーリング劣化、陸屋根の防水層劣化が典型的な症状",
      "足場代が大きいため、塗り替え周期を延ばせる高耐候塗料・高耐候シーリングが選ばれる",
    ],
    needsPriority: [
      "老朽化（長寿命化・安全対策：外壁の剥落・落下防止）",
      "雨漏り（陸屋根・外壁からの漏水）",
      "美観（施設のイメージ・入居者・保護者・患者への印象）",
      "学校は「廊下が暑い」など暑さ対策需要もある",
    ],
    decisionProcess: [
      "病院・老人ホームは修繕計画に沿った計画修繕型。数年先の工事に向けて調査し業者を選定する",
      "学校は修繕計画がなく都度対応が多い。予算を出して都度判断する",
      "悩みの発生源は現場担当者と法人本部の両方。決裁者の名称は施設ごとに異なるため「決裁者」で統一する",
    ],
    keyAppeals: [
      "RC造の傷み具合を評価する「調査報告書」（決裁資料としてそのまま使える）",
      "補助金・助成金の活用（私立学校施設整備費補助金・空調設備整備臨時特例交付金など。制度名・対象・補助率は必ず最新の一次情報で確認して記載）",
      "足場代を無駄にしない高耐候塗料（無機・フッ素）と高耐候シーリングによる長寿命化",
      "ひび割れ追従性のある弾性フィラー（エピテックフィラーAEⅡ）による下地補修",
      "陸屋根の防水改修（ウレタン塗膜防水・シート防水等）と外壁改修の同時計画",
    ],
    weakOrForbidden: [
      "公立学校・自治体・公共工事を読者にする記述",
      "鉄骨折板屋根前提の記述（施設はRC造・陸屋根が中心）",
      "工事中の安全対策の詳細・瑕疵保険や保証内容の記載",
    ],
    cases: [
      "A社・福岡県大川市（屋根遮熱防水塗装で雨漏り解消）※雨漏り解消の類似事例として引用",
      "住化ロジスティクス株式会社（屋根遮熱で最大6℃低下）※他業種事例として引用。施設固有の事例は現時点で未掲載のため断定的な施設実績を書かない",
    ],
    defaultFacilityTerms: ["私立学校", "病院", "老人ホーム"],
    keywordDomain: "施設（私立学校・老健施設（老人ホーム）・病院・宿泊施設）のRC造外壁改修・陸屋根防水・塗装・長寿命化",
    serviceH2Example: "アステックペイントの施設向け長寿命化改修という選択肢",
    keywordPlaceholder: "例: 「私立学校 外壁 ひび割れ 補修」",
    themePlaceholder: "例: 病院 外壁改修（記事にしたい大まかな領域を入力）",
    heatSteeringNote:
      "施設（特に学校）では「廊下や体育館が暑い」など利用者の安全・快適性が主訴になる。RC陸屋根・瓦棒屋根への遮熱塗装や遮熱防水を、老朽化改修と同時に行うメリットとして説明する。",
    activeColorClass: "bg-indigo-700 text-white shadow-md",
  },
};

export const FACILITY_CATEGORY_ORDER: FacilityCategoryId[] = [
  "factory",
  "livestock",
  "store",
  "facility",
];

const STORAGE_KEY = "facilityCategory";

function isValidCategoryId(value: unknown): value is FacilityCategoryId {
  return (
    value === "factory" ||
    value === "livestock" ||
    value === "store" ||
    value === "facility"
  );
}

function readStoredCategory(): FacilityCategoryId {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isValidCategoryId(stored)) return stored;
    }
  } catch (e) {
    // localStorage が使えない環境では既定値
  }
  return "factory";
}

// 現在選択中のカテゴリ（App.tsx のタブで設定。既定は工場・倉庫）
let currentCategoryId: FacilityCategoryId = readStoredCategory();

export function setCurrentFacilityCategory(id: FacilityCategoryId): void {
  currentCategoryId = id;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  } catch (e) {
    // 保存失敗は無視
  }
  console.log(`🏭 施設カテゴリを切替: ${FACILITY_CATEGORIES[id].label}`);
}

export function getCurrentFacilityCategoryId(): FacilityCategoryId {
  return currentCategoryId;
}

export function getCurrentFacilityCategory(): FacilityCategory {
  return FACILITY_CATEGORIES[currentCategoryId];
}

export function getFacilityCategory(id?: FacilityCategoryId): FacilityCategory {
  return id ? FACILITY_CATEGORIES[id] : getCurrentFacilityCategory();
}

/** 他カテゴリの施設語（キーワードが別カテゴリを明示している場合の検出用） */
function otherCategoryFacilityWords(cat: FacilityCategory): string[] {
  const words: string[] = [];
  for (const id of FACILITY_CATEGORY_ORDER) {
    if (id === cat.id) continue;
    for (const w of FACILITY_CATEGORIES[id].facilityWords) {
      if (cat.facilityWords.indexOf(w) === -1) words.push(w);
    }
  }
  return words;
}

function bulletList(items: string[]): string {
  return items.map((s) => `- ${s}`).join("\n");
}

/**
 * 構成生成（outlineGeneratorV2）用：【掲載メディアの文脈（絶対厳守）】ブロック
 */
export function buildOutlineMediaContext(id?: FacilityCategoryId): string {
  const cat = getFacilityCategory(id);
  const others = otherCategoryFacilityWords(cat);
  return `【掲載メディアの文脈（絶対厳守）】
- 掲載先: ${cat.mediaDescription}
- ターゲット読者: ${cat.audience}
- タイトル・見出し・執筆メモは必ず「${cat.shortLabel}」の文脈で作成すること
- キーワードに施設種別が含まれない場合（例:「遮熱塗料」のみ）は「${cat.defaultFacilityTerms.join("・")}」の文脈で構成すること
- キーワードが別の施設種別（${others.slice(0, 6).join("・")}等）を明示している場合のみ、その施設の文脈に合わせてよい

【このカテゴリの読者理解（構成に反映すること）】
■ 建物・工事特性
${bulletList(cat.buildingTraits)}
■ ニーズの優先順（高い順。H2の並び・タイトルの切り口はこの順を尊重する）
${bulletList(cat.needsPriority)}
■ 意思決定プロセス
${bulletList(cat.decisionProcess)}
■ 響く訴求（自社サービス訴求H2・writingNote に盛り込む）
${bulletList(cat.keyAppeals)}
■ 共通の強み
${bulletList(COMMON_STRENGTHS)}
■ 使える導入事例（これ以外の事例を創作しない）
${bulletList(cat.cases)}

【禁止（タイトル・見出し・執筆メモで使わない）】
${bulletList(COMMON_FORBIDDEN.concat(cat.weakOrForbidden))}

【内部リンク候補】
- 業種別サービスページ: ${cat.servicePageUrl}（自社サービス訴求H2の writingNote に「このページへの内部リンクを1箇所入れる」と記載）`;
}

/**
 * 執筆（writingAgentV3）用：WRITING_INSTRUCTIONS の直後に注入するカテゴリ文脈ブロック
 * WRITING_INSTRUCTIONS 内の audience 指定より優先させる。
 */
export function buildWritingCategoryContext(id?: FacilityCategoryId): string {
  const cat = getFacilityCategory(id);
  return `【施設カテゴリ文脈（最優先・上記 audience 指定を上書き）】
- 掲載先: ${cat.mediaDescription}
- 読者: ${cat.audience}
- 本文の主語・具体例・数値は必ず「${cat.shortLabel}」の文脈に揃える。キーワードに施設種別が無い場合は「${cat.defaultFacilityTerms.join("・")}」を想定する
■ 読者の建物・工事特性
${bulletList(cat.buildingTraits)}
■ 読者のニーズ優先順（本文で先に答える順）
${bulletList(cat.needsPriority)}
■ 意思決定の実態（「次の一歩」の提案はこれに合わせる）
${bulletList(cat.decisionProcess)}
■ 自社サービス訴求・まとめで使う訴求
${bulletList(cat.keyAppeals)}
■ 使える導入事例（これ以外の事例・数値を創作しない。他業種事例は「※工場・倉庫での事例」等と明記）
${bulletList(cat.cases)}
■ 禁止
${bulletList(COMMON_FORBIDDEN.concat(cat.weakOrForbidden))}
■ 内部リンク（必須・1箇所）
自社サービス訴求H2内の自然な文脈で、業種別サービスページへリンクする:
<a href="${cat.servicePageUrl}" target="_blank" rel="noopener">${cat.shortLabel}の修繕・改修工事について詳しく見る</a>
■ まとめのOK例（カテゴリ版）
「アステックペイントは、遮熱塗料シェアNo.1の塗料メーカーとして、全国の${cat.shortLabel}を含む施工実績が豊富な認定施工店と連携し、建物ごとに最適な塗料選定と工事をご提案しています。小さなお悩みでもお気軽にご相談ください。」`;
}

/**
 * 記事修正（articleRevisionService）用：読者定義の短いブロック
 */
export function buildRevisionCategoryContext(id?: FacilityCategoryId): string {
  const cat = getFacilityCategory(id);
  return `【施設カテゴリ文脈（最優先）】
- 読者: ${cat.audience}
- 本文の主語・具体例は「${cat.shortLabel}」の文脈に揃える
- 禁止: ${COMMON_FORBIDDEN.concat(cat.weakOrForbidden).join("／")}`;
}

/**
 * キーワード選定（strategicKeywordService）用：対象ドメイン文
 */
export function getKeywordDomain(id?: FacilityCategoryId): string {
  const cat = getFacilityCategory(id);
  return cat.keywordDomain;
}

/**
 * まとめH2の writingNote（構成生成用）
 */
export function buildSummaryWritingNote(id?: FacilityCategoryId): string {
  const cat = getFacilityCategory(id);
  return `記事要点を3-5点で総括し、最後にアステックペイントの${cat.shortLabel}向け塗装・改修サービスへの問い合わせを自然に案内する（記事テーマの延長線上で）`;
}
