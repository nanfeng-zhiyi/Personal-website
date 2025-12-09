import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import sanitizeHtml from 'sanitize-html'
import markdownItKatex from 'markdown-it-katex'

const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return `<pre class="hljs"><code class="hljs language-${lang}">${hljs.highlight(code, {
                    language: lang,
                }).value}</code></pre>`
            } catch (error) {
                console.error('代码高亮失败:', error)
            }
        }
        return `<pre class="hljs"><code class="hljs">${md.utils.escapeHtml(code)}</code></pre>`
    },
})

md.use(markdownItKatex)

const allowedTags = [
    ...sanitizeHtml.defaults.allowedTags,
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'img',
    'pre',
    'code',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'blockquote',
    'hr',
    'math',
    'annotation',
    'semantics',
    'mrow',
    'mi',
    'mo',
    'mn',
    'msup',
    'msub',
    'msubsup',
    'mfrac',
    'mtext',
    'mtable',
    'mtr',
    'mtd',
    'mstyle',
    'munderover',
    'mover',
    'menclose',
    'mpadded',
    'mphantom',
]

const allowedAttributes = {
    ...sanitizeHtml.defaults.allowedAttributes,
    code: ['class'],
    pre: ['class'],
    span: ['class'],
    img: ['src', 'alt', 'title'],
    table: ['class'],
    th: ['class'],
    td: ['class'],
    math: ['xmlns'],
    annotation: ['encoding'],
}

export function renderMarkdown(source: string = ''): string {
    const rawHtml = md.render(source)
    return sanitizeHtml(rawHtml, {
        allowedTags,
        allowedAttributes,
        allowedSchemes: ['http', 'https', 'mailto'],
    })
}


