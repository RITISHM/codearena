import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ value, onChange, language = 'javascript', isLocked = false }) {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Define custom dark theme for CodeArena
        monaco.editor.defineTheme('codearena-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
                { token: 'keyword', foreground: '569cd6' },
                { token: 'string', foreground: 'ce9178' },
            ],
            colors: {
                'editor.background': '#0d1117',
                'editor.foreground': '#c9d1d9',
                'editor.lineHighlightBackground': '#161b22',
                'editorCursor.foreground': '#58a6ff',
                'editorWhitespace.foreground': '#484f58',
                'editorIndentGuide.background': '#21262d',
                'editorIndentGuide.activeBackground': '#30363d',
            }
        });

        monaco.editor.setTheme('codearena-dark');
    };

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-dark-border relative">
            <Editor
                height="100%"
                width="100%"
                language={language}
                value={value}
                onChange={onChange}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'Fira Code', 'Consolas', monospace",
                    fontLigatures: true,
                    padding: { top: 16, bottom: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: true,
                    formatOnPaste: true,
                    readOnly: isLocked,
                }}
                theme="vs-dark" // Initial fallback before custom theme loads
                loading={
                    <div className="flex h-full items-center justify-center text-primary">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                }
            />
            {isLocked && (
                <div className="absolute inset-0 z-10 bg-blue-500/10 backdrop-blur-[2px] pointer-events-none flex items-center justify-center">
                    <div className="bg-dark-panel p-4 rounded-xl border border-primary/50 glow-primary shadow-2xl flex items-center gap-3">
                        <div className="w-4 h-4 bg-primary rounded-full animate-ping"></div>
                        <span className="font-bold text-white tracking-widest uppercase">Editor Frozen</span>
                    </div>
                </div>
            )}
        </div>
    );
}
