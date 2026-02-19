# Contributing to FaasJS

Thanks for contributing to FaasJS.

This project uses a GitHub-first workflow:

`Discussion -> Issue -> Pull Request -> Review -> Merge`

## Quick Start

1. Check existing issues before creating a new one.
2. Create an issue with the proper template (`Bug` or `Feature`).
3. Create a branch from `main`.
4. Open a PR that links the issue (`Closes #123`).
5. Wait for CI + review, then merge with **squash**.

## Issue Guidelines

- Use issue templates and fill all required sections.
- Keep one issue focused on one problem or feature.
- Include reproducible steps for bugs.
- Include acceptance criteria for features.
- Security issues: use [SECURITY.md](./SECURITY.md) guidance.

## Branch Naming

- `feat/<feature-name>`
- `fix/<issue-description>`
- `docs/<topic>`
- `chore/<task>`

Use lowercase and hyphens.

## Pull Request Guidelines

- Every PR must link an issue: `Closes #<issue-id>`.
- Keep PRs small and focused.
- Explain affected packages under `packages/*`.
- Mention breaking changes explicitly.
- Use [Conventional Commits](https://www.conventionalcommits.org/).

## Local Validation

Run checks before requesting review:

```bash
mise exec -- npm run lint
mise exec -- npm run test
```

For docs-only changes, explain why tests are skipped in the PR.

## Review and Merge Rules

- `main` only accepts PR merges.
- At least 1 approval is required.
- Required checks must pass (`Unit` and `Lint`).
- All review conversations must be resolved.
- Merge strategy: **Squash and merge**.

## Release

Releases are handled by maintainers.
Do not run release scripts in contributor PRs unless explicitly requested.

## Other Ways to Help

- Star or Watch [faasjs/faasjs](https://github.com/faasjs/faasjs)
- Share your FaasJS experience with articles or videos
- Improve docs at [faasjs.com](https://faasjs.com)
- [Sponsor FaasJS](https://github.com/sponsors/faasjs)

---

# 参与 FaasJS 贡献

感谢你为 FaasJS 做贡献。

本项目采用 GitHub 优先协作流程：

`Discussion -> Issue -> Pull Request -> Review -> Merge`

## 快速开始

1. 提交前先搜索是否已有相同 issue。
2. 使用模板创建 issue（`Bug` 或 `Feature`）。
3. 从 `main` 拉分支开发。
4. 提交 PR，并关联 issue（`Closes #123`）。
5. 等待 CI 和评审通过后，用 **squash** 合并。

## Issue 规范

- 必须使用 issue 模板并填写必填项。
- 一个 issue 只描述一个问题或一个需求。
- Bug 需提供可复现步骤。
- Feature 需提供验收标准。
- 安全问题请按 [SECURITY.md](./SECURITY.md) 指引处理。

## 分支命名

- `feat/<feature-name>`
- `fix/<issue-description>`
- `docs/<topic>`
- `chore/<task>`

分支名统一小写，使用连字符。

## PR 规范

- 每个 PR 必须关联 issue：`Closes #<issue-id>`。
- PR 保持小而聚焦，不要混入无关改动。
- 说明影响的 `packages/*` 包。
- 如有破坏性变更，必须明确说明。
- 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/)。

## 本地验证

发起评审前请先执行：

```bash
mise exec -- npm run lint
mise exec -- npm run test
```

仅文档改动可不跑测试，但需在 PR 里说明原因。

## 评审与合并规则

- `main` 仅允许通过 PR 合并。
- 至少需要 1 个 reviewer 通过。
- 必须通过必需检查（`Unit` 和 `Lint`）。
- 所有 review 对话需先解决。
- 合并方式固定为 **Squash and merge**。

## 发版说明

发布由维护者负责。
除非明确要求，贡献者 PR 不要执行发布脚本。

## 其他支持方式

- 给 [faasjs/faasjs](https://github.com/faasjs/faasjs) 点 Star 或 Watch
- 分享使用经验（文章、视频）
- 给 [faasjs.com](https://faasjs.com) 提改进建议
- [赞助 FaasJS](https://github.com/sponsors/faasjs)
