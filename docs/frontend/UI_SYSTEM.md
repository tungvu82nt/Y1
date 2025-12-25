
# 🎨 UI/UX Design System

Yapee 的设计语言是 "Bold, Urban, & Fast"。

## 1. Typography
- **Font**: `Plus Jakarta Sans` (Google Fonts)
- **Weights**: 
  - Regular (400): 正文
  - Bold (700): 按钮, 小标题
  - Black (900): 英雄标题, 营销文案

## 2. Color Palette (Tailwind Config)

| Token | Hex | Usage |
| :--- | :--- | :--- |
| `primary` | `#ed1d23` (Red) | Call to Actions, Highlights, Branding |
| `promotion` | `#FFF200` (Yellow) | Sale tags, Banners |
| `background-light` | `#ffffff` | Light mode background |
| `background-dark` | `#1a1a1a` | Dark mode background |
| `surface-dark` | `#2d2d2d` | Dark mode cards/modals |

## 3. Interaction Design
- **Hover Effects**: 按钮在 Hover 时会有轻微的 `scale-105` 或 `translate-x-1` 效果。
- **Active States**: 点击时使用 `active:scale-95` 提供触觉反馈。
- **Transitions**: 全局使用 `duration-200` 或 `duration-300` 保证流畅性。
- **Skeleton Loading**: 数据加载时应展示脉冲动画 (`animate-pulse`)。

## 4. Dark Mode Strategy
- 使用 Tailwind 的 `class` 策略。
- 所有的颜色定义都包含 `dark:` 前缀变体。
- **原则**: 
  - Light mode: 高对比度，白色背景，深色文字。
  - Dark mode: 柔和对比度，深灰背景 (#1a1a1a)，灰白文字，避免纯黑 (#000000) 导致的视觉疲劳。
