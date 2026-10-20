# unlikely ui

A design system with shared visual foundations and reusable interface components.
Its library defaults provide a coherent starting point for distinct products.

## Language

**Foundation**:
A shared visual or interaction rule, such as a color role, type scale, spacing
rhythm, focus treatment or motion preference.

**Semantic token**:
A named foundation value whose identity describes its purpose, such as primary
text or selected background, rather than a particular color.
_Avoid_: Treating a palette reference and a semantic role as interchangeable.

**Component**:
A reusable interface building block with a defined appearance, behavior and
accessibility contract.

**Pattern**:
A composition of components that solves a recurring interface task. It may be
documented as an example without becoming a separately supported component.

**Theme**:
A coordinated set of foundation values for an interface scope. A theme can
express appearance or a product's identity without changing component meaning.

**Packaged adoption**:
Using the versioned unlikely ui dependency, with shared component changes
received when the consuming product upgrades that dependency.

**Source adoption**:
Installing unlikely ui source into a product that then owns its local edits
and reviews subsequent upstream changes.

**Registry item**:
A source-installation unit containing a component, pattern or shared foundation,
with the files and dependencies it needs.
_Avoid_: Calling it an independently versioned npm component package.

**Showcase**:
The workspace for inspecting the design system's foundations and component
examples, with their actual maturity made visible.

**Devspace**:
The showcase area for experiments and incomplete component candidates before
their public contracts are settled.

**Preview component**:
A usable library implementation whose interface and visual behavior remain
provisional; it carries no stable-release promise.
