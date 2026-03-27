# プロジェクト概要

SEO最適化された記事構成・記事本文を自動生成するツール（factory クライアント専用カスタマイズ版）。Gemini API を軸に、競合調査・構成生成・執筆・校閲までをワンストップで処理する。

# コマンド

```bash
# 推奨: 全サーバー一括起動
bash ./start.sh

# 個別起動
npm run dev          # フロントエンド（ポート 5178）
npm run server       # スクレイピングサーバー（ポート 3002）
cd ai-article-imager-for-wordpress && npm run dev  # 画像生成エージェント（ポート 5179）

# ビルド
npm run build

# サーバー疎通確認
curl http://localhost:3002/api/health
```

# 技術スタック

| カテゴリ | 技術 |
|----------|------|
| フロントエンド | React 19, Vite 6, TypeScript, Tailwind CSS |
| バックエンド | Node.js, Express 4 |
| AI（構成・執筆・修正） | Gemini 2.5 Pro（`@google/generative-ai`） |
| AI（最終校閲） | GPT-5 / gpt-5-mini / gpt-5-nano（OpenAI Responses API） |
| AI（MoA相互検証） | Claude（`@anthropic-ai/sdk`） |
| スクレイピング | Puppeteer（開発）/ puppeteer-core + @sparticuz/chromium（本番） |
| 外部データ | Google Custom Search API, Google Drive API（ADC認証） |
| DB | Supabase |
| OCR | Tesseract.js, Sharp |
| その他 | kuromoji（形態素解析）, docx（Word出力） |

# ディレクトリ構成

```
factory-seo-article-generator/
├── App.tsx                    # メインアプリ（タブ管理・全体統合）
├── types.ts                   # グローバル型定義
├── vite.config.ts             # Vite設定（ポート5178、/api→3002プロキシ）
├── start.sh                   # 全サーバー一括起動スクリプト
├── components/                # React UIコンポーネント（32ファイル）
│   ├── ArticleWriter.tsx      # 執筆フロー全体UI（執筆・チェック・校閲）
│   ├── OutlineDisplayV2.tsx   # 構成V2表示・編集
│   ├── CompetitorResearchWebFetch.tsx  # 競合調査UI
│   ├── ArticleRevisionForm.tsx        # 修正指示UI
│   └── FrequencyWordsTab.tsx  # 頻出単語分析UI
├── services/                  # サービス層（43ファイル）
│   ├── outlineGeneratorV2.ts  # 構成V2生成（ルール定義含む）
│   ├── outlineCheckerV2.ts    # 構成V2バリデーション
│   ├── writingAgentV3.ts      # 記事執筆（Gemini 2.5 Pro + Grounding）
│   ├── writingCheckerV3.ts    # 執筆品質チェック
│   ├── articleRevisionService.ts  # 記事修正（手動ボタン後のみ）
│   ├── competitorResearchWithWebFetch.ts  # 競合調査（現行）
│   ├── driveAutoAuth.cjs      # Google Drive ADC認証（CommonJS形式）
│   └── finalProofreadingAgents/  # マルチエージェント校閲（現行）
│       ├── MultiAgentOrchestrator.ts
│       ├── IntegrationAgent.ts    # 100点満点スコア統合（75点以上で合格）
│       ├── MixtureOfAgentsVerifier.ts  # 3モデル相互検証
│       └── （専門エージェント7個＋出典エージェント3個）
├── utils/                     # ヘルパー関数（8ファイル）
├── hooks/
│   └── useImageAgent.ts       # 画像生成エージェント連携
├── server/                    # バックエンド（Express）
│   ├── scraping-server.js     # メインサーバー（SearchAPI + Puppeteer）
│   └── api/                   # 補助エンドポイント（Drive, Sheets, リンク検証）
├── ai-article-imager-for-wordpress/  # 画像生成エージェント（サブプロジェクト・ポート5179）
└── dist/                      # ビルド出力
```

# ルール・注意点

## ポート割り当て（factory専用）

| ポート | 用途 |
|--------|------|
| 5178 | メインアプリ（Vite） |
| 3002 | スクレイピングサーバー（Puppeteer + SearchAPI） |
| 5179 | 画像生成エージェント |

## コーディング

**Optional Chaining（`?.`）禁止** — Claude Code クラッシュの原因になる。段階的 null チェックに置き換える。

```typescript
// ❌ 禁止
const name = obj?.user?.name;
// ✅ 正しい
const name = obj && obj.user ? obj.user.name : undefined;
```

