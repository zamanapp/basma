# Releasing

Releases are automated. Push [conventional commits](https://www.conventionalcommits.org/)
to `main`; CI runs semantic-release, which computes the version, publishes to npm,
tags the commit, and updates the changelog. Publishing is **tokenless** — it uses
npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) over OIDC, so
no `NPM_TOKEN` secret is stored.

Use Node 26 (see `.nvmrc`): `nvm use`.

## One-time setup for a new package

npm won't let you configure a trusted publisher until the package already exists,
and OIDC can't perform that first publish. Bootstrap it with a throwaway stub:

1. **Publish the stub.** From your machine, logged in to an npm account with publish
   rights on the `@zamanapp` scope:

   ```bash
   nvm use                          # Node 26 — setup-trusted-publishing needs >= 24.4
   npm login                        # interactive; handles 2FA
   pnpm dlx setup-trusted-publishing
   ```

   This publishes a `0.0.0` stub (empty module) so the package name exists. It also
   writes `publishConfig.provenance: true` and repository info into `package.json` —
   review and keep that diff.

2. **Configure the trusted publisher** at
   `npmjs.com/package/@zamanapp/basma` → Settings → Trusted Publishers → Add:

   | Field | Value |
   | --- | --- |
   | Organization or user | `zamanapp` |
   | Repository | `basma` |
   | Workflow filename | `ci.yml` |
   | Allowed action | npm publish |

   Fields are case-sensitive and are **not** validated on save — a typo only surfaces
   at publish time.

3. **Release for real.** Push a conventional commit to `main`. semantic-release
   publishes the first real version (`1.0.0`), which supersedes the `0.0.0` stub.

That's it — every later release is just a push to `main`.
