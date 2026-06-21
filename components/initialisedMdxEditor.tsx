'use client'

import type { ForwardedRef } from 'react'

import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,

  // Plugins
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  tablePlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  frontmatterPlugin,
  directivesPlugin,
  toolbarPlugin,

  // Toolbar
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertTable,
  InsertImage,
  CodeToggle,
  InsertCodeBlock,
  Separator
} from '@mdxeditor/editor'


export default function InitializedMDXEditor({
  editorRef,
  readOnly = false,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null
  readOnly?: boolean
} & MDXEditorProps) {


  const plugins = [
    headingsPlugin(),

    listsPlugin(),

    quotePlugin(),

    thematicBreakPlugin(),

    linkPlugin(),
    linkDialogPlugin(),

    tablePlugin(),

    imagePlugin(),

    frontmatterPlugin(),

    // Allows ::: directives
    directivesPlugin(),

    // ``` blocks
    codeBlockPlugin(),

    // Syntax highlighting
    codeMirrorPlugin({
      codeBlockLanguages: {
        js: 'JavaScript',
        ts: 'TypeScript',
        jsx: 'React JSX',
        tsx: 'React TSX',
        html: 'HTML',
        css: 'CSS',
        json: 'JSON',
        bash: 'Bash',
        python: 'Python',
        java: 'Java',
        cpp: 'C++'
      }
    }),

    markdownShortcutPlugin()
  ]


  if (!readOnly) {
    plugins.push(
      toolbarPlugin({
        toolbarPosition: 'bottom',

        toolbarContents: () => (
          <>
            <UndoRedo />

            <Separator />

            <BlockTypeSelect />

            <Separator />

            <BoldItalicUnderlineToggles />

            <Separator />

            <ListsToggle />

            <Separator />

            <CreateLink />

            <Separator />

            <CodeToggle />

            <InsertCodeBlock />

            <Separator />

            <InsertTable />

            <InsertImage />
          </>
        )
      })
    )
  }


  return (
    <MDXEditor
      className=''
      ref={editorRef}
      readOnly={readOnly}
      plugins={plugins}
      {...props}
    />
  )
}