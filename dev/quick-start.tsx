import packageMetadata from '../package.json' with { type: 'json' };
import { CodeBlock } from './code-block.js';
import { ProjectDialog } from './examples/project-dialog.js';

export function QuickStart() {
  return (
    <>
      <div className="page-intro">
        <span className="eyebrow">GET STARTED</span>
        <h1>Start using unlikely ui</h1>
        <p>
          Install the package, import the styles, and add a local theme
          boundary.
        </p>
      </div>
      <section className="setup-step">
        <h2>1. Install an exact version</h2>
        <CodeBlock
          language="text"
          label="Shell"
          code={`pnpm add -E unlikely-ui@${packageMetadata.version}`}
        />
        <p>
          Requires React and React DOM {packageMetadata.peerDependencies.react}.
          ESM only. Tailwind is optional when consuming the precompiled styles.
        </p>
      </section>
      <section className="setup-step">
        <h2>2. Import CSS and wrap your components</h2>
        <CodeBlock
          code={`import { Theme } from 'unlikely-ui/theme';\nimport { Button } from 'unlikely-ui/button';\nimport 'unlikely-ui/styles.css';\n\nexport function App() {\n  return (\n    <Theme appearance="light">\n      <Button>Create project</Button>\n    </Theme>\n  );\n}`}
        />
      </section>
      <section className="setup-step">
        <h2>3. Compose a real workflow</h2>
        <p>
          The project dialog combines fields, validation, focus management, and
          a themed popover.
        </p>
        <div className="quickstart-demo">
          <ProjectDialog />
        </div>
        <div className="hero-actions">
          <a href="#components/dialog">
            Explore the dialog and complete source →
          </a>
          <a href="#recipes">Save and recovery recipes →</a>
        </div>
      </section>
      <section className="setup-step">
        <h2>Using Tailwind v4</h2>
        <p>
          Declare layer order before imports so app utilities can override
          allowed component properties. Class-string order does not establish
          precedence.
        </p>
        <CodeBlock
          language="text"
          label="CSS"
          code={`@layer theme, base, ui-theme, ui-base, ui-utilities, components, utilities;\n@import 'tailwindcss';\n@import 'unlikely-ui/styles.css';`}
        />
      </section>
      <section className="setup-step" id="compatibility">
        <h2>Preview releases and compatibility</h2>
        <p>
          All components are previews. This showcase follows the repository’s
          main branch and can include components newer than the published
          package. Components marked Unreleased are available in this checkout
          only. Pin the exact npm version and review changes before upgrading.
        </p>
        <p>
          CSS is an explicit import. Fonts, a global reset, and an icon package
          are not installed by the library. The app owns theme persistence and
          system-preference resolution.
        </p>
        <div className="hero-actions">
          <a href="https://github.com/Kreoniz/unlikely-ui/blob/main/USAGE.md">
            Consumer guide ↗
          </a>
          <a href="https://github.com/Kreoniz/unlikely-ui/blob/main/CHANGELOG.md">
            Release notes ↗
          </a>
        </div>
      </section>
    </>
  );
}