- Google Drive 関連の Node.js スクリプトは `.cjs` 拡張子（CommonJS形式）で記述
- 技術仕様（モデル名・ライブラリ・バージョン）を勝手に変更しない。変更が必要な場合は提案して承認を得てから実装
- コミットは明示的に指示された時のみ
- **CLAUDE.md 自動更新ルール**: コード修正時に以下に該当する変更を行った場合、CLAUDE.md も同時に更新すること（ユーザーの指示を待たない）：
  - ルール・制約・禁止事項に関わる変更
  - 処理フロー・コードパスの変更（例：関数の適用箇所変更、処理順序変更）
  - ポート番号・環境変数・外部サービス連携の変更
  - 新しい関数・サービスの追加で他の開発者が知るべきもの
  - バグ修正で「やってはいけないこと」が判明した場合

## OpenAI Responses API（GPT-5用）

```typescript
const response = await (openai as any).responses.create({
  model: 'gpt-5-mini',        // gpt-5 / gpt-5-mini / gpt-5-nano
  input: userInput,            // messages ではなく input
  tools: [{ type: 'web_search' }],
  reasoning: { effort: 'high' },
  max_completion_tokens: 4000  // max_tokens ではない
});
// temperature は GPT-5 では 1.0 固定（変更不可）
```

## 環境変数

```
GEMINI_API_KEY / VITE_GEMINI_API_KEY   # Gemini API（必須）
GOOGLE_API_KEY                         # Custom Search API（必須）
GOOGLE_SEARCH_ENGINE_ID                # カスタム検索エンジンID（必須）
OPENAI_API_KEY                         # GPT-5最終校閲用
ANTHROPIC_API_KEY                      # Claude MoA相互検証用
INTERNAL_API_KEY / VITE_INTERNAL_API_KEY
COMPANY_DATA_FOLDER_ID                 # Google DriveフォルダID
WP_BASE_URL / WP_USERNAME / WP_APP_PASSWORD  # WordPress連携
SLACK_WEBHOOK_URL
VITE_SERVICE_NAME / VITE_COMPANY_NAME  # 自社ブランド情報
```

`VITE_` プレフィックスのある変数のみブラウザ側で参照可能。

## 構成 Ver.2 ルール（絶対厳守）

- タイトル: **29〜35文字**（32文字前後が理想）、自社サービス名・【】記号を含めない
- H2見出し: 【】等記号で囲まない。「○選」等の数字があればH3は**その数と同数**で**通し番号**を付ける
- H3配分: H2ごとに「0個」または「2個以上」（**1個は禁止**）
- 最後3つのH2（固定順序）:
  1. FAQ・よくある質問（任意）
  2. **自社サービス訴求**（必須・H3を2〜3個）
  3. **まとめ**（必須・H3は0個）— 形式: `まとめ：[キーワード]を含む総括的なサブタイトル`

## 記事文字数制御

- **目標**: 5,000〜6,000文字（デフォルト5,500文字）
- `writingAgentV3.ts` の `WritingRequest.targetCharCount` で制御
- `ArticleWriter.tsx` で `characterCountAnalysis.average` を上限6,000でキャップして渡す
- プロンプトで「±10%以内、超過禁止」と明示指示
- `maxOutputTokens: 8192` でトークン上限も制限
- **1段落（`<p>`タグ）あたり最大140字**を厳守。超える場合は分割する
- **注意**: `maxOutputTokens` や `length_control`、段落文字数上限のプロンプト文言を勝手に緩和しないこと

## H2ブロック単位修正機能

### 構成案H2修正（構成生成後・執筆前）
- `services/outlineGeneratorV2.ts` の `reviseOutlineSection()` — 対象H2セクションの構成をGemini 2.5 Proで修正
- `components/OutlineDisplayV2.tsx` — 各H2ブロック下にtextarea＋「AI修正」ボタン
- `App.tsx` — `onOutlineUpdate` コールバックで構成案stateを更新

### 本文H2修正（執筆後）
- `services/articleRevisionService.ts` の `reviseArticleH2Section()` — 記事HTMLからH2セクションを正規表現で抽出→修正→再結合
- `components/ArticleWriter.tsx` — 記事プレビュー下に折りたたみ式「H2セクション単位で修正」パネル
- 修正後は `fixWordPressListBlocks()` / `fixWordPressTableBlocks()` で自動整形

## 処理フロー

```
キーワード入力
  → 競合調査（competitorResearchWithWebFetch → scraping-server）
  → 構成生成V2（outlineGeneratorV2 → outlineCheckerV2）
  → [任意] 構成案H2修正（reviseOutlineSection）
  → 執筆（writingAgentV3: Gemini 2.5 Pro + Grounding、目標5000〜6000文字）
  → 執筆チェック（writingCheckerV3）
  → [任意] 本文H2修正（reviseArticleH2Section）
  → 最終校閲マルチエージェント
      Phase 1（並列）: 7専門エージェント
      Phase 2（順次）: 出典エージェント3個
      Phase 3（統合）: IntegrationAgent（75点以上で合格）
  → 記事修正（人間確認後ボタン押下時のみ）
```

