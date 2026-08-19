# quiz-web-system

ライブクイズをホストする Web システムです。

## 構成

- `client` … Next.js フロントエンド
- `server` … Express + Prisma + Socket.IO API

## セットアップ

Node.js 22 以降と [pnpm](https://pnpm.io/) 11 が必要です。

### 1. 依存関係

```bash
pnpm install
```

### 2. データベース

```bash
docker compose up -d postgres_db
```

`server/.env` を `server/.env.example` から作成し、`DATABASE_URL` を設定してください。

```bash
pnpm --filter ./server prisma:deploy
```

### 3. 環境変数

- サーバー: `server/.env.example` を参照
- クライアント: `client/.env.example` を参照

### 4. 開発サーバー

```bash
pnpm dev
```

- 参加者: http://localhost:3000
- 管理画面: http://localhost:3000/admin/create
- API ドキュメント: http://localhost:4000/docs

## 使い方

1. 管理画面でセッションを作成
2. 参加者がセッションコードと名前で参加（再接続コードは自動発行）
3. 管理パネルで問題を編集し、状態を進行
4. `/admin/{id}/screen` で会場投影

## 本番ビルド

```bash
pnpm build
pnpm start
```

Docker Compose の `server` サービスは API のみを起動します。クライアントは別途デプロイしてください。
