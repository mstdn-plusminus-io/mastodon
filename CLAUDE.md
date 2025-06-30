# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

これは、Mastodonのフォークリポジトリです。以下の追加・変更機能があります：

- 投稿文字数制限を5000文字に増加
- SlackライクなUI
- GitHub Flavored Markdownのサポート（実験的）
- Cloudflare Turnstileによるサインアップ保護
- リモートメディアキャッシュの有効/無効設定

## 開発環境のセットアップ

### 前提条件
- Ruby 3.0.x
- Node.js 16.x
- Yarn 1.22.x
- PostgreSQL
- Redis

### 初期セットアップ
```bash
# 依存関係のインストール
yarn bootstrap

# Docker環境の起動（データベース等）
yarn docker:dev up -d

# 環境設定ファイルの準備
cp .env.sample .env

# データベースのマイグレーション
rails db:migrate

# DynamoDBテーブルの作成（必要な場合）
yarn dynamo:create
```

## よく使うコマンド

### 開発サーバーの起動
```bash
# Foremanを使用してすべてのプロセスを起動
yarn watch

# または個別に起動
bundle exec rails server              # Railsサーバー
bundle exec sidekiq -c 10             # バックグラウンドジョブ
yarn start                            # ストリーミングサーバー
bin/webpack-dev-server                # Webpack開発サーバー
```

### ビルド
```bash
# 開発環境用ビルド
yarn build:development

# 本番環境用ビルド  
yarn build:production
```

### テスト実行
```bash
# すべてのテスト（リント、型チェック、Jest）
yarn test

# RSpecテスト
bundle exec rspec

# 特定のRSpecテストファイルを実行
bundle exec rspec spec/path/to/test_spec.rb

# システムスペック（ブラウザテスト）を実行
RUN_SYSTEM_SPECS=true bundle exec rspec spec/system

# 検索関連のスペックを実行
RUN_SEARCH_SPECS=true bundle exec rspec spec/search
```

### リント・フォーマット
```bash
# JavaScriptのリント
yarn lint:js

# JavaScriptの自動修正
yarn fix:js

# Rubyのリント
bundle exec rubocop

# Rubyの自動修正
bundle exec rubocop -a

# すべてのファイルをリント
yarn lint

# すべてのファイルを自動修正
yarn fix
```

### 型チェック
```bash
yarn typecheck
```

## アーキテクチャの概要

### バックエンド（Ruby on Rails）

主要なディレクトリ構造：
- `app/controllers/` - Webリクエストを処理するコントローラー
- `app/models/` - データモデル（ActiveRecord）
- `app/services/` - ビジネスロジックを含むサービスクラス
- `app/workers/` - Sidekiqによる非同期ジョブ
- `app/lib/` - 共通ライブラリ・ユーティリティ
- `app/policies/` - 認可ロジック（Pundit）
- `app/serializers/` - API用のシリアライザー
- `app/validators/` - カスタムバリデーター

主要なモデル：
- `Account` - ユーザーアカウント（ローカル・リモート両方）
- `Status` - 投稿（トゥート）
- `User` - ローカルユーザーの認証情報
- `Follow` - フォロー関係
- `Notification` - 通知

### フロントエンド（React/Redux）

- `app/javascript/mastodon/` - Reactアプリケーションのルート
- `app/javascript/mastodon/components/` - 再利用可能なコンポーネント
- `app/javascript/mastodon/features/` - 機能ごとのコンポーネント
- `app/javascript/mastodon/actions/` - Reduxアクション
- `app/javascript/mastodon/reducers/` - Reduxレデューサー
- `app/javascript/mastodon/locales/` - 国際化ファイル

### ストリーミングサーバー（Node.js）

- `streaming/index.js` - WebSocketによるリアルタイム更新を処理

### API

MastodonはRESTful APIとActivityPub（分散型ソーシャルネットワークのプロトコル）を実装しています。

- `/api/v1/` - クライアントAPI
- `/api/v2/` - 新しいバージョンのAPI
- ActivityPubエンドポイント - 他のインスタンスとの通信用

### バックグラウンドジョブ

Sidekiqを使用して以下のような処理を非同期で実行：
- メディアファイルの処理
- 通知の送信
- ActivityPubの配信
- メールの送信

### データベース

PostgreSQLを使用。主要なテーブル：
- `accounts` - アカウント情報
- `statuses` - 投稿
- `users` - ユーザー認証情報
- `follows` - フォロー関係
- `notifications` - 通知

### キャッシュとセッション

Redisを使用：
- セッション管理
- キャッシュ
- Sidekiqのジョブキュー
- ストリーミングサーバーのPub/Sub

## 開発時の注意点

1. マイグレーションを追加する際は`strong_migrations`を使用してパフォーマンスへの影響を確認
2. 新しいAPIエンドポイントは適切なシリアライザーを使用
3. フロントエンドの変更時は国際化（i18n）を考慮
4. ActivityPubの実装を変更する際は他のインスタンスとの互換性を確認
5. このフォークの独自機能（5000文字制限等）を考慮した実装