## WordPress ブロックエディタ互換 HTML（絶対厳守）

記事の箇条書き（`<ul>`/`<ol>`）は **WordPress 6.x ブロックエディタ互換フォーマット** で出力すること。
この整形処理は `writingAgentV3.ts` の `fixWordPressListBlocks()`（exportされている）で行う。**この関数を削除・無効化・簡略化してはならない。**

### 適用箇所と注意事項

- `fixWordPressListBlocks()` は `components/ArticleWriter.tsx` の `cleanupArticleContent()` 内で最終ステップとして呼ばれる。これにより**全コードパス**（執筆・修正・一括修正）で適用される
- `articleRevisionService.ts` にも `fixWordPressListBlocksRevision()` がある（サーバー側修正用）
- **V3執筆モード（`generateArticleV3`）は既にHTMLを返すため、`convertMarkdownToHtml()` を適用してはならない。** 二重変換するとリスト構造が壊れる（`\n\n` → `</p><p>` 変換、各`<li>`の個別`<ul>`ラップが発生する）

### 正しい出力フォーマット

```html
<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>塗料費</strong>：使用塗料のグレードにより変動</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>足場費</strong>：建物の高さ・形状により変動</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->
```

### 必須要件

- `<ul>` / `<ol>` には `class="wp-block-list"` を付与する
- 各 `<li>` は `<!-- wp:list-item -->` と `<!-- /wp:list-item -->` で囲む
- `<ol>` の場合は `<!-- wp:list {"ordered":true} -->` とする
- AIが生成する `<ul><li>A</li></ul><ul><li>B</li></ul>` のような**連続する単一項目リストは1つに統合**する
- `<ul><ul>` のような**二重ネストは除去**する
- 既存の不正な `wp:list` / `wp:list-item` コメントは一度すべて除去してから再構築する

### 整形関数の適用箇所

| ファイル | 関数名 | 適用タイミング |
|----------|--------|---------------|
| `services/writingAgentV3.ts` | `fixWordPressListBlocks()` | 記事執筆の最終出力時 |
| `services/articleRevisionService.ts` | `fixWordPressListBlocksRevision()` | 記事修正の最終出力時 |

## factory 専用カスタマイズ

### 記事末尾のお問い合わせフォーム

執筆エージェント（`writingAgentV3.ts`）が記事本文の末尾に以下のお問い合わせフォームを自動挿入する。**この処理を削除しないこと。**

```html
<!-- wp:heading -->
<h2 class="wp-block-heading"><strong>お問い合わせ</strong></h2>
<!-- /wp:heading -->
<!-- wp:html -->
<iframe src="https://survey.zohopublic.jp/zs/G9l6Hu" frameborder='0' style='height:700px;width:100%;' marginwidth='0' marginheight='0' scrolling='auto' allow='geolocation'></iframe>
<!-- /wp:html -->
```

### 画像生成エージェントでの除外

画像生成エージェント（`ai-article-imager-for-wordpress`）は「お問い合わせ」セクション（H2）に対して画像を生成しない。

## Google Drive ADC認証

初回セットアップ（1回のみ）:
```bash
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/drive.readonly
```

ADC認証が失敗する場合: `gcloud auth application-default login --force`

## 姉妹プロジェクト（3プロジェクト共通管理）

同一コードベースのクライアント別カスタマイズ版が3つ存在する。共通修正は必ず3プロジェクトすべてに適用すること。

| プロジェクト | フロント | バックエンド | 画像生成 |
|---|---|---|---|
| zeenb-seo-article-generator | 5180 | 3003 | 5181 |
| factory-seo-article-generator | 5178 | 3002 | 5179 |
| apaman-seo-article-generator | 5176 | 3001 | 5177 |

- バックエンドポートのハードコード箇所が多数あるため、ポート変更時はサービスファイル全体を `localhost:旧ポート` で検索して漏れなく置換すること

## WordPress ブロックエディタ互換

記事HTMLは WordPress Gutenberg 互換フォーマットで出力する。

- **リスト**: `fixWordPressListBlocks()` で `<!-- wp:list -->` + `wp-block-list` クラスに変換
- **テーブル**: `fixWordPressTableBlocks()` で `<!-- wp:table -->` + `<figure class="wp-block-table">` ラッパーに変換
- 両関数とも冪等性あり（既にブロック構造の場合も正しく処理）
- クリーンアップ処理（`cleanupArticleContent`）内で順に呼び出される

## テーブル生成ルール

- Markdown記法（`|` や `---`）は禁止。必ず `<table>` HTMLで出力
- **セル結合（rowspan/colspan）は禁止**。同じ値が複数行に跨がる場合でも各行すべてに同じ値を繰り返し記載する（WordPress エディタにセル結合機能がないため）
- テーブルスタイルは `index.css` の `.article-content table` で定義
