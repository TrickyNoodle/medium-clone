'use client'

import '@mdxeditor/editor/style.css'

import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    linkPlugin,
    linkDialogPlugin,
    tablePlugin,
    imagePlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    frontmatterPlugin,
    toolbarPlugin,
    KitchenSinkToolbar
} from '@mdxeditor/editor'

export default function Editor() {
    return (
        <MDXEditor
            markdown=""
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),

                linkPlugin(),
                linkDialogPlugin(),

                tablePlugin(),
                imagePlugin(),

                frontmatterPlugin(),

                codeBlockPlugin(),
                codeMirrorPlugin({
                    codeBlockLanguages: {
                        js: 'JavaScript',
                        ts: 'TypeScript',
                        css: 'CSS',
                        html: 'HTML',
                        json: 'JSON'
                    }
                }),

                markdownShortcutPlugin(),

                toolbarPlugin({
                    toolbarContents: () => <KitchenSinkToolbar />
                })
            ]}
        />
    )
}